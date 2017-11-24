/* eslint-disable no-await-in-loop */

exports.up = async (knex, Promise) => {
  await knex.schema.table('user_profiles', (table) => {
    table.specificType('tags', 'text[]')
      .notNullable()
      .defaultTo(knex.raw("'{}'"))
      .index('user_tags', 'gin');

    table.text('description');
    table.text('subheader');
    table.text('profile_image_url');
    table.text('city');
    table.text('state');
    table.boolean('virtual').notNullable().defaultTo(false);
  });

  const users = await knex('users').select();

  const userProfileCreationQueries = [];

  users.forEach(user => userProfileCreationQueries.push(knex('user_profiles')
    .insert({
      user_id: user.id,
    }, ['id'])));

  await Promise.all(userProfileCreationQueries);

  await knex.schema.createTable('users_activities', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.uuid('activity_id').notNullable()
      .references('id').inTable('activities')
      .onDelete('CASCADE');

    table.primary(['user_id', 'activity_id']);
  });
};

exports.down = async (knex, Promise) => {
  // Borrowed from https://github.com/tgriesser/knex/issues/1091#issuecomment-163670542
  const columnsToDrop = [
    'tags',
    'subheader',
    'profile_image_url',
    'virtual',
    'city',
    'state',
    'description',
  ];

  await Promise
    // filter the columns based on whether or not they exist
    .filter(columnsToDrop, columnName => knex.schema.hasColumn('user_profiles', columnName))
    .then(existingColumns =>
      knex.schema.table('user_profiles', (t) => {
        // for each existing column, drop it
        existingColumns.forEach(columnName => t.dropColumn(columnName));
      }));

  await knex('user_profiles').truncate();

  await knex.schema.dropTableIfExists('users_activities');
};

module.exports.configuration = { transaction: true };

