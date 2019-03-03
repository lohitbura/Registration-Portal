var bcrypt = require('bcrypt');


var BCRYPT_SALT_ROUNDS = 12;

var passport = require('passport');
var router = require('express').Router();
const bodyParser = require('body-parser');
var passportSetup= require('../config/passport-setup');
//var urlencodedParser = bodyParser.urlencoded({extended : false});

router.post('/regularChange',(req,res)=>
{
    User.findOne({username : req.body.username}).then((currentuser)=>
    {
        bcrypt.compare(req.body.oldpassword, currentuser.password, function (err, result) {
            if (result == true) {
                bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)  // encryption of password
                .then(function(hashedPassword) {
                 return( 
                     currentuser.set({password : hashedPassword})
                 )})
                 .then(function() {
                   var newTime = Date.now()
                  currentuser.set({timestamp :newTime ,toki : null});
                   currentuser.save(function (err, updatedTank) {
                     console.log(currentuser.toki);
                    res.redirect('/login');
                    
                })
                   
                })
            } else {
             res.render('login',{message : "Incorrect Password"})
            }
          });
    })
})

// const authCheck = (req,res,next)=>
// {
//     console.log('yha aaya',req.user)
    
//      if(!req.user)
//     {
//         res.redirect('/');
//     }
//     else{
//         next();
//     }
// };

router.use('/regularChange',(req,res)=>
{
    res.render('changeRegular');
})

router.post('/local',passport.authenticate('local',{
    successRedirect:'/profile/show',
    failureRedirect: '/failure/login'
})
);


// router.post('/local',(req,res)=>
// {
//     res.send('hello mogli');
// })

router.post('/confirm',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
      console.log('hii mogli');
    res.redirect('https://localhost:3000');
  });

module.exports = router;