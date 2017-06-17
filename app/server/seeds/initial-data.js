
const initProperties = require('./initial-data/properties.js');
const initUsers = require('./initial-data/users.js');
const initCampaigns = require('./initial-data/campaigns.js');
const initActions = require('./initial-data/actions.js');

exports.seed = async (knex) => {

  const { issueAreas, types, levels, activities } = await initProperties(knex);
  // const users = await initUsers(knex);
  // const { campaigns } = await initCampaigns({ knex, users, issueAreas, types, levels, activities });
  // const actions = await initActions({ knex, users, campaigns, levels, issueAreas, types });

};
