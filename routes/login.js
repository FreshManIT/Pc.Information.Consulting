var express = require('express');
var router = express.Router();
var config = require('../config/default');
var fRequest = require('../commonUtils/fRquest');
var requirecrypto = require('../commonUtils/AESHelper');
var aesHelper = new requirecrypto(config.session.key || "FreshMan");

/* GET index page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
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

/* GET register page. */
router.route("/register").get(function(req, res) { // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("register", { title: 'User register' });
}).post(function(req, res) {
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;
    var upwd = req.body.upwd;
    User.findOne({ name: uname }, function(err, doc) { // 同理 /login 路径的处理方式
        if (err) {
            res.send(500);
            req.session.error = '网络异常错误！';
            console.log(err);
        } else if (doc) {
            req.session.error = '用户名已存在！';
            res.send(500);
        } else {
            User.create({ // 创建一组user对象置入model
                name: uname,
                password: upwd
            }, function(err, doc) {
                if (err) {
                    res.send(500);
                    console.log(err);
                } else {
                    req.session.error = '用户名创建成功！';
                    res.send(200);
                }
            });
        }
    });
});

/* GET home page. */
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
    res.redirect("/");
});

module.exports = router;