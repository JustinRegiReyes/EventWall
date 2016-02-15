'use strict';

var gulp = require("gulp"),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename');

gulp.task("concatScripts", function() {
	gulp.src([
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/bootstrap/dist/js/bootstrap.min.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-route/angular-route.js',
		'public/javascripts/application.js',
		'public/javascripts/services.js',
		'public/javascripts/controllers.js',
		'public/javascripts/eventWallFeedController.js',
		'public/javascripts/directives.js',
		'public/javascripts/factories.js'
		])
	.pipe(concat("dependencies.js"))
	.pipe(gulp.dest("dependencies"));
});

gulp.task('minifyScripts', function() {
	gulp.src(['dependencies/dependencies.js'])
	.pipe(uglify())
	.pipe(rename('dependencies.min.js'))
	.pipe(gulp.dest('dependencies'));
});

gulp.task("default", ["hello"], function() {
	console.log("This is the default task");
});