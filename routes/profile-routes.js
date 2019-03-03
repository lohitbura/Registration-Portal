router = require('express').Router();
var bcrypt = require('bcrypt');
const SendOtp = require('sendotp');
const VoiceIt2WebSDK = require('./../voiceit-node-backend');
const multer = require('multer')();
var VOICEIT_API_KEY = "key_03179856939f45528403238100710595";
var VOICEIT_API_TOKEN = "tok_56df2c2683194982bbaf79eab1efa016";
var BCRYPT_SALT_ROUNDS = 12;
const sendOtp = new SendOtp('264048Ar2eGxRl2GwH5c6e36cd');
sendOtp.setOtpExpiry('5');
const authCheck = (req,res,next)=>
{
    console.log('yha aaya',req.user)
    
     if(!req.user)
    {
        res.redirect('/');
    }
   else if(req.user.toki ==1)
    {
        res.redirect('/user/regularChange');
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

router.get('/deleteMac',authCheck,(req,res)=>
{
    User.findById(req.user.username ,function (err, user)
    {
    
        req.user.set({devices : []})
        req.user.save().then(()=>
        {
            res.redirect('/profile/show');
        })
    })
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
                     currentuser.set({password : hashedPassword , timestamp : Date.now()})
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
                        res.render('cprofile',{user : req.user ,message : "Phone No. Already Exist"});
                    }
                    else{
                        var otp1 = parseInt(Math.random() * (9999 - 1000) + 1000);
                        var mobile = parseInt(req.body.mobile);
               
                sendOtp.send(mobile, "PRIIND", otp1, function (error, data) {
                   
                    console.log(data);
                  //  req.session.otp = otp1;
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


router.get('/addFace', function (req, res) {
	// Upon a successful login, lookup the associated VoiceIt userId
	// const VOICEIT_USERID = VOICEIT_USER_ID_AFTER_DATABASE_LOOKUP;

	// Initialize module and replace this with your own credentials
	const myVoiceIt = new VoiceIt2WebSDK(VOICEIT_API_KEY, VOICEIT_API_TOKEN);

	// Generate a new token for the userId
	// const createdToken = myVoiceIt.generateTokenForUser(VOICEIT_USERID);
	const createdToken = myVoiceIt.generateTokenForUser(req.user.voiceituser);
	res.render('facereco', {token: createdToken})
	// Then return this token to the front end, for example as part of a jsonResponse
  // res.json({
  //   'ResponseCode': 'SUCC',
  //   'Message' : 'Successfully authenticated user',
  //   'Token' : createdToken
  // });
});

router.post('/create', multer.any(), function (req, res) {
	const myVoiceIt = new VoiceIt2WebSDK(VOICEIT_API_KEY, VOICEIT_API_TOKEN);
	myVoiceIt.initBackend(req, res, function(jsonObj){
		const callType = jsonObj.callType.toLowerCase();
		const userId = jsonObj.userId;
		if(jsonObj.jsonResponse.responseCode === "SUCC"){
			// User was successfully verified now log them in via the
			// backend, this could mean starting a new session with
			// their details, after you lookup the user with the
			// provided VoiceIt userId
		}
	});
});

router.get('/status',authCheck, (req,res)=>
{
    req.user.status = 1;
    req.user.save().then((result)=>
    {
        console.log(result)
        res.redirect('/profile/show')
    })
})

router.get('/create',authCheck, (req, res) => {
	const myVoiceIt = new VoiceIt2WebSDK(VOICEIT_API_KEY, VOICEIT_API_TOKEN);
	const createdUser = myVoiceIt.createUser((jsonResponse)=>{
        // console.log(jsonResponse)
    if(jsonResponse.status == 201)
    {
        console.log(req.user);
        req.user.voiceituser = jsonResponse.userId
        req.user.save();
        res.redirect('/profile/show/addFace');
    }
    else{
        res.redirect('/profile/show/');
    }
	  console.log(jsonResponse)
	});
})

router.get('/',authCheck,(req,res)=>{
    console.log('aa gya yha to');
    res.render('cprofile',{message : null ,user:req.user})
});

module.exports = router;