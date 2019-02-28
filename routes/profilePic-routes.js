var router = require('express').Router();
var multer  = require('multer');
var path = require('path');
var thumbnailPath;
var Jimp = require('jimp');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/profileUploads')
    },
    filename: function (req, file, cb) {
        var abc = Date.now();
        var imgname='profilePic-'+abc+path.extname(file.originalname);
        thumbnailPath=imgname;
        cb(null, file.fieldname + '-' +abc + path.extname(file.originalname));
    }
  })
   
  var upload = multer({ storage: storage })
  

router.post('/',upload.single('profilePic'), function (req, res) {

    Jimp.read("./public/profileUploads/"+thumbnailPath, (err, lenna) => {
        if (err) throw err;
        lenna
            .resize(Jimp.AUTO, 500) // resize
            .quality(100) // set JPEG quality
            //.greyscale() // set greyscale
            // .scaleToFit(300,300); // scale the image to the largest size that fits inside the given width and height
            .write("./public/profileUploads/"+thumbnailPath); // save
    });

    User.findById(req.user.username, function (err, user) {

        console.log(req.user.username);
        
        req.user.set({ image: thumbnailPath});
        console.log(req.user.image);
        req.user.save(function (err, updatedTank) {

            res.redirect('/profile/show');
        });
    });
        } );




module.exports = router;
