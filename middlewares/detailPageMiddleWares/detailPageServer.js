var config = require('../../config/default');
var fRequest = require('../../commonUtils/fRquest');
var rp = require('request-promise');

var options = {
    method: 'POST',
    url: "",
    body: {},
    json: true
};

/**
 * Get question detail
 */
var getDetailInfo = function(req, res) {
    var detailData = {};
    if (!req.query || !req.query.id || req.query.id < 1) {
        res.redirect("/home");
        return;
    }
    var questionId = req.query.id;

    options.url = config.apiUrl + '/Question/SearchQustionInfo?pageSize=10&id=' + questionId;
    rp(options)
        .then(function(questionData) {
            detailData = questionData.data[0];
            res.locals.detailData = detailData;
            res.render("detail", {
                title: detailData.piFQuestionTitle || "文章详情"
            });
        })
        .catch(function(err) {
            console.log(JSON.stringify(err));
            detailData.message += JSON.stringify(err);
        });
};

/**
 * GetHotReplyQuestionInfo 
 */
var getHotReplyQuestionInfo = function(req, res) {
    var hotReplyData = {};
    options.url = config.apiUrl + '/Question/GetHotReplyQuestionInfo';
    rp(options)
        .then(function(questionData) {
            hotReplyData = questionData;
            res.json(hotReplyData);
        })
        .catch(function(err) {
            res.json(hotReplyData);
        });
};

module.exports = getDetailInfo;