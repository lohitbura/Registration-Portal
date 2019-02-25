
var passport = require('passport');
var router = require('express').Router();
const bodyParser = require('body-parser');
var passportSetup= require('../config/passport-setup');
//var urlencodedParser = bodyParser.urlencoded({extended : false});



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