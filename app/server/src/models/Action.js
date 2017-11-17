const validator = require('validator');
const url = require('url');
const moment = require('moment-timezone');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');

const db = knex(knexConfig[process.env.NODE_ENV]);

const User = require('models/User.js');
const Campaign = require('models/Campaign.js');

const getValidSlug = require('models/getValidSlug');
const updateProperties = require('models/updateProperties')('action');

const config = require('config/config.js');


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
      // eslint-disable-next-line no-await-in-loop
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
      throw new Error(`More than one signup for user with id: ${userId}for action with id: ${actionId}`);
    } else {
      return signup.length === 1;
    }
  }

  static async signup({ userId, actionId }) {
    if (await this.attending({ userId, actionId })) {
      return Action.findOne({ id: actionId });
    }

    await db('action_signups')
      .insert({
        user_id: userId,
        action_id: actionId,
      });

    return Action.findOne({ id: actionId });
  }

  static async cancelSignup({ userId, actionId }) {
    if (!await this.attending({ userId, actionId })) {
      return Action.findOne({ id: actionId });
    }

    await db('action_signups')
      .where({
        user_id: userId,
        action_id: actionId,
      })
      .del();

    return Action.findOne({ id: actionId });
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
        'actions.tags as tags', 'actions.owner_id as owner_id',
        'actions.slug as slug', 'actions.description as description',
        'actions.location_name as location_name', 'actions.street_address as street_address', 'actions.street_address2 as street_address2',
        'actions.city as city', 'actions.state as state', 'actions.zipcode as zipcode', 'actions.location_notes as location_notes',
        'actions.virtual as virtual', 'actions.ongoing as ongoing'])
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
    const hasInputZipcode = (typeof search.targetZipcode === 'string' &&
      validator.isNumeric(search.targetZipcode) &&
      search.targetZipcode.length === 5);

    const targetZipcode = hasInputZipcode ? search.targetZipcode : defaultTargetZipcode;

    const distanceQueryString = `round(ST_DISTANCE(zipcodes.location, target_zip.location) * ${milesInMeter})`;

    const searchQuery = db.from('actions')
      .select(['actions.id as id', 'actions.title as title',
        db.raw('to_char(actions.start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
        db.raw('to_char(actions.end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
        'actions.tags as tags', 'actions.owner_id as owner_id', 'actions.slug as slug', 'actions.description as description',
        'actions.location_name as location_name', 'actions.street_address as street_address',
        'actions.street_address2 as street_address2',
        'actions.city as city', 'actions.state as state', 'actions.zipcode as zipcode', 'actions.location_notes as location_notes',
        'actions.virtual as virtual', 'actions.ongoing as ongoing',
        db.raw(`${distanceQueryString} as distance`),
        db.raw('to_char(actions.created_at at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as created_at'),
        'campaigns.title as campaign_title', 'campaigns.id as campaign_id', 'campaigns.slug as campaign_slug',
        'campaigns.profile_image_url as campaign_profile_image_url'])
      .where('actions.deleted', false)
      .andWhere('campaigns.deleted', false)
      .innerJoin('campaigns', 'actions.campaign_id', 'campaigns.id')
      .leftOuterJoin('zipcodes', 'zipcodes.postal_code', 'actions.zipcode')
      .crossJoin(db.raw('(SELECT postal_code, location from zipcodes where postal_code=?) target_zip', targetZipcode))
      .modify((qb) => {
        if (search) {
          const tags = db('actions')
            .select(db.raw('id, unnest(tags) tag'))
            .as('tags');

          const campaignTags = db('campaigns')
            .select(db.raw('id, unnest(tags) tag'))
            .as('campaign_tags');

          if (search.ids) {
            qb.andWhere(function idQueryBuilder() {
              search.ids.forEach((id) => {
                this.orWhere('actions.id', id);
              });
            });
          }

          if (search.slugs) {
            qb.andWhere(function slugQueryBuilder() {
              search.slugs.forEach((slug) => {
                this.orWhere('actions.slug', slug);
              });
            });
          }

          if (search.campaignIds) {
            qb.andWhere(function campaignIdQueryBuilder() {
              search.campaignIds.forEach((id) => {
                this.orWhere('campaigns.id', id);
              });
            });
          }

          if (search.tags) {
            search.tags.forEach((tag) => {
              qb.andWhere(function tagQueryBuilder() {
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
              qb.andWhere(function keywordQueryBuilder() {
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
            qb.andWhere(function campaignNameQueryBuilder() {
              search.campaignNames.forEach((campaignName) => {
                this.orWhere(db.raw('campaigns.title %> ?', campaignName));
              });
            });
          }


          if (search.activities) {
            qb.andWhere(function activityQueryBuilder() {
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

          if (search.dates) {
            qb.andWhere(function dateQueryBuilder() {
              if (search.dates.onDate) {
                this.andWhere(db.raw("(?::timestamptz, ?::timestamptz + interval '1 day') OVERLAPS (actions.start_time, actions.end_time)", [
                  search.dates.onDate, search.dates.onDate,
                ]));
              }

              if (search.dates.startDate) {
                this.andWhere(db.raw('?::timestamptz <= actions.start_time', search.dates.startDate));
              }

              if (search.dates.endDate) {
                this.andWhere(db.raw("?::timestamptz + interval '1 day' >= actions.end_time", search.dates.endDate));
              }

              if (search.dates.ongoing) {
                this.orWhere('ongoing', true);
              }
            });
          }

          // TODO: Clean this up
          if (search.times) {
            qb.andWhere(function timeQueryBuilder() {
              search.times.forEach((time) => {
                if (time.toLowerCase() === 'saturdays') {
                  this.orWhere(db.raw('EXTRACT (DOW FROM actions.start_time::date) = 6'));
                  this.orWhere(db.raw('EXTRACT (DOW FROM actions.end_time::date) = 6'));
                }
                if (time.toLowerCase() === 'sundays') {
                  this.orWhere(db.raw('EXTRACT (DOW FROM actions.start_time::date) = 0'));
                  this.orWhere(db.raw('EXTRACT (DOW FROM actions.end_time::date) = 0'));
                }
              });
            });
          }

          if (search.geographies) {
            qb.andWhere(function geographyQueryBuilder() {
              search.geographies.forEach((geography) => {
                if (typeof geography.virtual === 'boolean' && geography.virtual) {
                  this.orWhere('actions.virtual', geography.virtual);
                } else {
                  const { distance = 10, zipcode } = geography; // default to 10 miles

                  // TODO: It would be nice to refactor some of this out into knex language
                  const distanceQuery = db.select('id')
                    .from(function locationQueryBuilder() {
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

    const searchPageQuery = searchQuery.clone().modify((qb) => {
      const sortBy = search.sortBy || {
        name: 'distance',
        descending: false,
      };

      if (sortBy.name === 'campaignName') {
        qb.orderBy('campaigns.title', (sortBy.descending) ? 'DESC' : 'ASC');
      } else if (sortBy.name === 'date') {
        qb.orderByRaw(`actions.start_time ${sortBy.descending ? 'DESC' : 'ASC'} NULLS FIRST`);
      } else if (sortBy.name === 'distance') {
        qb.orderByRaw(`distance ${sortBy.descending ? 'DESC' : 'ASC'} NULLS LAST`);
      }

      if (search.cursor) {
        if (sortBy.name === 'campaignName') {
          qb.andWhere(function campaignNameFilter() {
            this.orWhere('campaigns.title', (sortBy.descending) ? '<' : '>', search.cursor.campaign_name);
            this.orWhere(function timeAndCampaignNameFilter() {
              this.andWhere('campaigns.title', '=', search.cursor.campaign_name);
              this.andWhere('actions.created_at', '<', db.raw('?::timestamptz', search.cursor.created_at));
            });
          });
        } else if (sortBy.name === 'date') {
          qb.andWhere(function cursorTimeFilter() {
            if (typeof search.cursor.start_type !== 'undefined' && moment(search.cursor.start_time).isValid()) {
              this.orWhere(db.raw('?::timestamptz', search.cursor.start_time), (sortBy.descending) ? '>' : '<', db.raw('actions.start_time'));
              this.orWhere(function timeandCreatedAtFilter() {
                this.andWhere(db.raw('?::timestamptz', search.cursor.start_time), '=', db.raw('actions.start_time'));
                this.andWhere('actions.created_at', '<', db.raw('?::timestamptz', search.cursor.created_at));
              });
            } else {
              this.orWhere(function createdAtFilter() {
                this.whereNull('actions.start_time');
                this.andWhere('actions.created_at', '<', db.raw('?::timestamptz', search.cursor.created_at));
              });
              this.orWhereNotNull('actions.start_time');
            }
          });
        } else if (sortBy.name === 'distance') {
          qb.andWhere(function distanceFilter() {
            this.orWhere(db.raw(distanceQueryString), (sortBy.descending) ? '<' : '>', search.cursor.distance);
            this.orWhere(function createdAtFilter() {
              this.andWhere(db.raw(distanceQueryString), '=', search.cursor.distance);
              this.andWhere('actions.created_at', '<', db.raw('?::timestamptz', search.cursor.created_at));
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

    const detailedResults = actionResults.map(action => ({
      ...action,
      campaign: {
        id: action.campaign_id,
        title: action.campaign_title,
        slug: action.campaign_slug,
        profile_image_url: action.campaign_profile_image_url,
      },
    }));

    const cursor = detailedResults.length ? [...detailedResults].pop() : undefined;

    return {
      total,
      targetZipcode,
      actions: detailedResults,
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


      [details.campaign, details.owner, details.activities] = await Promise.all([
        Campaign.findOne('id', action.campaign_id),
        User.findOne('id', action.owner_id),
        activitiesQuery,
      ]);

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
            qb.andWhere(function titleQueryBuilder() {
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
          const { activities, ...newActionInput } = newActionData;

          const newInsertInput = (user.superuser === true) ? { ...newActionInput, owner_id: campaign.owner_id } : newActionInput;

          const actionResult = await db.table('actions').insert(newInsertInput, [
            'id', 'title', 'slug', 'description', 'tags', 'owner_id', 'campaign_id',
          ]);

          const action = actionResult[0];

          if (activities && activities.length) {
            await updateProperties(activities, 'activity', action.id);
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
          const { activities, ...newInput } = input;

          const updateResult = await db('actions')
            .where('id', newInput.id)
            .update(newInput, [
              'id', 'title', 'internal_title', 'slug', 'description', 'tags', 'owner_id', 'campaign_id',
            ]);

          const actionResult = updateResult[0];

          if (activities && activities.length) {
            await updateProperties(activities, 'activity', actionResult.id);
          }

          return Object.assign({}, actionResult, await this.details(actionResult));
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
