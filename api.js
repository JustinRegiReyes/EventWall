var express = require('express');
var api = express.Router();
var sessionCtrl = require('./controllers/session_controller.js');
var twitCtrl = require('./controllers/twit_controller.js');
var env = process.env;



module.exports = api;