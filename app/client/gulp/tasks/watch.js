"use strict";

const path = require('path');
const gulp = require('gulp');
const config = require('../config');


gulp.task('watch', () => {

  console.log(config.appRoot);
	gulp.watch([
    path.join(config.src, '**', '*') 
  ], ['webpack']);
});
