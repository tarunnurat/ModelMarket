var url = require('url');
var passport = require('passport')
//#express
var express = require('express');
var app = express();

//------------------------------------------

// # Setup Views
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
// ----------------------

// #Session stuff:
app.use(express.static(__dirname + '/public'))
app.use(express.cookieParser());
app.use(express.bodyParser());

app.use(express.session({secret: 'IMMABEAST'}));

app.use(passport.initialize());
app.use(passport.session());

app.configure(function(){
  //...
  app.use(function(req, res, next){
    res.locals.passport = req.session.passport;
    next();
  });
  //...
});

//--------------------------------

// # Controllers:
// 	This is where the controllers are defined
var models_controller = require('./controllers/models_controller');
var navigation_controller = require('./controllers/navigation_controller');
var authentication_controller = require('./controllers/authentication_controller');

// -----------------------

// # Models:
// 	This is where the model schemas are defined
var model3d = require('./models/model3d_schema');
// -----------------------


// #DB# :
// 	Set Up Data Base and pass it to all routes
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mmdb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("mongo open");
});

global.root_path = __dirname;
console.log(global.root_path);

app.all('*', function(request, response, next)
{
    console.log("goes through here");
    //request.mongoose = mongoose;
    next();
});


// #Routes
app.get('/', navigation_controller.get_home);
app.get('/models/new', models_controller.get_new);
app.post('/models/new', models_controller.post_new);
app.get('/models/:id', models_controller.show);
app.del('/models/:id', models_controller.del);
app.get('/models/:id/buy',  models_controller.get_buy);
app.post('/models/:id/buy',  models_controller.post_buy);

app.get('/logout', authentication_controller.get_logout);
app.get('/login', authentication_controller.get_login);
app.get('/register', authentication_controller.get_register);

app.post('/login', passport.authenticate('local'), authentication_controller.post_login);
app.post('/register', authentication_controller.post_register);

app.listen(process.env.PORT || 3000);