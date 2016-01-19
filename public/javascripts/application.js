var app = angular.module('mediaWall', ['ngResource', 'ngRoute', 'mediaWall.controllers', 'mediaWall.services']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/static/templates/login.html'
		})
		.otherwise('/', {
			templateUrl: '/static/templates/login.html'
		})

	$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);