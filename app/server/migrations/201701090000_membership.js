module.exports.up = async (knex, Promise) => {
  console.info('running migration 201701090000_membership.js');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.specificType('email', 'citext').unique();
    table.text('first_name');
    table.text('last_name');
    table.boolean('email_confirmed').notNullable().defaultTo(false);
    table.text('password_hash');
    table.text('phone_number');
    table.text('zipcode').notNullable();
    table.timestamp('lockout_end', 'without time zone');
    table.boolean('lockout_enabled').notNullable().defaultTo(false);
    table.smallint('access_failed_count').notNullable().defaultTo(0);
    table.smallint('password_reset_count').notNullable().defaultTo(0);
    table.boolean('password_being_reset').notNullable().defaultTo(false);
  });

  await knex.schema.createTable('user_email_verifications', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.text('token').unique().notNullable();
    table.boolean('used').notNullable().defaultTo(false);
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('user_password_resets', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.text('code').unique().notNullable();
    table.specificType('ip', 'inet').notNullable();
    table.boolean('used').notNullable().defaultTo(false);
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('user_profiles', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.text('display_name');
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
  });
};

module.exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('user_profiles');
  await knex.schema.dropTableIfExists('user_email_verifications');
  await knex.schema.dropTableIfExists('user_password_resets');
  await knex.schema.dropTableIfExists('users');
};

module.exports.configuration = { transaction: true };
