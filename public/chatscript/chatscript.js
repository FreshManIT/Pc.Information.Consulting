var $name = $("#userName"),
    $userId = $("#userId"),
    $rule = $("#rule"),
    socket, host = location.host,
    $screen = $("#screen"),
    $userList = $("#userList"),
    to, $content = $("#content"),
    $msg = $("#msg");

function InitChat() {
    var name = $name.val();
    var rule = $rule.val();
    window.id = $userId.val();
    if (!name || !window.id || window.id < 1) {
        location.href = "/login";
        return false;
    }
    $screen.animate({
        "left": "-0%"
    }, 800);
    socket = io.connect('ws://' + host);
    //发送消息通知服务器有新用户需要加入
    socket.emit('newUser', {
        user_name: name,
        user_id: id,
        user_rule: rule
    });
    //监听服务器返回的在线人数
    socket.on('onlineCount', function(data) {
        var serverLength = data.freeServerList.length;
        var freeCustomerLength = data.freeList.length;
        //用户自动匹配
        if (serverLength > 0 && rule == 0) {
            $("#ul").html("匹配中，请稍后...");
        } else {
            $("#ul").html("当前服务器有" + freeCustomerLength + "位用户排队中，" + serverLength + "位服务者在线忙碌，请等待……<br><br><p style='text-align:center'>来自：系统通知</p>")
        }
    });
    //如果广播到用户包含自己，则匹配聊天
    socket.on('getChat', function(data, nameList) {
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
    //在线用户增加
    socket.on('addCount', function(data) {
        $("#count").text(data.freeServerListCount);
    });

    //接收消息
    socket.on('getMsg', function(data) {
        var html = '<div class="clearfix"><p class="chat-box-l">' + replace_em(data.msg) + '</p></div>'
        $content.append(html)
        toBottom()
    });

    //接收图片
    socket.on('getImg', function(data) {
        var html = '<div class="clearfix"><p class="chat-box-l"><img class="check" src="' + replace_em(data.msg) + '"/></p></div>'
        $content.append(html);
        toBottom()
    });

    //对方下线提示
    socket.on('offline', function(data) {
        if (to == data.id) {
            alert("对方用户已退出聊天，刷新或关闭页面将删除所有聊天内容！")
            $("#nickname").text("对方已经退出，刷新页面重新匹配")
            $msg.attr("disabled", "disabled")
        }
    });

    // 对面下线后继续发送信息，将报错提示
    socket.on('err', function(data) {
        alert(data.msg)
    });
}

/**
 * 初始化
 */
$(document).ready(function() {
    var h = window.innerHeight;
    var c_h = h - $("#nickname").height() - $(".text").height() - 40;
    $("#content").css("height", c_h + "px");
    InitChat();
});

/**
 * 绑定发送按钮事件
 */
$("#send").click(function() {
    sendMsg("msg");
});

//绑定回车键
$msg.keydown(function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        sendMsg("msg");
    }
});

// 返回后刷新页面，解放socket
$(".back").on('click', function() {
    $screen.animate({
        "left": 0
    }, 800, function() {
        location.reload()
    })
});

// 匹配表情字符
function replace_em(str) {
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\n/g, '<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="images/face/$1.gif" border="0" />');
    return str;
};
//表情转换
$('#emotion').qqFace({
    id: 'facebox', //表情盒子的ID
    assign: 'msg', //给那个控件赋值
    path: 'images/face/' //表情存放的路径
});

$msg.blur(function() {
    $("#facebox").css("display", "none");
});
//模拟file控件点击
$("#img").click(function() {
    $("#photo").click();
});

// 选中图片后出现弹窗
$("#photo").change(function() {
    var reader = new FileReader();
    reader.onload = function(e) {
        $("#preview").attr("src", this.result);
        $("#previewBox").css("display", "block");
    }
    reader.readAsDataURL(this.files[0]);
});

/**
 * 发送图片按钮事件绑定
 */
$("#sendImg").click(function() {
    var img = $("#preview").attr("src");
    socket.emit('sendImg', {
        msg: img,
        to: to
    });
    $("#previewBox").css("display", "none");
    sendMsg("img");
});

$("body").delegate('.check', 'click', function() {
    var img = $(this).attr("src");
    $("#check").attr("src", img)
    $("#scan").css("display", "block").click(function() {
        $(this).css("display", "none")
    })
});

$content.click(function() {
    $msg.blur();
});

// 接收新消息时，聊天框自动滚到最下方
function toBottom() {
    var top = $content[0].scrollHeight
    $content.scrollTop(top)
}

// 发送消息函数
function sendMsg(type) {
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