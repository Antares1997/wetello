var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var BooksShema = mongoose.model('book');
var AttachedBook = mongoose.model('AttachedBook');
var User = mongoose.model('user');
var jwt = require('../models/users').jwt;
var multer = require('multer');
var Busboy = require('busboy');
var path = require('path');
var md5 = require('md5');
var randomChars = require('random-chars');
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function(req, file, cb) {
    cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: 'uploads/'
}).single('file')
var fs = require('fs');
var mkdirp = require('mkdirp');


var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

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

module.exports.addBook = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    console.log('req.body', req.body);
    var monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    var downloadedOn = day + ', ' + monthes[month] + ' ' + year;
    var errors = [];
    var errorObj = {};

    User
      .findOne({
        'token': req.token
      }, (err, user) => {
        if (err) throw err;
        AttachedBook
          .findById(req.body.bookId, (err, attachedBook) => {
            if (err) throw err;
            if (attachedBook) {
              AttachedBook
                .updateOne({
                  '_id': ObjectId(attachedBook._id)
                }, {
                  $set: {
                    isUsed: true
                  }
                }, (err) => {
                  if (err) throw err;
                })
              var downloader_info = {
                name: user.name,
                surname: user.surname,
                downloadedOn: downloadedOn
              };
              var newBook = new BooksShema({
                author: req.body.author,
                title: req.body.title,
                rating: 0,
                status: req.body.status,
                attachedBook: attachedBook._id,
                review: req.body.review,
                downloader_Id: user._id,
                info: downloader_info
              });
              newBook
                .save((err, data) => {
                  if (err) {
                    if (err.code === 11000) {
                      console.log('err.errors', err);
                      // errorObj['duplicate'] = 'duplicate';
                    } else {
                      Object.keys(err.errors).forEach((errorName, index) => {
                        errorObj[errorName] = err.errors[errorName].message;
                      })
                    }
                    errors.push(errorObj);
                    sendJSONresponse(res, 206, {
                      errors: errors,
                      'message': 'Сheck the fields'
                    })
                  } else {
                    sendJSONresponse(res, 200, {
                      'message': 'Book was succsesfully add!'
                    })
                  }
                })
            } else {
              errorObj['url'] = 'Not found attch file';
              errors.push(errorObj);
              sendJSONresponse(res, 200, {
                errors: errors,
                'message': errorObj['url']

              })
            }
          })
      })
  }
};

module.exports.saveBook = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    var errors = [];
    var errorObj = {};
    var busboy = new Busboy({
      headers: req.headers
    });
    var bookId;
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      User.findOne({
          'token': req.token
        })
        .exec((err, user) => {
          var folder = './uploads/' + user._id + '/';
          var attachBook = new AttachedBook({
            filepath: folder + md5(randomChars.get(20)),
            filename: filename,
            type: mimetype,
            owner: user._id
          });
          attachBook.save((err, data) => {
            if (err) {
              Object.keys(err.errors).forEach((errorName, index) => {
                errorObj[errorName] = err.errors[errorName].message;
                console.log(errorObj);
              })
              errors.push(errorObj);
              return sendJSONresponse(res, 206, {
                errors: errors
              })
            } else {
              if (fs.existsSync(folder)) {
                file.pipe(fs.createWriteStream(attachBook.filepath));
              } else {
                mkdirp(folder, (err) => {
                  if (err) throw err;
                  file.pipe(fs.createWriteStream(attachBook.filepath));
                });
              }
              bookId = data._id;
            }
          })
        });
    });
    busboy.on('finish', function() {
      // if (errors.length > 0) {
      //   return sendJSONresponse(res, 206, {
      //     errors: errors
      //   })
      // }
      return sendJSONresponse(res, 200, {
        'bookId': bookId
      })
    });
    return req.pipe(busboy);
  }
}

module.exports.editbook = function(req, res) {
  var bookToSave = [];
  if (verifyInp(req.token, 'secret', res)) {
    User
      .findOne({
        token: req.token
      })
      .exec(function(err, user) {
        if (err) throw err;
        if (user) {
          editFunc(req.body, (err, books) => {
            if (err) {
              sendJSONresponse(res, 206, {
                errors: err
              })
            };
            if (books) {
              sendJSONresponse(res, 200, {
                books: books
              })
            }
          })
        } else {
          return sendJSONresponse(res, 200, {
            "message": "Pls, login"
          });
        }
      })
  }
}
module.exports.deleteBook = function(req, res) {
  let bookId;
  if (verifyInp(req.token, 'secret', res)) {
    console.log('deleteBook');
    User
      .findOne({
        token: req.token
      })
      .exec(function(err, user) {
        if (err) throw err;
        if (user) {
          bookId = req.body.bookId;
          console.log('bookId', bookId);
          deleteBookFromDb(bookId, (result) => {
            return sendJSONresponse(res, 200, {
              "message": "Ok"
            });
          });
        } else {
          return sendJSONresponse(res, 200, {
            "message": "Pls, login"
          });
        }
      })

  }
}

module.exports.sendFile = function(req, res) {
  //return fs.createReadStream(path.resolve('uploads/5abfbcb317d42e0bcb89d3fc/qwe.jpg')).pipe(res);
  var bookId = req.query.bookId;
  BooksShema
    .findById(bookId)
    .populate('attachedBook')
    .exec(function(err, data) {
      if (err) {
        return sendJSONresponse(res, 404, {
          "message": "Not found file!"
        });
      };

      if (data) {
        // res.setHeader(`Content-Disposition: attachment; filename='${data.title}'`)
        var stream = fs.createReadStream(path.resolve(data.attachedBook.filepath));
        res.download(data.attachedBook.filepath, data.title);
      } else {
        console.log('Not found');
      }
    })
  // return sendJSONresponse(res, 200, {
  //   "message": "well"
  // });
}

module.exports.setRating = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    BooksShema
      .update({
        _id: req.body.id
      }, {
        $set: {
          rating: req.body.rating
        }
      }, function(err) {
        console.log(err);
      });
    return sendJSONresponse(res, 200, {
      "message": "ok",
      "rating": req.body.rating
    });
  }
}

module.exports.setReadStatus = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    BooksShema
      .update({
        _id: req.body.id
      }, {
        $set: {
          status: req.body.readStatus
        }
      }, function(err) {
        console.log(err);
      });
    return sendJSONresponse(res, 200, {
      "message": "ok",
      "status": req.body.readStatus
    });
  }
}
module.exports.getInfo = function(req, res) {
  if (verifyInp(req.token, 'secret', res)) {
    var bookId = req.query.bookId;
    BooksShema
      .findById(bookId)
      // .select('_id rating')
      .exec((err, data) => {
        if (err) throw err;
        if (data) {
          return sendJSONresponse(res, 200, {
            "message": "ok",
            "data": data
          });
        } else {
          return sendJSONresponse(res, 200, {
            "message": "bad",
          });
        }
      })

  }
}

function editFunc(bookInfo, cb) {

  BooksShema
    .findById(bookInfo._id)
    .populate('attachedBook')
    .exec((err, book) => {
      if (err) {
        cb(getErrorMessage(err), null);
      } else {
        if (book) {
          book.update({
            $set: {
              author: bookInfo.author || book.autho,
              title: bookInfo.title || book.title,
              status: bookInfo.status || book.status,
              review: bookInfo.review || book.autreviewhor
            }
          }, (err, updatedBook) => {
            if (err) {
              cb(getErrorMessage(err), null);
            } else {
              cb(null, updatedBook);
            }
          })
        }
      }
    })
}

function getErrorMessage(err) {
  var errors = [];
  var errorObj = {};
  Object.keys(err.errors).forEach((errorName, index) => {
    errorObj[errorName] = err.errors[errorName].message;
  })
  errors.push(errorObj);
  return errors;
}

function deleteBookFromDb(bookId, cb) {
  BooksShema
    .findById(bookId)
    .populate('attachedBook')
    .exec((err, book) => {
      if (err) throw err;
      var index = book.attachedBook.filepath.lastIndexOf('/');
      var folder = book.attachedBook.filepath.slice(0, index);
      if (fs.existsSync(folder)) {
        fs.unlink(book.attachedBook.filepath, (err) => {
          if (err) throw err;
          fs.readdir(folder, (err, items) => {
            if (err) throw err;
            if (!items.length) {
              fs.rmdirSync(folder)
            } else {
              console.log('items is exist', items);
            }
          })
        })
      } else {
        console.log('errors');
      }

      book.attachedBook.remove();
      book.remove();
    });
  // .findById(ObjectId(bookId))
  // .exec((err, data) => {
  //   if (err) throw err;
  //   if (data) {
  //     console.log('data');
  //   } else {
  //     console.log('wtf');
  //   }
  // })
}