// require modules
var express = require('express'),
	logger = require('morgan');

// create instance of express
var app = express();

// server port
var port = (process.env.PORT || 3000);

// middleware
app.use(logger('dev'));

app.use('./api.js');



app.listen(port, function() {
	console.log('There is free food at port ' + port);
});