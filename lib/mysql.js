// 引入mysql数据库模块
var mysql = require('mysql');

var logic = require('./logic');
// 引入异步库
var Q = require('q');

var username = '';
// 数据库封装
module.exports = function(config, rbac) {
    var _this = this;
    _this.poolConn = mysql.createPool(config);

    _this.query = function(sql, param) {
        var deferred = Q.defer();
        param = param || [];
        _this.poolConn.getConnection(function(error, conn) {
            if (error) {
                deferred.reject({
                    errCode: error.sqlState,
                    errMag: error.code
                });
            } else {

                conn.query(sql, param, function(error, results, fields) {
                    if (error) {
                        deferred.reject({
                            errCode: error.sqlState,
                            errMag: error.code
                        });
                    } else {
                        deferred.resolve({
                            error: error,
                            results: results,
                            fields: fields
                        });
                    }

                });
                //释放连接                
                conn.release();
            }

        });
        return deferred.promise;
    };


    // 查询用户对应的角色id
    _this.queryuser = function(id) {
        var deferred = Q.defer();
        if (!id) {
            throw new Error('缺少配置参数 ： user_key！ ');
        } else {
            _this.query('select ' + rbac.userTrole + ', ' + rbac.userName + ' from ' + rbac.user + ' where id = ' + id).then(function(data) {
                deferred.resolve(data.results);
            }, function(error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    }

    // 查询用户对应的角色id
    _this.queryrole = function(idarr) {
        var deferred = Q.defer();
        var idparam = [];
        for (var i = 0; i < idarr.length; i++) {
            idparam.push(idarr[i][rbac.userTrole]);
            username = idarr[i][rbac.userName];
        }
        if (idparam.length <= 0) {
            deferred.resolve(idparam);
        } else {
            // 去重
            idparam = logic.unique(idparam.join(',').split(',')).join(',');
            _this.query('select ' + rbac.roleTnode + ' from ' + rbac.role + ' where id in (' + idparam + ')').then(function(data) {
                deferred.resolve(data.results);
            }, function(error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    }

    // 查询角色对应的权限路由
    _this.querynode = function(idarr) {
        var deferred = Q.defer();
        var idparam = [];
        for (var i = 0; i < idarr.length; i++) {
            idparam.push(idarr[i][rbac.roleTnode]);
        }
        if (idparam.length <= 0) {
            deferred.resolve(idparam);
        } else {

            idparam = logic.unique(idparam.join(',').split(',')).join(',');
            var sql = 'select ' + rbac.nodeTroute + ', ' + rbac.nodeTmethod + ' from ' + rbac.node + ' where id in (' + idparam + ')';
            _this.query(sql).then(function(data) {
                deferred.resolve(data.results);
            }, function(error) {
                deferred.reject(error);
            });

        }

        return deferred.promise;
    }

    // 导出权限路由
    _this.onlyRoot = function(userid) {
        var deferred = Q.defer();
        _this.queryuser(userid)
            .then(_this.queryrole)
            .then(_this.querynode)
            .then(function(data) {
                var idparam = [];
                for (var i = 0; i < data.length; i++) {
                    idparam.push({
                        route: data[i][rbac.nodeTroute],
                        method: data[i][rbac.nodeTmethod],
                    });
                }
                if (idparam.length > 0) {
                    // 去重
                    idparam = logic.unObj(idparam);

                }
                deferred.resolve({ user: username, route: idparam });
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    return {
        onlyRoot: _this.onlyRoot
    }
}