"use strict";
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var multer = require('multer');
var flash = require('connect-flash');
var multer = require('multer');
var expressValidator = require('express-validator')
require('./api/models/db');
var routesApi = require('./api/routes');

var http = require("http");
var app = express();
http = http.createServer(app);
var socketIo = require("socket.io");
var io = socketIo(http, {
  'forceNew': true
});

var ctrlIo = require('./api/controllers/chat/chat-server').ctrlIo;
io.on('connection', ctrlIo);
http.listen(3000, function() {
  console.log('on 3000!');
});
// app.use('/tmp', express.static(path.join(__dirname, '/tmp/')));
// app.use(express.static(path.join(__dirname, '/client/dist/')));
// app.use(() => {
//   console.log(__dirname)
// })
app.use(express.static(path.join(__dirname, '/uploads')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(flash());
app.use(cookieParser());
app.use(session({
  secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
  originalMaxAge: 60000,
  resave: false,
  saveUninitialized: true
}));
//
// app.get('/', function(req, res) {
//   console.log(req);
//   if (req.session.user) {
//     req.session.user++;
//     console.log(req.session.user);
//     res.send('asd' + req.session.user);
//
//   } else {
//     req.session.user = 1;
//     console.log(req.session.user);
//     res.send('asd' + req.session.user);
//   }
// })
app.use('/api', routesApi);
// app.use('/*', (req, res) => {
//   res.sendFile(__dirname + '/client/dist/index.html');
//   // res.redirect('/');
// });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
module.exports.http = http;