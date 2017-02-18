var getTopViewQuestionInfo = function() {
    console.log('进入');
    var title = $(".layui-input").val();
    if (!title || title == "") return;
    $.ajax({
        url: '/home',
        type: 'post',
        data: { title: title },
        success: function(data, status) {
            if (!data || !data.data) return;
            var hotQuestionList = data.data;
            var showStr = "";
            if (hotQuestionList.length == 0) {
                showStr = "暂无数据";
            } else {
                hotQuestionList.forEach(function(item, index) {
                    showStr += '<li class="fly-list-li"><h2 class="fly-tip"><a href="/detail?id=' + item.id + '">' + item.piFQuestionTitle + '</a><span class="fly-tip-stick">置顶</span><span class="fly-tip-jing">精</span></h2><p><span>作者：' + item.piFSendUserName + '</span><span>发布时间：' + new Date(item.piFCreateTime).Format("yyyy-MM-dd hh:ss:mm") + '</span><span class="fly-list-hint"><i class="iconfont" title="人气">&#xe60b;</i> ' + item.viewCount + '</span></p></li>';
                });
            }
            $("#showSearchData").html(showStr);
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

$(function() {
    $(".icon-sousuo").click(function() {
        getTopViewQuestionInfo();
    });
    getHotReplyQuestionInfo();
    getTopViewQuestionInfo();
})