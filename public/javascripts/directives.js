var app = angular.module('eventWall.directives', []);

// app.directive('helloWorld', function() {
//   return {
//       restrict: 'AE',
//       replace: 'true',
//       template: '<h3>Hello World!!</h3>'
//   };
// });

app.directive('feedInterface', [
  '$document',
  '$rootScope',
  'eventWallService',
  function($document, $rootScope, eventWallService) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
      	var tracker = 0;

      	//binds to the document page and listens for keydown events
        $document.bind('keydown', function(e) {
          var keydownEvent = e.which,
          rightArrow = 39,
          leftArrow = 37,
          xKey = 88;

	      if (keydownEvent === rightArrow) {
	        tracker += 1;
	        scope.$apply(function() {
	          scope.post = eventWallService.nextPost(scope.posts, tracker);
	        });
	      } else if(keydownEvent === leftArrow) {
	        tracker -= 1;
	        scope.$apply(function() {
	          scope.post = eventWallService.prevPost(scope.posts, tracker);
	        });
	      } else if(keydownEvent === xKey) {
	        console.log('ban');
	      }
        });
      }
    };
  }
]);

app.directive('showPost', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            template: '<div class="{{post.id}}Post">' + 
            			'{{post.text}}' +
            		  '</div>'
        };
});