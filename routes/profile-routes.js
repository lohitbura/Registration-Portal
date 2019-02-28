router = require('express').Router();
var bcrypt = require('bcrypt');
const SendOtp = require('sendotp');
var BCRYPT_SALT_ROUNDS = 12;
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
router.use('/changePass',authCheck,(req,res)=>
{
    User.findOne({username : req.user.username}).then((currentuser)=>
    {
        bcrypt.compare(req.body.oldpassword, currentuser.password, function (err, result) {
            if (result == true) {
                bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)  // encryption of password
                .then(function(hashedPassword) {
                 return( 
                     currentuser.set({password : hashedPassword})
                 )})
                 .then(function() {
              
                   currentuser.save(function (err, updatedTank) {
                    res.redirect('/profile/show');
                    
                })
                   
                })
            } else {
             res.render('cprofile',{message : "Incorrect Password"})
            }
          });
    })
})
router.use('/changepassword',authCheck,(req,res)=>
{
    res.render('changePassword',{message : null});
})
router.post('/change',authCheck,(req,res)=>{
    console.log("ayaaaaaaa");
    User.findOne({username : req.user.username}).then((cuser)=>
    {
        bcrypt.compare(req.body.password, cuser.password, function (err, result) {
            if(result==true)
            {
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
            }
            else{
                res.render('cprofile',{user: req.user ,message : "password was incorrect"})
            }
        })
    })
    
})

router.get('/',authCheck,(req,res)=>{
    console.log('aa gya yha to');
    res.render('cprofile',{message : null ,user:req.user})
});

module.exports = router;