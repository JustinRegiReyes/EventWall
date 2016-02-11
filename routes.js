var express = require('express'),
    appRoutes = express.Router(),
    path = require('path'),
    flash = require('express-flash'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    views = path.join(process.cwd(), 'views/'),
    public = path.join(process.cwd(), 'public/'),
    templates = path.join(public, 'templates/');

var flashMessages = {};
var app = require('./index.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mediamediamedia',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

exports.templates = function(req, res) {
  var filename = req.params.filename.toString();
  filename += '.ejs';

  var currentUser = req.user;

  if(!filename) return;  // might want to change this
  // console.log('templates', currentUser);
  res.render(path.join(templates, filename), {user: currentUser, flashMessages: flashMessages});
  flashMessages.noTwitter = null;
  flashMessages.duplTwitter = null;
};

exports.index = function(req, res) {
  console.log('index load');
  res.render(path.join(views, 'application.html.ejs'), {user: req.user});
};

exports.fallback = function(req, res) {
	var duplTwitter = req.flash('duplTwitter');
	var noTwitter = req.flash('noTwitter');
	
	// console.log('fallback', req.user);
	flashMessages.noTwitter = noTwitter ? noTwitter : null;
	flashMessages.duplTwitter = duplTwitter ? duplTwitter : null;
  res.render(path.join(views, 'application.html.ejs'), {user: req.user});
}