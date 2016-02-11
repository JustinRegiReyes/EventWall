var User = require('./../models').User,
	EventWall = require('./../models').EventWall,
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
			console.log(eventWall);
			// console.log('userLoggedIn?', !!req.user);
			eventWall.addToUser(user, function(user) {
				req.login(user, function(err) {
					console.log('updated logged in user!');
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
			return res.status(404).json({err: 'An event with this Url does not exist.'});
		}

		//quickfix for advanced OR queries
		var streamQuery = eventWall.hashtag.split('OR').join(',');

		stream = T.stream('statuses/filter', { track: [streamQuery]}); //, language: "en, und"

		stream.on('tweet', function (tweet) {
			var match = tweet.text.match(myRegexp); 
			//keep track if stream is still on or not
			console.log('tweet');
			if(match === null) {
				io.emit('tweet', tweet);
			}
		});

		T.get('search/tweets', { q: eventWall.hashtag, count: 100}, function(err, data, response) { //, language: "en, und"
			console.log('DATA', data.statuses.length);
			data.statuses.forEach(function(status) {
				var match = status.text.match(myRegexp); 
				
				if(match === null) {
					// console.log('---------------');
					//list the type of post it is for front end organization/styling
					status.type = 'twitter';
					// console.log(status);
					posts.push(status);
				}

				posts.reverse();
				
			})
		  return res.status(200).json({data: posts});
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

