var app = angular.module('mediaWall.services', []);

app.factory('AuthService', function ($q, $timeout, $http, $window) {

  // create user variable
  var user = $window.user || null;

  // return available functions for use in controllers
  return ({
    isLoggedIn: isLoggedIn,
    getUserStatus: getUserStatus,
    login: login,
    logout: logout,
    register: register,
    unlinkTwitter: unlinkTwitter
  });

  function isLoggedIn() {
      return !!user;
  }

  function getUserStatus() {
    return user;
  }

  function login(username, password) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/user/login', {username: username, password: password})
      // handle success
      .success(function (res, status) {
        if(status === 200 && res.data){
          user = res.data;
          $window.user = user;
          deferred.resolve();
        } else {
          user = false;
          deferred.reject();
        }
      })
      // handle error
      .error(function (res) {
        user = null;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function logout() {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a get request to the server
    $http.get('/api/user/logout')
      // handle success
      .success(function (res) {
      	$window.user = null;
        user = null;
        deferred.resolve();
      })
      // handle error
      .error(function (res) {
        user = null;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function register(username, password) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/user/register', {username: username, password: password})
      // handle success
      .success(function (res, status) {
        if(status === 200 && res.data){
          user = res.data;
          $window.user = user;
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .error(function (res) {
        deferred.reject(res.err);
      });

    // return promise object
    return deferred.promise;

  }

  function unlinkTwitter() {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/auth/twitter/unlink')
      // handle success
      .success(function (res, status) {
        if(status === 200 && res.data){
          user = res.data;
          console.log('unlinkService', user);
          $window.user = user;
          deferred.resolve(user);
        } else {
          deferred.reject();
        }
      })
      // handle error
      .error(function (res) {
        deferred.reject(res.err);
      });

    // return promise object
    return deferred.promise;

  }

});