import validator from 'validator';

const assert = require('assert');
const uuid = require('uuid/v4');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

class Opportunity {

  static findOne(...args) {
    return db.table('opportunities').where(...args).first();
  }

  static async search(search) {
    
    const searchQuery = db('opportunities')
      .select('*')
      .where('deleted', false)
      .modify( (qb) => {

        if (search) {
          if (search.keywords) {

            const tags = db('opportunities')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            qb.andWhere(function() {

              search.keywords.forEach( (keyword) => {
                
                this.orWhere(db.raw('title % \'' + keyword + '\''));
                this.orWhere(db.raw('location_name % \'' + keyword + '\''));
                this.orWhere(db.raw('street_address % \'' + keyword + '\''));
                this.orWhere(db.raw('street_address2 % \'' + keyword + '\''));
                this.orWhere(db.raw('city % \'' + keyword + '\''));
                this.orWhere(db.raw('state % \'' + keyword + '\''));
                this.orWhere(db.raw('location_notes % \'' + keyword + '\''));

                const tagKeywordQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag % \'' + keyword + '\'');

                this.orWhere('id', 'in', tagKeywordQuery);

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

        }
      });


    console.log(searchQuery.toString());

    const results = await searchQuery;
    return results;
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
                this.orWhere(db.raw('title % \'' + keyword + '\''));
                this.orWhere(db.raw('description % \'' + keyword + '\''));
              });
            });
          }

          if (search.title) {
            qb.orWhere(db.raw('title % \'' + search.title + '\''));
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
