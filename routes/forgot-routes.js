var router = require('express').Router();
var User = require('../models/user');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('264048Ar2eGxRl2GwH5c6e36cd');
var bcrypt = require('bcrypt');
var BCRYPT_SALT_ROUNDS = 12;
router.post('/fill',(req,res)=>
{
    User.findOne({username : req.body.username}).then((currentuser)=>
    {
        if(currentuser)
        {
            console.log('current User  ',currentuser);
            if(req.body.mobile === currentuser.mobile && req.body.email === currentuser.email && req.body.name === currentuser.name)
            {
                var otp1 = parseInt(Math.random() * (9999 - 1000) + 1000);
                var mobile = parseInt(req.body.mobile);
                sendOtp.send(mobile, "PRIIND", otp1, function (error, data) {
                    console.log(data);
                    req.session.forgototp = otp1;
                    req.session.username = req.body.username;
                    res.redirect('/forgot/forgotOtp');
                  });
            }
            else{
                res.render('login',{message : "Incorrect details"})
            }
        }
    })
})

const authCheck = (req,res,next)=>
{
    console.log('yha aaya',req.session.forgototp)
    if(!req.session.forgototp)
    {
        res.redirect('/');
    }
    else{
        next();
    }
};

const authCheck1 = (req,res,next)=>
{
    console.log('yha aaya',req.session.otp)
    if(!req.session.username)
    {
        res.redirect('/');
    }
    else{
        next();
    }
};

router.use('/forgotOtp',authCheck,(req,res)=>
{
       res.render('forgotverify');
})

router.post('/add',authCheck,(req,res)=>
{
    console.log('forgot otp ',req.session.forgototp);
    console.log(req.body.otp);
    if(req.body.otp==req.session.forgototp)
    {
       
        res.render('newpassword');
    }
    else{
        res.render('index',{message : "You Have Entered Wrong OTP"});
    }
})

router.post('/change',authCheck1,(req,res)=>
{
    console.log('here it is');
    User.findOne({username : req.session.username}).then((currentuser)=>
    {
        if(currentuser)
        {
            bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)  // encryption of password
            .then(function(hashedPassword) {
             return( 
                 currentuser.set({password : hashedPassword})
                 
             )})
            .then(function() {
                req.session.destroy();
                currentuser.save(function (err, updatedTank) {
                    res.render('login',{message : null});
                    
                })
               
                
            })
            .catch(function(error){
                console.log("Error saving user: ");
                console.log(error);
                next();
            });
        }
    })
})

router.use('/',(req,res)=>
{
    res.render('forgetp');
})


module.exports = router;