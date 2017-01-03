var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var config=require('config-lite');
var session = require('express-session');

var app = express();

//custormer middlewares
var routes = require('./routes');
var middlewares=require('./middlewares');

app.use(session({ 
  name:config.session.key,
	secret: config.session.secret,
	cookie:{ 
		maxAge: config.session.maxAge
	}
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express); // or   app.engine
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){ 
  res.locals.user = req.session.user || {};
	var err = req.session.error;
	delete req.session.error;
	res.locals.message = "";
	if(err){ 
		res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
	}
	next();
});

//路由
routes(app);

// error handlers
middlewares.errorHandler(app);

module.exports = app;