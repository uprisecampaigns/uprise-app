
module.exports = async (knex) => {

  let testUser = await knex('users').where('email', 'test@uprise.org').select('id');

  if (!testUser.length) {
    testUser = await knex('users').insert({
      email: 'test@uprise.org',
      zip: '12345',
      password_hash: '$2a$10$/dGp5EQFDO/5pqRSFryjSO3FUq.Rs6svkof/fiSics32mRPU8QCcS' // the password is password!
    }, ['id']);
  }

  return testUser;
};
