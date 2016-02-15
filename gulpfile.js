'use strict';

var gulp = require("gulp"),
concat = require('gulp-concat');

gulp.task("concatScripts", function() {
	gulp.src([
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/bootstrap/dist/js/bootstrap.min.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-route/angular-route.js'
		])
	.pipe(concat("dependencies.js"))
	.pipe(gulp.dest("vendor"));
});

gulp.task("default", ["hello"], function() {
	console.log("This is the default task");
});