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
    const opportunity = db.table('opportunities').where(...args).first();
    opportunity.owner = User.findOne('id', opportunity.owner_id);
  }

  static async search(search) {
    
    const searchQuery = db('opportunities')
      .select('*')
      .where('opportunities.deleted', false)
      .modify( (qb) => {

        if (search) {
          if (search.keywords) {

            const tags = db('opportunities')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            qb.andWhere(function() {

              search.keywords.forEach( (keyword) => {
                
                this.orWhere(db.raw('title % ?', keyword));
                this.orWhere(db.raw('location_name % ?', keyword));
                this.orWhere(db.raw('street_address % ?', keyword));
                this.orWhere(db.raw('street_address2 % ?', keyword));
                this.orWhere(db.raw('city % ?', keyword));
                this.orWhere(db.raw('state % ?', keyword));
                this.orWhere(db.raw('location_notes % ?', keyword));

                const tagKeywordQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag % ?', keyword);

                this.orWhere('id', 'in', tagKeywordQuery);

              });
            });
          }

          if (search.campaignNames) {
            qb.andWhere(function() {

              const campaigns = db('campaigns')
                .select('id', 'title', 'description')
                .as('campaigns');

              search.campaignNames.forEach( (campaignName) => {

                const campaignQuery = db.select('id')
                  .distinct()
                  .from('campaigns')
                  .where(db.raw('title % ?', campaignName));

                this.orWhere('campaign_id', 'in', campaignQuery);

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

                this.orWhere('id', 'in', activityQuery);

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

                const levelQuery = db.select('opportunity_id')
                  .distinct()
                  .from('levels')
                  .innerJoin('opportunities_levels', 'levels.id', 'opportunities_levels.level_id')
                  .where('title', level);

                this.orWhere('id', 'in', levelQuery);

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

                this.orWhere('id', 'in', issueAreaQuery);

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

                this.orWhere('id', 'in', distanceQuery);
              });
            });
          }

          if (search.sortBy) {
            if (search.sortBy.name === 'date') {
              qb.orderBy('start_time', (search.sortBy.descending) ? 'desc' : 'asc');

            } else if (search.sortBy.name === 'campaignName') {
              qb.orderBy('campaigns.title', (search.sortBy.descending) ? 'desc' : 'asc');
            }
          }
        }

        qb.innerJoin('campaigns', 'opportunities.campaign_id', 'campaigns.id');

      });


    console.log(searchQuery.toString());

    const opportunityResults = await searchQuery;

    for (let opportunity of opportunityResults) {

      opportunity.campaign = Campaign.findOne('id', opportunity.campaign_id); 

      opportunity.owner = User.findOne('id', opportunity.owner_id); 

      const activitiesQuery = db('activities')
        .innerJoin('opportunities_activities', 'opportunities_activities.activity_id', 'activities.id')
        .where('opportunities_activities.opportunity_id', opportunity.id)
        .select('title', 'description');

      console.log(activitiesQuery.toString());

      opportunity.activities = await activitiesQuery;

      const issuesQuery = db('issue_areas')
        .innerJoin('opportunities_issue_areas', 'opportunities_issue_areas.issue_area_id', 'issue_areas.id')
        .where('opportunities_issue_areas.opportunity_id', opportunity.id)
        .select('title');

      console.log(issuesQuery.toString());

      opportunity.issueAreas = await issuesQuery;
    };

    console.log(opportunityResults);
    return opportunityResults;
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
