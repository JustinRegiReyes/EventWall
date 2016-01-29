var express = require('express');
var api = express.Router();
var usersCtrl = require('./controllers/users_controller.js');
var sessionCtrl = require('./controllers/session_controller.js');
var twitCtrl = require('./controllers/twit_controller.js');
var env = process.env;

// api routes

// users & sessions
api.post('/api/user/register', usersCtrl.register)
api.post('/api/user/login', usersCtrl.login)
api.get('/api/user/logout', usersCtrl.logout)



module.exports = api;