var express = require('express');
var router = express.Router();
var config = require('../config/default');
var fRequest = require('../commonUtils/fRquest');
var middlewares = require('../middlewares');

/**
 *  GET register page. 
 *  */
router.get("/", function(req, res) {
    middlewares.getDetailInfoById(req, res);
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
    var requestData = { questionId: id, userId: userId, content: content };
    fRequest.postRequest(config.apiUrl + '/QuestionReply/AddQuestionReplyInfo', requestData, function(error, httpResponse, body) {
        if (error || httpResponse.statusCode != 200 || !body || !body.data || body.data.stateCode != "0000") {
            res.json({ code: 0, message: body.data.stateDesc || "Save data error." });
            return;
        } else {
            res.json({ code: 1, message: "Success." });
        }
    });
});

/**
 * praised reply info
 */
router.route("/praisedreply").post(function(req, res) {
    var loginUrer = middlewares.checkLogin(req);
    if (!loginUrer || loginUrer.id < 1) {
        res.json({ code: 0, message: "Please login." });
        return;
    }
    var replyId = req.body.replyId;
    var userId = loginUrer.id
    if (!replyId || replyId < 1) {
        res.json({ code: 0, message: "Please choose praised reply id." });
        return;
    }
    var requestData = { replyId: replyId, userId: userId };
    fRequest.postRequest(config.apiUrl + '/QuestionReply/AddReplyPraised', requestData, function(error, httpResponse, body) {
        if (error || httpResponse.statusCode != 200 || !body || !body.data || body.data.stateCode != "1") {
            res.json({ code: 0, message: body.data.stateDesc || "Save data error." });
            return;
        } else {
            res.json({ code: 1, message: "Success." });
        }
    });
});

/**
 * get hot reply question info.
 */
router.get("/getHotReplyInfo", function(req, res) {
    middlewares.getHotReplyQuestionInfo(req, res);
});

/**
 * get top view number question info.
 */
router.get("/getTopViewQuestionInfo", function(req, res) {
    middlewares.getTopViewQuestionInfo(req, res);
});

/**
 * Add view visit history.
 */
router.route("/viewInfo").post(function(req, res) {
    var loginUser = middlewares.checkLogin(req);
    var userId = loginUser ? loginUser.id : 0;
    var questionId = req.body.questionId || req.query.questionId;
    if (!questionId || questionId < 1) {
        res.json({ code: 0, message: "Save fail." });
        return;
    }
    var requestData = { questionId: questionId, userId: userId };
    fRequest.postRequest(config.apiUrl + '/Question/AddQuestionViewCount', requestData, function(error, httpResponse, body) {
        if (error || httpResponse.statusCode != 200 || !body || !body.data || body.data.stateCode != "0000") {
            res.json({ code: 0, message: "Save data error." });
            return;
        } else {
            res.json({ code: 1, message: "Success." });
        }
    });
});
module.exports = router;