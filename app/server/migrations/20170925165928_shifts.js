

exports.up = async (knex, Promise) => {
  await knex.schema.table('action_signups', (table) => {
    table.uuid('shift_id').notNullable()
      .references('id').inTable('shifts')
      .onDelete('CASCADE');
  });

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
};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('shifts');

  if (await knex.schema.hasColumn('action_signups', 'shift_id')) {
    knex.schema.table('action_signups', (table) => {
      table.dropColumn('shift_id');
    });
  }
};

module.exports.configuration = { transaction: true };
