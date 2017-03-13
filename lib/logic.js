// 数组去重
var unique = function(arr) {
    var res = [];
    var json = {};
    for (var i = 0, el;
        (el = arr[i]), el != null; i++) {
        if (arr[i] && !json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
}


module.exports.unique = unique;