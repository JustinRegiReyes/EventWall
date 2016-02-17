'use strict';

var gulp = require("gulp"),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	maps = require('gulp-sourcemaps'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	livereload = require('gulp-livereload'),
	nodemon = require('gulp-nodemon'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task("concatScripts", function() {
	return gulp.src([
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/bootstrap/dist/js/bootstrap.min.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-route/angular-route.js',
		'public/javascripts/angularApp.js',
		'public/javascripts/services.js',
		'public/javascripts/directives.js',
		'public/javascripts/controllers.js',
		'public/javascripts/eventWallFeedController.js',
		'public/javascripts/factories.js'
		])
	.pipe(maps.init())
	.pipe(concat("app.js"))
	.pipe(maps.write('./'))
	.pipe(gulp.dest("public/javascripts/application"));
});

gulp.task('minifyScripts', ["concatScripts"], function() {
	return gulp.src("public/javascripts/application/app.js")
	.pipe(maps.init())
	.pipe(uglify().on('error', gutil.log))
	.pipe(rename('app.min.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest("public/javascripts/application"))
	.on('end', function() {
		setTimeout(delayedReload, 3000);
	});

	function delayedReload() {
		gulp.src('index.js')
			.pipe(livereload());
		console.log('delayedReload');
	}
});

gulp.task('compileSass', function() {
  return gulp.src("public/stylesheets/scss/application.scss")
      .pipe(sass())
      .pipe(gulp.dest('public/stylesheets/css'));
});

gulp.task('autoprefix', ['compileSass'], function () {
	return gulp.src('public/stylesheets/css/application.css')
		.pipe(maps.init())
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}))
		.pipe(rename('prefix-app.css'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('public/stylesheets/css'))
		.pipe(livereload());
});

gulp.task('watch', function() {
	

	gulp.watch('public/stylesheets/scss/**/*.scss', ['autoprefix']);
	gulp.watch('public/javascripts/**.js', ['minifyScripts']);
	gulp.watch('public/templates/**.ejs')
	.on('change', function(event) {
		gulp.src('index.js')
			.pipe(livereload());
	});
	
});

gulp.task('nodemon', ['watch'], function() {
	livereload.listen();

	

	nodemon({
		// the script to run the app
		script: 'index.js',
		ext: 'js' 
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		// setTimeout(delayedReload, 3000);
	});
});

gulp.task("default", ["hello"], function() {
	console.log("This is the default task");
});