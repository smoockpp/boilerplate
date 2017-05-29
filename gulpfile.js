'use strict';

var    gulp = require('gulp'),
      babel = require("gulp-babel"),
     concat = require('gulp-concat'),
     uglify = require('gulp-uglify'),
     rename = require('gulp-rename'),
       sass = require('gulp-sass'),
       maps = require('gulp-sourcemaps'),
   cleanCSS = require('gulp-clean-css'),
        del = require('del'),
browserSync = require('browser-sync').create(),
     reload = browserSync.reload;

function swallowError (error) {

 // If you want details of the error in the console
 console.log(error.toString())
 this.emit('end')
}

gulp.task('concatScripts', function() {
  return gulp.src([
      'src/scripts/custom/index.js'])
  .pipe(concat('app.js'))
  .pipe(babel({
          presets: ['es2015']
      }))
  .on('error', swallowError)
  .pipe(gulp.dest('../'));
});


gulp.task('minifyScripts', ['concatScripts'], function() {
  return gulp.src('src/scripts/app.js')
      .pipe(maps.init())
      .pipe(uglify())
      .on('error', swallowError)
      .pipe(rename('app.min.js'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest('./'));
});



gulp.task('compileSass', function() {
  return gulp.src('src/styles/scss/styles.scss')
      .pipe(maps.init())
      .pipe(sass())
      .on('error', swallowError)
      .pipe(maps.write('./'))
      .pipe(gulp.dest('../'));
});

gulp.task('minifyCSS', ['compileSass'], function() {
    return gulp.src([
            'src/styles/styles.css'
            ])
        .pipe(cleanCSS())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('watchFiles', function() {
  browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
  gulp.watch('src/styles/scss/**/*.scss', ['compileSass', 'minifyCSS']).on('change', reload);

  gulp.watch('src/*.html', ['build']).on('change', reload);
  gulp.watch('scripts/custom/**/*.js', ['concatScripts', 'minifyScripts']).on('change', reload);
});



gulp.task('clean', function() {
  del(['dist', 'src/styles/application.css*', 'src/scripts/app.*.js*']);
});

gulp.task('build', ['compileSass', 'minifyCSS', 'concatScripts', 'minifyScripts'], function() {
  return gulp.src(['src/styles/application.min.css','src/styles/application.css.map', 'src/scripts/app.min.js', 'src/**.html'], { base: './src' })
             .pipe(gulp.dest('dist/'));
});

gulp.task('serve', ['watchFiles']);

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});