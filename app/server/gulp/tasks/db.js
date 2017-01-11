const fs = require('fs');
const gulp = require('gulp');
const knex = require('knex');
const argv = require('yargs').argv;

const config = require('config/knexfile');

gulp.task('db:migrate:latest', (done) => {
  const db = knex(config.development);
  return db.migrate.latest(config);
});

gulp.task('db:migrate:rollback', (done) => {
  const db = knex(config.development);
  return db.migrate.rollback(config);
});


