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

var addViewCountData = function() {
    var questionId = $("#hiddenQuestionId").val();
    $.ajax({
        url: '/detail/viewInfo?questionId=' + questionId,
        type: 'post',
        success: function(data, status) {},
        error: function(data, status) {}
    });
};

var praisedreply = function(replyId) {
    $.ajax({
        url: "/detail/praisedreply",
        type: "post",
        data: { replyId: replyId },
        success: function(data, status) {
            if (!data) return;
            if (data.code != 1) {
                layer.msg(data.message, { icon: 5 });
            } else {
                layer.msg(data.message, { icon: 6 });
                $(".zan" + replyId).addClass("zanok");
            }
        },
        error: function(err) {}
    });
};

$(function() {
    getHotReplyQuestionInfo();
    getTopViewQuestionInfo();
});