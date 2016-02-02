var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/media_memories');

module.exports = {
  User: require('./user'),
  Poster: require('./poster'),
  eventWall: require('./eventWall')
};
