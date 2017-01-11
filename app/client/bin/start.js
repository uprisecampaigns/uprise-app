const nodemon = require('nodemon');
const path = require('path');

const config = require('config/gulp.js');

nodemon({
  script: path.resolve(config.publicRoot, 'bin', 'gulp-start.js'),
  ignore: [ 
    config.src,
    config.dest,
    config.serverRoot,
  ],
  ext: 'js json'
});

nodemon.on('start', function () {
  console.log('Client gulp has started');
}).on('quit', function () {
  console.log('Client gulp has quit');
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});
