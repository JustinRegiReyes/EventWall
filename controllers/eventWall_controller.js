var express = require('express'),
    passport = require('passport'),
    app = require('.././index.js'),
    User = require('./../models').User,
	EventWall = require('./../models').EventWall;

module.exports.create = function(req, res) {
	var eventWallData = req.body;

	//find logged in user
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

	//find logged in user
	// req.currentUser(function(err, user) {
	// 	if(err) {return console.log(err)};

	// 	EventWall.create(eventWallData, function(err, eventWall) {
	// 		if(err) { console.log('errr?'); return res.status(500).json({err: err})}

	// 		// console.log('userLoggedIn?', !!req.user);
	// 		eventWall.addToUser(user, function(user) {
	// 			req.login(user, function(err) {
	// 				console.log('updated logged in user!');
	// 				res.status(200).json({data: eventWall});
	// 			})
	// 		});
	// 	})
	// });
	
};