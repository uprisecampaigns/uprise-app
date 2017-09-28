

const gulp = require('gulp');

gulp.task('default', ['db:migrate:latest', 'nodemon']);
