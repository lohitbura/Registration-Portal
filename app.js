var express = require('express');
var passport = require('passport');
var passportSetup= require('./config/passport-setup');
var app = express();

var adminRouter = require('./routes/admin-routes');
var verifyRouter = require('./routes/verify-routes');
var showRoutes = require('./routes/showRouter');
var otpRouter = require('./routes/otp-routes');
var profileRouter = require('./routes/profile-routes');
var localRouter = require('./routes/local-routes');
var forgotRouter = require('./routes/forgot-routes');
var profilePicRouter = require('./routes/profilePic-routes');
var failureRouter = require('./routes/failure-routes');
// var fs = require('fs')
// var https = require('https');
var path = require('path');
var multer = require('multer');
app.use(express.static(path.join(__dirname,'public')));


var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

var mongoose = require('mongoose');

mongoose.connect("mongodb://lohit:bharat123auth@ds139435.mlab.com:39435/bharat",{ useNewUrlParser: true });
//var db = mongoose.connection;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: false,
   store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {maxAge : 60*60*1000 }
}));



app.use((req,res,next)=>
{
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public')); 

app.use('/failure',failureRouter);
app.use('/otp',otpRouter);
app.use('/user',localRouter);
app.use('/verify',verifyRouter);
app.use('/profile/show',profileRouter);
app.use('/forgot',forgotRouter);
app.use('/admin',adminRouter);
app.use('/profilePic',profilePicRouter);
app.use('/',showRoutes);


 //app = require("https-localhost");
//  var options = {
//     key: fs.readFileSync( './localhost.key' ),
//     cert: fs.readFileSync( './localhost.cert' ),
//     requestCert: false,
//     rejectUnauthorized: false
// };


//var server = https.createServer( options, app );
var port = process.env.PORT || 3000;

app.listen( port, function () {
    console.log( 'Express server listening on port ' );
} );