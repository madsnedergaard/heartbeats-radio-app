'use strict';

var gulp = require('gulp');
var useref = require('gulp-useref');
var jsonModify = require('gulp-json-modify');

var electron = require('electron-connect').server.create();

gulp.task('serve', function () {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch(['main.js', 'renderer.js'], electron.restart);

  // Reload renderer process
  gulp.watch(['index.js', 'index.html'], electron.reload);
});


gulp.task('build', function () {

	gulp.src('app/images/*')
		.pipe(gulp.dest('dist/images'));
	gulp.src('app/renderer.js')
		.pipe(gulp.dest('dist'));
gulp.src('app/main.js')
		.pipe(gulp.dest('dist'));
  gulp.src('package.json')
    .pipe(jsonModify({key: 'main', value: 'main.js'}))
    .pipe(gulp.dest('dist'));
  gulp.src('app/index.html')
      .pipe(useref())
      .pipe(gulp.dest('dist'));
});