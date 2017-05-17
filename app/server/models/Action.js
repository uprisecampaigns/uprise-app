import validator from 'validator';

const assert = require('assert');
const url = require('url');
const uuid = require('uuid/v4');
const getSlug = require('speakingurl');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

const User = require('models/User.js');
const Campaign = require('models/Campaign.js');

const updateProperties = require('models/updateProperties')('action');

const config = require('config/config.js');


class Action {

  static async findOne(...args) {
    const action = await db('actions')
      .select(['id', 'title', 'internal_title', 'slug', 'tags', 'owner_id', 'description', 'campaign_id',
               db.raw('to_char(start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
               db.raw('to_char(end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
               'location_name', 'street_address', 'street_address2',
               'city', 'state', 'zipcode', 'location_notes', 'virtual'])
      .where(...args)
      .first();

    Object.assign(action, await this.details(action));

    return action;
  }

  static async find(...args) {
    const actions = await db.table('actions').where(...args);

    for (let action of actions) {
      Object.assign(action, await this.details(action));
    };

    return actions;
  }

  static async delete(deleteOptions, ownerId) {

    const options = Object.assign({}, deleteOptions, {
      owner_id: ownerId
    });

    const result = await db('actions')
      .where(options)
      .update({ deleted: true });

    return result === 1;
  }

  static async attending({ userId, actionId }) {

    const signup = await db('action_signups')
      .where({
        action_id: actionId,
        user_id: userId
      });

    if (signup.length > 1) {
      throw new Error('More than one signup for user with id: ' + userId + 'for action with id: ' + actionId);
    } else {
      return signup.length === 1;
    }
  }

  static async signup({ userId, actionId }) {
    if (await this.attending({ userId, actionId })) {
      return await Action.findOne({ id: actionId });
    } else {
      const result = await db('action_signups')
        .insert({
          user_id: userId,
          action_id: actionId
        });

      return await Action.findOne({ id: actionId });
    }
  }

  static async cancelSignup({ userId, actionId }) {
    if (!await this.attending({ userId, actionId })) {
      return await Action.findOne({ id: actionId });
    } else {
      const result = await db('action_signups')
        .where({
          user_id: userId,
          action_id: actionId
        })
        .del();

      return await Action.findOne({ id: actionId });
    }
  }

  static async signedUpVolunteers({ actionId }) {

    const result = await db('action_signups')
      .where('action_id', actionId)
      .innerJoin('users', 'action_signups.user_id', 'users.id')

    return result;
  }

  static async usersActions({ userId }) {

    const results = await db('action_signups')
      .where('user_id', userId)
      .innerJoin('actions', 'action_signups.action_id', 'actions.id')

    await Promise.all(results.map( async (action) => {
      Object.assign(action, await this.details(action));
    }));

    return results;
  }

  static async search(search) {
    
    const searchQuery = db('actions')
      .select(['actions.id as id', 'actions.title as title', 
               db.raw('to_char(actions.start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
               db.raw('to_char(actions.end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
               'actions.tags as tags', 'actions.owner_id as owner_id', 'actions.slug as slug', 'actions.description as description',
               'actions.location_name as location_name', 'actions.street_address as street_address', 'actions.street_address2 as street_address2',
               'actions.city as city', 'actions.state as state', 'actions.zipcode as zipcode', 'actions.location_notes as location_notes', 'actions.virtual as virtual',
               'campaigns.title as campaign_title', 'campaigns.id as campaign_id', 'campaigns.slug as campaign_slug', 'campaigns.profile_image_url as campaign_profile_image_url'])
 
      .where('actions.deleted', false)
      .innerJoin('campaigns', 'actions.campaign_id', 'campaigns.id')
      .modify( (qb) => {

        if (search) {

          if (search.ids) {
            qb.andWhere(function() {
              search.ids.forEach( (id) => {
                this.orWhere('actions.id', id);
              });
            });
          }
 
          if (search.slugs) {
            qb.andWhere(function() {
              search.slugs.forEach( (slug) => {
                this.orWhere('actions.slug', slug);
              });
            });
          }            

          if (search.campaignIds) {
            qb.andWhere(function() {
              search.campaignIds.forEach( (id) => {
                this.orWhere('campaigns.id', id);
              });
            });
          }            

          if (search.keywords) {

            const tags = db('actions')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            qb.andWhere(function() {

              search.keywords.forEach( (keyword) => {
                
                this.orWhere(db.raw('actions.title % ?', keyword));
                this.orWhere(db.raw('actions.location_name % ?', keyword));
                this.orWhere(db.raw('actions.street_address % ?', keyword));
                this.orWhere(db.raw('actions.street_address2 % ?', keyword));
                this.orWhere(db.raw('actions.city % ?', keyword));
                this.orWhere(db.raw('actions.state % ?', keyword));
                this.orWhere(db.raw('actions.location_notes % ?', keyword));
                this.orWhere(db.raw('campaigns.title % ?', keyword));

                this.orWhere(db.raw("campaigns.title ILIKE '%' || ? || '%' ", keyword));

                const tagKeywordQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag % ?', keyword);

                this.orWhere('actions.id', 'in', tagKeywordQuery);

                const activityQuery = db.select('action_id')
                  .distinct()
                  .from('activities')
                  .innerJoin('actions_activities', 'activities.id', 'actions_activities.activity_id')
                  .whereRaw('title % ?', keyword)
                  .orWhereRaw('description % ?', keyword)
                  .orWhereRaw("title ILIKE '%' || ? || '%' ", keyword)
                  .orWhereRaw("description ILIKE '%' || ? || '%' ", keyword);

                this.orWhere('actions.id', 'in', activityQuery);


              });
            });
          }

          if (search.campaignNames) {
            qb.andWhere(function() {

              search.campaignNames.forEach( (campaignName) => {
                this.orWhere(db.raw("campaigns.title ILIKE '%' || ? || '%' ", campaignName));
              });
            });
          }

 
          if (search.activities) {
            qb.andWhere(function() {

              const activities = db('activities')
                .select('id', 'title', 'description')
                .as('activities');

              search.activities.forEach( (activity) => {

                const activityQuery = db.select('action_id')
                  .distinct()
                  .from('activities')
                  .innerJoin('actions_activities', 'activities.id', 'actions_activities.activity_id')
                  .where('title', activity);

                this.orWhere('actions.id', 'in', activityQuery);

              });
            });
          }

          if (search.types) {
            qb.andWhere(function() {

              const types = db('types')
                .select('id', 'title', 'description')
                .as('types');

              search.types.forEach( (type) => {

                const typeQuery = db.select('action_id')
                  .distinct()
                  .from('types')
                  .innerJoin('actions_types', 'types.id', 'actions_types.type_id')
                  .where('title', type);

                this.orWhere('actions.id', 'in', typeQuery);

              });
            });
          }

          if (search.levels) {
            qb.andWhere(function() {

              const levels = db('levels')
                .select('id', 'title')
                .as('levels');

              search.levels.forEach( (level) => {

                const levelQuery = db.select('action_id')
                  .distinct()
                  .from('levels')
                  .innerJoin('actions_levels', 'levels.id', 'actions_levels.level_id')
                  .where('title', level);

                this.orWhere('actions.id', 'in', levelQuery);

              });
            });
          }

          if (search.issueAreas) {
            qb.andWhere(function() {

              const issueAreas = db('issue_areas')
                .select('id', 'title')
                .as('issue_areas');

              search.issueAreas.forEach( (issueArea) => {

                const issueAreaQuery = db.select('action_id')
                  .distinct()
                  .from('issue_areas')
                  .innerJoin('actions_issue_areas', 'issue_areas.id', 'actions_issue_areas.issue_area_id')
                  .where('title', issueArea);

                this.orWhere('actions.id', 'in', issueAreaQuery);

              });
            });
          }

          if (search.dates) {

            if (search.dates.onDate) {

              qb.andWhere(function() {
                this.andWhere(db.raw("date(?) >= actions.start_time::date", search.dates.onDate));
                this.andWhere(db.raw("date(?) <= actions.end_time::date", search.dates.onDate));
              }); 

            } else if (search.dates.startDate && search.dates.endDate) {
              // OVERLAPS is exclusive at the endDate, so add a day to simulate inclusion
              qb.andWhere(db.raw("(date(?), date(?) + interval '1 day') OVERLAPS (actions.start_time::date, actions.end_time::date)", [
                search.dates.startDate,
                search.dates.endDate
              ])); 
            }
          }

          // TODO: Clean this up
          if (search.times) {

            qb.andWhere(function() {
              search.times.forEach( (time) => {
                if (time.toLowerCase() === 'saturdays') {
                  this.orWhere(db.raw("EXTRACT (DOW FROM actions.start_time::date) = 6")); 
                  this.orWhere(db.raw("EXTRACT (DOW FROM actions.end_time::date) = 6")); 
                }
                if (time.toLowerCase() === 'sundays') {
                  this.orWhere(db.raw("EXTRACT (DOW FROM actions.start_time::date) = 0")); 
                  this.orWhere(db.raw("EXTRACT (DOW FROM actions.end_time::date) = 0")); 
                }
              });
            });
          }

          if (search.geographies) {

            qb.andWhere(function() {
              search.geographies.forEach( (geography) => {

                if (typeof geography.virtual === 'boolean' && geography.virtual) {

                  this.orWhere('actions.virtual', geography.virtual);

                } else {

                  const distance = geography.distance || 10; // default to 10 miles
                  const zipcode = geography.zipcode;
                  const milesInMeter = 0.000621371192237;

                  // TODO: It would be nice to refactor some of this out into knex language
                  const distanceQuery = db.select('id')
                    .from(function() {
                      this.select('actions.id', db.raw('ST_DISTANCE(actions.location, target_zip.location) * ? AS distance', milesInMeter))
                        .as('distances')
                        .from(db.raw(`
                          (SELECT postal_code, location from zipcodes where postal_code=?) target_zip
                          CROSS JOIN
                          (select * from actions join zipcodes on zipcodes.postal_code = actions.zipcode) actions
                        `, zipcode))
                    })
                    .where('distance', '<=', distance);

                  this.orWhere('actions.id', 'in', distanceQuery);
                }
              });
            });
          }

          if (search.sortBy) {
            if (search.sortBy.name === 'date') {
              qb.orderBy('actions.start_time', (search.sortBy.descending) ? 'desc' : 'asc');

            } else if (search.sortBy.name === 'campaignName') {
              qb.orderBy('campaigns.title', (search.sortBy.descending) ? 'desc' : 'asc');
            }
          }
        }
      });

    const actionResults = await searchQuery;

    actionResults.forEach( (action) => {
      action.campaign = {
        id: action.campaign_id,
        title: action.campaign_title,
        slug: action.campaign_slug,
        profile_image_url: action.campaign_profile_image_url
      };
    });

    return actionResults;
  }

  static async details(action) {
    const details = {};

    const activitiesQuery = db('activities')
      .innerJoin('actions_activities', 'actions_activities.activity_id', 'activities.id')
      .where('actions_activities.action_id', action.id)
      .select('activities.id as id', 'activities.title as title', 'activities.description as description');

    const issuesQuery = db('issue_areas')
      .innerJoin('actions_issue_areas', 'actions_issue_areas.issue_area_id', 'issue_areas.id')
      .where('actions_issue_areas.action_id', action.id)
      .select('issue_areas.id as id', 'issue_areas.title as title');

    const levelsQuery = db('levels')
      .innerJoin('actions_levels', 'actions_levels.level_id', 'levels.id')
      .where('actions_levels.action_id', action.id)
      .select('levels.id as id', 'levels.title as title');

    const typesQuery = db('types')
      .innerJoin('actions_types', 'actions_types.type_id', 'types.id')
      .where('actions_types.action_id', action.id)
      .select('types.id as id', 'types.title as title');

    [ details.campaign, details.owner, details.activities,
      details.issue_areas, details.levels, details.types ] = await Promise.all([
      Campaign.findOne('id', action.campaign_id),
      User.findOne('id', action.owner_id),
      activitiesQuery,
      issuesQuery,
      levelsQuery,
      typesQuery,
    ]);

    details.public_url = url.resolve(config.urls.client, 'action/' + action.slug);
    details.dashboard_url = url.resolve(config.urls.client, 'organize/' + details.campaign.slug + '/action/' + action.slug);

    return details;
  }

  static async listActivities(search) {
       
    const searchQuery = db('activities')
      .select('*')
      .where('deleted', false)
      .modify( (qb) => {

        if (search) {
          if (search.keywords) {
            qb.andWhere(function() {
              search.keywords.forEach( (keyword) => {
                this.orWhere(db.raw('title % ?', keyword));
                this.orWhere(db.raw('description % ?', keyword));
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

    const user = await db.table('users').where('id', options.owner_id).first('id');

    if (user) {

      const campaign = await db('campaigns').where('id', options.campaign_id).first();

      if (!campaign) {
        throw new Error('Cannot find campaign with id=' + options.campaign_id);

      } else if (campaign.owner_id === user.id) {

        let found;
        let append = 0;
        let slug;

        do {
          found = false;

          if (append > 0) {
            slug = getSlug(options.title + append, '');
          } else {
            slug = getSlug(options.title, '');
          }

          const slugQuery = await db('actions').where('slug', slug);
          if (slugQuery.length > 0) {
            found = true;
          }

          append++;

        } while (found)

        const newActionData = Object.assign({}, options, { slug });

        try {
          const actionResult = await db.table('actions').insert(newActionData, [
            'id', 'title', 'slug', 'description', 'tags', 'owner_id', 'campaign_id'
          ]);
          return actionResult[0];

        } catch(e) {
          throw new Error('Cannot insert action: ' + e.message);
        }

      } else {
        throw new Error('User must be owner of campaign');
      }
    } else {
      throw new Error('User not found');
    }
  }

  static async edit(options) {

    const user = await db.table('users').where('id', options.owner_id).first('id');

    if (user) {

      const action = await db('actions').where('id', options.id).first();

      if (!action) {
        throw new Error('Cannot find action with id=' + options.id);

      } else if (action.owner_id === user.id) {

        try {
          const levels = options.levels;
          delete options.levels;

          const types = options.types;
          delete options.types;

          const issueAreas = options.issue_areas;
          delete options.issue_areas;

          const activities = options.activities;
          delete options.activities;

          const actionResult = await db('actions')
            .where('id', options.id)
            .update(options, [
              'id', 'title', 'internal_title', 'slug', 'description', 'tags', 'owner_id', 'campaign_id'
            ]);

          const action = actionResult[0];

          if (levels && levels.length) {
            await updateProperties(levels, 'level', action.id);
          }

          if (issueAreas && issueAreas.length) {
            await updateProperties(issueAreas, 'issue_area', action.id);
          }

          if (types && types.length) {
            await updateProperties(types, 'type', action.id);
          }

          if (activities && activities.length) {
            await updateProperties(activities, 'activity', action.id);
          }

          return Object.assign({}, action, await this.details(action));

        } catch(e) {
          throw new Error('Cannot edit action: ' + e.message);
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
