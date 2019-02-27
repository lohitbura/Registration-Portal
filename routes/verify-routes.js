
var router = require('express').Router();
var User = require('../models/user');


var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');


var BCRYPT_SALT_ROUNDS = 12;


router.use('/add',(req,res)=>
{
    if(req.session.otp){
        
    if(req.body.otp==req.session.otp)
    {

  bcrypt.hash(req.session.password, BCRYPT_SALT_ROUNDS)  // encryption of password
  .then(function(hashedPassword) {
   return( new User(
            {
                username : req.session.username,
                password : hashedPassword,
                mobile : req.session.mobile,
                email : req.session.email,
                name : req.session.name,
                dob : req.session.dob,
                gender : req.session.gender
            }
        ).save().then((newuser)=>
        {
            console.log('new user is',newuser);
        }
   ))})
  .then(function() {
    
      req.session.destroy();
      res.render('login',{message : null});
  })
  .catch(function(error){
      console.log("Error saving user: ");
      console.log(error);
      next();
  });
   
}
else{
    res.render('index',{message : "You Have Entered Wrong OTP"});
}
}

})
router.use('/change',(req,res)=>
{
    if(req.session.otp){
        
    if(req.body.otp==req.session.otp)
    {

        User.findById(req.user.username, function (err, user) {

            console.log(req.user.username);
            
           req.user.set({mobile : req.session.mobile})
           
           
            req.user.save(function (err, updatedTank) {
                
               res.redirect('/profile/show');
            });
        });
   
}
else{
    res.render('cprofile',{message : "You Have Entered Wrong OTP"});
}
}

})

module.exports = router;