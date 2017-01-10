const gulp = require('gulp');
require('../gulpfile')

if (gulp.tasks.default) { 
  console.log('gulpfile contains default!');
  gulp.start('default');
}
