var appDirMod = angular.module('eventWall.directives', []);

appDirMod.directive('feedInterface', [
  '$document',
  '$rootScope',
  'eventWallService',
  '$window',
  'AuthService',
  function($document, $rootScope, eventWallService, $window, AuthService) {
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
		  // console.log(scope.post);
		}, 5000);



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
	      		// console.log('not caughtUp');
	      		if(scope.prevTracker === 0) {
	      			justCaughtUp = true;
	      		}
	      	}
	      	// console.log(scope.tracker);
	      	if(caughtUp && scope.tracker > 0) {
	      		if(scope.posts[scope.tracker].banned === undefined) {
	      			scope.$apply(function() {
		      			scope.prevPosts.unshift(scope.post);
		      		});
		      		scope.$apply(function() {
		      			scope.post = scope.posts[scope.tracker];
		      		});
		      		scope.tracker -= 1;
	      		} else {
	      			console.log('banned post');
	      			scope.tracker -= 1;
	      		}
	      	} else if(caughtUp && scope.tracker === 0) {
	      		if(scope.posts[scope.tracker].banned === undefined) {
		      		scope.$apply(function() {
		      			scope.prevPosts.unshift(scope.post);
		      		});
		      		scope.$apply(function() {
		      			scope.post = scope.posts[scope.tracker];
		      		});
		      		scope.tracker = scope.posts.length - 1;
		      	} else {
		      		console.log('banned post');
		      		scope.tracker = scope.posts.length - 1;
		      	}
	      	}

	      	if(caughtUp === false) {
	      		if(justCaughtUp) {
	      			if(scope.posts[scope.tracker + 1] && scope.posts[scope.tracker + 1].banned === undefined) {
		      			scope.$apply(function() {
			      			scope.post = scope.posts[scope.tracker + 1];
		      			});
		      		} else {
		      			console.log('justCaughtUp banned post')
		      		}
	      		} else {
	      			scope.$apply(function() {
		      			scope.post = scope.prevPosts[scope.prevTracker - 1];
		      		});
	      		}
	      		
	      	}
	      	//if there are posts to hit leftarrow to view
	      } else if(keydownEvent === leftArrow && scope.prevPosts.length > 0) {
	      	// if the previous tracker is less than the amount of posts we can go back
	      	// so we do not shuffle through undefined indexes
	      	if(scope.prevTracker < scope.prevPosts.length) {
	      		if(scope.prevPosts[scope.prevTracker].banned === undefined) {
	      			scope.$apply(function() {
		      			scope.post = scope.prevPosts[scope.prevTracker];
		      		});
		      		scope.prevTracker += 1;
	      		} else {
	      			console.log('banned previous');
	      			scope.prevTracker += 1;
	      		}
	      	}
	      } else if((keydownEvent === xKey) && scope.canBan) {
	        scope.post.banned = true;
	        eventWallService.banPost(scope.post, scope.eventWall.url);
	        $(document).trigger(rightArrowEvent);

	      } else if(keydownEvent === spaceBar) {
	      	timerTracker += 1;
	      	if(timerTracker % 2 !== 0) {
	      		$window.clearInterval(autoPlay);
	      	} else {
	      		console.log('new timer?');
	      		autoPlay = $window.setInterval(function(){
				  $(document).trigger(rightArrowEvent);
				  // console.log(scope.post);
				}, 5000);
	      	}
	      }
        });
      } //end of function
    };
    
  }
]);

appDirMod.directive('showPost', function() {
        return {
            restrict: 'AE',
            replace: 'true',
            template: '<div class="feedPost">' + 
            			'<div class="{{post.type}}Post feedContent">{{post.text}}' +
            		  '</div></div>'
        };
});