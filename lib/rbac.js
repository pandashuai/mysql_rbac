// 数据库封装
var mysql = require('./mysql');

// 默认配置
var config = require('./default');




module.exports = function(param) {
    param = param || {};
    var _this = this;
    // 合并默认参数
    _this.default = Object.assign(config, param);
    // 配置数据库参数
    _this.mysql = mysql(_this.default.mysql, _this.default.rbac);
    return function(req, res, next) {
        // 检测express-session 是否存在
        if (!req.session) {
            throw new Error("Cannot find module 'express-session'!");
        }
        req.session[_this.default.hook.rbac_route] = req.session[_this.default.hook.rbac_route] || {};
        // 检测是否处于登录状态
        if (!req.session[_this.default.rbac.user_key]) {
            req[_this.default.hook.root] = function() {
                req.session[_this.default.hook.rbac_route] = {};
                return false;
            }
            req.session[_this.default.hook.rbac_route] = {};
            return next();
        }
        // 将权限状态挂载到req参数中
        req[_this.default.hook.root] = function(callbask) {
            // 获取当前路由 end
            var ddpBaseUrl = req.baseUrl;
            var ddpPath = (ddpBaseUrl || '') + req.route.path;
            var ddpMethod = req.method;
            // 获取当前路由 end
            // 在session参数挂载权限, 区分是否（1：登录验证， 2：时时验证) 状态 
            if (req.session[_this.default.hook.rbac_route].route && _this.default.rbac.rbac_type == 1) {
                if (_this.default.rbac.superUser && req.session[_this.default.hook.rbac_route].user === _this.default.rbac.superUser) {
                    return callbask(true);
                }
                for (var i = 0, el;
                    (el = req.session[_this.default.hook.rbac_route].route[i]), el != null; i++) {
                    if (el.method.split('/').indexOf(ddpMethod) != '-1' && el.route === ddpPath) {
                        return callbask(true);
                    }
                }
                return callbask(false);
            }
            // 从数据库获取路由数组
            _this.mysql.onlyRoot(req.session[_this.default.rbac.user_key]).then(function(data) {
                req.session[_this.default.hook.rbac_route] = data;
                if (_this.default.rbac.superUser && data.user === _this.default.rbac.superUser) {
                    return callbask(true);
                }
                // 匹配权限状态
                for (var i = 0, el;
                    (el = data.route[i]), el != null; i++) {
                    if (el.method.split('/').indexOf(ddpMethod) != '-1' && el.route === ddpPath) {
                        return callbask(true);
                    }
                }
                return callbask(false);
            }, function(err) {
                console.error(err);
                req.session[_this.default.hook.rbac_route] = {};
                return callbask(false);
            });
        }
        next();
    }

}