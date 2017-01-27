module.exports.up = async (knex, Promise) => {
  console.log('running migration 201701090001_opportunities.js');

  await knex.schema.createTable('opportunities', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.string('title');
    table.timestamps(true, true);
    table.timestamp('date');
    table.uuid('owner_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

module.exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('opportunities');
};

module.exports.configuration = { transaction: true };
