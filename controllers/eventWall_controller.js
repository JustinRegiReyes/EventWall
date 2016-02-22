var User = require('./../models').User,
	EventWall = require('./../models').EventWall,
	Poster = require('./../models').Poster,
	io = require('.././index.js').io,
	Twit = require('twit');


var T = new Twit({
    consumer_key:         'u1AQm3v8qwIOHho9znwgm2SJ8',
    consumer_secret:      '87ewdo1HQp6yPeNTqYlAm6fXmlBFrAIrRdHBSuOzKuEawgBm0u',
    access_token:         '2694541230-FqQmbhi0N2hcWlvbAIlnECrCPa7lqL0duNDSHUm',
    access_token_secret:  'oGcDSQNQfHGWWOYWYxAXFJEVNwDtKwOofb60HvsHMjpjF'
  });

// make stream variable global so I can start and stop it in different methods
var stream;

module.exports.create = function(req, res) {
	var eventWallData = req.body;

	//find logged in user to edit in DB
	req.currentUser(function(err, user) {
		if(err) {return console.log(err)};

		EventWall.create(eventWallData, function(err, eventWall) {
			if(err) { console.log(err); return res.status(500).json({err: err})}
			// console.log(eventWall);
			// console.log('userLoggedIn?', !!req.user);
			eventWall.addToUser(user, function(user) {
				req.login(user, function(err) {
					// console.log('updated logged in user!');
					res.status(200).json({data: eventWall});
				})
			});
		})
	});
	
};

module.exports.get = function(req, res) {
	var eventWallUrl = req.query.eventWallUrl;
	console.log('eventWallUrl', eventWallUrl);

	EventWall.findByUrl(eventWallUrl, function(err, eventWall) {
		if(err) {
			return res.status(500).json({err: 'An error has occured. Please refresh the page.'});
		}

		if(eventWall === null) {
			return res.status(404).json({err: 'An event with this Url does not exist.'});
		}

		return res.status(200).json({data: eventWall});

	});
};

module.exports.feed = function(req, res) {
	var eventWallUrl = req.query.eventWallUrl;
	// req.user is user info. Not able to manipulate in DB
	var user = req.user;
	var posts = [];
	var myRegexp = /https:\/\//i;

	EventWall.findByUrl(eventWallUrl, function(err, eventWall) {
		if(err) {
			return res.status(500).json({err: 'An error has occured. Please refresh the page.'});
		}

		if(eventWall === null) {
			return res.status(404).json({err: 'An event with this Url does not exist!'});
		}

		//quickfix for advanced OR queries
		var streamQuery = eventWall.hashtag.split('OR').join(',');

		T.get('search/tweets', { q: eventWall.hashtag, count: 100}, function(err, data, response) { //, language: "en, und"
			console.log(data.statuses.length);
			data.statuses.forEach(function(status) {
				var match = status.text.match(myRegexp); 
				if(match === null) {
					// console.log('---------------');
					//list the type of post it is for front end organization/styling
					status.type = 'twitter';
					//changing string value created_at date into Date obj for bubbleSort comparison
					status.created_at = toDate(status.created_at);
					posts.push(status);
				}
			})

			// combination of tweets and posts posted to the eventWall
			var eventWallPosts = bubbleSort(eventWall.posts.concat(posts));
			console.log(eventWallPosts.length);
			var filteredEventWallPosts = [];
			//filtering banned tweets and posts
			//if there is a match banned is switched to true
			eventWallPosts.forEach(function(unfilteredPost) {
				var banned = false;
				eventWall.bannedTweets.forEach(function(bannedTweet) {
					if(bannedTweet.id === unfilteredPost.id) {
						banned = true;
					}
				});
				eventWall.bannedPosts.forEach(function(bannedSitePost) {
					if(bannedSitePost.id === unfilteredPost.id) {
						banned = true;
					}
				});

				//if the post makes it through the bannedTweet and bannedPosts
				if(banned === false) {
					// push the now filtered post into the filtedPosts
					filteredEventWallPosts.push(unfilteredPost);
				}
			});

			//define stream
			stream = T.stream('statuses/filter', { track: [streamQuery]}); //, language: "en, und"

			stream.on('tweet', function (tweet) {
				var match = tweet.text.match(myRegexp); 
				//keep track if stream is still on or not
				console.log('tweet');
				if(match === null) {
					console.log('tweet emitted')
					io.emit('tweet', tweet);
				}
			});

		  return res.status(200).json({data: filteredEventWallPosts});
		});
	});
}

module.exports.terminateStream = function(req, res) {
	console.log('stop');
	// in the event two streams start by accident
	stream.stop();
	stream.stop();
	stream.stop();
	stream.stop();
	stream.stop();
	stream.stop();
}

module.exports.postToWall = function(req, res) {
	var url = req.body.url,
		text = req.body.text,
		picture = req.body.picture,
		date = new Date(),
		id1 = Math.floor(Math.random()*900000000) + 100000,
		id2 = Math.floor(Math.random()*900000000) + 100000
		id = id1 + id2;

	var poster = req.user;
	//type is equal to post to help differentiate between tweet and post when merging
	var post = {text: text, picture: picture, type: 'site', created_at: date, id: id};
	Poster.update({googleId: poster.googleId}, {$push: {posts: post}},
		function(err, updatedPoster) {
			if(err) {return console.log(err);}
			post.poster = {
				username: poster.username, 
				_id: poster._id
			};

			EventWall.update({url: url}, {$push: {posts: post}}, function(err, eventWall) {
				if(err) {return console.log(err);}
				console.log('savedEventWall', eventWall);
				io.emit(url, post);
				// console.log('successful post to Event Wall');
				return res.status(200).json({data: 'success'});
			});
	});
}

module.exports.exists = function(req, res) {
	var url = req.query.eventWallUrl;

	EventWall.findOne({url: url}, function(err, eventWall) {
		if(err) {
			return console.log(err);
		}
		if(eventWall === null) {
			return res.status(404).json({err: 'Event Wall with this url does not exist.'})
		}
		return res.status(200).json({data: eventWall});
	});
}


module.exports.banTweet = function(req, res) {
	var post = req.body.post;
	var tweet = {};
	tweet.id = post.id;
	tweet.text = post.text;
	tweet.screen_name = post.user.screen_name;
	var url = req.body.url;

	EventWall.update({url: url}, {$push: {bannedTweets: tweet}},
	 function(err, eventWall) {
	 	return res.status(200).json({data: 'Succesfully banned tweet'});
	});
}

module.exports.banSitePost = function(req, res) {
	var post = req.body.post;
	var url = req.body.url;

	EventWall.update({url: url}, {$push: {bannedPosts: post}},
	 function(err, eventWall) {
	 	return res.status(200).json({data: 'Succesfully banned site post'});
	});
}

module.exports.userCreated = function(req, res) {
	var eventWallIds = req.query.eventWallIds;

	EventWall.find({_id: {$in: eventWallIds}},
		function(err, eventWalls) {
			if(err) { return res.status(500);}

			return res.status(200).json({data: eventWalls});
		})
}


// HELPER FUNCTIONS

// used to sort out the concatted eventWall posts and tweets
function bubbleSort(arr){
   var len = arr.length;
   for (var i = len-1; i>=0; i--){
     for(var j = 1; j<=i; j++){
       if(arr[j-1].created_at>arr[j].created_at){
           var temp = arr[j-1];
           arr[j-1] = arr[j];
           arr[j] = temp;
        }
     }
   }
   return arr;
}

//taking string dates and turning them into Date objects for comparison for bubbleSort
function toDate(date) {
	return new Date(date);
}


