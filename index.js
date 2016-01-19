// require modules
var express = require('express'),
	logger = require('morgan'),
	path = require('path');

// create instance of express
var app = express();

// server port
var port = (process.env.PORT || 3000);

// middleware
app.use(logger('dev'));

// save views into variable
var views = path.join(process.cwd(), 'views/');

// require routes
var api = require('./api');

// serve js and css files
app.use('/static', express.static('public'));

// routes
app.use(api);

app.get(["/", "*"], function(req, res) {
	res.sendFile(path.join(views, 'application.html'));
});

app.listen(port, function() {
	console.log('There is free food at port ' + port);
});