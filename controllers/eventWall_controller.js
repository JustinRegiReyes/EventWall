var express = require('express'),
    passport = require('passport'),
    app = require('.././index.js'),
    User = require('./../models').User;

module.exports.create = function(req, res) {
	console.log('mediaFeedUser', req.user);
	console.log('req.body', req.body);
	res.status(200).json({data: 'api hit'})
}