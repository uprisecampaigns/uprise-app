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

        if (search.tags) {

          const tags = db('opportunities')
            .select(db.raw('id, unnest(tags) tag'))
            .as('tags');

          qb.andWhere(function() {

            search.tags.forEach( (searchTag) => {

              const tagQuery = db.select('id')
                .distinct()
                .from(tags)
                .whereRaw('tag % \'' + searchTag + '\'');

              this.orWhere('id', 'in', tagQuery);
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

      });

    console.log(searchQuery.toString());

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
