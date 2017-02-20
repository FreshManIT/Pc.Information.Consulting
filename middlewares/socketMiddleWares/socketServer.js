module.exports = function(http) {
    var fRequest = require('../../commonUtils/fRquest');
    var config = require('../../config/default');
    var io = require('socket.io')(http);
    var userServer = {};
    var userList = {};
    var freeList = [];
    var freeServerList = [];
    var onlineCount = 0;
    io.on('connection', function(socket) {
        socket.on('newUser', function(data) {
            var user_nickname = data.user_name,
                user_id = data.user_id,
                user_rule = data.user_rule;
            //user id
            socket.id = user_id;
            socket.rule = user_rule;
            //user socket object
            userServer[user_id] = socket;
            //online user name
            userList[user_id] = user_nickname;
            //add new online user id to freeList
            if (user_rule == 0) {
                freeList.push(user_id);
            } else {
                freeServerList.push(user_id);
            }
            AddNewUser(user_id, user_nickname, user_rule);
            //广播在线空闲用户id
            io.emit('onlineCount', { freeList: freeList, freeServerList: freeServerList });
            //广播在线人数
            io.emit('addCount', { freeListCount: freeList.length, freeServerListCount: freeServerList.length });
            if (user_rule == 0) {
                if (freeServerList.length > 0) {
                    var from = user_id;
                    //重置自身状态为非空闲
                    Arrayremove(freeList, from);
                    //筛选一个服务者用户进行咨询
                    if (freeServerList.length == 1) {
                        n = 0;
                    } else {
                        n = Math.floor(Math.random() * freeServerList.length);
                    }
                    var to = freeServerList[n];
                    //重置已选用户状态为非空闲态
                    Arrayremove(freeServerList, to);
                    //发送消息配对成功
                    io.emit("getChat", { p1: from, p2: to }, userList);
                    //广播在线空闲用户id
                    io.emit('onlineCount', { freeList: freeList, freeServerList: freeServerList });
                    //广播在线人数
                    io.emit('addCount', { freeListCount: freeList.length, freeServerListCount: freeServerList.length });
                }
            }
        });
        //用户注销登陆执行内容
        socket.on('disconnect', function() {
            var id = socket.id;
            var rule = socket.rule;
            ReMoveUser(id || 0, userList[id], rule);
            if (rule == 0) {
                Arrayremove(freeList, id);
            } else {
                Arrayremove(freeServerList, id);
            }
            delete userServer[id];
            delete userList[id];
            io.emit('onlineCount', { freeList: freeList, freeServerList: freeServerList });
            io.emit('offline', { id: id });
            io.emit('addCount', { freeListCount: freeList.length, freeServerListCount: freeServerList.length });
        });
        socket.on('message', function(data) {
            if (userServer.hasOwnProperty(data.to)) {
                userServer[data.to].emit('getMsg', { msg: data.msg });
                //write history info.
                fRequest.getRequest(config.apiUrl + '/ChatInfoHistory/AddChatInfo?fromId={0}&toId={1}&groupId={2}&contentType={3}&content={4}'.Format(socket.id, data.to, 0, 0, encodeURIComponent(data.msg)));
            } else {
                socket.emit("err", { msg: "对方已经下线或者断开连接" })
            }
        })
        socket.on('sendImg', function(data) {
            if (userServer.hasOwnProperty(data.to)) {
                //消息发送
                userServer[data.to].emit('getImg', { msg: data.msg });
                //记录消息
                var postData = {
                    fromId: socket.id,
                    toId: data.to,
                    groupId: 0,
                    contentType: 1,
                    content: encodeURIComponent(data.msg)
                };
                fRequest.postRequest(config.apiUrl + '/ChatInfoHistory/AddChatInfo', postData);
            } else {
                //离线状态
                socket.emit("err", { msg: "对方已经下线或者断开连接" })
            }
        })
    });

    /**
     * 移除用户
     */
    function Arrayremove(array, name) {
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (array[i] == name) {
                array.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 获取指定类型的用户列表
     */
    function GetUserList(ruleType) {
        fRequest.getRequest(config.apiUrl + '/ChatInfoHistory/GetAllOnlineUserModels?ruleType={0}'.Format(ruleType), function(error, httpResponse, body) {
            if (error || httpResponse.statusCode != 200 || !body || !body.data) {
                return [];
            }
            return body.data;
        });
    }

    /**
     * Add new Online user.
     */
    function AddNewUser(userId, userName, ruleType) {
        fRequest.getRequest(config.apiUrl + '/ChatInfoHistory/AddOnlineUser?userId={0}&userName={1}&ruleType={2}'.Format(userId, userName, ruleType), function(error, httpResponse, body) {
            if (error || httpResponse.statusCode != 200 || !body || !body.data) {
                //Add new user into redis error .
            }
            onlineCount = body.data;
        });
    }

    /**
     * 删除下线用户
     */
    function ReMoveUser(userId, userName, ruleType) {
        fRequest.getRequest(config.apiUrl + '/ChatInfoHistory/RemoveOnlineUser?userId={0}&userName={1}&ruleType={2}'.Format(userId, userName, ruleType), function(error, httpResponse, body) {
            if (error || httpResponse.statusCode != 200 || !body || !body.data) {
                //Add new user into redis error .
            }
            onlineCount = body.data;
        });
    }
}