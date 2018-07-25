var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Attachments = mongoose.model('attachment');
var AttachedBook = mongoose.model('AttachedBook');
var User = mongoose.model('user');
var jwt = require('../models/users').jwt;
var time = new Date();
var interval = 1000 * 60 * 58;
var randomChars = require('random-chars');

function verifyInp(token, secret, res) {
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      console.log('bad');
      result = false;
    } else {
      result = true;
      // console.log('Succsess');
    }
  })
  return result;
}

module.exports.attach = (req, res) => {
  if (verifyInp(req.token, 'secret', res)) {
    var busboy = new Busboy({
      headers: req.headers
    });
    let filesId = [];
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join('tmp/', randomChars.get(10) + filename);
      console.log(fieldname, file, filename, encoding, mimetype);
      User.findOne({
          'token': req.token
        })
        .exec((err, user) => {
          var attachObject = new Attachments({
            type: mimetype,
            filepath: saveTo,
            filename: filename,
            owner: user._id
          });
          attachObject.save((err, data) => {
            if (err) throw err;
            file.pipe(fs.createWriteStream(saveTo));
            filesId.push(data._id)
          })
        })
    });
    busboy.on('finish', function() {
      console.log('Upload complete');
      res.json({
        'filesId': filesId
      });
    });

    return req.pipe(busboy);
  }
};
module.exports.remove = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    var id = req.body.id;
    if (id) {
      Attachments
        .findById(id)
        .exec((err, data) => {
          fs.unlink(data.filepath)
        });
      Attachments.remove({
          _id: ObjectId(id)
        })
        .exec((err, result) => {
          if (err) throw err;
          res.json('ok')
        })
    }
  }
}


var inter = setInterval(() => {
    Attachments
      .find({
        'is_used': false
      })
      .exec((err, data) => {
        for (var i = 0; i < data.length; i++) {
          fs.unlink(data[i].filepath, (err, data) => {
            if (err) throw err;
            if (data) {
              Attachments.remove({
                  'is_used': false
                })
                .exec((err, result) => {
                  if (err) throw err;
                  if (result) {}
                })
            }
          })

        }
      });

    AttachedBook
      .remove({
        'isUsed': false
      }, (err, succsess) => {
        if (err) throw err;
      })

  },
  interval);