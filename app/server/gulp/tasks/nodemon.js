"use strict";

const gulp = require('gulp');
const path = require('path');
const yargs = require('yargs');
const nodemon = require('gulp-nodemon');

const config = require('config/gulp');

gulp.task('nodemon', () => {

  let exec;
  if (process.env.NODE_DEBUG) {
    exec = path.resolve(config.appRoot, 'node_modules', 'babel-cli', 'bin', 'babel-node.js') + ' --inspect=5857 ';
  } else {
    exec = path.resolve(config.appRoot, 'node_modules', 'babel-cli', 'bin', 'babel-node.js');
  }

  console.log('exec path = ' + exec);

  const nodemonOpts = {
    script: path.resolve(config.serverRoot, 'bin', 'www'), 
    exec: exec,
    ignore: [ config.publicRoot ],
    ext: 'js json', 
    legacyWatch: true 
  };

  const monitor = nodemon(nodemonOpts);
  process.once('SIGINT', () => {
    monitor.once('exit', () => {
      process.exit();
    });
  });
});


