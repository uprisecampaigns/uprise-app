const gulp = require('gulp');
const clean = require('gulp-clean');
const notify = require('gulp-notify');

const config = require('config/gulp.js')

gulp.task('clean', function() {
	return gulp.src(config.dest, {read: false})
		.pipe(clean())
    .pipe(notify());
});
