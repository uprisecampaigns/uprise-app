
module.exports = async (knex) => {

  await knex('users')
    .where('email', 'test@uprise.org')
    .orWhere('email', 'john_anderson99@example.com')
    .orWhere('email', 'george_brown@example.com')
    .orWhere('email', 'frank_kaplan49@example.com')
    .orWhere('email', 'marian_shultz19@example.com')
    .orWhere('email', 'darryl_wade83@example.com')
    .orWhere('email', 'james_cole67@example.com')
    .delete();

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
      {
        email: 'john_anderson99@example.com',
        first_name: 'John',
        last_name: 'Anderson',
        zipcode: '23219',
        phone_number: '2154647781',
      },
      {
        email: 'george_brown@example.com',
        first_name: 'George',
        last_name: 'Brown',
        // street_address: '676 Pine St. Apt. 34',
        // city: 'Richmond',
        // state: 'VA',
        zipcode: '23219',
        phone_number: '2154647781',
        password_hash: '$2a$10$/dGp5EQFDO/5pqRSFryjSO3FUq.Rs6svkof/fiSics32mRPU8QCcS' // the password is password!
      },  
      {
        email: 'frank_kaplan49@example.com',
        first_name: 'Frank',
        last_name: 'Kaplan',
        zipcode: '23220',
        phone_number: '3124665959',
      },
      {
        email: 'marian_shultz19@example.com',
        first_name: 'Marian',
        last_name: 'Shultz',
        // street_address: '1628 Lone Mountain Rd.',
        // city: 'Richmond',
        // state: 'VA',
        zipcode: '23220',
        phone_number: '3124665959',
        password_hash: '$2a$10$/dGp5EQFDO/5pqRSFryjSO3FUq.Rs6svkof/fiSics32mRPU8QCcS' // the password is password!
      },
      {
        email: 'darryl_wade83@example.com',
        first_name: 'Darryl',
        last_name: 'Wade',
        // street_address: '8185 W Ann Road',
        // city: 'Richmond',
        // state: 'VA',
        zipcode: '23219',
        phone_number: '5853894484',
        password_hash: '$2a$10$/dGp5EQFDO/5pqRSFryjSO3FUq.Rs6svkof/fiSics32mRPU8QCcS' // the password is password!
      },
      {
        email: 'james_cole67@example.com',
        first_name: 'James',
        last_name: 'Cole',
        // street_address: '2623 Covington Ln.',
        // city: 'Richmond',
        // state: 'VA',
        zipcode: '23220',
        phone_number: '8664913667',
        password_hash: '$2a$10$/dGp5EQFDO/5pqRSFryjSO3FUq.Rs6svkof/fiSics32mRPU8QCcS' // the password is password!
      },
    ], ['id'] );
  }

  return testUser;
};
