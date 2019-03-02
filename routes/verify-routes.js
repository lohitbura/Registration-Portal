
var router = require('express').Router();
var User = require('../models/user');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('264048Ar2eGxRl2GwH5c6e36cd');
sendOtp.setOtpExpiry('5');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');


var BCRYPT_SALT_ROUNDS = 12;


router.use('/add',(req,res)=>
{
    sendOtp.verify(req.session.mobile, req.body.otp, function (error, data) {
        console.log(data); // data object with keys 'message' and 'type'
        if(data.type == 'success') 
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
        if(data.type == 'error') {
            res.render('index',{message : "You Have Entered Wrong OTP"});

        }
      });
   })


router.use('/change',(req,res)=>
{
    sendOtp.verify(req.session.mobile, req.body.otp, function (error, data) {
        console.log(data); // data object with keys 'message' and 'type'
        if(data.type == 'success') 
        {
            User.findById(req.user.username, function (err, user) {

                console.log(req.user.username);
                
               req.user.set({mobile : req.session.mobile})
               
               
                req.user.save(function (err, updatedTank) {
                    
                   res.redirect('/profile/show');
                });
            });
        }
        if(data.type == 'error') {
            res.render('cprofile',{message : "You Have Entered Wrong OTP"});
        }
      });
        
    


})

module.exports = router;