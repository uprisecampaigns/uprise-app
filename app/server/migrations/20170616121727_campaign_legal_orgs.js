
const tableName = 'campaigns';

exports.up = function (knex, Promise) {
  return knex.schema.table(tableName, (table) => {
    table.boolean('legal_org').notNullable().defaultTo(false);
    table.text('org_website');
    table.text('org_name');
    table.text('org_status');
    table.text('org_contact_name');
    table.text('org_contact_position');
    table.text('org_contact_email');
    table.text('org_contact_phone');
  });
};

exports.down = function (knex, Promise) {
  // Borrowed from https://github.com/tgriesser/knex/issues/1091#issuecomment-163670542
  const columnsToDrop = [
    'legal_org',
    'org_website',
    'org_name',
    'org_status',
    'org_contact_name',
    'org_contact_position',
    'org_contact_email',
    'org_contact_phone',
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
