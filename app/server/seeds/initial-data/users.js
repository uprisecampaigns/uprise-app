const vaUsers = require('./users/VA-users-4.20.17.json');

module.exports = async (knex) => {
  let testUser = await knex('users').where('email', 'test@uprise.org').select(['id', 'email']);

  if (!testUser.length) {
    testUser = await knex('users').insert([
      {
        email: 'test@uprise.org',
        first_name: 'Test',
        last_name: 'ProgUser',
        zipcode: '12345',
        password_hash: '$2a$10$/dGp5EQFDO/5pqRSFryjSO3FUq.Rs6svkof/fiSics32mRPU8QCcS', // the password is password!
      },

    ], ['id', 'email']);
  }

  let antoniaUser = await knex('users').where('email', 'antonia@uprise.org').select(['id', 'email']);

  if (!antoniaUser.length) {
    antoniaUser = await knex('users').insert([
      {
        email: 'antonia@uprise.org',
        first_name: 'Antonia',
        last_name: 'Scatton',
        zipcode: '12345',
        password_hash: '$2a$10$/dGp5EQFDO/5pqRSFryjSO3FUq.Rs6svkof/fiSics32mRPU8QCcS', // the password is password!
      },

    ], ['id', 'email']);
  }

  const newVaUsers = [];

  for (const userRecord of vaUsers) {
    // eslint-disable-next-line no-await-in-loop
    const dbUser = await knex('users').where('email', userRecord.email).select(['id', 'email']);

    if (dbUser.length === 0) {
      // eslint-disable-next-line no-await-in-loop
      const newUser = await knex('users').insert([userRecord], ['id', 'email']);
      newVaUsers.push(newUser);
    } else {
      newVaUsers.push(dbUser[0]);
    }
  }

  return testUser.concat(antoniaUser).concat(newVaUsers);
};
