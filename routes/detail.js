var express = require('express');
var router = express.Router();
var config = require('../config/default');
var fRequest = require('../commonUtils/fRquest');

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



module.exports = router;