"use strict";

const fs = require('fs');
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

  const gitWatchFiles = fs.readdirSync(config.gitWatchDir)
    .map((filename) => path.resolve(config.gitWatchDir, filename));

  const nodemonOpts = {
    script: path.resolve(config.serverRoot, 'bin', 'www'), 
    exec: exec,
    ignoreRoot: [ 'node_modules' ],
    ignore: [ config.publicRoot ],
    watch: [ config.serverRoot, ...gitWatchFiles ],
    ext: 'js,json,ejs',
    legacyWatch: true,
    verbose: true,
  };

  const monitor = nodemon(nodemonOpts);
  process.once('SIGINT', () => {
    monitor.once('exit', () => {
      process.exit();
    });
  });
});


