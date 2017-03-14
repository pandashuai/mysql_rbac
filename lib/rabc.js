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

        // 检测是否处于登录状态
        if (!req.session[_this.default.rbac.user_key]) {
            req[_this.default.hook.root] = function() {
                req.session[_this.default.hook.rbac_route] = [];
                return false;
            }
            return next();
        }

        // 将权限状态挂载到req参数中
        req[_this.default.hook.root] = function(callbask) {
        	// 获取当前路由 end
            var routes = (req.baseUrl + req.path).split('/');
            for (var pkey in req.params) {
                var param = req.params[pkey];
                if (param) {
                    var index = routes.indexOf(param);
                    if (index != '-1') {
                        routes.splice(index, 1);
                    }
                }

            }
            if (routes[routes.length - 1] == '') {
                routes.splice((routes.length - 1), 1);
            }

            if (routes[0] == '') {
                routes.splice(0, 1);
            }

            var path = routes.join('/');
            // 获取当前路由 end

            // 在session参数挂载权限, 区分是否（1：登录验证， 2：时时验证) 状态 
            if (req.session[_this.default.hook.rbac_route] && _this.default.rbac.rbac_type == 1) {
                if (req.session[_this.default.hook.rbac_route].indexOf(path) != '-1') {
                    return callbask(true);
                }
                return callbask(false);
            }

            // 从数据库获取路由数组
            _this.mysql.onlyRoot(req.session[_this.default.rbac.user_key]).then(function(data) {
                req.session[_this.default.hook.rbac_route] = data;

                // 匹配权限状态
                if (data.indexOf(path) != '-1') {
                    return callbask(true);
                }
                return callbask(false);



            }, function(err) {
                console.error(err);
                req.session[_this.default.hook.rbac_route] = [];
                return callbask(false);
            });

        }

        next();

    }

}

