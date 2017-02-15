const fs = require('fs');
const gulp = require('gulp');
const knex = require('knex');
const argv = require('yargs').argv;

const config = require('config/knexfile');

gulp.task('db:migrate:latest', async () => {
  const db = knex(config.development);
  await db.migrate.latest(config);
});

gulp.task('db:migrate:rollback', async () => {
  const db = knex(config.development);
  await db.migrate.rollback(config);
});

gulp.task('db:seed:run', async () => {
  const db = knex(config.development);
  await db.seed.run(config);
});

gulp.task('db:seed:make', async () => {
  const seedName = argv.name;
  const db = knex(config.development);
  await db.seed.make(seedName, config);
});

