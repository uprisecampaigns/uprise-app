const nodemon = require('nodemon');
const path = require('path');

const config = require('config/gulp.js');

let exec;
if (process.env.NODE_DEBUG) {
  exec = 'node --inspect=0.0.0.0:5856';
} else {
  exec = 'node';
}

nodemon({
  script: path.resolve(config.publicRoot, 'bin', 'gulp-start.js'),
  ignore: [ 
    config.src,
    config.dest,
    config.serverRoot,
  ],
  exec,
  ext: 'js json'
});

nodemon.on('start', function () {
  console.log('Client gulp has started');
}).on('quit', function () {
  console.log('Client gulp has quit');
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});
