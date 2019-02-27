router = require('express').Router();
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('264048Ar2eGxRl2GwH5c6e36cd');
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
        
       
        req.user.save(function (err, updatedTank) {
            
           
        });
    });
}
    res.send(value);

})

router.post('/change',(req,res)=>{
    console.log("ayaaaaaaa");

    User.findOne({mobile : req.body.mobile}).then((currentuser)=>
            {
                if(currentuser)
                {
                    res.render('/cprofile',{message : "Phone No. Already Exist"});
                }
                else{
                    var otp1 = parseInt(Math.random() * (9999 - 1000) + 1000);
                    var mobile = parseInt(req.body.mobile);
           
            sendOtp.send(mobile, "PRIIND", otp1, function (error, data) {
               
                console.log(data);
                req.session.otp = otp1;
                req.session.mobile = mobile;
                
                res.redirect('/otp/change');
              });
                }
            })  
})

router.get('/',authCheck,(req,res)=>{
    console.log('aa gya yha to');
    res.render('cprofile',{message : null ,user:req.user})
});

module.exports = router;