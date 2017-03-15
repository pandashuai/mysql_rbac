var mysql = require('mysql');
var mysql_config = require('./config');

//使用连接池，提升性能
var poolConn = mysql.createPool(mysql_config);

// 连接池查询
var query = function(sql, params, callback) {
	if (typeof(params) == 'function'){
		callback = params;
		params = [];
	}
    poolConn.getConnection(function(err, conn) {
        if (err) {
            callback(err, null, null);
        } else {

            var query = conn.query(sql, params, callback);
            //释放连接                
            conn.release();
        }

    });

};



// 添加用户
var adduser = function(param, callback) {
	query('insert into user(username, password, logintime, loginip, role_id) values(?, ?, ?, ?, ?)', param, function(error, results, fields) {
		if (error) {
			throw error;
		} else {
			callback(true);
		}
	});
};

// 添加角色
var addrole = function(param, callback) {
	query('insert into role(name, status, remark) values(?, ?, ?)', param, function(error, results, fields) {
		if (error) {
			throw error;
		}
		if (callback) {
			return callback(true);
		}
	});
}


// 添加节点分类
var addnodetag = function(param, callback) {
	query('insert into node_tag(name) values(?)', param, function(error, results, fields) {
		if (error) {
			throw error;
		}
		if (callback) {
			return callback(true);
		}
	});
}

// 添加节点
var addnode = function(param, callback) {
	query('insert into node(name, route, tag) values(?, ?, ?)', param, function(error, results, fields) {
		if (error) {
			throw error;
		}
		if (callback) {
			return callback(true);
		}
	});
}

// 更新角色权限
var updaterole = function(param, callback) {
	query('update role set node_id = ? where id = ? ', param, function(error, results, fields) {
		if (error) {
			throw error;
		}
		if (callback) {
			return callback(true);
		}
	});
}

// 遍历角色
var eachrole = function(param, callback) {
		if (typeof(param) == 'function') {
			callback = param;
			param = '';
		} else {
			param = 'where id = ' + param;
		}
		query('select * from role ' + param, function(error, results, fields) {
			if (error) {
				throw error;
			}

			return callback(results);
		});
	}

// 遍历用户,user.id as user_id, user.loginlock as loginlock, user.loginip as loginip, user.username as username, user.logintime as logintime, role_user.role_id as role_id, role.name as role_name
var eachuser = function(callback) {
		query('select id, loginlock, loginip, username, logintime, role_id from user', function(error, results, fields) {
			if (error) {
				throw error;
			}
			return callback(results);
		});
	}
	// 遍历节点分类
var eachnodetag = function(callback) {
		query('select * from node_tag', function(error, results, fields) {
			if (error) {
				throw error;
			}
			return callback(results);
		});
	}
	// 遍历节点
var eachnode = function(callback) {
	query('select node.id as id, node.name as name, node.route as route, node_tag.name as tag_name from node left join node_tag on node.tag = node_tag.id', function(error, results, fields) {
		if (error) {
			throw error;
		}
		return callback(results);
	});
}

module.exports.adduser = adduser;
module.exports.addrole = addrole;
module.exports.addnodetag = addnodetag;
module.exports.addnode = addnode;
module.exports.updaterole = updaterole;
module.exports.eachrole = eachrole;
module.exports.eachuser = eachuser;
module.exports.eachnodetag = eachnodetag;
module.exports.eachnode = eachnode;















// material
var isUser = function(param, callback) {
	query('select * from user where username = ? and password = ?', param, function(error, results, fields) {
		if (error) {
			throw error;
		}
		if(results.length > 0 ){
			return callback(results[0].id);
		}

		return callback(false);
	});
}
module.exports.isUser = isUser;