// require modules
var express = require('express'),
	session = require('express-session'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	path = require('path'),
	ejs = require('ejs'),
	flash = require('express-flash'),
	cookieParser = require('cookie-parser'),
  db = require('./models'),
	env = process.env;

// create instance of express
var app = module.exports = express();

//create socket
var server = require('http').Server(app);
var io = require('socket.io')(server);
//export socket for us in controllers
module.exports.io = io;

// set templating engine
app.set('view engine', 'ejs');

// server port
var port = (process.env.PORT || 3000);

// require routes
var api = require('./api');
var auth = require('./auth');
var routes = require('./routes');

// middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mediamediamedia',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// save views into variable
var views = path.join(process.cwd(), 'views/');

// serve js and css files
app.use('/static', express.static('public'));
app.use('/vendor', express.static('bower_components'));
app.use('/dependencies', express.static('dependencies'));

//session helpers
app.use(function( req, res, next) {

    //helps save logged in user document
    //since passport's req.user isn't a document instance
    req.currentUser = function (cb) {
        db.User.findOne({_id: req.user._id},
            function (err, user) {
                cb(err, user);
            });
    };

    req.currentPoster = function (cb) {
        db.Poster.findOne({_id: req.user._id},
            function (err, user) {
                cb(err, user);
            });
    };

    next();
});

// routes
app.use(auth);
app.use(api);

app.get('/', function(req, res) {
  // console.log('index.js', req.flash());
  res.render(path.join(views, 'application.html.ejs'), {user: req.user});
});

app.get('/templates/:filename', routes.templates);
app.get('*', routes.fallback);


// errors

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});



// server
server.listen(port, function() {
	console.log('There is free food at port ' + port);
});