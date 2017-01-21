var express = require('express');
var router = express.Router();
var config = require('../config/default');
var requirecrypto = require('../commonUtils/AESHelper');
var aesHelper = new requirecrypto(config.session.key || "FreshMan");

/* GET index page. */
router.get('/', function(req, res, next) {
    var _username = "";
    var _userId = 0;
    if (!req.cookies.userInfo) { //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login"); //未登录则重定向到 /login 路径
    } else {
        var userInfoCook = req.cookies.userInfo;
        var userModel = JSON.parse(aesHelper.AesDeCoding(userInfoCook));
        if (!userModel || userModel.id < 1) {
            req.session.error = "请先登录"
            res.redirect("/login");
            return;
        }
        _username = userModel.userName;
        _userId = userModel.id;
    }
    res.render('chat', { title: '欢迎进入咨询系统', username: _username, userId: _userId });
});

module.exports = router;