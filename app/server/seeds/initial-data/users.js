
module.exports = async (knex) => {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('user_profiles').del();

  const rows = await knex('users').insert({
    email: 'test@uprise.org',
    zip: '12345',
  }, ['id']);

  console.log(rows);

  return rows[0].id;
};
