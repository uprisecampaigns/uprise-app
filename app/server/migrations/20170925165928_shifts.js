

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

  const actions = await knex('actions').select().where('ongoing', false);

  for (const action of actions) {
    const shift = {
      action_id: action.id,
      start: action.start_time,
      end: action.end_time,
    }

    const shiftId = (await knex('shifts').insert(shift, 'id'))[0];
    await knex('actions').where('id', action.id).update({ start_time: null, end_time: null });

    const signups = await knex.select().table('action_signups').where('action_id', action.id);

    for (const signup of signups) {
      await knex('shift_signups').insert({
        shift_id: shiftId,
        user_id: signup.user_id,
      });
    }

    await knex('action_signups').where('action_id', action.id).del();
  }
};

exports.down = async (knex, Promise) => {
  const shifts = await knex('shifts').select();
  // No way to perfectly map 'shifts' back onto start_time and end_time, but we can do it for just one shift
  // (likely rollback scenario)
  for (const shift of shifts) {
    await knex('actions').where('id', shift.action_id).update({ start_time: shift.start, end_time: shift.end });
  }

  const signups = await knex('shift_signups')
    .join('shifts', 'shifts.id', '=', 'shift_signups.shift_id')
    .select('shifts.action_id as action_id', 'shift_signups.user_id as user_id');

  for (const signup of signups) {
    await knex('action_signups').insert({
      user_id: signup.user_id,
      action_id: signup.action_id,
    });
  }

  await knex.schema.dropTableIfExists('shift_signups');
  await knex.schema.dropTableIfExists('shifts');
};

module.exports.configuration = { transaction: true };
