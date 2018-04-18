var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlActionBooks = require('../controllers/actionbooks');
var ctrlUser = require('../controllers/user');
/* Post users actions*/
router.post('/login', ctrlUser.login);
router.post('/registration', ctrlUser.registration);
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