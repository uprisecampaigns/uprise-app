
module.exports = async (knex) => {

  let testUser = await knex('users').where('email', 'test@uprise.org').select('id');

  if (!testUser.length) {
    testUser = await knex('users').insert({
      email: 'test@uprise.org',
      zip: '12345',
    }, ['id']);
  }

  return testUser;
};
