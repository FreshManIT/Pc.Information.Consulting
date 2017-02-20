var dom = {
    mine: $('#LAY-mine'),
    mineview: $('.mine-view'),
    minemsg: $('#LAY_minemsg'),
    infobtn: $('#LAY_btninfo')
};
/**
 * 绑定table切换事件
 */
var showTable = function(index, hash) {
    var a = dom.mine.find('a');
    if (hash) {
        a.each(function(i, item) {
            if ($(this).attr('hash') === hash) {
                index = i;
                return false;
            }
        });
    }
    a.eq(index).addClass('tab-this').siblings().removeClass('tab-this');
    dom.mineview.hide();
    dom.mineview.eq(index).show();
};

dom.mine.find('a').on('click', function() {
    var othis = $(this),
        index = othis.index();
    var type = othis.attr('type'),
        hash = othis.attr('hash');
    if (othis.attr('href') !== 'javascript:;') {
        return;
    }
    showTable(index);
    if (hash) {
        location.hash = hash;
    }
});
dom.mine[0] && showTable(0, location.hash.replace(/^#/, ''));

/**
 * 更新用户信息
 */
var updatauserInfo = function() {
    var email = $("#L_email").val();
    if (email != "" && !IsEmailAddress(email)) {
        layer.msg('电子邮箱格式不正确', { time: 3000, icon: 5 });
        return false;
    }
    var sex = $("#hiddenSex").val();
    var job = $("#hiddenJob").val();
    var birthday = $("#hiddenbirthday").val();
    var password = $("#hiddenUpdataPassword").val();
    if (!sex || !job || job == "" || !birthday || birthday == "" || !password || password == "") {
        layer.msg('必填项必填', { time: 3000, icon: 5 });
        return false;
    }
    var data = { email: email, sex: sex, job: job, birthday: birthday, password: password };
    $.ajax({
        url: "/set/updatauserInfo",
        type: "post",
        data: data,
        success: function(data, status) {
            if (!data) {
                layer.msg("保存失败", { icon: 5 });
                return false;
            }
            if (data.code == 1) {
                layer.msg("修改成功", { icon: 6 });
                return false;
            } else {
                layer.msg(data.msg, { icon: 5 });
                return false;
            }
        },
        error: function(err) {
            layer.msg("修改失败", { icon: 5 });
            return false;
        }
    });
    return false;
};