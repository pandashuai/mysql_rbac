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

// 权限判断
var is_root = function(req, res, next) {
    if( !req.is_root ){
        return next();
        // res.end('没有权限');
    }
    req.is_root(function(isRoot) {
        
        if (isRoot) {
            next();
        } else {
            res.end('没有权限');
        }
    });
}

module.exports.unique = unique;
module.exports.is_root = is_root;
