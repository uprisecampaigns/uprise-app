module.exports.up = async (knex, Promise) => {
  console.log('running migration 201701090001_opportunities_campaigns.js');

  await knex.schema.createTable('campaigns', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.string('title');
    table.string('slug').notNullable().unique().index();
    table.text('description');

    table.specificType('tags', 'text[]')
      .notNullable()
      .defaultTo(knex.raw("'{}'"))
      .index('campaign_tags_tags', 'gin');

    table.uuid('owner_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('types', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.string('title');
    table.string('description');
  });

  await knex.schema.createTable('issue_areas', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.string('title');
  });

  await knex.schema.createTable('levels', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.string('title');
  });

  await knex.schema.createTable('campaigns_issue_areas', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('campaign_id').notNullable()
      .references('id').inTable('campaigns')
      .onDelete('CASCADE');

    table.uuid('issue_area_id').notNullable()
      .references('id').inTable('issue_areas')
      .onDelete('CASCADE');

    table.primary(['campaign_id', 'issue_area_id']);

  });

  await knex.schema.createTable('campaigns_levels', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('campaign_id').notNullable()
      .references('id').inTable('campaigns')
      .onDelete('CASCADE');

    table.uuid('level_id').notNullable()
      .references('id').inTable('levels')
      .onDelete('CASCADE');

    table.primary(['campaign_id', 'level_id']);

  });

  await knex.schema.createTable('campaigns_types', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('campaign_id').notNullable()
      .references('id').inTable('campaigns')
      .onDelete('CASCADE');

    table.uuid('type_id').notNullable()
      .references('id').inTable('types')
      .onDelete('CASCADE');

    table.primary(['campaign_id', 'type_id']);

  });


  await knex.schema.createTable('opportunities', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.string('title');
    table.string('slug').notNullable().unique().index();

    table.timestamp('start_time');
    table.timestamp('end_time');
    table.text('description');

    table.specificType('tags', 'text[]')
      .notNullable()
      .defaultTo(knex.raw("'{}'"))
      .index('opportunity_tags_tags', 'gin');

    table.text('location_name');
    table.string('street_address');
    table.string('street_address2');
    table.string('city');
    table.string('state', 2);
    table.string('zip', 12);
    table.string('location_notes');

    table.uuid('owner_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.uuid('campaign_id').notNullable()
      .references('id').inTable('campaigns')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('opportunities_levels', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('opportunity_id').notNullable()
      .references('id').inTable('opportunities')
      .onDelete('CASCADE');

    table.uuid('level_id').notNullable()
      .references('id').inTable('levels')
      .onDelete('CASCADE');

    table.primary(['opportunity_id', 'level_id']);

  });

  await knex.schema.createTable('opportunities_types', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('opportunity_id').notNullable()
      .references('id').inTable('opportunities')
      .onDelete('CASCADE');

    table.uuid('type_id').notNullable()
      .references('id').inTable('types')
      .onDelete('CASCADE');

    table.primary(['opportunity_id', 'type_id']);

  });

  await knex.schema.createTable('opportunities_issue_areas', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('opportunity_id').notNullable()
      .references('id').inTable('opportunities')
      .onDelete('CASCADE');

    table.uuid('issue_area_id').notNullable()
      .references('id').inTable('issue_areas')
      .onDelete('CASCADE');

    table.primary(['opportunity_id', 'issue_area_id']);

  });

  await knex.schema.createTable('activities', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.string('title');
    table.string('description');

  });

  await knex.schema.createTable('opportunities_activities', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('opportunity_id').notNullable()
      .references('id').inTable('opportunities')
      .onDelete('CASCADE');

    table.uuid('activity_id').notNullable()
      .references('id').inTable('activities')
      .onDelete('CASCADE');

    table.primary(['opportunity_id', 'activity_id']);

  });

};

module.exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('campaigns_issue_areas');
  await knex.schema.dropTableIfExists('campaigns_types');
  await knex.schema.dropTableIfExists('campaigns_levels');
  await knex.schema.dropTableIfExists('opportunities_issue_areas');
  await knex.schema.dropTableIfExists('opportunities_levels');
  await knex.schema.dropTableIfExists('opportunities_types');
  await knex.schema.dropTableIfExists('opportunities_activities');
  await knex.schema.dropTableIfExists('types');
  await knex.schema.dropTableIfExists('levels');
  await knex.schema.dropTableIfExists('issue_areas');
  await knex.schema.dropTableIfExists('activities');
  await knex.schema.dropTableIfExists('opportunities');
  await knex.schema.dropTableIfExists('campaigns');
};

module.exports.configuration = { transaction: true };
