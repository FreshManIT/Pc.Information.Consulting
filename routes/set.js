var express = require('express');
var router = express.Router();
var config = require('../config/default');
var fRequest = require('../commonUtils/fRquest');
var middlewares = require('../middlewares');

router.route("/").get(function(req, res) {
    res.render("set", { title: '账号设置' });
});

module.exports = router;