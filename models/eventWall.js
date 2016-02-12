var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user.js');

var EventWallSchema = new Schema({
  // an array containing posts made by 'Posters', non tweeters
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
  background: String,
  hashtagicon: String,
  //an array of tweets that have been banned. containing id and text
  bannedTweets: {
  	type: Array
  },
  //an array of posts that have been banned. containing id and text
  bannedPosts: {
    type: Array
  }
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

EventWallSchema.statics.findByUrl = function(url, cb) {
	this.findOne({url: url}, function(err, eventWall) {
		if(err) {return cb(err, null)};

		cb(null, eventWall);
	})
}

var eventWall = mongoose.model('eventWall', EventWallSchema);

module.exports = eventWall;