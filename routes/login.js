var express = require('express');
var router = express.Router();
var config = require('../config/default');
var fRequest = require('../commonUtils/fRquest');
var requirecrypto = require('../commonUtils/AESHelper');
var aesHelper = new requirecrypto(config.session.key || "FreshMan");

/* GET index page. */
router.get('/', function(req, res, next) {
    if (req.cookies.userInfo) { //到达/home路径首先判断是否已经登录
        var userInfoCook = req.cookies.userInfo;
        var userModel = JSON.parse(aesHelper.AesDeCoding(userInfoCook));
        res.render("home", {
            title: '信息咨询系统',
            user: {
                name: userModel.userName,
                id: userModel.id
            }
        });
    }
    res.render('home', { title: '信息咨询系统' });
});

/* GET login page. */
router.route("/login").get(function(req, res) {
    res.render("login", { title: '用户登录' });
}).post(function(req, res) { // get post for login.
    var uname = req.body.uname; //get post uname data.
    var password = req.body.upwd; //get post password data
    if (!uname || !password) {
        req.session.error = "用户名或密码必填";
        res.send(404);
        return;
    }
    password = aesHelper.AesEnCoding(password);
    fRequest.getRequest(config.apiUrl + '/LoginUser/Login?userName=' + uname + '&password=' + password, function(error, httpResponse, body) {
        if (error || httpResponse.statusCode != 200 || !body || !body.data) {
            req.session.error = "用户名或密码错误";
            res.send(404);
            return;
        }
        //TODO data check.
        var user = { userName: uname, id: body.data.id };
        var userCook = aesHelper.AesEnCoding(JSON.stringify(user));
        res.cookie('userInfo', userCook, { maxAge: 1000 * 60 * 60 * 24 });
        res.redirect('/home');
    });
});

/**
 *  GET register page.
 *  */
router.route("/register").get(function(req, res) {
    res.render("register", { title: '用户注册' });
}).post(function(req, res) {
    var uname = req.body.uname;
    var password = req.body.upwd;
    var emailAddress = req.body.emailAddress;
    if (!uname || !password) {
        req.session.error = "用户名或密码必填";
        res.send(404);
        return;
    }
    password = aesHelper.AesEnCoding(password);
    fRequest.getRequest(config.apiUrl + '/LoginUser/RegisterUser?userName={0}&password={1}&emailAddress={2}&birthday=1900-01-01'.Format(uname, password, emailAddress), function(error, httpResponse, body) {
        if (error || httpResponse.statusCode != 200 || !body || !body.data) {
            req.session.error = "输入信息有误";
            res.send(404);
            return;
        } else if (body.data.stateCode != "0000") {
            req.session.error = body.data.stateDesc;
            res.send(404);
            return;
        }
        res.redirect('/login');
    });
});

/**
 *  GET home page.
 *  */
router.get("/home", function(req, res) {
    if (!req.cookies.userInfo) { //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login"); //未登录则重定向到 /login 路径
        return;
    } else {
        var userInfoCook = req.cookies.userInfo;
        var userModel = JSON.parse(aesHelper.AesDeCoding(userInfoCook));
        if (!userModel || userModel.id < 1) {
            req.session.error = "请先登录"
            res.redirect("/login");
            return;
        }
        res.render("home", {
            title: '信息咨询系统',
            user: {
                name: userModel.userName,
                id: userModel.id
            }
        });
    }
});

/**
 * GET logout page.
 */
router.get("/logout", function(req, res) { // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.cookies.userInfo = null;
    req.session.user = null;
    req.session.error = null;
    res.cookie('userInfo', null, { maxAge: 0 });
    res.redirect("/");
});

module.exports = router;