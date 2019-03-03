const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt');

const User =require('../models/user');

passport.serializeUser((user,done)=>
{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>
{
    User.findById(id).then((user)=>
    {
        done(null,user);
    })
});



passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            console.log('aauaio');
            if (err) { return done(err); }
            if (!user) {
                console.log('galat username')
                return done(null, false, { message: 'Incorrect username.' });
            }
            else{
            bcrypt.compare(password, user.password, function (err, result) {
                var x = Date.now();

                var res =   parseInt(x) - parseInt(user.timestamp);
                
               
                console.log(res/1000);
                if(result == true && res/1000 > 500)
                {
                    user.toki = 1;
                    user.save();
                   return done(null,user);
                }
                
                else if (result == true) {
                    console.log('done here')
                    return done(null,user);
                } else {
                 return done(null, false, { message: 'Incorrect Password.' });
                }
              });
            }
        });
    }
));
