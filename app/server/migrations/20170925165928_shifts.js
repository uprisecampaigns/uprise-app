

exports.up = async (knex, Promise) => {
  await knex.schema.createTable('shifts', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).unique();
    table.timestamps(true, true);

    table.timestamp('start');
    table.timestamp('end');

    table.uuid('action_id').notNullable()
      .references('id').inTable('actions')
      .onDelete('CASCADE');

    table.boolean('deleted').notNullable().defaultTo(false);
  });

  await knex.schema.createTable('shift_signups', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).unique();
    table.timestamps(true, true);

    table.uuid('shift_id').notNullable()
      .references('id').inTable('shifts')
      .onDelete('CASCADE');

    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.primary(['shift_id', 'user_id']);
  });
};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('shifts');
  await knex.schema.dropTableIfExists('shift_signups');
};

module.exports.configuration = { transaction: true };
