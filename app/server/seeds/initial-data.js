
const users = require('./initial-data/users.js');
const campaigns = require('./initial-data/campaigns.js');

exports.seed = async (knex) => {

  const userId1 = await users(knex);
  await campaigns(knex, userId1);

};
