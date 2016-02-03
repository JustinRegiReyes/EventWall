var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user.js');

var EventWallSchema = new Schema({
  posts: {
    type: Array
  },
  hashtag: String,
  user: String,
  name: String,
  url: {
  	type: String,
  	unique: true
  },
  icon: String,
  background: String
});

EventWallSchema.methods.addToUser = function(user, cb) {
  // console.log('user getting added to', user);
  // console.log('eventWall about to get added to user', this);
  user.eventWalls.push(this._id);
  user.save(function(err, savedUser) {
  	if(err) {
  		return console.log(err);
  	}
  	cb(savedUser);
  })
};

var eventWall = mongoose.model('eventWall', EventWallSchema);

module.exports = eventWall;