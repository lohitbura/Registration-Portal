router = require('express').Router();

const authCheck = (req,res,next)=>
{
    console.log('yha aaya',req.user)
    if(!req.user)
    {
        res.redirect('/');
    }
    else{
        next();
    }
};


router.get('/',authCheck,(req,res)=>{
    console.log('aa gya yha to');
    res.render('cprofile',{user:req.user})
});

module.exports = router;