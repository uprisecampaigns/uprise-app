
const assert = require('assert');
const knex = require('knex');
const pluralize = require('pluralize');

const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

const updateProperties = (type) => {
  return async (collection, name, id) => {

    console.log('type = ' + type);
    console.log('name = ' + name);

    const pluralType = pluralize(type);
    const pluralName = pluralize(name);

    try {
      const deleteResult = await db(pluralType + '_' + pluralName)
        .where(type + '_id', id)
        .delete();
    } catch (e) {
      throw new Error('Could not clear ' + type + ': ' + e.message);
    }

    const newItems = collection.map( (itemId) => ({
      [type + '_id']: id,
      [name + '_id']: itemId
    }));

    try {
      const newItemsResult = await db(pluralType + '_' + pluralName)
        .insert(newItems);
      console.log(newItemsResult);
      assert(newItemsResult.rowCount === collection.length);

    } catch (e) {
      throw new Error('Error adding ' + collection + ' to ' + type + ': ' + e.message);
    }
  }
}


module.exports = updateProperties;
