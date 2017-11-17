const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const nodemon = require('gulp-nodemon');

const config = require('config/gulp');

gulp.task('nodemon', () => {
  let exec;
  if (process.env.NODE_DEBUG) {
    exec = 'kill-port --port 5857 && node --inspect=0.0.0.0:5857';
  } else {
    exec = 'node';
  }

  const gitWatchFiles = fs.readdirSync(config.gitWatchDir)
    .map(filename => path.resolve(config.gitWatchDir, filename));

  const nodemonOpts = {
    script: path.resolve(config.serverSrc, 'app.js'),
    exec,
    ignoreRoot: ['node_modules'],
    ignore: [config.publicRoot],
    watch: [config.serverRoot, ...gitWatchFiles],
    verbose: true,
    ext: 'js,json,ejs',
    legacyWatch: true,
  };

  const monitor = nodemon(nodemonOpts);

  monitor.on('start', () => {
    console.info('Server nodemon has started');
  }).on('quit', () => {
    console.info('Server nodemon has quit');
  }).on('restart', (files) => {
    console.info('Server nodemon restarted due to: ', files);
  }).on('SIGINT', () => {
    console.info('Server nodemon received SIGINT');
    monitor.once('exit', () => {
      process.exit();
    });
  });
});
