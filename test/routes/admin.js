var express = require('express');
var mysql = require('../database/mysql');
var fn = require('./logic/fn');
var moment = require("moment");
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/index');
});

// 用户列表
router.get('/userlist', fn.is_root, function(req, res, next) {
    mysql.eachuser(function(userlist) {
        mysql.eachrole(function(rolelist) {
            var roleObj = {};
            var userarr = [];
            for (var i = 0, role;
                (role = rolelist[i]), role != null; i++) {
                roleObj[role.id] = role;
            }

            for (var i = 0, user;
                (user = userlist[i]), user != null; i++) {
                var rolearr = [];
                for (var j = 0, role;
                    (role = user.role_id.split(',')[j]), role != null; j++) {
                    rolearr.push({
                        name: roleObj[role].name
                    });
                }
                userarr.push({
                    id: user.id,
                    name: user.username,
                    time: user.logintime,
                    lock: user.loginlock,
                    ip: user.loginip,
                    rolearr: rolearr
                });
            }

            res.locals.lists = userarr;
            res.render('admin/purview/user_list');
        });
    });
});

// 角色列表
router.get('/rolelist', fn.is_root, function(req, res, next) {
    mysql.eachrole(function(data) {
        res.locals.lists = data;
        res.render('admin/purview/role_list');
    });
});

// 节点分类列表
router.get('/nodetag', fn.is_root, function(req, res, next) {
    mysql.eachnodetag(function(data) {
        res.locals.lists = data;
        res.render('admin/purview/node_tag');
    })
});


// 节点列表
router.get('/nodelist', fn.is_root, function(req, res, next) {
    mysql.eachnode(function(data) {
        res.locals.lists = data;
        res.render('admin/purview/node_list');
    });
});

// 添加用户
router.get('/adduser', fn.is_root, function(req, res, next) {
    mysql.eachrole(function(rolelist) {
        res.locals.rolelists = rolelist;
        res.render('admin/purview/add_user');
    });
}).post('/adduser', fn.is_root, function(req, res, next) {
    var body = req.body;
    var ip = req.ip.replace(/[:f]/g, '');
    var logintime = moment().unix();
    var node_id = typeof(req.body.node_id) == 'string' ? req.body.node_id : (fn.unique(body.role_id) || []).join(',');
    var arr = [body.username, body.password, logintime, ip, node_id];


    mysql.adduser(arr, function(status) {
        if (status) {
            res.status(200).redirect('back');
        } else {
            res.status(500).end('插入错误！');
        }
    });

});

// 添加角色 
router.get('/addrole', fn.is_root, function(req, res, next) {

    res.render('admin/purview/add_role');

}).post('/addrole', fn.is_root, function(req, res, next) {
    var body = req.body;
    var arr = [body.name, body.status, body.remark];
    mysql.addrole(arr, function(status) {
        if (status) {
            // 返回上一级
            res.redirect('back');
        }
    });
});
// 添加节点 
router.get('/addnode', fn.is_root, function(req, res, next) {
    mysql.eachnodetag(function(tag) {
        res.locals.tags = tag;
        res.render('admin/purview/add_node');
    });
}).post('/addnode', function(req, res, next) {
    var data = req.body;
    var arr = [data.name, data.route, (data.method || 'GET/POST'), data.tag];
    mysql.addnode(arr, function(status) {
        if (status) {
            // 返回上一级
            res.redirect('back');
        }
    });
});

// 添加节点分类
router.get('/addnodetag', fn.is_root, function(req, res, next) {
    res.render('admin/purview/add_node_tag');
}).post('/addnodetag', function(req, res, next) {
    var data = req.body;
    mysql.addnodetag([data.name], function(status) {
        if (status) {
            // 返回上一级
            res.redirect('back');
        }
    });
});

router.get('/rolelist/edit/:id', fn.is_root, function(req, res, next) {
    var id = req.params.id || 4;
    mysql.eachrole(id, function(rolelist) {
        var checked = (rolelist[0].node_id || '').split(',');
        mysql.eachnode(function(data) {
            let tmpobj = {}
            for (let i = 0, obj;
                (obj = data[i]), obj != null; i++) {
                if (!tmpobj[obj.tag_name]) {
                    tmpobj[obj.tag_name] = {};
                    tmpobj[obj.tag_name] = {
                        name: obj.tag_name,
                        child: []
                    }

                }
                tmpobj[obj.tag_name].child.push({
                    name: obj.name,
                    route: obj.route,
                    method: obj.method,
                    id: obj.id,
                    isChecked: (checked.indexOf(obj.id.toString()) != '-1' ? true : false)
                })
            }
            let arrs = [];
            for (let key in tmpobj) {
                arrs.push(tmpobj[key]);
            }
            res.locals.lists = arrs;
            res.render('admin/purview/role_node_edit');
        })
    })
}).post('/rolelist/edit/:id', fn.is_root, function(req, res, next) {
    var id = req.params.id;
    var node_id = typeof(req.body.node_id) == 'string' ? req.body.node_id : (req.body.node_id || []).join(',');
    mysql.updaterole([node_id, id], function(status) {
        if (status) {
            // 返回上一级
            res.redirect('back');
        }
    });
});





module.exports = router;