var router = require('express').Router();

// const authCheck = (req,res,next)=>
// {
//     console.log('yha aaya',req.session.otp)
//     if(!req.session.otp)
//     {
//         res.redirect('/');
//     }
//     else{
//         next();
//     }
// };

router.get('/change',(req,res)=>{
    console.log('aa gya yha to');
    res.render('verifyChange');
});


router.get('/',(req,res)=>{
    console.log('aa gya yha to');
    res.render('verify');
});

module.exports = router;