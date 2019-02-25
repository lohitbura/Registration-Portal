
var passport = require('passport');
var router = require('express').Router();
var User = require('../models/user');

const SendOtp = require('sendotp');
const sendOtp = new SendOtp('264048Ar2eGxRl2GwH5c6e36cd');
router.use('/data',(req,res)=>
{
    
    User.findOne({username : req.body.username}).then((currentuser)=>
    {
        if(currentuser)
        {
            
            res.render('index',{message : "User Already Exist"});
        }
        else{
            var otp1 = parseInt(Math.random() * (9999 - 1000) + 1000);
            var mobile = parseInt(req.body.mobile);
    console.log('fghj',otp1);
    console.log("hi ",req.body);
    sendOtp.send(mobile, "PRIIND", otp1, function (error, data) {
        console.log(data);
        req.session.otp = otp1;
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        req.session.mobile = req.body.mobile;
        req.session.name = req.body.name;
        req.session.dob = req.body.dob;
        req.session.gender = req.body.gender;
        req.session.email = req.body.email;
        res.redirect('/otp');
      });
     
           
        }
    })

   
})

router.use('/login',(req,res)=>
{
    res.render('login',{message : null});
});

router.use('/logout',(req,res)=>
{
    req.logout();
    res.redirect('/');
});


router.use('/',(req,res)=>
{
    res.render('index',{message : null});
});




module.exports= router;

