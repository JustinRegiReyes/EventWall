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
  twitterSecret: String
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.static('findOrCreate', function(new_user, done){
  var klass = this;
  klass.findOne(new_user, function(err, existing_user){
    if (existing_user || err) {
      return done && done(err, existing_user);
    }
    klass.create(new_user, done)
  })
})

var User = mongoose.model('user', UserSchema);

module.exports = User;