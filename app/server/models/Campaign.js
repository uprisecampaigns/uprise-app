import validator from 'validator';

const uuid = require('uuid/v4');
const url = require('url');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig[process.env.NODE_ENV]);

const User = require('models/User.js');

const getValidSlug = require('models/getValidSlug');
const updateProperties = require('models/updateProperties')('campaign');

const config = require('config/config.js');

class Campaign {

  static async findOne(...args) {
    const campaign = await db.table('campaigns').where(...args).first();

    Object.assign(campaign, await this.details(campaign));
    return campaign;
  }

  static async find(...args) {
    const campaigns = await db.table('campaigns').where(...args).orderBy('slug', 'asc');

    for (let campaign of campaigns) {
      Object.assign(campaign, await this.details(campaign));
    };

    return campaigns;
  }

  static async create(options) {

    const user = await db.table('users').where('id', options.owner_id).first('id', 'email_confirmed');

    if (!user.email_confirmed) {
      throw new Error('User must confirm email to create a campaign');
    }

    if (!user) {
      throw new Error('User not found');
    }

    const slug = await getValidSlug(options.title);

    const newCampaignData = Object.assign({}, options, { slug });

    const campaignResult = await db.table('campaigns').insert(newCampaignData, [
      'id', 'title', 'slug', 'description', 'tags', 'owner_id'
    ]);

    const newCampaign = campaignResult[0];

    return Object.assign({}, newCampaign, await this.details(newCampaign));
  }

  static async edit({ input, userId }) {

    const user = await db.table('users').where('id', userId).first('id', 'superuser');
    const campaignId = input.id;

    if (user) {

      const campaign = await db('campaigns').where('id', campaignId).first();

      if (await User.ownsObject({ user, object: campaign })) {

        const levels = input.levels;
        delete input.levels;

        const types = input.types;
        delete input.types;

        const issueAreas = input.issue_areas;
        delete input.issue_areas;

        const campaignResult = await db('campaigns')
          .where('id', campaignId)
          .update(input, [
            'id', 'title', 'slug', 'description', 'tags', 'owner_id'
          ]);

        if (levels && levels.length) {
          await updateProperties(levels, 'level', campaignId);
        }

        if (issueAreas && issueAreas.length) {
          await updateProperties(issueAreas, 'issue_area', campaignId);
        }

        if (types && types.length) {
          await updateProperties(types, 'type', campaignId);
        }

        const campaign = campaignResult[0];

        return Object.assign({}, campaign, await this.details(campaign));

      } else {
        throw new Error('User must be owner of campaign');
      }
    } else {
      throw new Error('User not found');
    }
  }

  static async delete(deleteOptions, ownerId) {
    const options = Object.assign({}, deleteOptions, {
      owner_id: ownerId
    });

    const result = await db('campaigns')
      .where(options)
      .update({ deleted: true });

    return result === 1;
  }

  static async subscribed({ userId, campaignId }) {

    const subscription = await db('campaign_signups')
      .where({
        campaign_id: campaignId,
        user_id: userId
      });

    if (subscription.length > 1) {
      throw new Error('More than one subscription for user with id: ' + userId + 'for campaign with id: ' + campaignId);
    } else {
      return subscription.length === 1;
    }
  }

  static async subscribe({ userId, campaignId }) {
    if (await this.subscribed({ userId, campaignId })) {
      return await Campaign.findOne({ id: campaignId });
    } else {
      const result = await db('campaign_signups')
        .insert({
          user_id: userId,
          campaign_id: campaignId
        });

      return await Campaign.findOne({ id: campaignId });
    }
  }

  static async cancelSubscription({ userId, campaignId }) {
    if (!await this.subscribed({ userId, campaignId })) {
      return await Campaign.findOne({ id: campaignId });
    } else {
      const result = await db('campaign_signups')
        .where({
          user_id: userId,
          campaign_id: campaignId
        })
        .del();

      return await Campaign.findOne({ id: campaignId });
    }
  }

  static async subscribedUsers({ campaignId }) {

    const result = await db('campaign_signups')
      .where('campaign_id', campaignId)
      .innerJoin('users', 'campaign_signups.user_id', 'users.id')

    return result;
  }

  static async usersSubscriptions({ userId }) {

    const results = await db('campaign_signups')
      .where('user_id', userId)
      .andWhere('deleted', false)
      .innerJoin('campaigns', 'campaign_signups.campaign_id', 'campaigns.id')

    await Promise.all(results.map( async (campaign) => {
      Object.assign(campaign, await this.details(campaign));
    }));

    return results;
  }


  static async search(search) {
    
    const searchQuery = db('campaigns')
      .select('*')
      .where('deleted', false)
      .orderBy('slug', 'asc')
      .modify( (qb) => {

        if (search) {

          if (search.titles) {
            qb.andWhere(function() {

              search.titles.forEach( (title) => {
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

          if (search.keywords) {

            const tags = db('campaigns')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            qb.andWhere(function() {

              search.keywords.forEach( (keyword) => {
                
                this.orWhere(db.raw('title %> ?', keyword));

                this.orWhere(db.raw('profile_subheader %> ?', keyword));

                this.orWhere(db.raw('description %> ?', keyword));

                const tagKeywordQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag %> ?', keyword);

                this.orWhere('id', 'in', tagKeywordQuery);

              });
            });
          }

          if (search.types) {
            qb.andWhere(function() {

              const types = db('types')
                .select('id', 'title', 'description')
                .as('types');

              search.types.forEach( (type) => {

                const typeQuery = db.select('campaign_id')
                  .distinct()
                  .from('types')
                  .innerJoin('campaigns_types', 'types.id', 'campaigns_types.type_id')
                  .where('title', type);

                this.orWhere('id', 'in', typeQuery);
              });
            });
          }

          if (search.levels) {
            qb.andWhere(function() {

              const levels = db('levels')
                .select('id', 'title')
                .as('levels');

              search.levels.forEach( (level) => {

                const levelQuery = db.select('campaign_id')
                  .distinct()
                  .from('levels')
                  .innerJoin('campaigns_levels', 'levels.id', 'campaigns_levels.level_id')
                  .where('title', level);

                this.orWhere('campaigns.id', 'in', levelQuery);

              });
            });
          }

          if (search.issueAreas) {
            qb.andWhere(function() {

              const issueAreas = db('issue_areas')
                .select('id', 'title')
                .as('issue_areas');

              search.issueAreas.forEach( (issueArea) => {

                const issueAreaQuery = db.select('campaign_id')
                  .distinct()
                  .from('issue_areas')
                  .innerJoin('campaigns_issue_areas', 'issue_areas.id', 'campaigns_issue_areas.issue_area_id')
                  .where('title', issueArea);

                this.orWhere('campaigns.id', 'in', issueAreaQuery);

              });
            });
          }

          if (search.geographies) {

            qb.andWhere(function() {
              search.geographies.forEach( (geography) => {

                if (validator.isNumeric(geography.zipcode)) {

                  const zipcode = geography.zipcode;
                  this.orWhereRaw('? = ANY(zipcode_list)', zipcode);
                }
              });
            });
          }

        }
      });

    const results = await searchQuery;

    return results;
  }

  static async details(campaign) {
    const details = {};

    const issuesQuery = db('issue_areas')
      .innerJoin('campaigns_issue_areas', 'campaigns_issue_areas.issue_area_id', 'issue_areas.id')
      .where('campaigns_issue_areas.campaign_id', campaign.id)
      .select('issue_areas.id as id', 'issue_areas.title as title');

    const levelsQuery = db('levels')
      .innerJoin('campaigns_levels', 'campaigns_levels.level_id', 'levels.id')
      .where('campaigns_levels.campaign_id', campaign.id)
      .select('levels.id as id', 'levels.title as title');

    const typesQuery = db('types')
      .innerJoin('campaigns_types', 'campaigns_types.type_id', 'types.id')
      .where('campaigns_types.campaign_id', campaign.id)
      .select('types.id as id', 'types.title as title');

    const actionsQuery = db('actions')
      .select(['id', 'title', 'slug', 'city', 'state', 'zipcode', 'ongoing',
               db.raw('to_char(start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
               db.raw('to_char(end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time')])
      .where('campaign_id', campaign.id);

    [ details.owner, details.issue_areas, details.levels,
      details.types, details.actions ] = await Promise.all([
      User.findOne('id', campaign.owner_id),
      issuesQuery,
      levelsQuery,
      typesQuery,
      actionsQuery
    ]);

    details.public_url = url.resolve(config.urls.client, 'campaign/' + campaign.slug);
    details.dashboard_url = url.resolve(config.urls.client, 'organize/' + campaign.slug);

    return details;
  }

  static async searchTypes(search) {
       
    const searchQuery = db('types')
      .select('*')
      .where('deleted', false)
      .modify( (qb) => {

        if (search) {
          if (search.keywords) {
            qb.andWhere(function() {
              search.keywords.forEach( (keyword) => {
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

  static async listTypes() {
       
    return await db('types')
      .select('*')
      .where('deleted', false);
  }

  static async listLevels() {
       
    return await db('levels')
      .select('*')
      .where('deleted', false);
  }

  static async listIssueAreas() {
       
    return await db('issue_areas')
      .select('*')
      .where('deleted', false);
  }
}

module.exports = Campaign;
