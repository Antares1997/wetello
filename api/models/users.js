var mongoose = require('mongoose');
var crypto = require('crypto');
var async = require('async');
var util = require('util');
var jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
var usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  token: String
});

usersSchema.methods.encryptPassword = function(password) {
  return crypto.createHmac('SHA256', this.salt).update(password).digest('base64');
};

usersSchema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._plainPassword;
  });
usersSchema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};
usersSchema.methods.updatePassword = function(newpassword) {
  this.hashedPassword = this.encryptPassword(newpassword);
};

usersSchema.statics.registration = function(username, name, surname, password, email, callback) {
  var User = this;
  async.waterfall([
    function(callback) {
      User.findOne({
        $or: [{
            email: email
          },
          {
            username: username
          }
        ]
      }, callback);
    },
    function(user, callback) {
      // console.log('Session---', req.session);
      if (user) {
        callback(new AuthError('The user with this email or username is registered!'));
      } else {

        user = new User({
          username: username,
          name: name,
          surname: surname,
          password: password,
          email: email,
          token: 'token'
        });
        jwt.sign({
          user: user
        }, 'secret', (err, token) => {
          if (err) throw (err);
          user.token = token;
        })

        user.save(function(err) {
          if (err) {
            return callback(err);
          }
          callback(null, user);
        });
      }
    }
  ], callback);
};
usersSchema.statics.authhorize = function(username, password, callback) {
  var User = this;
  async.waterfall([
    function(callback) {
      User.findOne({
        username: username
      }, callback);
    },
    function(user, callback) {
      // console.log('Session---', req.session);
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback(new AuthError('Password incorect!'));
        }
      } else {
        // callback(new AuthError('Користувач з цією адресою не зареєстрований!'));
        callback(null, user);
      }
    }
  ], callback);
};

function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);
  this.message = message;
  return message;
};
exports.AuthError = AuthError;
exports.jwt = jwt;
mongoose.model('user', usersSchema, 'users');