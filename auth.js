var express = require('express'),
    auth = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    app = require('./index.js'),
    flash = require('express-flash'),
    User = require('./models').User;

var signedInUser;
var redirectTo;

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
    // console.log("**************************");
    // console.log("TWITTER_CLIENT_TOKEN", twitter_client_token);
    // console.log("TWITTER_CLIENT_SECRET", twitter_client_secret);
    // console.log("app.locals.user", app.locals.user);

    signedInUser = app.locals.user;
    
    if(!!signedInUser && signedInUser.username) { //if there is a user logged in already they want to link account to Twitter

      User.findOne({username: signedInUser.username}, function(err, currentUser) {
        if(err) {
          return console.log("find currentuser Error", err);
        }

        currentUser.twitterId = profile.id;
        currentUser.twitterToken = twitter_client_token;
        currentUser.twitterSecret = twitter_client_secret;
        currentUser.save(function(savedErr, savedUser) {
          if(savedErr) {
            redirectTo = '/settings';
            console.log("duplicate key error", savedErr);
            return done(null, savedUser);
          } else {
            console.log('twitter link successful', savedUser);
            return done(null, savedUser);
          }
        })
      })
    } else { //if no user is logged in they want to log in to account via TwitterOAuth
      User.findOne({ twitterId: profile.id}, function (err, twitterUser) {
            console.log('twitterUser',twitterUser);

            if(twitterUser === null) {
              redirectTo = '/login'
            }
            return done(err, twitterUser);
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
  // console.log('serializeUser')
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  // console.log('deserializeUser');
  cb(null, obj);
});




/**********
 * Routes *
 **********/

auth.get('/auth/twitter',
  passport.authenticate('twitter')
);

auth.get('/auth/twitter/callback', function(req, res, next) {
  passport.authenticate('twitter', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      var flashMessage;
      var flashReason;
      if(redirectTo === '/login') {
        console.log('-----No user found with twitter account-----');
        flashReason = 'noTwitter';
        flashMessage = 'Twitter profile is not connected to an account. Log in and connect your profile to use this feature.';
      } else if(redirectTo === '/settings') {
        console.log('-----Twitter profile already linked with an account-----');
        flashReason = 'duplTwitter';
        flashMessage = 'An account is already bound to that twitter account. Log out and "log in with Twitter" to access the account.';
      }
      // console.log(flashReason, flashMessage);
      // console.log('REDIRECTTO', redirectTo);

      req.flash(flashReason, flashMessage);
      return res.redirect(redirectTo); 

    } else {
      console.log('-----Logging in user with Twitter OAuth-----');
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/home');
      });
    }
    
  })(req, res, next)

});

auth.post('/auth/twitter/unlink', function(req, res) {
  var currentUser = req.user;
  
  User.update({username: currentUser.username}, {$unset: {twitterId:1, twitterToken:1, twitterSecret:1} }, {}, function(err, user) {
    if(err) {
      return console.log(err);
    }
    User.findOne({username: currentUser.username}, function(unlinkedErr, unlinkedUser) {
      if(unlinkedErr) {
        console.log("SAVE ERROR", err);
        return res.status(500).json({err: 'Could not unlink account'});
      }
      console.log('-----Successfully unlinked Twitter profile from account-----');
      //log in the new version of user
      //TODO: Figure out why "req.user = unlinked" user does not work and I have to log in the new User
      req.logIn(unlinkedUser, function (err) {
        if (err) {
          return res.status(500).json({err: 'Could not log in user'});
        }
        res.status(200).json({
                                status: 'Unlink Successful',
                                data: unlinkedUser
                            });;
      });

    })
  });

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
