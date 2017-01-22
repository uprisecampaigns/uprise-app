"use strict";

const path = require('path');
const gulp = require('gulp');
const config = require('config/gulp.js');

gulp.task('watch', () => {

	gulp.watch([
    path.join(config.src, '**', '*') 
  ], ['webpack']);

});
