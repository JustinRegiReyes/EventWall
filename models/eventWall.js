var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user.js');

function unique(modelName, field, caseSensitive) {
  return function(value, respond) {
    if(value && value.length) {
      var query = mongoose.model(modelName).where(field, new RegExp('^'+value+'$', caseSensitive ? 'i' : undefined));
      if(!this.isNew)
        query = query.where('_id').ne(this._id);
      query.count(function(err, n) {
        respond(n<1);
      });
    }
    else
      respond(false);
  };
}

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
    validate: [unique('EventWall', 'url', true), 'unique']
  },
  icon: String,
  background: String,
  //to check to see if the Event Wall background is a solid color or image
  backgroundColor: {
    type: Boolean
  },
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
	this.findOne({url: { $regex: url, $options: 'i' }}, function(err, eventWall) {
		if(err) {return cb(err, null)};

		cb(null, eventWall);
	})
}

var EventWall = mongoose.model('EventWall', EventWallSchema);

module.exports = EventWall;