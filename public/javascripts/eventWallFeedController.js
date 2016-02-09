var app = angular.module('eventWall.feed', []);

app.controller('eventWallFeedController',
  ['$scope', '$location', 'eventWallService', 'AuthService', '$window',
  function ($scope, $location, eventWallService, AuthService, $window) {
    // if(AuthService.isLoggedIn() === false) {
    //   $location.path('/login');
    // }

    var path = $location.path().toLowerCase();
    var myRegexp = /\/feed\/(.*)/;
    var url = myRegexp.exec(path)[1];
    
    eventWallService.get(url)
      // handle success
      .then(function (data) {
        console.log(data);
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
        })
        // handle error
        .catch(function (error) {
          console.log(error); 
      });
    }

    $scope.post = "";

}]);