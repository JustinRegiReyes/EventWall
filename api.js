var express = require('express');
var api = express.Router();
var usersCtrl = require('./controllers/users_controller.js');
var eventWallCtrl = require('./controllers/eventWall_controller.js');
var twitCtrl = require('./controllers/twit_controller.js');
var env = process.env;

// api routes

// users & sessions
api.post('/api/user/register', usersCtrl.register);
api.post('/api/user/login', usersCtrl.login);
api.get('/api/user/logout', usersCtrl.logout);

// eventWall
api.post('/api/eventWall/create', eventWallCtrl.create);
api.get('/api/eventWall', eventWallCtrl.get);
api.get('/api/eventWall/feed', eventWallCtrl.feed);
api.post('/api/eventWall/feed/create', eventWallCtrl.postToWall);
api.delete('/api/eventWall/terminate-stream', eventWallCtrl.terminateStream);
api.get('/api/eventWall/exists', eventWallCtrl.exists);
api.post('/api/eventWall/ban/tweet', eventWallCtrl.banTweet);
api.post('/api/eventWall/ban/sitepost', eventWallCtrl.banSitePost);

module.exports = api;