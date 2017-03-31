
exports.up = function(knex, Promise) {
  return knex.schema.table('campaigns', (table) => {
    table.text('map_url');
    table.text('profile_image_url');
    table.text('profile_about_content');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('campaigns', (table) => {
    table.dropColumns('map_url', 'profile_image_url', 'profile_about_content');
  });
};

module.exports.configuration = { transaction: true };
