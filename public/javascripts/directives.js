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
  '$window',
  function($document, $rootScope, eventWallService, $window) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
      	//keydown event values
      	var rightArrow = 39,
          leftArrow = 37,
          xKey = 88,
          spaceBar = 32,
          timerTracker = 0;

      	//defines which event we want to trigger
	    var rightArrowEvent = $.Event('keydown');
	    rightArrowEvent.which = rightArrow;

	    // every x seconds the right arrow is triggered
	    var autoPlay = $window.setInterval(function(){
		  $(document).trigger(rightArrowEvent);
		}, 3000);

      	//binds to the document page and listens for keydown events
        $document.bind('keydown', function(e) {
        	var keydownEvent = e.which;
          
	      if (keydownEvent === rightArrow) {
	      	//variable to keep track if we are back where we started if going through previous posts
	      	var caughtUp = true;
	      	// to keep track of instance when we are about to enter queue of posts that arent previousPosts
	      	// TODO: Find a way to make this more efficient. But for the life of me, me right now can't figure it out
	      	var justCaughtUp = false;
	      	if(scope.prevTracker > 0) {
	      		scope.prevTracker -= 1;
	      		caughtUp = false;
	      		console.log('not caughtUp');
	      		if(scope.prevTracker === 0) {
	      			justCaughtUp = true;
	      			// scope.tracker += 1;
	      		}
	      	}
	      	// console.log(scope.tracker);
	      	if(caughtUp && scope.tracker > 0) {
	      		scope.$apply(function() {
	      			scope.prevPosts.unshift(scope.post);
	      		});
	      		scope.$apply(function() {
	      			scope.post = scope.posts[scope.tracker];
	      		});
	      		scope.tracker -= 1; 
	      		// console.log(scope.prevPosts);
	      	} else if(caughtUp && scope.tracker === 0) {
	      		scope.$apply(function() {
	      			scope.prevPosts.unshift(scope.post);
	      		});
	      		scope.$apply(function() {
	      			scope.post = scope.posts[scope.tracker];
	      		});
	      		scope.tracker = scope.posts.length - 1;
	      		// console.log('added qwe');
	      		// scope.posts.push({text: 'qwe'});
	      	}

	      	if(caughtUp === false) {
	      		if(justCaughtUp) {
	      			scope.$apply(function() {
		      			// console.log('justCaughtUp');
		      			scope.post = scope.posts[scope.tracker + 1];
	      			});
	      		} else {
	      			scope.$apply(function() {
		      			scope.post = scope.prevPosts[scope.prevTracker - 1];
		      		});
	      		}
	      		
	      	}
	      } else if(keydownEvent === leftArrow && scope.prevPosts.length > 0) {
	      	if(scope.prevTracker < scope.prevPosts.length) {
	      		scope.$apply(function() {
	      			console.log(scope.prevTracker);
	      			scope.post = scope.prevPosts[scope.prevTracker];
	      		});
	      		scope.prevTracker += 1;
	      	}
	      } else if(keydownEvent === xKey) {
	        console.log('ban');
	      } else if(keydownEvent === spaceBar) {
	      	timerTracker += 1;
	      	if(timerTracker % 2 !== 0) {
	      		$window.clearInterval(autoPlay);
	      	} else {
	      		console.log('new timer?');
	      		autoPlay = $window.setInterval(function(){
				  $(document).trigger(rightArrowEvent);
				}, 3000);
	      	}
	      }
        });
      } //end of function
    };
    
  }
]);

app.directive('showPost', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            template: '<div class="{{post.type}}Post">' + 
            			'{{post.text}}' +
            		  '</div>'
        };
});