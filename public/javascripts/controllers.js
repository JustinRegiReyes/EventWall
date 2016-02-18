var appCtrlMod = angular.module('eventWall.controllers', []);


appCtrlMod.controller('mainCtrl', ['$scope', '$location', '$http', '$window', 'AuthService',
  function($scope, $location, $http, $window, AuthService) {
  $scope.user = $window.user;
  $scope.isLoggedIn = AuthService.isLoggedIn();


}]);

appCtrlMod.controller('navCtrl', ['$scope', '$location', '$http', '$window', 'AuthService', 'NavService',
  function($scope, $location, $http, $window, AuthService, NavService) {

    $scope.hideNav = function() {
      return NavService.hideNav();
    }

}]);

appCtrlMod.controller('welcomeCtrl', ['$scope', '$location', '$http', '$window', 'AuthService',
  function($scope, $location, $http, $window, AuthService) {

    

}]);








appCtrlMod.controller('loginController',['$scope', '$rootScope', '$location', 'AuthService', '$window', 
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

appCtrlMod.controller('logoutController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

appCtrlMod.controller('registerController',
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

appCtrlMod.controller('homeController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    var user = AuthService.getUserStatus();
    $scope.user = user;


    if(AuthService.isLoggedIn() === true && user.googleId !== undefined) {
      $location.path('/eventWall/find/post');
    }

    if(AuthService.isLoggedIn() === false) {
      $location.path('/');
    }

    if(AuthService.isLoggedIn() === true) {
      AuthService.getEventWalls(user.eventWalls)
      // handle success
        .then(function (data) {
          $scope.user.eventWalls = data;
        })
        // handle error
        .catch(function (res) {
          $scope.error = true;
          $scope.errorMessage = "Could not unlink Twitter account. Please try again.";
        });
    }
    

    

}]);

appCtrlMod.controller('settingsController',
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

appCtrlMod.controller('eventWallCreateController',
  ['$scope', '$location', 'eventWallService', 'AuthService',
  function ($scope, $location, eventWallService, AuthService) {
  	if(AuthService.isLoggedIn() === false) {
  		$location.path('/login');
  	}

    // Instantiate Uploadcare Widgets
    var widgets = uploadcare.initialize('#my-form');
    var widgets = uploadcare.initialize();

  	$scope.eventWallForm = {};

  	$scope.create = function() {
      // console.log($scope.eventWallForm);
      var icon = $('#eventWallIcon').val();
      var hashtagicon = $('#eventWallHashtagIcon').val();
      var background = $('#eventWallBackground').val();
      // console.log(icon, hashtagicon, background);
  		eventWallService.create(
  			$scope.eventWallForm.name,
  			$scope.eventWallForm.hashtag,
  			$scope.eventWallForm.url.toLowerCase(),
  			icon,
        hashtagicon,
  			background
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

appCtrlMod.controller('eventWallPostAuthController',
  ['$scope', '$location', 'eventWallService', 'PosterService', 'AuthService',
  function ($scope, $location, eventWallService, PosterService, AuthService) {
      var reg = /\/post\/(.*)/;
      var url = $location.path().match(reg)[1];
      $scope.url = url;
      // console.log(redirect);
    eventWallService.exists(url)
    // handle success
      .then(function (data) {
        $scope.eventWall = data;
      })
      // handle error
      .catch(function (err) {
        $scope.error = true;
        $scope.errorMessage = 'An Event Wall with that Url does not exist';
      });

    //if there is not a user they are asked to log in via gmail
    var user = AuthService.getUserStatus();



    $scope.user = user;
    
    if(AuthService.isLoggedIn() && user.googleId === undefined) {
      $scope.error = true;
      $scope.errorMessage = "Please log out of your account to post to an Event Wall. Then, post via Google."
    }

}]);

appCtrlMod.controller('eventWallPostController',
  ['$scope', '$location', 'eventWallService', 'PosterService', 'AuthService',
  function ($scope, $location, eventWallService, PosterService, AuthService) {
    //if there is not a user they are asked to log in via gmail
    var user = AuthService.getUserStatus();
    
    if(user === null) {
      var reg = /\/post\/(.*?)\//;
      var redirect = $location.path().match(reg)[0];
      $location.path(redirect);
    }

    if(user && user.googleId === null) {
      // console.log(user.googleId);
      $scope.error = true;
      $scope.errorMessage = "Please log out of your account to post to an Event Wall. Then, post via Google."
    }

    // Instantiate Uploadcare Widgets
    var widgets = uploadcare.initialize('#my-form');
    var widgets = uploadcare.initialize();

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
