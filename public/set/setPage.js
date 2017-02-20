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