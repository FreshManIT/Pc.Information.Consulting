module.exports = {
    //error handler init.
    errorHandler: function(app, err, req, res, next) {
        var errorHandlerModule = require('./errorMiddleWares/errorHandler');
        errorHandlerModule(app);
    },
    //socket server init.
    socketInit: function(http) {
        var socketHandlerModule = require('./socketMiddleWares/socketServer');
        socketHandlerModule(http);
    },
    //check login
    checkLogin: function(req) {
        var checkHandlerModule = require('./cookieMiddleWares/chekLogin');
        return checkHandlerModule(req);
    },
    //get question detail info.
    getDetailInfoById: function(req, res) {
        var getDetailInfoModule = require('./detailPageMiddleWares/detailPageServer');
        getDetailInfoModule(req, res);
    }
};