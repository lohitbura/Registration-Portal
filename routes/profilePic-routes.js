var router = require('express').Router();
var multer  = require('multer');
var path = require('path');
var x;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/profileUploads')
    },
    filename: function (req, file, cb) {
        x = Date.now()+''+path.extname(file.originalname);
      cb(null,file.fieldname +'-'+ x)
    }
  })
   
  var upload = multer({ storage: storage })
  

router.post('/',upload.single('profilePic'), function (req, res) {

  

    User.findById(req.user.username, function (err, user) {

        console.log(req.user.username);

        req.user.set({ image: 'profilePic-'+x});
        console.log(req.user.image);
        req.user.save(function (err, updatedTank) {

            res.redirect('/profile/show');
        });
    });
        } );




module.exports = router;
