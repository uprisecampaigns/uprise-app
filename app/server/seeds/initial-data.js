/* eslint-disable */

const initProperties = require('./initial-data/properties.js');

exports.seed = async (knex) => {
  await initProperties(knex);
  // const users = await initUsers(knex);
  // const { campaigns } = await initCampaigns({ knex, users, issueAreas, types, levels, activities });
  // const actions = await initActions({ knex, users, campaigns, levels, issueAreas, types });
};
