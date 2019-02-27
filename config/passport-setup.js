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
                if (result == true) {
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
