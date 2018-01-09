const validator = require('validator');
const assert = require('assert');
const uuid = require('uuid/v4');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const config = require('config/config.js');
const knexConfig = require('config/knexfile.js');

const db = knex(knexConfig[process.env.NODE_ENV]);
const sendEmail = require('lib/sendEmail.js');

const updateProperties = require('models/updateProperties')('user');


const milesInMeter = 0.000621371192237;

const activitiesQuery = db.table('users_activities')
  .select([
    'users_activities.user_id as user_id',
    db.raw('json_agg(activities) as object'),
  ])
  .leftOuterJoin('activities', 'users_activities.activity_id', 'activities.id')
  .groupBy('activities.id', 'users_activities.user_id')
  .as('activities_query');

const actionsQuery = db.table('actions')
  .select([
    'owner_id',
    db.raw('(case when count(id)=0 then \'[]\'::json else ' +
    'json_agg(json_build_object(\'id\', id, \'title\', title)) end) as object'),
  ])
  .groupBy('owner_id')
  .as('actions_query');

const campaignsQuery = db.table('campaigns')
  .select([
    'owner_id',
    db.raw('(case when count(id)=0 then \'[]\'::json else ' +
    'json_agg(json_build_object(\'id\', id, \'title\', title)) end) as object'),
  ])
  .groupBy('owner_id')
  .as('campaigns_query');

class User {
  static findOne({ selections = [], args }) {
    // If one of the args has a property name 'id', we really want it to
    // refer to 'users.id'
    const newArgs = Object.assign(...Object.keys(args).map((k) => {
      if (k === 'id') {
        return { 'users.id': args[k] };
      }
      return { [k]: args[k] };
    }));

    const allSelections = [
      ...selections,
      'users.id as id', 'first_name', 'last_name', 'user_profiles.description as description', 'user_profiles.tags as tags',
      'user_profiles.profile_image_url as profile_image_url', 'user_profiles.subheader as subheader',
      'campaigns_query.object as campaigns', 'actions_query.object as actions', 'activities_query.object as activities',
    ];

    const userQuery = db.table('users')
      .where(newArgs)
      .leftOuterJoin('user_profiles', 'user_profiles.user_id', 'users.id')
      .leftJoin(campaignsQuery, 'campaigns_query.owner_id', 'users.id')
      .leftJoin(actionsQuery, 'actions_query.owner_id', 'users.id')
      .leftJoin(activitiesQuery, 'activities_query.user_id', 'users.id')
      .first(...allSelections);

    return userQuery;
  }

  static search({ search, userId }) {
    const searchQuery = db('users')
      .leftJoin('user_profiles', 'user_profiles.user_id', 'users.id')
      .select([
        'users.id as id', 'first_name', 'last_name', 'user_profiles.description as description', 'user_profiles.tags as tags',
        'user_profiles.profile_image_url as profile_image_url', 'user_profiles.subheader as subheader',
      ])
      .modify((qb) => {
        qb.whereNot('users.id', userId);

        if (search) {
          if (search.names) {
            qb.andWhere(function nameQueryBuilder() {
              search.names.forEach((name) => {
                this.orWhere(db.raw('first_name || \' \' || last_name %> ?', name));
              });
            });
          }

          if (search.tags) {
            const tags = db('users')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            search.tags.forEach((tag) => {
              qb.andWhere(function tagsQueryBuilder() {
                const tagQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag ILIKE ?', tag);

                this.where('users.id', 'in', tagQuery);
              });
            });
          }

          if (search.keywords) {
            const tags = db('users')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            search.keywords.forEach((keyword) => {
              qb.andWhere(function keywordQueryBuilder() {
                const stringOverlapComparator = /^#/.test(keyword) ? "SIMILAR TO '%(,| )\\?' || ? || '(,| )\\?%'" : '%> ?';

                this.orWhere(db.raw(`first_name ${stringOverlapComparator}`, keyword));

                this.orWhere(db.raw(`last_name ${stringOverlapComparator}`, keyword));

                this.orWhere(db.raw(`subheader ${stringOverlapComparator}`, keyword));

                this.orWhere(db.raw(`description ${stringOverlapComparator}`, keyword));

                const tagKeywordQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw(`tag ${stringOverlapComparator}`, keyword);

                this.orWhere('users.id', 'in', tagKeywordQuery);
              });
            });
          }

          if (search.geographies) {
            qb.andWhere(function () {
              search.geographies.forEach((geography) => {
                const { distance = 10, zipcode } = geography; // default to 10 miles

                // TODO: It would be nice to refactor some of this out into knex language
                const distanceQuery = db.select('id')
                  .from(function () {
                    this.select('users.id', db.raw('ST_DISTANCE(users.location, target_zip.location) * ? AS distance', milesInMeter))
                      .as('distances')
                      .from(db.raw(`
                        (SELECT postal_code, location from zipcodes where postal_code=?) target_zip
                        CROSS JOIN
                        (select * from users join zipcodes on zipcodes.postal_code = users.zipcode) users
                      `, zipcode));
                  })
                  .where('distance', '<=', distance);

                this.orWhere('users.id', 'in', distanceQuery);
              });
            });
          }
        }
      });

    return searchQuery;
  }

  static async create(user) {
    const userInfo = {};

    if (!validator.isEmail(user.email)) {
      throw new Error('Email is not valid');
    }

    const rows = await db.table('users').insert(user, ['id', 'email']);
    await db.table('user_profiles').insert({ user_id: rows[0].id });

    Object.assign(userInfo, rows[0]);
    return userInfo;
  }

  static async edit(options) {
    const {
      profile_image_url, description,
      subheader, tags, activities, ...userArgs
    } = options;

    const userResult = await db('users')
      .where('id', userArgs.id)
      .update(userArgs, [
        'id', 'first_name', 'last_name', 'email', 'phone_number', 'zipcode', 'email_confirmed',
      ]);

    const userProfileResult = await db('user_profiles')
      .where('user_id', userArgs.id)
      .update({
        profile_image_url, description, subheader, tags,
      }, [
        'profile_image_url', 'description', 'subheader', 'tags',
      ]);

    if (activities && activities.length) {
      await updateProperties(activities, 'activity', userArgs.id);
    }

    return { ...userResult[0], ...userProfileResult[0] };
  }

  static getUserProfile(id) {
    return db.table('user_profiles').select().where('id', id);
  }

  static async verifyEmail({ token }) {
    const tokenResult = await db.table('user_email_verifications').select().where('token', token).first();

    if (!tokenResult) {
      throw new Error('User email verification does not exist');
    } else if (tokenResult.used) {
      console.error(`Email Verification token already used: ${token}`);
      return { token };
    }

    let updated = await db.table('users')
      .where('id', tokenResult.user_id)
      .update({
        email_confirmed: true,
      });

    assert(updated === 1);

    updated = await db.table('user_email_verifications')
      .where('token', token)
      .update({
        used: true,
      });

    assert(updated === 1);

    return { token };
  }

  static async changePassword(userId, newPassword, oldPassword) {
    const user = await db.table('users').where({
      id: userId,
    }).first();

    if (!user) {
      throw new Error('User not found');
    }

    // if the password is being reset, we don't need an old password
    if (!user.password_being_reset && !bcrypt.compareSync(oldPassword, user.password_hash)) {
      throw new Error('Incorrect password.');
    }

    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    const resultRows = await db.table('users')
      .where({
        id: userId,
      })
      .update({
        password_being_reset: false,
        password_hash: newPasswordHash,
      }, ['id']);

    if (resultRows.length !== 1) {
      throw new Error('Error changing password');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  static async resetPassword(email, req) {
    if (!validator.isEmail(email)) {
      throw new Error('Email is not valid');
    }

    const user = await db.table('users').where({
      email,
    }).first();

    if (!user) {
      throw new Error('User not found');
    }

    const resetCodeData = {
      code: uuid(),
      ip: req.ip,
      user_id: user.id,
    };

    const rows = await db.table('user_password_resets').insert(resetCodeData, ['id', 'code']);

    const resetCode = rows[0];

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      templateName: 'password-reset-email',
      context: {
        resetURL: `${config.urls.api}/use-password-reset/${resetCode.code}`,
      },
    });

    return {
      email: user.email,
    };
  }

  static async usePasswordResetCode(code) {
    const reset = await db.table('user_password_resets').where({
      code,
    }).first();

    if (reset.used) {
      throw new Error('Password reset already used');
    }

    // TODO: check for expiration time?
    await db.table('user_password_resets')
      .where({
        code,
      })
      .update({
        used: true,
      }, ['id']);

    const userResults = await db.table('users')
      .where({
        id: reset.user_id,
      })
      .update({
        password_being_reset: true,
      }, ['id', 'email']);

    if (userResults.length !== 1) {
      throw new Error('Error using password reset code');
    }

    return userResults[0];
  }

  static async ownsObject({ user, object, userId }) {
    const userTest = (!(user && typeof user.superuser === 'boolean')) ?
      await db.table('users').where('id', userId).first() :
      user;

    return (object.owner_id === userTest.id || userTest.superuser);
  }

  static async sendVerificationEmail(u) {
    const user = { ...u };

    const verification = {
      token: uuid(),
      user_id: user.id,
    };

    const rows = await db.table('user_email_verifications').insert(verification, ['id', 'token']);

    user.verificationToken = rows[0].token;

    return sendEmail({
      to: user.email,
      subject: 'Confirm your email address',
      templateName: 'verification-email',
      context: {
        verifyURL: `${config.urls.client}settings/confirm-email/${user.verificationToken}`,
      },
    });
  }
}

module.exports = User;
