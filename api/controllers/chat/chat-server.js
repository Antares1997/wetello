var chatBox = require('./models').chatBox;
var sendResponseMessage = require('./models').sendResponseMessage;
var sendAllChat = require('./models').sendAllChat;
var checkUpdates = require('./models').checkUpdates;
var jwt = require('../../models/users').jwt;
var mongoose = require('mongoose');
var ObjectID = require('mongoose').ObjectID;
var chatDB = mongoose.model('chat');
var User = mongoose.model('user');
var attachment = mongoose.model('attachment');
var fs = require('fs');
var path = require('path');
var redis = require('redis');
var client = redis.createClient();
var redisIndex = 0;
// var io = require('../../../app').;
// io.on('connection', ctrlIo);
function verifyInp(token, secret, res) {
  var result;
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      console.log('bad verifyInp');
      result = false;
    } else {
      result = true;
    }
  })
  return result;
}
module.exports.chat = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    var companionId = req.params.id;
    var curentUserId;
    User
      .find()
      .exec((err, users) => {
        if (err) throw err;
        if (users) {
          if (companionId) {
            User.findOne({
                token: req.token
              })
              .exec((err, data) => {
                if (err) throw err;
                if (data) {
                  curentUserId = data.id;
                  chatDB
                    .find({
                      $or: [{
                          $and: [{
                              'receiverId': companionId
                            },
                            {
                              'sender.id': curentUserId
                            }
                          ]
                        }, {
                          $and: [{
                              'receiverId': curentUserId
                            },
                            {
                              'sender.id': companionId
                            }
                          ]
                        }

                      ]
                    })
                    .populate('attachedFiles')
                    .exec((err, data) => {
                      if (err) throw err;
                      if (data) {
                        redisIndex = req.token;
                        var user = {};
                        var clientUsers = [];
                        var index = 0;
                        for (let i = 0; i < users.length; i++) {
                          if (users[i].token === req.token) {
                            user = users[i];
                            index = users.indexOf(user);
                          }
                        }
                        users.splice(index, 1);
                        data = data.filter((item) => {
                          // console.log('find here', user._id, item.forbidForUser);
                          return item.forbidForUser != user._id;
                        })
                        res.json({
                          'data': data,
                          'user': user,
                          'companions': users
                        });
                      } else {
                        console.log('no data');
                      }
                    })
                }
              })

          } else {
            chatDB
              .find({
                "receiverId": false
              })
              .populate('attachedFiles')
              .exec((err, data) => {
                if (err) throw err;
                if (data) {
                  var user = {};
                  var clientUsers = [];
                  var index = 0;
                  for (let i = 0; i < users.length; i++) {
                    if (users[i].token === req.token) {
                      user = users[i];
                      index = users.indexOf(user);
                    }
                  }
                  var data = data.filter((item) => {
                    // console.log('find here', user._id, item.forbidForUser);
                    return item.forbidForUser != user._id;
                  });
                  users.splice(index, 1);
                  res.json({
                    'data': data,
                    'user': user,
                    'companions': users
                  });
                } else {
                  console.log('no data');
                }
              })
          }
        }
      })
  }
}
module.exports.deleteMessage = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    var messageId = req.body.messageId;
    User
      .findOne({
        'token': req.token
      })
      .exec((err, user) => {
        if (err) throw err;
        if (user) {
          chatDB
            .remove({
              'forbidForUser': {
                $ne: 'none'
              }
            }, (err, data) => {
              if (err) throw err;
            })
          chatDB
            .updateOne({
              _id: messageId
            }, {
              'forbidForUser': user._id
            }, (err, result) => {
              if (err) throw err;
              res.json({
                'removedStatus': 'removed',
                'messageId': messageId
              })
            })
        }
      })

  }
}
module.exports.deleteMessageForBoth = function(req, res) {
  var messageId = req.body.messageId;
  console.log('messageId', messageId);
  chatDB
    .remove({
      _id: messageId
    })
    .exec((err, suc) => {
      if (err) throw err;
      res.json({
        'removedStatus': 'removed',
        'messageId': messageId
      })
    })
}
var connection = [];
module.exports.ctrlIo = function(socket) {
  connection.push(socket);
  console.log('Client connected..., now we have ' + connection.length + ' connections', redisIndex);

  socket.on('checkNewMassege', (chatInfo) => {
    checkUpdates(chatInfo, (data) => {
      socket.emit('updateMessage', data);
    });
  });

  socket.on('message', function(client, msgInf) {
    chatBox(client, msgInf, (response) => {
      return socket.emit('responseMessage', response);
    });
  });
  socket.on('sendImage', (file) => {
    console.log('sendImage', file);
  });
  socket.on('disconnect', function() {
    console.log('disconnect');
    var index = connection.indexOf(socket);
    connection.splice(index, 1);
    socket.disconnect();
  });
}
// добавить функцию chenewдля сравнения количства поточных сообщений на сервера и в БД