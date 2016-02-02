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
  url: String,
  icon: String,
  background: String
});

var eventWall = mongoose.model('eventWall', EventWallSchema);

module.exports = eventWall;