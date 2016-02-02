'use strict';

var app = angular.module('eventWall', ['ngResource', 'ngRoute', 'eventWall.services', 'eventWall.controllers']);

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
		.when('/mediaFeed/create', {
			templateUrl: '/templates/eventWall-create',
			controller: 'eventWallController'
		})
		.otherwise({redirectTo: '/'});

	$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);