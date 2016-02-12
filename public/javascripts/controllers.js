var app = angular.module('eventWall.controllers', []);


app.controller('mainCtrl', ['$scope', '$location', '$http', '$window', 
	function($scope, $location, $http, $window) {
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

    $scope.user = function() {
    	return AuthService.getUserStatus();
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
  		$location.path('/');
  	}

    $scope.getUserStatus = function() {
    	console.log(AuthService.getUserStatus());
    }

}]);

app.controller('settingsController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

  	if(AuthService.isLoggedIn() === false) {
  		$location.path('/login');
  	}

    $scope.user = AuthService.getUserStatus();
    console.log($scope.user);

    $scope.twitterLinked = !!$scope.user && !!$scope.user.twitterId && $scope.user.twitterId.length > 0 ? true : false;

    $scope.unlinkTwitter = function () {

      // call register from service
      AuthService.unlinkTwitter()
        // handle success
        .then(function (data) {
	    	console.log('data', data);
	    	$scope.user = data;
	    	$scope.twitterLinked = false;
	    	console.log($scope.user);
          $location.path('/settings');
        })
        // handle error
        .catch(function (res) {
          $scope.error = true;
          $scope.errorMessage = "Could not unlink Twitter account. Please try again.";
        });

    };

}]);

app.controller('eventWallController',
  ['$scope', '$location', 'eventWallService', 'AuthService',
  function ($scope, $location, eventWallService, AuthService) {
  	if(AuthService.isLoggedIn() === false) {
  		$location.path('/login');
  	}

  	$scope.eventWallForm = {};

  	$scope.create = function() {
      // console.log($scope.eventWallForm);
  		eventWallService.create(
  			$scope.eventWallForm.name,
  			$scope.eventWallForm.hashtag,
  			$scope.eventWallForm.url.toLowerCase(),
  			$scope.eventWallForm.icon,
  			$scope.eventWallForm.background
  			)
        // handle success
        .then(function (data) {
        // console.log(data);
        $location.path('/home')
        })
        // handle error
        .catch(function (err) {
          $scope.error = true;
          $scope.errorMessage = 'An Event Wall with that Url has already been made.';
        });

  	}

}]);

app.controller('eventWallPostAuthController',
  ['$scope', '$location', 'eventWallService', 'PosterService', 'AuthService',
  function ($scope, $location, eventWallService, PosterService, AuthService) {
      var reg = /\/post\/(.*)/;
      var url = $location.path().match(reg)[1];
      // console.log(redirect);
    eventWallService.exists(url)
    // handle success
      .then(function (data) {
      
      })
      // handle error
      .catch(function (err) {
        $scope.error = true;
        $scope.errorMessage = 'An Event Wall with that Url does not exist';
      });

    //if there is not a user they are asked to log in via gmail
    var user = AuthService.getUserStatus();
    
    if(AuthService.isLoggedIn() && user.type !== 'poster') {
      $scope.error = true;
      $scope.errorMessage = "Please log out of your account to post to an Event Wall. Then, post via Google."
    }

}]);

app.controller('eventWallPostController',
  ['$scope', '$location', 'eventWallService', 'PosterService', 'AuthService',
  function ($scope, $location, eventWallService, PosterService, AuthService) {
    //if there is not a user they are asked to log in via gmail
    var user = AuthService.getUserStatus();
    
    if(user === null) {
      var reg = /\/post\/(.*?)\//;
      var redirect = $location.path().match(reg)[0];
      $location.path(redirect);
    }

    if(user && user.type !== 'poster') {
      $scope.error = true;
      $scope.errorMessage = "Please log out of your account to post to an Event Wall. Then, post via Google."
    }

    $scope.post = function() {

      
      var text = $('#messageTextArea').val();
      var picture = $('#postPicture').val();
      var reg = /post\/(.*?)\//;
      var url = $location.path().match(reg)[1];
      // console.log(url);
      PosterService.post(
        text,
        user.username,
        url,
        picture
        )
        // handle success
        .then(function (data) {
          $location.path('/feed/post/success');
        })
        // handle error
        .catch(function (err) {
          console.log('error');
        });

    }
}]);
