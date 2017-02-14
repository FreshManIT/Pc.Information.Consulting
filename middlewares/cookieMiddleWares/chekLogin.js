var config = require('../../config/default');
var requirecrypto = require('../../commonUtils/AESHelper');
var aesHelper = new requirecrypto(config.session.key || "FreshMan");
var checkLoginUserInfo = function(req) {
    var loginInfo = null;
    var userInfoCook = req.cookies.userInfo;
    if (req.cookies.userInfo) {
        var userInfoCook = req.cookies.userInfo;
        var userModel = JSON.parse(aesHelper.AesDeCoding(userInfoCook));
        if (userModel && userModel.id > 0) {
            loginInfo = {
                name: userModel.userName,
                id: userModel.id
            }
        }
    }
    return loginInfo;
};
module.exports = checkLoginUserInfo;