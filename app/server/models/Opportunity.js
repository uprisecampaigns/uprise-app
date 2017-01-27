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

  static async create(options) {

    const user = await db.table('users').where('id', options.ownerId).first('id');

    if (user) {
      const opportunity = {
        title: options.title,
        owner_id: options.ownerId
      }

      const rows = await db.table('opportunities').insert(opportunity, ['id', 'title']);

      return rows;
    }
  }
}

module.exports = Opportunity;
