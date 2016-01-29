var db = require("./models");

db.User.collection.drop(function() {
	process.exit();
});