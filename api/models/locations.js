var mongoose = require('mongoose');

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
    required: true
  },
  title: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    "default": 0,
    min: 0,
    max: 5
  },
  status: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  downloader_Id: {
    type: String
  },
  info: infoSchema
});

mongoose.model('book', booksShema, 'books');