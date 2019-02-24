router = require('express').Router();
keys = require('../config/keys');
var bcrypt = require('bcrypt');


var BCRYPT_SALT_ROUNDS = 12;
router.get('/logout',(req,res)=>
{
	req.session.admin = null;
	res.redirect('/');
})
router.post('/profile',(req,res)=>
{
    if(req.body.username == keys.adminname && req.body.password == keys.adminpassword)
    {
    
            req.session.admin = req.body.username;
      
            
     }
     
      
        if(req.session.admin)
        {
            res.render('adminProfile');
        }
        else
        {
            res.redirect('/');
        }
      
})

router.get('/profile',(req,res)=>
{
    if(req.session.admin)
        {
            res.render('adminProfile');
        }
        else
        {
            res.redirect('/');
        }
})

// router.get('/usersList', function(req, res) {
//     User.find({}, function(err, users) {
//       var userMap = {};
  
//       users.forEach(function(user) {
//         userMap[user._id] = user;
//       });
  
//       res.send(userMap);  
//     });
//   });


    router.get('/deleteUser',(req,res)=>
{

    var  id = req.query.id;
        console.log("aaya aaya aaya"+id)
         User.deleteOne({ _id : id }, function (err) {
//   if (err) return handleError(err);
  // deleted at most one tank document
});
         res.send({
            id:id
         })
})
router.get('/search',(req,res)=>
{
    var data = req.query.data;
    console.log('search',data);
    User.findOne({username : data}).then((currentuser)=>
    {
        if(currentuser)
        {
            res.send({data:currentuser});
        }
    })
})

  router.get('/show-users', function(req, res, next) {
    var perPage = 8;
    var page = Number(req.query.page);
    console.log("here aaya h ")
    User
        .find({})
        .skip((perPage * page))
        .limit(perPage)
        .exec(function(err, users) {

            User.count().exec(function(err, total) {
                 if (err) return next(err);
                res.send({
                    users: users,
                    total: total,
                    current: page,
                    count: Math.min(perPage, total-(perPage*page)),
                    pages: Math.ceil(total / perPage)

                })
            })
        })
});

router.use('/',(req,res)=>
{
    res.render('adminLogin');
})


module.exports = router;