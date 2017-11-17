const path = require('path');
const gulp = require('gulp');
const cache = require('gulp-cached');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const { argv } = require('yargs');

const config = require('config/gulp');

const lintSrcPath = `${config.serverRoot}/**/*.js`;

const eslintConfig = {
  configFile: path.resolve(config.serverRoot, '.eslintrc'),
  fix: argv.fix,
};

const isFixed = file => file.eslint != null && file.eslint.fixed;


gulp.task('cached-lint', () => gulp.src(lintSrcPath)
  .pipe(cache('eslint'))
  // Only uncached and changed files past this point
  .pipe(eslint(eslintConfig))
  .pipe(eslint.format())
  .pipe(gulpIf(isFixed, gulp.dest(config.serverRoot)))
  .pipe(eslint.result((result) => {
    if (result.warningCount > 0 || result.errorCount > 0) {
      // If a file has errors/warnings remove uncache it
      delete cache.caches.eslint[path.resolve(result.filePath)];
    }
  })));

gulp.task('lint-watch', ['cached-lint'], () =>
  gulp.watch(lintSrcPath, ['cached-lint'], (event) => {
    if (event.type === 'deleted' && cache.caches.eslint) {
      // remove deleted files from cache
      delete cache.caches.eslint[event.path];
    }
  }));
