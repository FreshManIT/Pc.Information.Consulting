var express = require('express');
var router = express.Router();
var config = require('../config/default');
var fRequest = require('../commonUtils/fRquest');
var middlewares = require('../middlewares');

/**
 *  GET register page.
 *  */
router.get("/", function(req, res) {
    if (!req.query || !req.query.id || req.query.id < 1) {
        res.redirect("/home");
        return;
    }
    var id = req.query.id;
    fRequest.getRequest(config.apiUrl + '/Question/SearchQustionInfo?pageSize=10&id=' + id, function(error, httpResponse, body) {
        var detailData = {};
        if (error || httpResponse.statusCode != 200 || !body || !body.data || body.data.length != 1) {
            req.session.error = "Data is empty.";
            res.redirect("/home");
            return;
        } else {
            detailData = body.data[0];
            res.locals.detailData = detailData;
            res.render("detail", {
                title: detailData.piFQuestionTitle || "文章详情"
            });
        }
    });
});

/**
 * Post reply data
 */
router.route("/reply").post(function(req, res) {
    var loginUrer = middlewares.checkLogin(req);
    if (!loginUrer || loginUrer.id < 1) {
        res.json({ code: 0, message: "Please login." });
        return;
    }
    var id = req.body.id;
    var userId = loginUrer.id
    var content = req.body.content;
    if (!content || !(content.trim())) {
        res.json({ code: 0, message: "Content info is null." });
        return;
    }
    if (id < 1) {
        res.json({ code: 0, message: "Please reload this page." });
        return;
    }
    res.json({ code: 1, message: "Success." });
});



module.exports = router;