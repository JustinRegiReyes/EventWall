var app = angular.module('eventWall.feed', []);

app.controller('eventWallFeedController',
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
    
    eventWallService.get(url)
      // handle success
      .then(function (data) {
        // console.log(data);
        $scope.eventWall = data;
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
          $scope.posts = data;
          $scope.post = data[0];
          // stop loading gif
        })
        // handle error
        .catch(function (error) {
          console.log(error); 
      });
    }

    socket.on('tweet', function (data) {
      console.log('tweet', data);
    });

    
}]);