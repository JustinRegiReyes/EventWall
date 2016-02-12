'use strict';

var app = angular.module('eventWall', ['ngResource', 'ngRoute', 'eventWall.services', 'eventWall.controllers', 'eventWall.feed','eventWall.directives', 'eventWall.factories']);


app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/templates/welcome'
		})
		.when('/login', {
			templateUrl: '/templates/login',
			controller: 'loginController'
		})
		.when('/logout', {
			controller: 'logoutController'
		})
		.when('/sign-up', {
			templateUrl: '/templates/sign-up',
			controller: 'registerController'
		})
		.when('/home', {
			templateUrl: '/templates/home',
			controller: 'homeController'
		})
		.when('/settings', {
			templateUrl: '/templates/settings',
			controller: 'settingsController'
		})
		.when('/eventWall/new', {
			templateUrl: '/templates/eventWall-new',
			controller: 'eventWallController'
		})
		//shortened the url by excluding eventWall and just putting feed
		.when('/feed/:url', {
			templateUrl: '/templates/eventWall-feed',
			controller: 'eventWallFeedController'
		})
		.when('/post/:url', {
			templateUrl: '/templates/eventWall-post',
			controller: 'eventWallPostAuthController'
		})
		.when('/post/:url/new', {
			templateUrl: '/templates/eventWall-post-new',
			controller: 'eventWallPostController'
		})
		.when('/feed/post/success', {
			templateUrl: '/templates/eventWall-post-success'
		})
		.otherwise({redirectTo: '/'});

	$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);