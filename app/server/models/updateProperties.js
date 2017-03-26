
const assert = require('assert');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);

const updateProperties = (type) => {
  return async (collection, name, id) => {

    try {
      const deleteResult = await db(type + 's_' + name + 's')
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
      const newItemsResult = await db(type + 's_' + name + 's')
        .insert(newItems);
      console.log(newItemsResult);
      assert(newItemsResult.rowCount === collection.length);

    } catch (e) {
      throw new Error('Error adding ' + collection + ' to ' + type + ': ' + e.message);
    }
  }

}


module.exports = updateProperties;
