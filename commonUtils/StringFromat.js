String.prototype.Format = function() {
    var args = arguments || [];
    var str = this.valueOf();
    return str.replace(/{(\d+)}/g, function(a, b) {
        return args[b] !== undefined ? args[b] : a;
    });
}