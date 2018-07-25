var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var UserModel = mongoose.model('user');
var typesOfFiles = ['application/msword', 'application/pdf', 'text/plain', 'image/vnd.djvu'];
var typeValidation = function(type) {
  var index = typesOfFiles.indexOf(type);
  if (index == '-1') {
    return false;
  } else {
    return true;
  }
}
var infoSchema = new mongoose.Schema({
  name: {
    type: String
  },
  surname: {
    type: String
  },
  downloadedOn: {
    type: String,
    "default": Date.now
  }
});

var booksShema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Please fill a valid author field!'],
  },
  title: {
    type: String,
    required: [true, 'Please fill a valid title field!'],
  },
  rating: {
    type: Number,
    "default": 0,
    min: 0,
    max: 5
  },
  status: {
    type: Boolean,
    default: false
    // required: [true, 'Please fill a valid status field!']
  },
  attachedBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttachedBook',
    required: [true, 'Wrong file type!'],
  },
  review: {
    type: String,
  },
  downloader_Id: {
    type: String
  },
  info: infoSchema
});
var AttachedBook = new mongoose.Schema({
  filepath: {
    type: String,
    // unique: [true, 'Book already is exist!']
  },
  filename: String,
  type: {
    type: String,
    required: true,
    validate: [typeValidation, 'Invalid file type'],
  },
  owner: String,
  isUsed: {
    type: Boolean,
    default: false
  }
});
// booksShema.pre('findOneAndUpdate', (next) => {
//   var oldAuthor = this.author;
//   var oldTitle = this.title;
//   var oldStatus = this.status;
//   var oldReview = this.review;
//   if(this.isModified())
// })

mongoose.model('AttachedBook', AttachedBook, 'AttachedBooks');
mongoose.model('book', booksShema, 'books');