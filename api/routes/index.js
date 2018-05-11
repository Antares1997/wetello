var express = require('express');
var passport = require('passport');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlActionBooks = require('../controllers/actionbooks');
var ctrlUser = require('../controllers/user');
var ctrlChat = require('../controllers/chat/chat-server');
var ctrlAttachment = require('../controllers/attachments');
require('../controllers/config/passport')(passport);
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
/* Post users actions*/
router.post('/login', ctrlUser.login);
router.post('/registration', ctrlUser.registration);
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login?message="log in again"');
    } else {
      console.log('user', user);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/bookslist?userToken=' + user.token);
    });
  })(req, res, next);
});
// {
//   successRedirect: 'http://localhost:4200/bookslist',
//   failureRedirect: 'http://localhost:4200/login'
// }
/* GET home page. */
router.get('/bookslist', verifyToken, ctrlLocations.getBooksList);
router.post('/searchBook', verifyToken, ctrlLocations.searchBook);
router.put('/bookslist/:id', verifyToken, ctrlLocations.changeBookStatus);
router.delete('/bookslist/:id', verifyToken, ctrlLocations.deleteBookStatus);
router.get('/getUser', verifyToken, ctrlLocations.getUser);
// /* GET add  book */
// router.get('/addbook', ctrlAddBooks.getAddBook);
router.post('/addbook', verifyToken, ctrlActionBooks.addBook);
// /* GET edit  book */
// router.get('/editbook', ctrlLocations.getEditbook);
router.put('/editbook', verifyToken, ctrlActionBooks.editbook);
router.post('/deleteBook', verifyToken, ctrlActionBooks.deleteBook);


router.put('/setRating', verifyToken, ctrlActionBooks.setRating);
router.put('/setReadStatus', verifyToken, ctrlActionBooks.setReadStatus);
router.get('/getInfo', verifyToken, ctrlActionBooks.getInfo);
//
router.get('/sendFIle', ctrlActionBooks.sendFile);
router.get('/chat', verifyToken, ctrlChat.chat);
router.get('/chat/:id', verifyToken, ctrlChat.chat);
router.post('/chat/deleteMessage', verifyToken, ctrlChat.deleteMessage)
router.post('/chat/deleteMessageForBoth', verifyToken, ctrlChat.deleteMessageForBoth)
router.post('/saveAttachment', verifyToken, ctrlAttachment.attach)
router.post('/removeAttachment', verifyToken, ctrlAttachment.remove)
module.exports = router;


function verifyToken(req, res, next) {
  const bearerHEader = req.headers['authorization'];
  if (typeof bearerHEader !== 'undefined') {
    const bearer = bearerHEader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    return res.sendStatus(403);
  }
}