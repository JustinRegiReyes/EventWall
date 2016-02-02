var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var PosterSchema = new Schema({
  googleId: {
    type: String,
    unique: true
  },
  posts: {
    type: Array
  },
  strikes: {
    type: Number,
    default: 0
  },
  canPost: {
    type: Boolean,
    default: true
  }
});

PosterSchema.plugin(passportLocalMongoose);

PosterSchema.static('findOrCreate', function(new_user, done){
  var klass = this;
  klass.findOne(new_user, function(err, existing_user){
    if (existing_user || err) {
      return done && done(err, existing_user);
    }
    klass.create(new_user, done)
  })
})

var Poster = mongoose.model('poster', PosterSchema);

module.exports = Poster;