var db = require("./models");

// db.User.collection.drop(function() {
// 	process.exit();
// });

var post = {text: 'test3'};

// db.EventWall.update({url: 'cats'}, {$push: {posts: post}},
// function(err, eventWall) {
// 	db.EventWall.findOne({url: 'cats'}, function(err, eventWall) {
// 		if(err) {return console.log(err)}	
// 		console.log(eventWall);
// 		process.exit();
// 	});
// });

// db.EventWall.update({url: 'j'}, {posts: new Array},
// function(err, eventWall) {
// 	db.EventWall.findOne({url: 'j'}, function(err, eventWall) {
// 		if(err) {return console.log(err)}	
// 		console.log(eventWall);
// 		process.exit();
// 	});
// });

db.EventWall.findOne({url: 'lisafoundthejuan'}, function(err, eventWall) {
	console.log(eventWall);
	process.exit();
});

// 	console.log(eventWalls);
// 	process.exit();
// })

// db.Poster.collection.drop(function() {
// 	process.exit();
// });

// db.EventWall.collection.drop(function() {
// 	process.exit();
// })