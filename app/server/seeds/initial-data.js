
const initUsers = require('./initial-data/users.js');
const initCampaigns = require('./initial-data/campaigns.js');
const initActions = require('./initial-data/actions.js');

exports.seed = async (knex) => {

  const users = await initUsers(knex);
  const { campaigns, levels, issueAreas, types } = await initCampaigns(knex, users);
  const actions = await initActions(knex, { users, campaigns, levels, issueAreas, types });

};
