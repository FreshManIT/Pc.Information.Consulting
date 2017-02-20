var express = require('express');
var router = express.Router();
var config = require('../config/default');
var requirecrypto = require('../commonUtils/AESHelper');
var aesHelper = new requirecrypto(config.session.key || "FreshMan");

/**
 *  GET index page.
 * */
router.get('/', function(req, res, next) {
    var _username = "";
    var _userId = 0;
    var _rule = 0;
    //get chat page need login.
    if (!req.cookies.userInfo) {
        req.session.error = "Please login."
        res.redirect("/login");
        return;
    } else {
        var userInfoCook = req.cookies.userInfo;
        var userModel = JSON.parse(aesHelper.AesDeCoding(userInfoCook));
        if (!userModel || userModel.id < 1) {
            req.session.error = "Please login."
            res.redirect("/login");
            return;
        }
        _username = userModel.userName;
        _userId = userModel.id;
        _rule = userModel.rule || 0;
    }
    res.render('chat', { title: '欢迎进入咨询系统', username: _username, userId: _userId, rule: _rule });
});

module.exports = router;