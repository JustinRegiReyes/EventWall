var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  twitterId: {
    type: String,
    unique: true,
    sparse: true
  },
  twitterToken: String,
  twitterSecret: String,
  mediaFeeds: {
    type: Array
  }
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('user', UserSchema);

module.exports = User;