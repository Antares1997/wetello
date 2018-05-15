var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var User = require('./user');
var UserModel = mongoose.model('user');
var Message = require('./message');
var chatDB = mongoose.model('chat');
var Attachment = mongoose.model('attachment');
var Busboy = require('busboy');
var fs = require('fs');
var multer = require('multer');
var randomChars = require('random-chars');
var path = require('path');
var mkdirp = require('mkdirp');
// var data = item.replace(/^data:image\/\w+;base64,/, "");
const storage = multer.diskStorage({
  destination: './chatImages',
  filename: function(req, file, cb) {
    cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname));
  }
});
module.exports.User = User;
module.exports.Message = Message;
var chatBox = function(client, msgInf, cb) {
  UserModel
    .findOne({
      token: User(client).token
    })
    .select('_id avatar')
    .exec((err, data) => {
      if (err) throw err;
      if (data) {
        var sender = {
          id: data._id,
          username: User(client).username,
          avatar: data.avatar
        };
        var mes = Message(msgInf.currentMessage);
        var infoToDB = new chatDB({
          receiverId: msgInf.companionId || false,
          message: mes,
          sender: sender,
          attachedFiles: msgInf.attachedFiles
        });
        infoToDB.save(function(err, messageInfo) {
          if (err) throw (err);
          if (messageInfo) {
            console.log('allMessage');
            chatDB
              .findById(messageInfo._id)
              .populate('attachedFiles')
              .exec((err, attachment) => {
                if (err) throw err;
                if (attachment) {
                  attachment = attachment;
                  // console.log('allMessage', attachment);
                  updateDB(Attachment, attachment.attachedFiles);
                  cb(attachment)
                } else {
                  console.log('No found');
                }

              })
          }
        })
      } else {
        console.log('no data');
      }
    })
}

function updateDB(DB, comparativeObject) {
  for (var i = 0; i < comparativeObject.length; i++) {
    DB.updateOne({
      _id: comparativeObject[i]._id
    }, {
      is_used: true
    }, function(err, res) {
      if (err) throw err;
      console.log('resasdasd', res);
    })
  }
}

function base64_encode(file) {
  var type = file.split('.').reverse()[0];
  var base = `data:image/` + type + `;base64,`;
  var file = base + fs.readFileSync(file, 'base64');
  return file;
}
var checkUpdates = function(chatInfo, cb) {
  let count = 0;
  var companionId = chatInfo.companionId;
  if (chatInfo.companionId != 'false') {
    UserModel
      .findOne({
        'token': chatInfo.token
      })
      .exec((err, user) => {
        if (err) throw err;
        if (user) {
          chatDB
            .find({
              $or: [{
                  $and: [{
                      'receiverId': companionId
                    },
                    {
                      'sender.id': user._id
                    }
                  ]
                }, {
                  $and: [{
                      'receiverId': user._id
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
                var allMessage = data.filter((item) => {
                  // console.log('find here', user._id, item.forbidForUser);
                  return item.forbidForUser != user._id;
                })
                var DBlength = data.length;
                var resMessage = allMessage.slice(chatInfo.length);
                cb(resMessage);
              }
            })
        }
      })
  } else {
    chatDB
      .find({
        "receiverId": "false"
      })
      .populate('attachedFiles')
      .exec((err, data) => {
        if (err) throw err;
        if (data) {
          var allMessage = data;
          var DBlength = data.length;
          var resMessage = allMessage.slice(chatInfo.length);
          cb(resMessage);
        }
      })
  }
}

module.exports.checkUpdates = checkUpdates;
module.exports.chatBox = chatBox;
// module.exports.sendResponseMessage = sendResponseMessage;