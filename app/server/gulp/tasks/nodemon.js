"use strict";

const gulp = require('gulp');
const path = require('path');
const yargs = require('yargs');
const nodemon = require('gulp-nodemon');

const config = require('config/gulp');

gulp.task('nodemon', function () {

  const nodemonOpts = {
    script: path.resolve(config.serverRoot, 'bin', 'www'), 
		ignore: [ config.publicRoot ],
    ext: 'js json', 
    legacyWatch: true 
  };

  if (process.env.NODE_DEBUG) {
    nodemonOpts.nodeArgs = ['--inspect=5857']
  }

  nodemon(nodemonOpts);
});


