import validator from 'validator';

const assert = require('assert');
const uuid = require('uuid/v4');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

const User = require('models/User.js');


class Campaign {

  static async findOne(...args) {
    const campaign = await db.table('campaigns').where(...args).first();
    campaign.owner = await User.findOne('id', campaign.owner_id);

    return campaign;
  }

  static async search(search) {
    
    const searchQuery = db('campaigns')
      .select('*')
      .where('deleted', false)
      .modify( (qb) => {

        if (search) {

          if (search.titles) {
            qb.andWhere(function() {

              search.titles.forEach( (title) => {
                this.orWhere(db.raw('title % ?', title));

              });
            });
          }

          if (search.keywords) {

            const tags = db('campaigns')
              .select(db.raw('id, unnest(tags) tag'))
              .as('tags');

            qb.andWhere(function() {

              search.keywords.forEach( (keyword) => {
                
                this.orWhere(db.raw('title % ?', keyword));

                const tagKeywordQuery = db.select('id')
                  .distinct()
                  .from(tags)
                  .whereRaw('tag % ?', keyword);

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
        }
      });


    console.log(searchQuery.toString());

    const results = await searchQuery;
    return results;
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
