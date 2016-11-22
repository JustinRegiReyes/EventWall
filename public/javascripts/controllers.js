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
  ['$scope', '$location', 'AuthService', "$window",
  function ($scope, $location, AuthService, $window) {
    // var user = AuthService.getUserStatus();
    // $scope.user = { 
    //   eventWalls: 
    //      [ "56bda6eee28cb22519832b94",
    //        "56be44e0d657389451ae241a",
    //        "56be45218a978151520a5337",
    //        "56be459d6be255fa5245370b",
    //        "56be5196e95b42e0618271a6",
    //        "56be92e23bac4290b6066824",
    //        "56be93b43bac4290b6066825",
    //        "56cbaca3708159bb19b24c72",
    //        "56cbad02708159bb19b24c73",
    //        "56cbfcb427eb6439258aca9a" ],
    //   twitterToken: '2694541230-FqQmbhi0N2hcWlvbAIlnECrCPa7lqL0duNDSHUm',
    //   twitterSecret: 'oGcDSQNQfHGWWOYWYxAXFJEVNwDtKwOofb60HvsHMjpjF',
    //   twitterId: '2694541230',
    //   __v: 10,
    //   username: 'Jstn',
    //   _id: "56bd72602c29d02f0a56546a" 
    // };

  



    // if(AuthService.isLoggedIn() === true && user.googleId !== undefined) {
    //   $location.path('/eventWall/find/post');
    // }

    // if(AuthService.isLoggedIn() === false) {
    //   $location.path('/');
    // }

    if(AuthService.isLoggedIn() === true) {
      console.log('so this is running?');
      AuthService.getEventWalls($scope.user.eventWalls)
      // handle success
        .then(function (data) {
          console.log('fetched eventWalls', new Date);
          $scope.eventWalls = blockBackground(data);
          $window.user = $scope.user;          
        })
        // handle error
        .catch(function (res) {
          
        });
    }
    //sets background of Event Wall blocks on home page
    function blockBackground(eventWalls) {
      console.log(eventWalls.length);
      eventWalls.forEach(function(eventWall) {
        // console.log(eventWall.name);
        eventWall.style = 'background: linear-gradient(rgba(0, 0, 0, .60), rgba(0, 0, 0, .60), rgba(0, 0, 0, .60)), url(' + eventWall.background + ');' +
                          'background-size: cover;';
        // eventWall.style = 'background: rgba(0, 0, 0, 0.60), url(' + eventWall.background + ');' +
        //                   'background-size: cover;';
      });
      return eventWalls;
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

  	$scope.eventWallForm = {};
    $scope.urlAbout = $scope.eventWallForm.url && $scope.eventWallForm.url.length > 0 ? $scope.eventWallForm.url : "UrlYouInputBelow";
    // watches urlAbout variable for when 
    $scope.$watch("eventWallForm.url", function(newValue, oldValue) {
      $scope.urlAbout = $scope.eventWallForm.url && $scope.eventWallForm.url.length > 0 ? $scope.eventWallForm.url : "UrlYouInputBelow";
    });

    $scope.$watch("eventWallForm.backgroundColored", function(newValue, oldValue) {
      if(newValue === true) {
        $("#backgroundTypeImage").fadeOut(100, function() {
            $("#backgroundTypeColor").fadeIn(100, function() {
              // animation complete
            });
        });
      }
      if(newValue === false) {
        $("#backgroundTypeColor").fadeOut(100, function() {
            $("#backgroundTypeImage").fadeIn(100, function() {
              // animation complete
            });
        });
        
        
      }
    });

    $(document).ready(function() {
      // instantiates farbtastic color wheel in form
      $('#colorpicker').farbtastic('#color');
      // instantiates uploadcare widgets
      var widgets = uploadcare.initialize('#eventWallCreateForm');
      //adds caret to upload care buttons
      $('.uploadcare-widget-button-open').append('&nbsp; <i class="fa fa-caret-down" style="color: #FFF;"></i>');
    });

  	$scope.create = function() {
      // console.log($scope.eventWallForm);
      var icon = $('#eventWallIcon').val();
      // var hashtagicon = $('#eventWallHashtagIcon').val();
      var background = $('#eventWallBackground').val();
      // console.log(icon, hashtagicon, background);
  		eventWallService.create(
  			$scope.eventWallForm.name,
  			$scope.eventWallForm.hashtag,
  			$scope.eventWallForm.url.toLowerCase(),
  			icon,
        // hashtagicon,
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
