"use strict";

const gulp = require('gulp');
const path = require('path');
const nodemon = require('gulp-nodemon');

const config = require('../config');

gulp.task('nodemon', function () {
  nodemon({
    script: path.resolve(config.serverRoot, 'bin', 'www'), 
		ignore: [ config.publicRoot ],
    ext: 'js json', 
    legacyWatch: true 
  });
});


