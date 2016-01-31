var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user.js');

var MediaFeedSchema = new Schema({
  posts: {
    type: Array
  },
  hashtag: String,
  user: String,
  name: String,
  url: String,
  icon: String,
  background: String
});

var mediaFeed = mongoose.model('mediaFeed', MediaFeedSchema);

module.exports = mediaFeed;