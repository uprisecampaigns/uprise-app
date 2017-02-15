
module.exports = async (knex) => {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('user_profiles').del();

  const users = await knex('users').insert({
    email: 'test@uprise.org',
    zip: '12345',
  }, ['id']);

  console.log(users);

  return users;
};
