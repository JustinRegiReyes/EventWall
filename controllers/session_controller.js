var express = require('express'),
	env = process.env,
	T = require('./twit_controller.js');

module.exports.login = function(req, res) {
	var authToken = env.TWIT_CONS_KEY;
	console.log(authToken);
	res.status(200).json({
				status: "Login attempt",
				data: authToken
			});
};