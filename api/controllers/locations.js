var mongoose = require('mongoose');
var Loc = mongoose.model('book');
var User = mongoose.model('user');
var ObjectId = mongoose.ObjectId;
var jwt = require('../models/users').jwt;
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

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
module.exports.getUser = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    User
      .findOne({
        token: req.token
      })
      .select('username email')
      .exec((err, data) => {
        if (err) throw err;
        if (data) {
          return sendJSONresponse(res, 200, {
            "email": data.email,
            "username": data.username,
            "id": data._id
          });
        }
      })
  }
}
module.exports.getBooksList = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    let sendBooks = [];
    User
      .findOne({
        token: req.token
      })
      .exec((err, data) => {
        if (err) throw err;
        if (data) {
          Loc
            .find()
            .select('author title status rating url review info downloader_Id')
            .exec(function(err, docs) {
              if (err) throw err;
              if (!docs) {
                return sendJSONresponse(res, 200, {
                  "message": "Sorry, something wrong"
                });
              } else {

                for (let i = 0; i < docs.length; i++) {
                  if (String(data._id) === docs[i].downloader_Id) {
                    sendBooks.push(docs[i]);
                  } else {
                    console.log('bad');
                  }
                }
                console.log('sendBooks', sendBooks);
                return sendJSONresponse(res, 200, {
                  books: sendBooks
                });

              }
            })
        } else {
          return sendJSONresponse(res, 200, {
            "message": "Sorry, something wrong"
          });
        }
      })

  } else {
    return sendJSONresponse(res, 200, {
      "message": "Pls, login"
    });
  }
};
module.exports.searchBook = function(req, res) {
  verifyInp(req.token, 'secret');
  var key_word = req.body.key_word || req.query.key_word;
  if (key_word === '' || key_word === undefined) {
    sendJSONresponse(res, 200, {})
  } else {
    Loc
      .find({
        $or: [{
          title: {
            $regex: key_word
          }
        }, {
          author: {
            $regex: key_word
          }
        }]
      })
      .select('author title status rating url review')
      .exec(function(err, docs) {
        if (err) throw err;
        if (docs.length === 0) {
          sendJSONresponse(res, 200, {
            "message": "Sorry, nothing found!",
            books: []
          });
        } else {
          sendJSONresponse(res, 200, {
            books: docs
          });
        }
      })
  }
}
module.exports.changeBookStatus = function(req, res) {
  verifyInp(req.token, 'secret');
  var book_id = req.query.id || req.params.id;
  var status = req.body.status || req.query.status;
  console.log('book_id ' + book_id,
    'status ' + status);
  Loc
    .updateOne({
      _id: book_id
    }, {
      $set: {
        'status': status
      }
    }, function(err, doc) {
      if (err) console.log(err);
      if (doc.ok === 0) {
        sendJSONresponse(res, 200, {
          'message': 'Not found book!'
        })
      } else {
        sendJSONresponse(res, 200, {
          'message': 'the book updated!'
        })
      }
    })
};
module.exports.deleteBookStatus = function(req, res) {
  verifyInp(req.token, 'secret');
  var book_id = req.query.id || req.params.id;
  if (book_id) {
    Loc
      .findByIdAndRemove(book_id)
      .exec(
        function(err, book) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err)
            return;
          } else {
            sendJSONresponse(res, 204, null);
          }
        }
      )
  } else {
    sendJSONresponse(res, 404, {
      'message': 'No book id!'
    });
  }
};

module.exports.addbook = function(req, res) {
  verifyInp(req.token, 'secret');
  res.render('index', {
    title: 'addbook'
  });
};
module.exports.editbook = function(req, res) {
  verifyInp(req.token, 'secret');
  res.render('index', {
    title: 'editbook'
  });
};

module.exports.deletebook = function(req, res) {
  verifyInp(req.token, 'secret');
  res.render('index', {
    title: 'deletebook'
  });
};