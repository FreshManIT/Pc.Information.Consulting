var $name = $("#userName"),
    $userId = $("#userId"),
    socket, host = location.host,
    $screen = $("#screen"),
    $userList = $("#userList"),
    to, $content = $("#content"),
    $msg = $("#msg");

function InitChat() {
    var name = $name.val();
    window.id = $userId.val();
    if (!name) {
        location.href = "/login";
        return false;
    }
    $screen.animate({
        "left": "-0%"
    }, 800);
    socket = io.connect('ws://' + host);
    socket.emit('newUser', {
        user_name: name,
        user_id: id
    });
    socket.on('onlineCount', function(data) {
        var len = data.length
        if (len > 1) {
            $("#ul").html("匹配中，请稍后...");
            socket.on('getChat', function(data, nameList) { //如果广播到用户包含自己，则匹配聊天
                if (data.p1 == id) {
                    to = data.p2;
                } else if (data.p2 == id) {
                    to = data.p1;
                }
                var name = nameList[to];
                if (to) {
                    $screen.animate({
                        "left": "-100%"
                    }, 800)
                    $("#nickname").text("与" + name + "聊天中...")
                    $("#ul").css("display", "none")
                }
            });
        } else {
            $("#ul").html("当前服务器只有您一位空闲用户，请等待其他用户加入<br><br><p style='text-align:center'>来自：QQ1174632606</p>")
        }
    });

    socket.on('addCount', function(data) { //在线用户增加
        $("#count").text(data)
    })

    socket.on('getMsg', function(data) { // 接收消息
        var html = '<div class="clearfix"><p class="chat-box-l">' + replace_em(data.msg) + '</p></div>'
        $content.append(html)
        toBottom()
    })

    socket.on('getImg', function(data) { // 接收图片
        var html = '<div class="clearfix"><p class="chat-box-l"><img class="check" src="' + replace_em(data.msg) + '"/></p></div>'
        $content.append(html)
        toBottom()
    })


    socket.on('offline', function(data) { // 对方下线提示
        if (to == data.id) {
            alert("对方用户已退出聊天，刷新或关闭页面将删除所有聊天内容！")
            $("#nickname").text("对方已经退出，刷新页面重新匹配")
            $msg.attr("disabled", "disabled")
        }
    })

    socket.on('err', function(data) { // 对面下线后继续发送信息，将报错提示
        alert(data.msg)
    })

}

$(document).ready(function() {
    var h = window.innerHeight
    var c_h = h - $("#nickname").height() - $(".text").height() - 40
    $("#content").css("height", c_h + "px")
})
InitChat();

$("#send").click(function() {
    sendMsg("msg");
})

$msg.keydown(function(e) { //绑定回车键
    if (e.keyCode === 13) {
        e.preventDefault();
        sendMsg("msg");
    }
});

$(".back").on('click', function() { // 返回后刷新页面，解放socket
    $screen.animate({
        "left": 0
    }, 800, function() {
        location.reload()
    })
})

function replace_em(str) { // 匹配表情字符
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\n/g, '<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="images/face/$1.gif" border="0" />');
    return str;
}
$('#emotion').qqFace({ //表情转换
    id: 'facebox', //表情盒子的ID
    assign: 'msg', //给那个控件赋值
    path: 'images/face/' //表情存放的路径
});
$msg.blur(function() {
    $("#facebox").css("display", "none");
})

$("#img").click(function() { //模拟file控件点击
    $("#photo").click();

})

$("#photo").change(function() { // 选中图片后出现弹窗
    var reader = new FileReader();
    reader.onload = function(e) {
        $("#preview").attr("src", this.result);
        $("#previewBox").css("display", "block");
    }
    reader.readAsDataURL(this.files[0]);
})

$("#sendImg").click(function() {
    var img = $("#preview").attr("src")
    socket.emit('sendImg', {
        msg: img,
        to: to
    });
    $("#previewBox").css("display", "none");
    sendMsg("img");
})

$("body").delegate('.check', 'click', function() {
    var img = $(this).attr("src");
    $("#check").attr("src", img)
    $("#scan").css("display", "block").click(function() {
        $(this).css("display", "none")
    })
})

$content.click(function() {
    $msg.blur()
})

function toBottom() { // 接收新消息时，聊天框自动滚到最下方
    var top = $content[0].scrollHeight
    $content.scrollTop(top)
}

function sendMsg(type) { // 发送消息函数
    if (type == "msg") {
        var msg = $("#msg").val()
        if ($.trim(msg) == "") { //不能发送空值
            $("#msg").val("")
            return false
        }
        socket.emit('message', {
            msg: msg,
            to: to
        });
        var html = '<div class="clearfix"><p class="chat-box-r">' + replace_em(msg) + '</p></div>';
        $content.append(html);
        $("#msg").val("").blur() // 发送信息后置空，失焦 
    } else {
        var msg = $("#preview").attr("src")
        var html = '<div class="clearfix"><p class="chat-box-r"><img class="check" src="' + replace_em(msg) + '"/></p></div>';
        $content.append(html);
    }
    toBottom();
}