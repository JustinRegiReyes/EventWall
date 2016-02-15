'use strict';

var gulp = require("gulp"),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	maps = require('gulp-sourcemaps'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass');

gulp.task("concatScripts", function() {
	gulp.src([
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/bootstrap/dist/js/bootstrap.min.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-route/angular-route.js',
		'public/javascripts/angularApp.js',
		'public/javascripts/services.js',
		'public/javascripts/controllers.js',
		'public/javascripts/eventWallFeedController.js',
		'public/javascripts/directives.js',
		'public/javascripts/factories.js'
		])
	.pipe(maps.init())
	.pipe(concat("app.js"))
	.pipe(maps.write('./'))
	.pipe(gulp.dest("public/javascripts"));
});

gulp.task('minifyScripts', ["concatScripts"], function() {
	gulp.src("public/javascripts/app.js")
	.pipe(uglify().on('error', gutil.log))
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest("public/javascripts"));
});

gulp.task('compileSass', function() {
  return gulp.src("public/stylesheets/scss/application.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('public/stylesheets/css'));
});

gulp.task("default", ["hello"], function() {
	console.log("This is the default task");
});