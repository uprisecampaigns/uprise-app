const vaUsers = require('./users/VA-users-4.20.17.json');

module.exports = async (knex) => {

  let testUser = await knex('users').where('email', 'test@uprise.org').select('id');

  if (!testUser.length) {
    testUser = await knex('users').insert([
      {
        email: 'test@uprise.org',
        first_name: 'Test',
        last_name: 'ProgUser',
        zipcode: '12345',
        password_hash: '$2a$10$/dGp5EQFDO/5pqRSFryjSO3FUq.Rs6svkof/fiSics32mRPU8QCcS' // the password is password!
      }, 

    ], ['id'] );
  }

  console.log(testUser);

  const newVaUsers = [];

  for (let userRecord of vaUsers) {

    const dbUser = await knex('users').where('email', userRecord.email).select('id');

    if (dbUser.length === 0) {
      const newUser = await knex('users').insert([userRecord], ['id']);
      newVaUsers.push(newUser);
    } else {
      newVaUsers.push(dbUser[0]);
    }
  }

  console.log(newVaUsers);

  return testUser.concat(newVaUsers);
};
