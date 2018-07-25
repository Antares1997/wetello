var mongoose = require('mongoose');
var User = mongoose.model('user');
var AuthError = require('../models/users').AuthError;
var sendMessage = require('../libs/nodemailer');
var randomChars = require('random-chars');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('../models/users').jwt;
var configPassport = require('./config/passport');
var Request = require('request');
const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');
var confirmnumber;
var message = '';
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports.registration = function(req, res) {
  let username = req.body.username,
    name = req.body.name,
    surname = req.body.surname,
    password = req.body.password,
    email = req.body.email,
    googleId = req.body.googleId || false;
  // req.checkBody('email', 'Email filed is required!').notEmpty();
  // req.checkBody('email', 'Email is valid!').isEmail();
  // req.check('name', 'Name filed is required!').notEmpty();
  // req.checkBody('surname', 'Email filed is required!').notEmpty();
  // req.checkBody('username', 'Username filed is required!').notEmpty();
  // req.checkBody('password', 'Password filed is required!').notEmpty();
  // var errors = req.validationErrors();
  // if (errors) {
  //   sendJSONresponse(res, 200, {
  //     'message': 'errors',
  //     'status': 0,
  //     errors: errors
  //   })
  //   console.log(errors);
  //   errors = [];
  //   return;
  // } else {
  // User.registration(req.body, function (err, createdUser) {})
  User.registration(username, name, surname, password, email, googleId, function(err, user) {
    if (err) {
      if (err instanceof AuthError) {
        sendJSONresponse(res, 200, {
          'message': err.message,
          'status': 0
        });
      } else {
        sendJSONresponse(res, 206, {
          errors: err,
          'status': 0
        })
      }
    } else {
      confirmnumber = randomChars.get(8);
      // sendMessage(confirmnumber, req.body.email);
      sendJSONresponse(res, 200, {
        errors: '',
        'message': 'A test message has been sent to your mail, and your account has been successfully created!',
        'status': 1,
        'headerToken': user.token
      })
      return;
    }
  });
  // }

};

function verifyInp(token, secret, res) {
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      console.log('bad verififcation');
      return false;
    }
    return true;
  })
}
module.exports.login = function(req, res) {
  User.authhorize(req.body.username, req.body.password, function(err, user) {
    if (err) {
      if (err instanceof AuthError) {
        sendJSONresponse(res, 200, {
          'message': ' Users are not found with this data!',
          'status': 0
        })
      } else [
        sendJSONresponse(res, 200, {
          'message': 'Sorry, there was an unknown error.',
          'status': 0
        })
      ]
    } else {
      if (user) {

        sendJSONresponse(res, 200, {
          'message': '',
          'status': 1,
          'headerToken': user.token
        })
      } else {
        sendJSONresponse(res, 200, {
          'message': 'Incorrect data entered!',
          'status': 0
        })
      }
    }
  });

}