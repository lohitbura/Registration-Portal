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

router.get('/edit',authCheck,(req,res)=>{
    data = req.query.data;
    value = req.query.value;
   console.log("value is",value);
    console.log("data is",data);
   if(value==null || value == "")
   {
        
   }
   else{
    User.findById(req.user.username, function (err, user) {

        console.log(req.user.username);

        if(data=="name")
        {
        req.user.set({name : value})
        }
        if(data=="dob")
        {
            req.user.set({dob : value})
        }
        if(data=="email")
        {
            req.user.set({email : value})
        }
        if(data=="gender")
        {
            req.user.set({gender : value})
        }
        if(data=="mobile")
        {
            req.user.set({mobile : value})   
        }
       
        req.user.save(function (err, updatedTank) {
            
           
        });
    });
}
    

})

router.get('/',authCheck,(req,res)=>{
    console.log('aa gya yha to');
    res.render('cprofile',{user:req.user})
});

module.exports = router;