
const tableName = 'campaigns';

exports.up = function (knex, Promise) {
  return knex.schema.table(tableName, (table) => {
    table.text('map_url');
    table.text('profile_subheader');
    table.text('profile_image_url');
    table.text('profile_about_content');
  });
};

exports.down = function (knex, Promise) {
  // Borrowed from https://github.com/tgriesser/knex/issues/1091#issuecomment-163670542
  const columnsToDrop = [
    'map_url',
    'profile_image_url',
    'profile_subheader',
    'profile_about_content',
  ];

  return Promise
    // filter the columns based on whether or not they exist
    .filter(columnsToDrop, columnName => knex.schema.hasColumn(tableName, columnName))
    .then(existingColumns =>
      knex.schema.table(tableName, (t) => {
        // for each existing column, drop it
        existingColumns.forEach(columnName => t.dropColumn(columnName));
      }),
    );
};

module.exports.configuration = { transaction: true };
