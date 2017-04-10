

exports.up = async (knex, Promise) => {
  await knex.schema.createTable('action_signups', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).unique();
    table.timestamps(true, true);

    table.uuid('action_id').notNullable()
      .references('id').inTable('actions')
      .onDelete('CASCADE');

    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.primary(['action_id', 'user_id']);
  });
};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('action_signups');
};

module.exports.configuration = { transaction: true };
