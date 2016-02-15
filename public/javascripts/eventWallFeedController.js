var appFeedMod = angular.module('eventWall.feed', []);

appFeedMod.controller('eventWallFeedController',
  ['$scope', '$location', 'eventWallService', 
  'AuthService', '$window', 'socket',
  function ($scope, $location, eventWallService, AuthService, $window, socket) {
    $scope.$on('$routeChangeStart', function(next, current) { 
       eventWallService.terminateStream();
     });

    $window.addEventListener('unload', function(event) {
        eventWallService.terminateStream();
      });

    var path = $location.path().toLowerCase();
    var myRegexp = /\/feed\/(.*)/;
    var url = myRegexp.exec(path)[1];
    $scope.post = "";
    $scope.prevPosts = [];
    $scope.prevTracker = 0;
    
    eventWallService.get(url)
      // handle success
      .then(function (data) {
        // console.log(data);
        $scope.eventWall = data;
        $window.eventWallTest = data;
        var user = AuthService.getUserStatus();

        // checks if the User that is logged in is the creator of the event wall
        // if so they can ban posts
        if(user && (user.googleId === undefined)) {
          $scope.canBan = AuthService.canBan($scope.eventWall._id);
        }
        // console.log($window.eventWall);
        feed(url);
      })
      // handle error
      .catch(function (error) {
        console.log(error);
        $scope.error = true;
        $scope.errorMessage = error;
    });


    // calls feed function of eventWallService
    // assigns $scope.posts to data.statuses
    function feed(url) {
      eventWallService.feed(url)
      // handle success
        .then(function (data) {
          $window.posts = data;
          $scope.posts = data;
          $scope.tracker = data.length - 2;
          $scope.post = data[$scope.tracker + 1];
          // stop loading gif
        })
        // handle error
        .catch(function (error) {
          console.log(error); 
      });
    }

    socket.on('tweet', function (postData) {
      $scope.posts.push(postData);
    });

    socket.on(url, function (postData) {
      // console.log(postData);
      if($scope.posts.length === 0) {
          $scope.post = postData;
          $scope.tracker = 1;
      }
      // console.log(postData);
      $scope.posts.push(postData);
    });

    
}]);