module.exports.up = async (knex, Promise) => {
  console.info('running migration 201701090001_actions_campaigns.js');

  await knex.schema.createTable('campaigns', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.text('title');
    table.text('slug').notNullable().unique().index();
    table.text('description');
    table.text('website_url');
    table.text('email');
    table.text('phone_number');
    table.text('street_address');
    table.text('street_address2');
    table.text('city');
    table.text('state');
    table.text('zipcode');

    table.text('location_state');
    table.text('location_district_number');
    table.text('location_type');
    table.text('legislative_district_type');

    table.specificType('zipcode_list', 'text[]')
      .notNullable()
      .defaultTo(knex.raw("'{}'"))
      .index('campaign_zipcode_list', 'gin');

    table.specificType('tags', 'text[]')
      .notNullable()
      .defaultTo(knex.raw("'{}'"))
      .index('campaign_tags', 'gin');

    table.uuid('owner_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('types', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.text('title');
    table.text('description');
  });

  await knex.schema.createTable('issue_areas', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.text('title');
  });

  await knex.schema.createTable('levels', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.text('title');
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


  await knex.schema.createTable('actions', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.text('title');
    table.text('internal_title');
    table.text('slug').notNullable().unique().index();

    table.timestamp('start_time');
    table.timestamp('end_time');
    table.text('description');

    table.specificType('tags', 'text[]')
      .notNullable()
      .defaultTo(knex.raw("'{}'"))
      .index('action_tags_tags', 'gin');

    table.boolean('virtual').notNullable().defaultTo(false);

    table.text('location_name');
    table.text('street_address');
    table.text('street_address2');
    table.text('city');
    table.text('state');
    table.text('zipcode');
    table.text('location_notes');

    table.uuid('owner_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.uuid('campaign_id').notNullable()
      .references('id').inTable('campaigns')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('actions_levels', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('action_id').notNullable()
      .references('id').inTable('actions')
      .onDelete('CASCADE');

    table.uuid('level_id').notNullable()
      .references('id').inTable('levels')
      .onDelete('CASCADE');

    table.primary(['action_id', 'level_id']);
  });

  await knex.schema.createTable('actions_types', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('action_id').notNullable()
      .references('id').inTable('actions')
      .onDelete('CASCADE');

    table.uuid('type_id').notNullable()
      .references('id').inTable('types')
      .onDelete('CASCADE');

    table.primary(['action_id', 'type_id']);
  });

  await knex.schema.createTable('actions_issue_areas', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('action_id').notNullable()
      .references('id').inTable('actions')
      .onDelete('CASCADE');

    table.uuid('issue_area_id').notNullable()
      .references('id').inTable('issue_areas')
      .onDelete('CASCADE');

    table.primary(['action_id', 'issue_area_id']);
  });

  await knex.schema.createTable('activities', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()')).primary();
    table.timestamps(true, true);
    table.boolean('deleted').notNullable().defaultTo(false);

    table.text('title');
    table.text('description');
  });

  await knex.schema.createTable('actions_activities', (table) => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.timestamps(true, true);

    table.uuid('action_id').notNullable()
      .references('id').inTable('actions')
      .onDelete('CASCADE');

    table.uuid('activity_id').notNullable()
      .references('id').inTable('activities')
      .onDelete('CASCADE');

    table.primary(['action_id', 'activity_id']);
  });
};

module.exports.down = async (knex, Promise) => {
  await knex.schema.dropTableIfExists('campaigns_issue_areas');
  await knex.schema.dropTableIfExists('campaigns_types');
  await knex.schema.dropTableIfExists('campaigns_levels');
  await knex.schema.dropTableIfExists('actions_issue_areas');
  await knex.schema.dropTableIfExists('actions_levels');
  await knex.schema.dropTableIfExists('actions_types');
  await knex.schema.dropTableIfExists('actions_activities');
  await knex.schema.dropTableIfExists('types');
  await knex.schema.dropTableIfExists('levels');
  await knex.schema.dropTableIfExists('issue_areas');
  await knex.schema.dropTableIfExists('activities');
  await knex.schema.dropTableIfExists('actions');
  await knex.schema.dropTableIfExists('campaigns');
};

module.exports.configuration = { transaction: true };
