var app = angular.module('mediaWall.controllers', []);


app.controller('mainCtrl', ['$scope', '$location', '$http', '$window', 
	function($scope, $location, $http, $window) {
	console.log('mainCtrl says hi', user);
	$scope.user = $window.user;
}]);

app.controller('loginController',['$scope', '$rootScope', '$location', 'AuthService', '$window', 
	function($scope, $rootScope, $location, AuthService, $window) {

    $scope.isLoggedIn = function(){
      return AuthService.isLoggedIn()
    }

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/home');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

    $scope.getUserStatus = function() {
    	console.log(AuthService.getUserStatus());
    }

}]);

app.controller('logoutController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

app.controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    console.log(AuthService.getUserStatus());

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/home');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function (res) {
          $scope.error = true;
          $scope.errorMessage = res.name === "UserExistsError" ? 
          "That username is already in use." : "Something has gone wrong. Please try again.";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);

app.controller('homeController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

  	if(AuthService.isLoggedIn() === false) {
  		$location.path('/login');
  	}

    $scope.getUserStatus = function() {
    	console.log(AuthService.getUserStatus());
    }

}]);