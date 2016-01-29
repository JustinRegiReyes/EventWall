var express = require('express'),
	twit = require('twit'),
	env = process.env;

// // access twit
var T = new twit({
    consumer_key: 'env.TWIT_CONS_KEY', 
    consumer_secret: 'env.TWIT_CONS_SEC',
    access_token: 'env.TWIT_ACC_TOK',
    access_token_secret: 'env.TWIT_ACC_TOK_SEC'
});



module.exports = T;