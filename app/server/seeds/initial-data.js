
const initUsers = require('./initial-data/users.js');
const initCampaigns = require('./initial-data/campaigns.js');
const initOpportunities = require('./initial-data/opportunities.js');

exports.seed = async (knex) => {

  const users = await initUsers(knex);
  const { campaigns, levels, issueAreas, types } = await initCampaigns(knex, users);
  const opportunities = await initOpportunities(knex, { users, campaigns, levels, issueAreas, types });

};
