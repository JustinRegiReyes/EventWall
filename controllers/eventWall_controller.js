var express = require('express'),
    passport = require('passport'),
    app = require('.././index.js'),
    User = require('./../models').User,
	EventWall = require('./../models').EventWall,
	Twit = require('twit');

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

	var T = new Twit({
	  consumer_key:         'u1AQm3v8qwIOHho9znwgm2SJ8',
	  consumer_secret:      '87ewdo1HQp6yPeNTqYlAm6fXmlBFrAIrRdHBSuOzKuEawgBm0u',
	  access_token:         '2694541230-FqQmbhi0N2hcWlvbAIlnECrCPa7lqL0duNDSHUm',
	  access_token_secret:  'oGcDSQNQfHGWWOYWYxAXFJEVNwDtKwOofb60HvsHMjpjF',
	  timeout_ms:           60*1000
	})

	T.get('search/tweets', { q: 'lisafoundthejuan OR #lisafoundthejuan', count: 10}, function(err, data, response) {
		// console.log('data', data);
		data.statuses.forEach(function(status) {
			console.log('---------------');
			//list the type of post it is for front end organization/styling
			status.type = 'twitter';
			// console.log(status);
		})
	  return res.status(200).json({data: data.statuses});
	})
}