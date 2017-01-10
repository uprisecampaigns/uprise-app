const fs = require('fs');
const gulp = require('gulp');
const knex = require('knex');

const config = require('../../knexfile.js');

gulp.task('db:migrate', (done) => {
  db = knex(config.development);
  return db.migrate.latest(config);
});


