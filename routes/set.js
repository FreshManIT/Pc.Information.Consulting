var express = require('express');
var router = express.Router();
var config = require('../config/default');
var fRequest = require('../commonUtils/fRquest');
var middlewares = require('../middlewares');
var checkData = require('../commonUtils/checkDataType');

router.route("/").get(function(req, res) {
    var loginUrer = middlewares.checkLogin(req);
    if (!loginUrer || loginUrer.id < 1) {
        res.redirect("/login");
        return;
    }
    var userId = loginUrer.id;
    fRequest.getRequest(config.apiUrl + '/LoginUser/SearchUserInfoByUserId?userId=' + userId, function(error, httpResponse, body) {
        if (error || httpResponse.statusCode != 200 || !body || !body.data || body.data.id < 1) {
            res.redirect("/login");
            return;
        } else {
            res.render("set", { title: "用户设置", userModel: body.data });
        }
    });
});

/**
 * updata user userModel
 */
router.route("/updatauserInfo").post(function(req, res) {
    var loginUrer = middlewares.checkLogin(req);
    if (!loginUrer || loginUrer.id < 1) {
        res.json({ code: 0, msg: "请先登录" });
        return;
    }
    var email = req.body.email;
    var sex = req.body.sex;
    var job = req.body.job;
    var birthday = req.body.birthday;
    var password = req.body.password;
    if (!checkData.IsEmailAddress(email)) {
        res.json({ code: 0, msg: "邮箱格式不正确" });
        return;
    }
    if (!sex || !job || job == "" || !birthday || birthday == "" || !password || password == "") {
        res.json({ code: 0, msg: "必填项必填" });
        return;
    }
    var data = {
        PiFUserName: loginUrer.name,
        PiFPassword: password,
        PiFRule: loginUrer.rule,
        PiFJob: job,
        PiFEmailAddress: email,
        PiFSex: sex,
        PiFBirthday: birthday,
        password: password
    };
    fRequest.postRequest(config.apiUrl + '/LoginUser/UpdateUserInfo', data, function(error, httpResponse, body) {
        if (error || httpResponse.statusCode != 200 || !body || !body.data || body.data.id < 1) {
            res.json({ code: 0, msg: "更新失败" });
            return;
        } else {
            res.json({ code: 1, msg: "保存成功" });
            return;
        }
    });
});
module.exports = router;