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

var app = require('./index.js');

var flashMessages = {};

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

  if(!filename) return;  // might want to change this

  console.log('app.locals', flashMessages);
  res.render(path.join(templates, filename), {message: 'hello', flashMessages: flashMessages} );
};

exports.index = function(req, res) {
  console.log('index load');
  res.render(path.join(views, 'application.html.ejs'), {user: req.user});
};

exports.fallback = function(req, res) {
	// console.log(req.flash('error'));
	var flashError = req.flash('error');
	if(flashError.length > 0) {
		flashMessages.flashError = flashError;
	}
  res.render(path.join(views, 'application.html.ejs'), {user: req.user, test: 'test'});
}