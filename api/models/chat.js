var mongoose = require('mongoose');
var UserModel = mongoose.model('user');

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
var chatShema = new mongoose.Schema({
  message: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  sender: {
    id: String,
    username: String,
    avatar: String
  },
  receiverId: {
    type: String,
    default: false
  },
  attachedFiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'attachment'
  }],
  forbidForUser: {
    type: String,
    default: 'none'
  }
});
var attachmentSchema = new mongoose.Schema({
  type: String,
  filepath: String,
  filename: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'
  },
  date: Date,
  is_used: {
    type: Boolean,
    default: false
  }
});
var Attach = mongoose.model('attachment', attachmentSchema, 'attachments');
var Chat = mongoose.model('chat', chatShema, 'chats');