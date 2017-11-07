import validator from 'validator';

const assert = require('assert');
const url = require('url');
const uuid = require('uuid/v4');
const moment = require('moment-timezone');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const zipcodeToTimezone = require('zipcode-to-timezone');

const db = knex(knexConfig[process.env.NODE_ENV]);

const User = require('models/User.js');
const Campaign = require('models/Campaign.js');

const getValidSlug = require('models/getValidSlug');
const updateProperties = require('models/updateProperties')('action');

const config = require('config/config.js');


const createShifts = async (shifts, actionId) => {
  const shiftResults = [];
  for (const shift of shifts) {
    shift.action_id = actionId;
    shiftResults.push(await db('shifts').insert(shift, 'id', 'start', 'end'));
  }

  return shiftResults;
}

const updateShifts = async (shifts, actionId) => {
  const shiftResults = [];
  const shiftDeletes = [];
  const shiftInserts = [];

  await db('shifts').where('action_id', actionId).del();

  shifts.forEach((shift) => {
    shift.action_id = actionId;
    shiftInserts.push(db('shifts').insert(shift, 'id', 'start', 'end'));
  });

  return await Promise.all(shiftInserts);
}

const insertShifts = async ({ shifts, userId }) => {
  const shiftSignupInserts = [];
  shifts.forEach((shift) => {
    if (typeof shift.id !== 'string') {
      throw new Error(`Shift must have id`);
    }

    shiftSignupInserts.push(db('shift_signups').insert({
      shift_id: shift.id,
      user_id: userId,
    }));
  });

  await Promise.all(shiftSignupInserts);
}

const removeShifts = async ({ actionId, userId }) => {
  const currentShifts = await db('shift_signups')
    .join('shifts', 'shifts.id', '=', 'shift_signups.shift_id')
    .select('shift_signups.id as id')
    .where('shift_signups.user_id', '=', userId)
    .andWhere('shifts.action_id', '=', actionId);

  const currentShiftIds = currentShifts.map(s => s.id);

  await db('shift_signups').whereIn('id', currentShiftIds).del();
}

class Action {
  static async findOne(...args) {
    const action = await db('actions')
      .select(['id', 'title', 'internal_title', 'slug', 'tags', 'owner_id', 'description', 'campaign_id',
        db.raw('to_char(start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
        db.raw('to_char(end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
        'location_name', 'street_address', 'street_address2',
        'city', 'state', 'zipcode', 'location_notes', 'virtual', 'ongoing'])
      .where(...args)
      .first();

    Object.assign(action, await this.details(action));

    return action;
  }

  static async find(...args) {
    const actions = await db.table('actions').where(...args).orderBy('slug', 'asc');

    for (const action of actions) {
      Object.assign(action, await this.details(action));
    }

    return actions;
  }

  static async delete({ input, userId }) {
    const user = await db.table('users').where('id', userId).first('id', 'superuser');

    if (!user) {
      throw new Error('User not found');
    }

    const action = await Action.findOne(input);

    if (!action) {
      throw new Error('Action not found');
    }

    if (!await User.ownsObject({ userId, object: action })) {
      throw new Error('User must own action');
    }

    const result = await db('actions')
      .where('id', action.id)
      .update({ deleted: true });

    return result === 1;
  }

  static async attending({ userId, actionId }) {
    const signup = await db('action_signups')
      .where({
        action_id: actionId,
        user_id: userId,
      });

    if (signup.length > 1) {
      throw new Error(`More than one role signup for user with id: ${userId}for action with id: ${actionId}`);
    } else if (signup.length == 1) {
      return true;
    } else {
      const signedUpShifts = await Action.signedUpShifts({ userId, actionId });
      return signedUpShifts.length > 0;
    }
  }

  static async signedUpShifts({ userId, actionId }) {
    return await db('shift_signups')
      .innerJoin('shifts', 'shifts.id', '=', 'shift_signups.shift_id')
      .select(['shifts.action_id as action_id', 'shifts.id as id',
        'shifts.start as start', 'shifts.end as end',
        'shift_signups.user_id as user_id'])
      .where('user_id', userId)
      .andWhere('action_id', actionId);
  }

  // If action is not ongoing, shifts passed in here will over-write any previously
  // signed up shifts
  static async signup({ userId, actionId, shifts }) {
    const action = await Action.findOne({ id: actionId });

    if (action.ongoing) {
      if (await this.attending({ userId, actionId })) {
        return action;
      }

      await db('action_signups')
        .insert({
          user_id: userId,
          action_id: actionId,
        });

    } else {
      if (!shifts || !shifts.length) {
        throw new Error(`No shifts provided to signup for and action is not ongoing`);
      }

      await removeShifts({ actionId, userId });
      await insertShifts({ userId, shifts });
    }

    return action;
  }

  static async changeShifts({ userId, actionId, newShifts }) {
    const action = await Action.findOne({ id: actionId });
    if (action.ongoing) {
      throw new Error('Action is ongoing and can\'t have shift signups');
    }

    await removeShifts({ actionId, userId });
    await insertShifts({ userId, shifts });

    return action;
  }

  static async cancelSignup({ userId, actionId }) {
    const action = await Action.findOne({ id: actionId });
    if (!await this.attending({ userId, actionId })) {
      return action;
    }

    await db('action_signups')
      .where({
        user_id: userId,
        action_id: actionId,
      })
      .del();

    await removeShifts({ actionId, userId });

    return action;
  }

  static async signedUpVolunteers({ actionId }) {
    const result = await db('action_signups')
      .where('action_id', actionId)
      .innerJoin('users', 'action_signups.user_id', 'users.id');

    return result;
  }

  static async usersActions({ userId }) {
    const results = await db('action_signups')
      // TODO: DRY this fancy select out
      .select(['actions.id as id', 'actions.title as title', 'actions.campaign_id as campaign_id',
        db.raw('to_char(actions.start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
        db.raw('to_char(actions.end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
        'actions.tags as tags', 'actions.owner_id as owner_id', 'actions.slug as slug', 'actions.description as description',
        'actions.location_name as location_name', 'actions.street_address as street_address', 'actions.street_address2 as street_address2',
        'actions.city as city', 'actions.state as state', 'actions.zipcode as zipcode', 'actions.location_notes as location_notes', 'actions.virtual as virtual', 'actions.ongoing as ongoing'])
      .where('action_signups.user_id', userId)
      .andWhere('actions.deleted', false)
      .innerJoin('actions', 'action_signups.action_id', 'actions.id');

    await Promise.all(results.map(async (action) => {
      Object.assign(action, await this.details(action));
    }));

    return results;
  }

  static async search(search) {
    const defaultPageLimit = 20;
    const milesInMeter = 0.000621371192237;
    const defaultTargetZipcode = config.geography.defaultZipcode;

    const targetZipcode = (typeof search.targetZipcode === 'string' && validator.isNumeric(search.targetZipcode) && search.targetZipcode.length === 5) ?
      search.targetZipcode : defaultTargetZipcode;

    const timezone = zipcodeToTimezone.lookup(targetZipcode);

    const distanceQueryString = `round(ST_DISTANCE(zipcodes.location, target_zip.location) * ${milesInMeter})`;

    const searchQueryWithoutDateFiltering = db.from('actions')
      .select([
        db.raw('coalesce((array_agg(shifts.id))[1], actions.id) as id'), // This just provides a unique id, but is very hacky
        'actions.id as action_id', 'actions.title as title',
        db.raw('to_char(coalesce(min(shifts.start), actions.start_time) at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
        db.raw('to_char(coalesce(max(shifts.end), actions.end_time) at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
        db.raw(`date(coalesce(shifts.start, actions.start_time) at time zone '${timezone}') as date`),
        'actions.tags as tags', 'actions.owner_id as owner_id', 'actions.slug as slug', 'actions.description as description',
        'actions.location_name as location_name', 'actions.street_address as street_address', 'actions.street_address2 as street_address2',
        'actions.city as city', 'actions.state as state', 'actions.zipcode as zipcode', 'actions.location_notes as location_notes', 'actions.virtual as virtual', 'actions.ongoing as ongoing',
        db.raw(`${distanceQueryString} as distance`),
        db.raw('(case when count(shifts.id)=0 then \'[]\'::json else json_agg(json_build_object(\'id\', shifts.id, \'start\', (to_char(shifts.start at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\')), \'end\', (to_char(shifts.end at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\')) )) end) as shifts'),
        db.raw('to_char(actions.created_at at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as created_at'),
        'campaigns.title as campaign_title', 'campaigns.id as campaign_id', 'campaigns.slug as campaign_slug', 'campaigns.profile_image_url as campaign_profile_image_url'])
      .where('actions.deleted', false)
      .andWhere('campaigns.deleted', false)
      .innerJoin('campaigns', 'actions.campaign_id', 'campaigns.id')
      .leftOuterJoin('shifts', 'shifts.action_id', 'actions.id')
      .leftOuterJoin('zipcodes', 'zipcodes.postal_code', 'actions.zipcode')
      .crossJoin(db.raw('(SELECT postal_code, location from zipcodes where postal_code=?) target_zip', targetZipcode))
      .groupByRaw(`date(coalesce(shifts.start, actions.start_time) at time zone '${timezone}'), actions.id, zipcodes.location, target_zip.location, campaigns.id`)
      .as('actions')
      .modify((qb) => {
        if (search) {
          const tags = db('actions')
            .select(db.raw('id, unnest(tags) tag'))
            .as('tags');

          const campaignTags = db('campaigns')
            .select(db.raw('id, unnest(tags) tag'))
            .as('campaign_tags');

          if (search.ids) {
            qb.andWhere(function () {
              search.ids.forEach((id) => {
                this.orWhere('actions.id', id);
              });
            });
          }

          if (search.slugs) {
            qb.andWhere(function () {
              search.slugs.forEach((slug) => {
                this.orWhere('actions.slug', slug);
              });
            });
          }

          if (search.campaignIds) {
            qb.andWhere(function () {
              search.campaignIds.forEach((id) => {
                this.orWhere('campaigns.id', id);
              });
            });
          }

          if (search.tags) {
            search.tags.forEach((tag) => {
              qb.andWhere(function () {
                const tagQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag ILIKE ?', tag);

                this.where('actions.id', 'in', tagQuery);

                const campaignTagQuery = db.select('id')
                  .distinct()
                  .from(campaignTags)
                  .whereRaw('tag ILIKE ?', tag);

                this.orWhere('campaign_id', 'in', campaignTagQuery);

                const activityQuery = db.select('action_id')
                  .distinct()
                  .from('activities')
                  .innerJoin('actions_activities', 'activities.id', 'actions_activities.activity_id')
                  .whereRaw('title ILIKE ?', tag);

                this.orWhere('actions.id', 'in', activityQuery);
              });
            });
          }

          if (search.keywords) {
            search.keywords.forEach((keyword) => {
              qb.andWhere(function () {
                const strictStringComparator = 'ILIKE ?';
                const looseStringComparator = '% ?';

                const strictStringOverlapComparator = "SIMILAR TO '%(,| )\\?' || ? || '(,| )\\?%'";
                const looseStringOverlapComparator = '%> ?';

                const stringComparator = /^#/.test(keyword) ? strictStringComparator : looseStringComparator;
                const stringOverlapComparator = /^#/.test(keyword) ? strictStringOverlapComparator : looseStringOverlapComparator;

                this.orWhere(db.raw(`actions.title ${stringOverlapComparator}`, keyword));
                this.orWhere(db.raw(`actions.description ${stringOverlapComparator}`, keyword));
                this.orWhere(db.raw(`actions.location_name ${stringComparator}`, keyword));
                this.orWhere(db.raw(`actions.street_address ${stringComparator}`, keyword));
                this.orWhere(db.raw(`actions.street_address2 ${stringComparator}`, keyword));
                this.orWhere(db.raw(`actions.city ${stringComparator}`, keyword));
                this.orWhere(db.raw(`actions.state ${stringComparator}`, keyword));
                this.orWhere(db.raw(`actions.location_notes ${stringOverlapComparator}`, keyword));
                this.orWhere(db.raw(`campaigns.title ${stringOverlapComparator}`, keyword));

                const tagKeywordQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw(`similarity(tag, ?) > ${knexConfig.tagSimilarityThreshold}`, keyword);

                this.orWhere('actions.id', 'in', tagKeywordQuery);

                const campaignTagQuery = db.select('id')
                  .distinct()
                  .from(campaignTags)
                  .whereRaw(`similarity(tag, ?) > ${knexConfig.tagSimilarityThreshold}`, keyword);

                this.orWhere('campaign_id', 'in', campaignTagQuery);

                const activityQuery = db.select('action_id')
                  .distinct()
                  .from('activities')
                  .innerJoin('actions_activities', 'activities.id', 'actions_activities.activity_id')
                  .whereRaw(`title ${stringOverlapComparator}`, keyword)
                  .orWhereRaw(`description ${stringOverlapComparator}`, keyword);

                this.orWhere('actions.id', 'in', activityQuery);
              });
            });
          }

          if (search.campaignNames) {
            qb.andWhere(function () {
              search.campaignNames.forEach((campaignName) => {
                this.orWhere(db.raw('campaigns.title %> ?', campaignName));
              });
            });
          }


          if (search.activities) {
            qb.andWhere(function () {
              const activities = db('activities')
                .select('id', 'title', 'description')
                .as('activities');

              search.activities.forEach((activity) => {
                const activityQuery = db.select('action_id')
                  .distinct()
                  .from('activities')
                  .innerJoin('actions_activities', 'activities.id', 'actions_activities.activity_id')
                  .where('title', activity);

                this.orWhere('actions.id', 'in', activityQuery);
              });
            });
          }


          if (search.geographies) {
            qb.andWhere(function () {
              search.geographies.forEach((geography) => {
                if (typeof geography.virtual === 'boolean' && geography.virtual) {
                  this.orWhere('actions.virtual', geography.virtual);
                } else {
                  const distance = geography.distance || 10; // default to 10 miles
                  const zipcode = geography.zipcode;

                  // TODO: It would be nice to refactor some of this out into knex language
                  const distanceQuery = db.select('id')
                    .from(function () {
                      this.select('actions.id', db.raw('ST_DISTANCE(actions.location, target_zip.location) * ? AS distance', milesInMeter))
                        .as('distances')
                        .from(db.raw(`
                          (SELECT postal_code, location from zipcodes where postal_code=?) target_zip
                          CROSS JOIN
                          (select * from actions join zipcodes on zipcodes.postal_code = actions.zipcode) actions
                        `, zipcode));
                    })
                    .where('distance', '<=', distance);

                  this.orWhere('actions.id', 'in', distanceQuery);
                }
              });
            });
          }
        }
      });

    const searchQuery = db.select('*').from(searchQueryWithoutDateFiltering).modify((qb) => {
      if (search.dates) {
        qb.andWhere(function () {
          if (search.dates.onDate) {
            this.andWhere(db.raw("(?::timestamptz, ?::timestamptz + interval '1 day') OVERLAPS (timestamptz(start_time), timestamptz(end_time))", [
              search.dates.onDate, search.dates.onDate,
            ]));
          }

          if (search.dates.startDate) {
            this.andWhere(db.raw('?::timestamptz <= timestamptz(start_time)', search.dates.startDate));
          }

          if (search.dates.endDate) {
            this.andWhere(db.raw("?::timestamptz + interval '1 day' >= timestamptz(end_time)", search.dates.endDate));
          }

          if (search.dates.ongoing) {
            this.orWhere('ongoing', true);
          }
        });
      }

      // TODO: Clean this up
      if (search.times) {
        qb.andWhere(function () {
          search.times.forEach((time) => {
            if (time.toLowerCase() === 'saturdays') {
              this.orWhere(db.raw('EXTRACT (DOW FROM date) = 6'));
            }
            if (time.toLowerCase() === 'sundays') {
              this.orWhere(db.raw('EXTRACT (DOW FROM date) = 0'));
              this.orWhere(db.raw('EXTRACT (DOW FROM date) = 0'));
            }
          });
        });
      }
    });

    const searchPageQuery = searchQuery.clone().modify((qb) => {

      const sortBy = search.sortBy || {
        name: 'distance',
        descending: false,
      };

      if (sortBy.name === 'campaignName') {
        qb.orderBy('campaigns.title', (sortBy.descending) ? 'DESC' : 'ASC');
      } else if (sortBy.name === 'date') {
        qb.orderByRaw(`timestamptz(start_time) ${sortBy.descending ? 'DESC' : 'ASC'} NULLS FIRST`);
      } else if (sortBy.name === 'distance') {
        qb.orderByRaw(`distance ${sortBy.descending ? 'DESC' : 'ASC'} NULLS LAST`);
      }

      if (search.cursor) {
        if (sortBy.name === 'campaignName') {
          qb.andWhere(function () {
            this.orWhere('campaigns.title', (sortBy.descending) ? '<' : '>', search.cursor.campaign_name);
            this.orWhere(function () {
              this.andWhere('campaigns.title', '=', search.cursor.campaign_name);
              this.andWhere('actions.created_at', '<', db.raw('?::timestamptz', search.cursor.created_at));
            });
          });
        } else if (sortBy.name === 'date') {
          qb.andWhere(function () {
            if (typeof search.cursor.start_type !== undefined && moment(search.cursor.start_time).isValid()) {
              this.orWhere(db.raw('?::timestamptz', search.cursor.start_time), (sortBy.descending) ? '>' : '<', db.raw('timestamptz(actions.start_time)'));
              this.orWhere(function () {
                this.andWhere(db.raw('?::timestamptz', search.cursor.start_time), '=', db.raw('timestamptz(start_time)'));
                this.andWhere(db.raw('timestamptz(actions.created_at)'), '<', db.raw('?::timestamptz', search.cursor.created_at));
              });
            } else {
              this.orWhere(function () {
                this.whereNull('start_time');
                this.andWhere(db.raw('timestamptz(actions.created_at)'), '<', db.raw('?::timestamptz', search.cursor.created_at));
              });
              this.orWhereNotNull('start_time');
            }
          });
        } else if (sortBy.name === 'distance') {
          qb.andWhere(function () {
            this.orWhere(db.raw(distanceQueryString), (sortBy.descending) ? '<' : '>', search.cursor.distance);
            this.orWhere(function () {
              this.andWhere(db.raw(distanceQueryString), '=', search.cursor.distance);
              this.andWhere(db.raw('timestamptz(actions.created_at)'), '<', db.raw('?::timestamptz', search.cursor.created_at));
            });
          });
        }
      }

      if (search.limit && typeof search.limit === 'number') {
        qb.limit(parseInt(search.limit, 10));
      } else {
        qb.limit(defaultPageLimit);
      }

      qb.orderBy('actions.created_at', 'desc');
    });

    const searchTotalsQuery = db.count('id').from(searchQuery.as('count_rows'));

    const total = (await searchTotalsQuery)[0].count;
    const actionResults = await searchPageQuery;

    actionResults.forEach((action) => {
      action.campaign = {
        id: action.campaign_id,
        title: action.campaign_title,
        slug: action.campaign_slug,
        profile_image_url: action.campaign_profile_image_url,
      };
    });

    const cursor = actionResults.length ? [...actionResults].pop() : undefined;

    return {
      total,
      targetZipcode,
      actions: actionResults,
      cursor,
    };
  }

  static async details(action, quick = false) {
    const details = {};

    if (!quick) {
      const activitiesQuery = db('activities')
        .innerJoin('actions_activities', 'actions_activities.activity_id', 'activities.id')
        .where('actions_activities.action_id', action.id)
        .select('activities.id as id', 'activities.title as title', 'activities.description as description');

      const shiftsQuery = db('shifts')
        .select(['id',
          db.raw('to_char(shifts.start at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start'),
          db.raw('to_char(shifts.end at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end')])
        .where('action_id', action.id)

      try {
        [details.campaign, details.owner, details.activities, details.shifts] = await Promise.all([
          Campaign.findOne('id', action.campaign_id),
          User.findOne('id', action.owner_id),
          activitiesQuery,
          shiftsQuery,
        ]);
      } catch (e) {
        throw new Error(`Error querying details: ${e.message}`);
      }

      details.dashboard_url = url.resolve(config.urls.client, `organize/${details.campaign.slug}/opportunity/${action.slug}`);
    }

    details.public_url = url.resolve(config.urls.client, `opportunity/${action.slug}`);

    return details;
  }

  static async listActivities(search) {
    const searchQuery = db('activities')
      .select('*')
      .where('deleted', false)
      .orderBy('description')
      .modify((qb) => {
        if (search) {
          if (search.keywords) {
            qb.andWhere(function () {
              search.keywords.forEach((keyword) => {
                this.orWhere(db.raw('title %> ?', keyword));
                this.orWhere(db.raw('description %> ?', keyword));
              });
            });
          }

          if (search.title) {
            qb.orWhere(db.raw('title % ?', search.title));
          }
        }
      });

    const results = await searchQuery;

    return results;
  }

  static async create(options) {
    const user = await db.table('users').where('id', options.owner_id).first('id', 'superuser', 'email_confirmed');

    if (user) {
      const campaign = await db('campaigns').where('id', options.campaign_id).first();

      if (!campaign) {
        throw new Error(`Cannot find campaign with id=${options.campaign_id}`);
      } else if (!user.email_confirmed) {
        throw new Error('User must confirm email to create an action');
      } else if (await User.ownsObject({ user, object: campaign })) {
        const slug = await getValidSlug(options.title);

        const newActionData = Object.assign({}, options, { slug });

        try {
          const { activities, shifts, ...newActionInput } = newActionData;

          const newInsertInput = (user.superuser === true) ? { ...newActionInput, owner_id: campaign.owner_id } : newActionInput;

          const actionResult = await db.table('actions').insert(newInsertInput, [
            'id', 'title', 'slug', 'description', 'tags', 'owner_id', 'campaign_id',
          ]);

          const action = actionResult[0];

          if (activities && activities.length) {
            await updateProperties(activities, 'activity', action.id);
          }

          if (shifts && shifts.length) {
            await createShifts(shifts, action.id);
          }

          return Object.assign({}, action, await this.details(action));
        } catch (e) {
          throw new Error(`Cannot insert action: ${e.message}`);
        }
      } else {
        throw new Error('User must be owner of campaign');
      }
    } else {
      throw new Error('User not found');
    }
  }

  static async edit({ input, userId }) {
    const user = await db.table('users').where('id', userId).first('id', 'superuser');

    if (user) {
      const action = await db('actions').where('id', input.id).first();

      if (!action) {
        throw new Error(`Cannot find action with id=${input.id}`);
      } else if (await User.ownsObject({ user, object: action })) {
        try {
          const { activities, shifts, ...newInput } = input;

          const actionResult = await db('actions')
            .where('id', newInput.id)
            .update(newInput, [
              'id', 'title', 'internal_title', 'slug', 'description', 'tags', 'owner_id', 'campaign_id',
            ]);

          const action = actionResult[0];

          if (activities && activities.length) {
            await updateProperties(activities, 'activity', action.id);
          }

          if (shifts && shifts.length) {
            await updateShifts(shifts, action.id);
          }

          return Object.assign({}, action, await this.details(action));
        } catch (e) {
          throw new Error(`Cannot edit action: ${e.message}`);
        }
      } else {
        throw new Error('User must be owner of action');
      }
    } else {
      throw new Error('User not found');
    }
  }
}

module.exports = Action;
