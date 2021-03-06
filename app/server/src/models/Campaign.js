const validator = require('validator');
const url = require('url');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');

const db = knex(knexConfig[process.env.NODE_ENV]);

const User = require('models/User.js');

const getValidSlug = require('models/getValidSlug');

const config = require('config/config.js');

const milesInMeter = 0.000621371192237;
const defaultTargetZipcode = config.geography.defaultZipcode;
const distanceQueryString = `round(ST_DISTANCE(zipcodes.location, target_zip.location) * ${milesInMeter})`;

class Campaign {
  static async findOne(...args) {
    const campaign = await db
      .table('campaigns')
      .where(...args)
      .first();

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    Object.assign(campaign, await this.details(campaign));
    return campaign;
  }

  static async find(...args) {
    const campaigns = await db
      .table('campaigns')
      .where(...args)
      .orderBy('slug', 'asc');

    for (const campaign of campaigns) {
      // eslint-disable-next-line no-await-in-loop
      Object.assign(campaign, await this.details(campaign));
    }

    return campaigns;
  }

  static async create(options) {
    const user = await db
      .table('users')
      .where('id', options.owner_id)
      .first('id', 'email_confirmed');

    if (!user.email_confirmed) {
      throw new Error('User must confirm email to create a campaign');
    }

    if (!user) {
      throw new Error('User not found');
    }

    const slug = await getValidSlug(options.title);

    const newCampaignData = Object.assign({}, options, { slug });

    const campaignResult = await db
      .table('campaigns')
      .insert(newCampaignData, ['id', 'title', 'slug', 'description', 'tags', 'owner_id']);

    const newCampaign = campaignResult[0];

    return Object.assign({}, newCampaign, await this.details(newCampaign));
  }

  static async edit({ input, userId }) {
    const user = await db
      .table('users')
      .where('id', userId)
      .first('id', 'superuser');
    const campaignId = input.id;

    if (user) {
      const campaign = await db('campaigns')
        .where('id', campaignId)
        .first();

      if (await User.ownsObject({ user, object: campaign })) {
        const updateResult = await db('campaigns')
          .where('id', campaignId)
          .update(input, ['id', 'title', 'slug', 'description', 'tags', 'owner_id']);

        const campaignResult = updateResult[0];

        return { ...campaignResult, ...(await this.details(campaignResult)) };
      }
      throw new Error('User must be owner of campaign');
    } else {
      throw new Error('User not found');
    }
  }

  static async delete({ input, userId }) {
    const user = await db
      .table('users')
      .where('id', userId)
      .first('id', 'superuser');

    if (!user) {
      throw new Error('User not found');
    }

    const campaign = await Campaign.findOne(input);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (!(await User.ownsObject({ userId, object: campaign }))) {
      throw new Error('User must own campaign');
    }

    const campaignsResult = await db('campaigns')
      .where('id', campaign.id)
      .update({ deleted: true });

    await db('actions')
      .where('campaign_id', campaign.id)
      .update({ deleted: true });

    return campaignsResult === 1;
  }

  static async subscribed({ userId, campaignId }) {
    const subscription = await db('campaign_signups').where({
      campaign_id: campaignId,
      user_id: userId,
    });

    if (subscription.length > 1) {
      throw new Error(`More than one subscription for user with id: ${userId}for campaign with id: ${campaignId}`);
    } else {
      return subscription.length === 1;
    }
  }

  static async subscribe({ userId, campaignId }) {
    if (await this.subscribed({ userId, campaignId })) {
      return Campaign.findOne({ id: campaignId });
    }

    await db('campaign_signups').insert({
      user_id: userId,
      campaign_id: campaignId,
    });

    return Campaign.findOne({ id: campaignId });
  }

  static async cancelSubscription({ userId, campaignId }) {
    if (!(await this.subscribed({ userId, campaignId }))) {
      return Campaign.findOne({ id: campaignId });
    }

    await db('campaign_signups')
      .where({
        user_id: userId,
        campaign_id: campaignId,
      })
      .del();

    return Campaign.findOne({ id: campaignId });
  }

  static async subscribedUsers({ campaignId }) {
    const result = await db('campaign_signups')
      .where('campaign_id', campaignId)
      .innerJoin('users', 'campaign_signups.user_id', 'users.id');

    return result;
  }

  static async usersSubscriptions({ userId }) {
    const results = await db('campaign_signups')
      .where('user_id', userId)
      .andWhere('deleted', false)
      .innerJoin('campaigns', 'campaign_signups.campaign_id', 'campaigns.id');

    await Promise.all(
      results.map(async (campaign) => {
        Object.assign(campaign, await this.details(campaign));
      }),
    );

    return results;
  }

  static async search(search) {
    const searchQuery = db('campaigns')
      .select('*')
      .where('deleted', false)
      .orderBy('slug', 'asc')
      .modify((qb) => {
        if (search) {
          if (search.titles) {
            qb.andWhere(function titleQueryBuilder() {
              search.titles.forEach((title) => {
                this.orWhere(db.raw('title %> ?', title));
              });
            });
          }

          if (search.id) {
            qb.andWhere('id', search.id);
          }

          if (search.ownerId) {
            qb.andWhere('owner_id', search.ownerId);
          }

          if (search.tags) {
            const tags = db('campaigns')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            search.tags.forEach((tag) => {
              qb.andWhere(function tagsQueryBuilder() {
                const tagQuery = db
                  .select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag ILIKE ?', tag);

                this.where('campaigns.id', 'in', tagQuery);
              });
            });
          }

          if (search.keywords) {
            const tags = db('campaigns')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            search.keywords.forEach((keyword) => {
              qb.andWhere(function keywordQueryBuilder() {
                const stringOverlapComparator = /^#/.test(keyword)
                  ? "SIMILAR TO '%(,| )\\?' || ? || '(,| )\\?%'"
                  : '%> ?';

                this.orWhere(db.raw(`title ${stringOverlapComparator}`, keyword));

                this.orWhere(db.raw(`profile_subheader ${stringOverlapComparator}`, keyword));

                this.orWhere(db.raw(`description ${stringOverlapComparator}`, keyword));

                const tagKeywordQuery = db
                  .select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw(`tag ${stringOverlapComparator}`, keyword);

                this.orWhere('id', 'in', tagKeywordQuery);
              });
            });
          }

          if (search.geographies) {
            qb.andWhere(function geographyQueryBuilder() {
              search.geographies.forEach((geography) => {
                if (validator.isNumeric(geography.zipcode)) {
                  const { distance = 10, zipcode } = geography; // default to 10 miles

                  // TODO: It would be nice to refactor some of this out into knex language
                  const distanceQuery = db
                    .select('id')
                    .from(function() {
                      this.select(
                        'campaigns.id',
                        db.raw('ST_DISTANCE(campaigns.location, target_zip.location) * ? AS distance', milesInMeter),
                      )
                        .as('distances')
                        .from(
                          db.raw(
                            `
                          (SELECT postal_code, location from zipcodes where postal_code=?) target_zip
                          CROSS JOIN
                          (select * from campaigns join zipcodes on zipcodes.postal_code = campaigns.zipcode) campaigns
                        `,
                            zipcode,
                          ),
                        );
                    })
                    .where('distance', '<=', distance);

                  this.orWhere('campaigns.id', 'in', distanceQuery);

                  // this.orWhereRaw('? = ANY(zipcode_list)', zipcode);
                  // this.orWhereRaw('? = zipcode', zipcode);
                }
              });
            });
          }
        }
      });

    const results = await searchQuery;

    return results;
  }

  static async findActions(campaignId) {
    const actionsQuery = db('actions')
      .select([
        'id',
        'title',
        'slug',
        'city',
        'state',
        'zipcode',
        'ongoing',
        'campaign_id',
        'owner_id',
        'description',
        db.raw('to_char(start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
        db.raw('to_char(end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
        'location_name',
        'street_address',
        'street_address2',
        'city',
        'state',
        'zipcode',
        'location_notes',
        'virtual',
        'ongoing',
      ])
      .where('campaign_id', campaignId)
      .andWhere('deleted', false);

    return actionsQuery;
  }

  static async details(campaign, quick = false) {
    const details = {};

    if (!quick) {
      const actionsQuery = db('actions')
        .select([
          'actions.id as id',
          'title',
          'slug',
          'city',
          'state',
          'zipcode',
          'ongoing',
          'campaign_id',
          'owner_id',
          'description',
          db.raw('to_char(start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
          db.raw('to_char(end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
          db.raw(
            "(case when count(shifts.id)=0 then '[]'::json else " +
              "json_agg(json_build_object('id', shifts.id, 'start', " +
              '(to_char(shifts.start at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\')), ' +
              "'end', (to_char(shifts.end at time zone 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"')) )) end) as shifts",
          ),
          'location_name',
          'street_address',
          'street_address2',
          'city',
          'state',
          'zipcode',
          'location_notes',
          'virtual',
          'ongoing',
        ])
        .leftOuterJoin('shifts', 'shifts.action_id', 'actions.id')
        .where('campaign_id', campaign.id)
        .groupBy('actions.id')
        .andWhere('actions.deleted', false);

      [details.owner, details.actions] = await Promise.all([
        User.findOne({ args: { id: campaign.owner_id } }),
        actionsQuery,
      ]);
    }

    details.public_url = url.resolve(config.urls.client, `campaign/${campaign.slug}`);
    details.dashboard_url = url.resolve(config.urls.client, `organize/${campaign.slug}`);

    return details;
  }

  static async searchTypes(search) {
    const searchQuery = db('types')
      .select('*')
      .where('deleted', false)
      .modify((qb) => {
        if (search) {
          if (search.keywords) {
            qb.andWhere(function typesQueryBuilder() {
              search.keywords.forEach((keyword) => {
                this.orWhere(db.raw('title %> ?', keyword));
                this.orWhere(db.raw('description %> ?', keyword));
              });
            });
          }

          if (search.title) {
            qb.orWhere(db.raw('title %> ?', search.title));
          }
        }
      });

    const results = await searchQuery;

    return results;
  }
}

module.exports = Campaign;
