var express = require('express'),
    auth = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    flash = require('express-flash'),
    User = require('./models').User;

var signedInUser;

// use passport
auth.use(passport.initialize());
auth.use(passport.session());
auth.use(flash());

// configure passport
passport.use(new LocalStrategy(User.authenticate()));

passport.use(new TwitterStrategy({
    consumerKey: "u1AQm3v8qwIOHho9znwgm2SJ8", // TWITTER_CONSUMER_KEY
    consumerSecret: "87ewdo1HQp6yPeNTqYlAm6fXmlBFrAIrRdHBSuOzKuEawgBm0u", //TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(twitter_client_token, twitter_client_secret, profile, done) {
    console.log("**************************");
    console.log("TWITTER_CLIENT_TOKEN", twitter_client_token);
    console.log("TWITTER_CLIENT_SECRET", twitter_client_secret);
    console.log("signedInUser", signedInUser);

    
    if(!!signedInUser && signedInUser.username) {
      User.findOne({ username: signedInUser.username }, function (err, user) {
          user.twitterId = profile.id;
          user.twitterToken = twitter_client_token;
          user.twitterSecret = twitter_client_secret;
          user.save(function(err, user) {
            return done(err, user);  
          })
      });
    } else {
      User.findOne({ twitterId: profile.id + '3'}, function (err, user) {
            return done(err, user);
      });
    }
 
  }
));

passport.use(new GoogleStrategy({
    clientID: '1016385464015-of3je8ffm2bstgool36s6u0nrsmjcqnn.apps.googleusercontent.com',
    clientSecret: 'uotcVc_zg6AjhcnSLFHUtOPZ',
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.find({username: profile.id}, function (err, user) {
      return done(err, user);
    });
  }
));


// Serialize data into the session
passport.serializeUser(function(user, cb) {
  console.log('serializeUser', user);
  // User.findOne({twitterId: user.twitterId }, function(err, user) {
  //   if(err) {
  //     return console.log(err);
  //   } else {
  //     user.testNum += 1;
  //     user.save();
  //     console.log("USER", user);
  //   }
  // })
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  // console.log(req);
  signedInUser = obj;
  console.log('deserializeUser', obj);
  cb(null, obj);
});




/**********
 * Routes *
 **********/

auth.get('/auth/twitter',
  passport.authenticate('twitter')
);

auth.get('/auth/twitter/callback',
  //failureFlash is ambiguous so specific pages can handle error message wheere twitter Auth error occurs
  passport.authenticate('twitter', {failureRedirect: '/login', failureFlash: 'error'}), 
  function(req, res) {
    res.locals.errorFlash = 'test';
    signedInUser = req.user;
    console.log('REQ.USER', signedInUser);
    // Successful authentication, redirect home.
       res.redirect('/');
  });

auth.get('/auth/google',
  passport.authenticate('google', { scope: "profile" }));

auth.get('/auth/google/callback', 
  passport.authenticate('google', {  failureFlash: 'TESTING123', failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = auth;
