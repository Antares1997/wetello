var mongoose = require('mongoose');
var crypto = require('crypto');
var async = require('async');
var util = require('util');
var jwt = require('jsonwebtoken');
var path = require('path');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};
var usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, 'dont unique']
  },
  name: {
    type: String,
    required: [true, "name is required"]
  },
  surname: {
    type: String,
    required: [true, "surname is required"]
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Email filed is required!'],
    validate: [validateEmail, 'Please fill a valid email address'],
    unique: true
  },
  hashedPassword: {
    type: String,
    required: [true, "hashedPassword is required"]
  },
  salt: {
    type: String,
    required: [true, "salt is required"]
  },
  created: {
    type: Date,
    default: Date.now
  },
  google: {
    id: String
  },
  token: {
    type: String
  },
  avatar: {
    type: String,
    required: [true, "avatar is required"]
  }
  // google_id: {
  //   type: String,
  //   default: ''
  // }
});
usersSchema.plugin(uniqueValidator)
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

usersSchema.statics.registration = function(username, name, surname, password, email, googleId, callback) {
  var errors = [];
  var errorObj = {};
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
      // if (user) {
      //   errorObj['email'] = 'The user with this email or username is registered!';
      //   errors.push(errorObj)
      //   callback(errors)
      //   // callback(new AuthError('The user with this email or username is registered!'));
      // } else {
      var avatar = path.join('../../assets/') + getRandomFace() + ".png"
      user = new User({
        username: username,
        name: name,
        surname: surname,
        password: password,
        email: email,
        token: 'token',
        google: {
          id: googleId
        },
        avatar: avatar
      });
      jwt.sign({
        user: user
      }, 'secret', (err, token) => {
        if (err) throw (err);
        user.token = token;
      })

      user.save(function(err) {
        if (err) {
          Object.keys(err.errors).forEach((errorName, index) => {
            errorObj[errorName] = err.errors[errorName].message;
          })

          if ((password.length === 0)) {
            errorObj['password'] = 'Password is required!'
          }
          errors.push(errorObj);
          return callback(errors);
        }
        callback(null, user);
      });
      // }
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

function getRandomFace() {
  return Math.floor(Math.random(0, 10) * 17);
}
exports.AuthError = AuthError;
exports.jwt = jwt;
mongoose.model('user', usersSchema, 'users');