var getSearchQuestionInfo = function() {
    var title = $(".layui-input").val();
    if (!title || title == "") return;
    $.ajax({
        url: '/home',
        type: 'post',
        data: { title: title },
        success: function(data, status) {
            if (!data || !data.data) return;
            var hotQuestionList = data.data;
            drawQuestionInfo(hotQuestionList, "#showSearchData", false);
        },
        error: function(err) {}
    });
};

var getTopViewQuestionInfo = function() {
    $.ajax({
        url: '/detail/getTopViewQuestionInfo',
        type: 'get',
        success: function(data, status) {
            if (!data || !data.data) return;
            var hotQuestionList = data.data;
            var showStr = "";
            if (hotQuestionList.length == 0) {
                showStr = "暂无数据";
            } else {
                hotQuestionList.forEach(function(item, index) {
                    showStr += "<li><a href='/detail?id=" + item.id + "'>" + item.piFQuestionTitle + "</a><span><i class='iconfont'>&#xe60b;</i>" + item.viewCount + "</span>                    </li>";
                });
                $("#topViewQuestionList").append(showStr);
            }
        },
        error: function(err) {}
    });
};

var getHotReplyQuestionInfo = function() {
    $.ajax({
        url: '/detail/getHotReplyInfo',
        type: 'get',
        success: function(data, status) {
            if (!data || !data.data) return;
            var hotQuestionList = data.data;
            var showStr = "";
            if (hotQuestionList.length == 0) {
                showStr = "暂无数据";
            } else {
                hotQuestionList.forEach(function(item, index) {
                    showStr += "<li><a href='/detail?id=" + item.id + "'>" + item.piFQuestionTitle + "</a><span><i class='iconfont'>&#xe60c;</i>" + item.countNumber + "</span>                    </li>";
                });
                $("#hotQuestionList").append(showStr);
            }
        },
        error: function(err) {}
    });
};

var getMoreQuestionInfo = function() {
    var pageIndex = $("#hiddentPageIndex").val();
    pageIndex = (!pageIndex || pageIndex < 2) ? 2 : pageIndex;
    $.ajax({
        url: '/home/more?pageIndex=' + pageIndex,
        type: 'get',
        success: function(data, status) {
            if (!data || !data.data) return;
            var hotQuestionList = data.data;
            drawQuestionInfo(hotQuestionList, "#showSearchData", true);
            pageIndex = pageIndex + 1;
            $("#hiddentPageIndex").val();
            if (!hotQuestionList || hotQuestionList.length < 10) {
                $(".laypage-next").html("别點了，到头了~");
            }
        },
        error: function(err) {}
    });
};

var drawQuestionInfo = function(questionList, showId, isAppend) {
    var showStr = "";
    if (questionList.length == 0) {} else {
        questionList.forEach(function(item, index) {
            showStr += '<li class="fly-list-li"><h2 class="fly-tip"><a href="/detail?id=' + item.id + '">' + item.piFQuestionTitle + '</a><span class="fly-tip-stick">置顶</span><span class="fly-tip-jing">精</span></h2><p><span>作者：' + item.piFSendUserName + '</span><span>发布时间：' + new Date(item.piFCreateTime).Format("yyyy-MM-dd hh:ss:mm") + '</span><span class="fly-list-hint"><i class="iconfont" title="人气">&#xe60b;</i> ' + item.viewCount + '</span></p></li>';
        });
    }
    if (isAppend) {
        $(showId).append(showStr);
    } else {
        $(showId).html(showStr);
    }
};

var getHotUserList = function() {
    $.ajax({
        url: "/home/gethotuserlist",
        type: "get",
        success: function(data, status) {
            if (!data || !data.data) return;
            var hotUserList = data.data;
            var showStr = "";
            if (hotUserList && hotUserList.length > 0) {
                hotUserList.forEach(function(item, index) {
                    showStr += '<a><img src = "../fly-master/res/images/avatar/default.png" ><cite>' + item.viewCount + '次回答</cite> <i>' + item.piFUserName + '</i></a>';
                });
            }
            $("#showHotUser").html(showStr);
        },
        error: function(err) {}
    });
};

$(function() {
    $(".icon-sousuo").click(function() {
        getSearchQuestionInfo();
    });
    $(".laypage-next").click(function() {
        getMoreQuestionInfo();
    });
    getHotUserList();
    getHotReplyQuestionInfo();
    getTopViewQuestionInfo();
});

//keyDown
function keyDown(e) {
    var keycode = 0;
    //IE浏览器
    if (CheckBrowserIsIE()) {
        keycode = event.keyCode;
    } else {
        //火狐浏览器
        keycode = e.which;
    }
    if (keycode == 13) //回车键是13
    {
        getSearchQuestionInfo();
    }
}
//CheckBrowserIsIE
function CheckBrowserIsIE() {
    var result = false;
    var browser = navigator.appName;
    if (browser == "Microsoft Internet Explorer") {
        result = true;
    }
    return result;
}