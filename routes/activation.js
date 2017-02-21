var express = require('express');
var router = express.Router();
var config = require('../config/default');
var fRequest = require('../commonUtils/fRquest');
var middlewares = require('../middlewares');
var checkData = require('../commonUtils/checkDataType');

router.route("/").get(function(req, res) {
    var key = req.query.key;
    if (!key || key == "") {
        res.render("activation", { title: "激活邮箱", activationState: 0 });
        return;
    }
    fRequest.getRequest(config.apiUrl + '/LoginUser/ActivationEmail?activationKey=' + key, function(error, httpResponse, body) {
        if (error || httpResponse.statusCode != 200 || !body || !body.data) {
            res.render("activation", { title: "激活邮箱", activationState: 0 });
            return;
        } else {
            res.render("activation", { title: "激活邮箱", activationState: body.data });
        }
    });
});

module.exports = router;