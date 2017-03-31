const fs = require('fs');
const gulp = require('gulp');
const knex = require('knex');
const argv = require('yargs').argv;

const config = require('config/knexfile');

gulp.task('db:migrate:make', () => {
  const migrationName = argv.name;
  const db = knex(config.development);
  return db.migrate.make(migrationName, config);
});

gulp.task('db:migrate:latest', () => {
  const db = knex(config.development);
  return db.migrate.latest(config);
});

gulp.task('db:migrate:rollback', () => {
  const db = knex(config.development);
  return db.migrate.rollback(config);
});

gulp.task('db:seed:run', () => {
  const db = knex(config.development);
  return db.seed.run(config);
});

gulp.task('db:seed:make', () => {
  const seedName = argv.name;
  const db = knex(config.development);
  return db.seed.make(seedName, config);
});

