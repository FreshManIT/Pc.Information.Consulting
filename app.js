var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var config = require('config-lite');
var session = require('express-session');
var requirecrypto = require('./commonUtils/AESHelper');
var aesHelper = new requirecrypto(config.session.key || "FreshMan");

var app = express();

//custormer middlewares
var routes = require('./routes');
var middlewares = require('./middlewares');
var requirecrypto = require('./commonUtils/AESHelper');
var aesHelper = new requirecrypto(config.session.key || "FreshMan");

/**
 * session
 */
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    }
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html", require("ejs-locals")); // or   app.engine
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * deal error and get login user model.
 */
app.use(function(req, res, next) {
    res.locals.user = {};
    var userInfoCook = req.cookies.userInfo;
    if (req.cookies.userInfo) {
        var userInfoCook = req.cookies.userInfo;
        var userModel = JSON.parse(aesHelper.AesDeCoding(userInfoCook));
        if (userModel && userModel.id > 0) {
            res.locals.user = {
                name: userModel.userName,
                id: userModel.id,
                rule: userModel.rule
            }
        }
    }
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = "";
    if (err) {
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>';
    }
    next();
});

//路由
routes(app);

// error handlers
middlewares.errorHandler(app);

module.exports = app;