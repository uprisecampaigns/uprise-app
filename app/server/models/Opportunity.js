import validator from 'validator';

const assert = require('assert');
const uuid = require('uuid/v4');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

const User = require('models/User.js');
const Campaign = require('models/Campaign.js');


class Opportunity {

  static async findOne(...args) {
    const opportunity = await db.table('opportunities').where(...args).first();

    Object.assign(opportunity, await this.details(opportunity));

    return opportunity;
  }

  static async search(search) {
    
    const searchQuery = db('opportunities')
      .select(['opportunities.id as id', 'opportunities.title as title', 
               db.raw('to_char(opportunities.start_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as start_time'),
               db.raw('to_char(opportunities.end_time at time zone \'UTC\', \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as end_time'),
               'opportunities.tags as tags', 'opportunities.owner_id as owner_id', 'opportunities.slug as slug', 'opportunities.description as description',
               'opportunities.location_name as location_name', 'opportunities.street_address as street_address', 'opportunities.street_address2 as street_address2',
               'opportunities.city as city', 'opportunities.state as state', 'opportunities.zip as zip', 'opportunities.location_notes as location_notes',
               'campaigns.title as campaign_title', 'campaigns.id as campaign_id', 'campaigns.slug as campaign_slug'])
 
      .where('opportunities.deleted', false)
      .modify( (qb) => {

        if (search) {
          if (search.keywords) {

            const tags = db('opportunities')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            qb.andWhere(function() {

              search.keywords.forEach( (keyword) => {
                
                this.orWhere(db.raw('opportunities.title % ?', keyword));
                this.orWhere(db.raw('opportunities.location_name % ?', keyword));
                this.orWhere(db.raw('opportunities.street_address % ?', keyword));
                this.orWhere(db.raw('opportunities.street_address2 % ?', keyword));
                this.orWhere(db.raw('opportunities.city % ?', keyword));
                this.orWhere(db.raw('opportunities.state % ?', keyword));
                this.orWhere(db.raw('opportunities.location_notes % ?', keyword));
                this.orWhere(db.raw('campaigns.title % ?', keyword));

                const tagKeywordQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag % ?', keyword);

                this.orWhere('opportunities.id', 'in', tagKeywordQuery);

              });
            });
          }

          if (search.campaignNames) {
            qb.andWhere(function() {

              search.campaignNames.forEach( (campaignName) => {
                this.orWhere(db.raw('campaigns.title % ?', campaignName));
              });
            });
          }

 
          if (search.activities) {
            qb.andWhere(function() {

              const activities = db('activities')
                .select('id', 'title', 'description')
                .as('activities');

              search.activities.forEach( (activity) => {

                const activityQuery = db.select('opportunity_id')
                  .distinct()
                  .from('activities')
                  .innerJoin('opportunities_activities', 'activities.id', 'opportunities_activities.activity_id')
                  .where('title', activity);

                this.orWhere('opportunities.id', 'in', activityQuery);

              });
            });
          }

          if (search.types) {
            qb.andWhere(function() {

              const types = db('types')
                .select('id', 'title', 'description')
                .as('types');

              search.types.forEach( (type) => {

                const typeQuery = db.select('opportunity_id')
                  .distinct()
                  .from('types')
                  .innerJoin('opportunities_types', 'types.id', 'opportunities_types.type_id')
                  .where('title', type);

                this.orWhere('opportunities.id', 'in', typeQuery);

              });
            });
          }

          if (search.levels) {
            qb.andWhere(function() {

              const levels = db('levels')
                .select('id', 'title')
                .as('levels');

              search.levels.forEach( (level) => {

                const levelQuery = db.select('opportunity_id')
                  .distinct()
                  .from('levels')
                  .innerJoin('opportunities_levels', 'levels.id', 'opportunities_levels.level_id')
                  .where('title', level);

                this.orWhere('opportunities.id', 'in', levelQuery);

              });
            });
          }

          if (search.issueAreas) {
            qb.andWhere(function() {

              const issueAreas = db('issue_areas')
                .select('id', 'title')
                .as('issue_areas');

              search.issueAreas.forEach( (issueArea) => {

                const issueAreaQuery = db.select('opportunity_id')
                  .distinct()
                  .from('issue_areas')
                  .innerJoin('opportunities_issue_areas', 'issue_areas.id', 'opportunities_issue_areas.issue_area_id')
                  .where('title', issueArea);

                this.orWhere('opportunities.id', 'in', issueAreaQuery);

              });
            });
          }

          if (search.dates) {

            if (search.dates.onDate) {

              qb.andWhere(function() {
                this.andWhere(db.raw("date(?) >= opportunities.start_time::date", search.dates.onDate));
                this.andWhere(db.raw("date(?) <= opportunities.end_time::date", search.dates.onDate));
              }); 

            } else if (search.dates.startDate && search.dates.endDate) {
              // OVERLAPS is exclusive at the endDate, so add a day to simulate inclusion
              qb.andWhere(db.raw("(date(?), date(?) + interval '1 day') OVERLAPS (opportunities.start_time::date, opportunities.end_time::date)", [
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
                  this.orWhere(db.raw("EXTRACT (DOW FROM opportunities.start_time::date) = 6")); 
                  this.orWhere(db.raw("EXTRACT (DOW FROM opportunities.end_time::date) = 6")); 
                }
                if (time.toLowerCase() === 'sundays') {
                  this.orWhere(db.raw("EXTRACT (DOW FROM opportunities.start_time::date) = 0")); 
                  this.orWhere(db.raw("EXTRACT (DOW FROM opportunities.end_time::date) = 0")); 
                }
              });
            });
          }

          if (search.geographies) {

            qb.andWhere(function() {
              search.geographies.forEach( (geography) => {
                const distance = geography.distance || 10; // default to 10 miles
                const zipcode = geography.zipcode;
                const milesInMeter = 0.000621371192237;

                // TODO: It would be nice to refactor some of this out into knex language
                const distanceQuery = db.select('id')
                  .from(function() {
                    this.select('opportunities.id', db.raw('ST_DISTANCE(opportunities.location, target_zip.location) * ? AS distance', milesInMeter))
                      .as('distances')
                      .from(db.raw(`
                        (SELECT postal_code, location from zipcodes where postal_code=?) target_zip
                        CROSS JOIN
                        (select * from opportunities join zipcodes on zipcodes.postal_code = opportunities.zip) opportunities
                      `, zipcode))
                  })
                  .where('distance', '<=', distance);

                this.orWhere('opportunities.id', 'in', distanceQuery);
              });
            });
          }

          if (search.sortBy) {
            if (search.sortBy.name === 'date') {
              qb.orderBy('opportunities.start_time', (search.sortBy.descending) ? 'desc' : 'asc');

            } else if (search.sortBy.name === 'campaignName') {
              qb.orderBy('campaigns.title', (search.sortBy.descending) ? 'desc' : 'asc');
            }
          }
        }

        qb.innerJoin('campaigns', 'opportunities.campaign_id', 'campaigns.id');

      });


    console.log(searchQuery.toString());

    const opportunityResults = await searchQuery;

    console.log(opportunityResults);

    for (let opportunity of opportunityResults) {
      Object.assign(opportunity, await this.details(opportunity));
    };

    console.log(opportunityResults);
    return opportunityResults;
  }

  static async details(opportunity) {
    const details = {};

    details.campaign = Campaign.findOne('id', opportunity.campaign_id); 

    details.owner = User.findOne('id', opportunity.owner_id); 

    const activitiesQuery = db('activities')
      .innerJoin('opportunities_activities', 'opportunities_activities.activity_id', 'activities.id')
      .where('opportunities_activities.opportunity_id', opportunity.id)
      .select('title', 'description');

    console.log(activitiesQuery.toString());

    details.activities = await activitiesQuery;

    const issuesQuery = db('issue_areas')
      .innerJoin('opportunities_issue_areas', 'opportunities_issue_areas.issue_area_id', 'issue_areas.id')
      .where('opportunities_issue_areas.opportunity_id', opportunity.id)
      .select('title');

    console.log(issuesQuery.toString());

    details.issue_areas = await issuesQuery;

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

    const user = await db.table('users').where('id', options.ownerId).first('id');

    if (user) {
      const opportunity = {
        title: options.title,
        owner_id: options.ownerId
      }

      const opportunityResult = await db.table('opportunities').insert(opportunity, ['id', 'title']).first();

      return opportunityResult;
    }
  }
}

module.exports = Opportunity;
