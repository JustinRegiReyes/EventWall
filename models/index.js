var mongoose = require('mongoose');
mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL || 
                  'mongodb://localhost/eventWall');

module.exports = {
  User: require('./user'),
  Poster: require('./poster'),
  EventWall: require('./eventWall')
};
