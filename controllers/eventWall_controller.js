var express = require('express'),
    passport = require('passport'),
    app = require('.././index.js'),
    User = require('./../models').User,
	EventWall = require('./../models').EventWall;

module.exports.create = function(req, res) {
	var eventWallData = req.body;
	EventWall.create(eventWallData, function(err, eventWall) {
		if(err) { return res.status(500).json({err: err})}

		res.status(200).json({data: eventWall});
	})
};