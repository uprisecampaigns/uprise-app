module.exports.up = async (knex, Promise) => {
  console.log('running migration 201701090000_membership.js');
  // PostgreSQL extensions (may require superuser or database owner priveleges)
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "hstore"');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.string('email').unique();
    table.string('first_name');
    table.string('last_name');
    table.boolean('email_confirmed').notNullable().defaultTo(false);
    table.string('password_hash', 100);
    table.string('phone_number', 50);
    table.string('zip', 12).notNullable();
    table.timestamp('lockout_end', 'without time zone');
    table.boolean('lockout_enabled').notNullable().defaultTo(false);
    table.smallint('access_failed_count').notNullable().defaultTo(0);
    table.smallint('password_reset_count').notNullable().defaultTo(0);
    table.boolean('password_being_reset').notNullable().defaultTo(false);
  });

  await knex.schema.createTable('user_email_verifications', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.string('token').unique().notNullable();
    table.boolean('used').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

  await knex.schema.createTable('user_password_resets', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.string('code').unique().notNullable();
    table.specificType('ip', 'inet').notNullable();
    table.boolean('used').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

  await knex.schema.createTable('user_profiles', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.string('display_name', 100);
    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

module.exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('user_profiles');
  await knex.schema.dropTableIfExists('user_email_verifications');
  await knex.schema.dropTableIfExists('user_password_resets');
  await knex.schema.dropTableIfExists('users');
};

module.exports.configuration = { transaction: true };
