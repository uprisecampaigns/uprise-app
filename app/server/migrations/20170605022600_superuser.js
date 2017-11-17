

const tableName = 'users';

exports.up = (knex, Promise) => (
  knex.schema.table(tableName, (table) => {
    table.boolean('superuser').notNullable().defaultTo(false);
  })
);

exports.down = (knex, Promise) => {
  // Borrowed from https://github.com/tgriesser/knex/issues/1091#issuecomment-163670542
  const columnsToDrop = [
    'superuser',
  ];

  return Promise
    // filter the columns based on whether or not they exist
    .filter(columnsToDrop, columnName => knex.schema.hasColumn(tableName, columnName))
    .then(existingColumns =>
      knex.schema.table(tableName, (t) => {
        // for each existing column, drop it
        existingColumns.forEach(columnName => t.dropColumn(columnName));
      }));
};

module.exports.configuration = { transaction: true };
