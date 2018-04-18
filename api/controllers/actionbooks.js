var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Loc = mongoose.model('book');
var User = mongoose.model('user');
var temp_id = '5a70b6073d8dba93745d95bf';
var jwt = require('../models/users').jwt;
var multer = require('multer');
var Busboy = require('busboy');
var path = require('path');
var inspect = require('util').inspect;
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
  var result = 'test';
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
  var bookToSave = [],
    saveTo = '',
    ext = '';
  if (verifyInp(req.token, 'secret', res)) {
    var busboy = new Busboy({
      headers: req.headers
    });


    // parseReq(req);
    let downloader_info, Save_options;
    User
      .findOne({
        "token": req.token
      })
      .exec(function(err, user) {
        if (err) throw err;
        if (user) {
          busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
            bookToSave[fieldname] = val;
          });
          busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            ext = '.' + filename.split('.').reverse()[0];
            var folder = './uploads/' + user._id;
            saveTo = path.join(folder, bookToSave['author'] + '__' + bookToSave['title'] + ext);
            if (!fs.existsSync(saveTo)) {
              mkdirp(folder, function(err) {
                if (err) throw err;
                file.pipe(fs.createWriteStream(saveTo));
              });
            } else {
              return sendJSONresponse(res, 200, {
                'message': `Book (s) with this title and the author exists!`
              });
            }
          });
          busboy.on('finish', function() {
            saveFunc(req, res, user, bookToSave, saveTo);
          });
          return req.pipe(busboy);
        }
      });
  } else {
    return sendJSONresponse(res, 200, {
      "message": "Pls, login"
    });
  }

};



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
          var busboy = new Busboy({
            headers: req.headers
          });
          busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
            bookToSave[fieldname] = val;
          });
          busboy.on('finish', function() {
            editFunc(req, res, user, bookToSave);
          });
          return req.pipe(busboy);
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
    // var bookId = req.params.id;
    User
      .findOne({
        token: req.token
      })
      .exec(function(err, user) {
        if (err) throw err;
        if (user) {
          bookId = req.body.bookId;
          deleteBookLocal(res, bookId);
          return sendJSONresponse(res, 200, {
            "message": "Ok"
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
  Loc
    .findById(bookId)
    .exec(function(err, data) {
      if (err) throw err;
      if (data) {
        var stream = fs.createReadStream(path.resolve(data.url));
        stream.pipe(res);
        // stream.on('readable', function() {
        //   var book = stream.read();
        //   if(book ==)
        //   console.log('book', book);
        //   // res.send(data)
        // });
        // stream.on('end', function() {
        //   console.log("THE END");
        //   var data = stream.read();
        //   console.log('data', data);
        // });
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
    Loc
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
    Loc
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
    Loc
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



function saveFunc(req, res, user, bookToSave, saveTo) {
  var monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate();
  var year = date.getFullYear();
  var downloadedOn = day + ', ' + monthes[month] + ' ' + year;
  if (!saveTo) {
    return sendJSONresponse(res, 200, {
      'message': `Fill all the fields correctly!`
    });;
  }
  downloader_info = {

    name: user.name,
    surname: user.surname,
    downloadedOn: downloadedOn
  };
  Save_options = {
    author: bookToSave['author'] || 'author',
    title: bookToSave['title'] || 'title',
    rating: 0,
    status: bookToSave['readStatus'] || 0,
    url: saveTo || 'url',
    review: bookToSave['review'] || 'review',
    downloader_Id: user._id,
    info: downloader_info
  };
  Loc
    .find({
      $and: [{
          title: Save_options.title
        }, {
          author: Save_options.author
        },
        {
          downloader_Id: Save_options.downloader_Id
        }
      ]
    })
    .exec((err, docs) => {
      if (err) throw err;
      if (docs.length !== 0) {
        return sendJSONresponse(res, 200, {
          'message': `Book(s) with this title and author is exist!`
        });
      } else {
        Loc
          .create(Save_options,
            function(err, saved_book) {
              if (err) {
                console.log(err);
                sendJSONresponse(res, 200, {
                  'message': `Can't save new book`
                });
              } else {
                // console.log(saved_book);
                sendJSONresponse(res, 200, {
                  'message': `book was succsesfully save`
                });
              }
            })
      }
      // fs.rename(docs.url, saveTo, (err) => {
      //   if (err) throw err;
      //   console.log('Rename complete!');
      // });
    })

}
var saveTo = '';

function editFunc(req, res, user, bookToSave) {
  Loc
    .findById(bookToSave._id)
    .exec(function(err, data) {
      if (err) throw err;
      if (data) {
        User
          .findOne({
            token: req.token
          })
          .exec((err, user) => {
            if (err) throw err;
            if (user) {
              Loc
                .find({
                  $and: [{
                      title: bookToSave['title']
                    }, {
                      author: bookToSave['author']
                    },
                    {
                      downloader_Id: user.downloader_Id
                    }
                  ]
                })
                .exec((err, docs) => {
                  if (err) throw err;
                  if (docs.length !== 0) {
                    return sendJSONresponse(res, 200, {
                      'message': `Book(s) with this title and author is exist!`
                    });
                  } else {
                    var author, title, status, url, review;
                    Loc
                      .findById(bookToSave._id)
                      .exec((err, singleBook) => {
                        if (err) throw err;
                        if (singleBook) {
                          console.log("bookToSave['review']", bookToSave['review']);
                          author = ((bookToSave['author'] != 'undefined') && (bookToSave['author'] != '')) ? bookToSave['author'] : singleBook.author;
                          title = ((bookToSave['title'] != 'undefined') && (bookToSave['title'] != '')) ? bookToSave['title'] : singleBook.title;
                          status = ((bookToSave['readStatus'] != 'undefined') && (bookToSave['readStatus'] != '')) ? bookToSave['readStatus'] : singleBook.status;
                          review = ((bookToSave['review'] != 'undefined') && (bookToSave['review'] != '')) ? bookToSave['review'] : singleBook.review;
                          var ext = '.' + data.url.split('.').reverse()[0];
                          var source = './uploads/' + user._id + '/' + author + '__' + title;
                          var saveTo = source + ext;
                          url = saveTo;
                          review = ((bookToSave['review'] != 'undefined') && (bookToSave['review'] != '')) ? bookToSave['review'] : singleBook.review;
                          console.log("bookToSave['author']" + bookToSave['author']);
                          console.log(author + ' - ' + title + ' - ' + singleBook.author + ' - ' + singleBook.title);
                          if (!fs.existsSync(saveTo)) {
                            fs.rename(data.url, saveTo, (err) => {
                              if (err) throw err;
                              console.log('Rename complete!');
                            });
                          } else {
                            console.log('Rename bad!');
                            // return sendJSONresponse(res, 200, {
                            //   'message': `Book(s) with this title and author is exist!`
                            // });
                          }
                          Loc
                            .update({
                              _id: bookToSave._id
                            }, {
                              $set: {
                                author: author,
                                title: title,
                                status: status,
                                url: url,
                                review: review,
                              }
                            }, function(err) {
                              console.log(err);
                            });
                        }
                      })


                  }
                })
            }
          })


      } else {
        console.log('not found');
      }
    });
}

function deleteBookLocal(res, id) {
  Loc
    .findById(ObjectId(id))
    .exec((err, data) => {
      if (err) throw err;
      if (data) {
        let way = data.url.split('/');
        let length = way.length;
        way = way.slice(0, length - 1).join('/');
        Loc
          .remove({
            _id: ObjectId(id)
          }, function(err) {
            if (err) return err;
            // removed!
          });
        if (!fs.existsSync(data.url)) {
          console.log('Not exist');
          return sendJSONresponse(res, 200, {
            'message': `This book not exist!`
          });
        } else {
          fs.unlinkSync(data.url);
          fs.readdir(way, (err, files) => {
            if (files.length === 0) {
              fs.rmdirSync(way);
            }
          })
        }
      } else {
        console.log('wtf');
      }
    })
}

// function(err, saved_book) {
//   if (err) {
//     console.log(err);
//     sendJSONresponse(res, 200, {
//       'message': `Can't save new book`
//     });
//   } else {
//     // console.log(saved_book);
//     sendJSONresponse(res, 200, {
//       'message': `book was succsesfully save`
//     });
//   }
// }