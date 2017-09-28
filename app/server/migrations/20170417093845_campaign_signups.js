

exports.up = async (knex, Promise) => {
  await knex.schema.createTable('campaign_signups', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).unique();
    table.timestamps(true, true);

    table.uuid('campaign_id').notNullable()
      .references('id').inTable('campaigns')
      .onDelete('CASCADE');

    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.primary(['campaign_id', 'user_id']);
  });
};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('campaign_signups');
};

module.exports.configuration = { transaction: true };
