var db = require("./models");

// db.User.collection.drop(function() {
// 	process.exit();
// });

var post = {text: 'test3'};
// var eventWallIds = [ '56bda6eee28cb22519832b94',
//      '56be44e0d657389451ae241a',
//      '56be45218a978151520a5337',
//      '56be459d6be255fa5245370b',
//      '56be5196e95b42e0618271a6',
//      '56be92e23bac4290b6066824',
//      '56be93b43bac4290b6066825' ];

//  db.EventWall.find({ _id: {$in: eventWallIds}
// }, function(err, eventWalls) {
//  	console.log(eventWalls);
//  	process.exit()
//  });

// db.EventWall.update({url: 'cats'}, {$push: {posts: post}},
// function(err, eventWall) {
// 	db.EventWall.findOne({url: 'cats'}, function(err, eventWall) {
// 		if(err) {return console.log(err)}	
// 		console.log(eventWall);
// 		process.exit();
// 	});
// });

db.User.update({username: 'Jstn'}, {eventWalls: new Array},
function(err, user) {
	db.User.findOne({username: 'Jstn'}, function(err, newUser) {
		if(err) {return console.log(err)}	
		console.log(newUser);
	});
});

// db.EventWall.findOne({url: { $regex: 'theflashtv', $options: 'i' }}, function(err, eventWall) {
// 	console.log(eventWall);
// 	process.exit();
// });

// db.EventWall.findOne({url: 'LISAFOUNDTHEJUAN'}, function(err, eventWall) {
// 	if(err) {
// 		console.log(err);
// 	}
// 	console.log(eventWall);
// 	process.exit();
// });

// db.Poster.collection.drop(function() {
// 	process.exit();
// });

db.EventWall.collection.drop(function() {
	process.exit();
});