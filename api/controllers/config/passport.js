// var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('user');
var configAuth = require('./auth');
var jwt = require('jsonwebtoken');
var async = require('async');
var Request = require('request');
var randomChars = require('random-chars');
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // code for login (use('local-login', new LocalStategy))
  // code for signup (use('local-signup', new LocalStategy))
  // code for facebook (use('facebook', new FacebookStrategy))
  // code for twitter (use('twitter', new TwitterStrategy))

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({

      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {
      console.log('profile', profile);
      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Google
      process.nextTick(function() {

        // try to find the user based on their google id
        User.findOne({
          'google.id': profile.id
        }, function(err, user) {
          if (err)
            return done(err);

          if (user) {
            // console.log('user token', user.token);
            console.log('Already register google');;
            return done(null, user);
          } else {
            console.log('will register google');
            let username = profile.name.givenName + profile.id.substr(0, 5),
              name = profile.name.givenName,
              surname = profile.name.familyName,
              password = randomChars.get(10),
              email = profile.emails[0].value,
              googleId = profile.id;
            var formData = {
              email: email,
              username: username,
              name: name,
              surname: surname,
              password: password,
              googleId: googleId
            }
            User.findOne({
              $or: [{
                  email: email
                },
                {
                  username: username
                }
              ]
            }, (err, data) => {
              if (err) throw err;
              if (data) {
                return done(null, data);
              } else {
                console.log('profile.image', profile);
                var user = new User({
                  username: username,
                  name: name,
                  surname: surname,
                  password: password,
                  email: email,
                  token: 'token',
                  avatar: profile.photos[0].value || 'Test',
                  google: {
                    id: googleId
                  }
                });
                jwt.sign({
                  user: user
                }, 'secret', (err, token) => {
                  if (err) throw (err);
                  user.token = token;
                })
                user.save(function(err) {
                  if (err)
                    throw err;
                  return done(null, user);
                });
              }
            });

          }
        });
      });
    }));
};