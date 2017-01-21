module.exports = function(http) {
    var fRequest = require('../../commonUtils/fRquest');
    var config = require('../../config/default');
    var io = require('socket.io')(http);
    var userServer = {};
    var userList = {};
    var freeList = [];
    var count = 0;
    io.on('connection', function(socket) {
        count += 1;
        socket.on('newUser', function(data) {
            var nickname = data.user_name,
                user_id = data.user_id;
            socket.id = user_id;
            userServer[user_id] = socket;
            userList[user_id] = nickname
            freeList.push(user_id)
            io.emit('onlineCount', freeList)
            io.emit('addCount', count)
            if (freeList.length > 1) {
                var from = user_id;
                Arrayremove(freeList, from)
                if (freeList.length == 1) {
                    n = 0
                } else {
                    n = Math.floor(Math.random() * freeList.length)
                }
                var to = freeList[n]
                Arrayremove(freeList, to)
                io.emit("getChat", { p1: from, p2: to }, userList)
            }
        })
        socket.on('disconnect', function() { //用户注销登陆执行内容
            count -= 1;
            var id = socket.id
            Arrayremove(freeList, id)
            delete userServer[id]
            delete userList[id]
            io.emit('onlineCount', freeList)
            io.emit('offline', { id: id })
            io.emit('addCount', count)
        })
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
    })

    function Arrayremove(array, name) {
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (array[i] == name) {
                array.splice(i, 1)
                break
            }
        }
    }
}