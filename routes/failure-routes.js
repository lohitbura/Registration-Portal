var router = require('express').Router();

router.use('/login',(req,res)=>
{
    res.render('login',{message : "Wrong Username/Password!!"})
})


module.exports= router;