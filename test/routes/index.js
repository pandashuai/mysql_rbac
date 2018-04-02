var express = require('express');
var mysql = require('../database/mysql');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('material/index', { title: 'rbac测试' });
});

router.get('/post/:id', function(req, res, next) {
    res.render('material/content', { title: 'rbac测试' });
});

router.get('/login', function(req, res, next) {
    if (req.session.uid) {
        return res.redirect('/admin');
    }
    res.render('material/login', { title: 'rbac测试' });
}).post('/login', function(req, res, next) {
    var name = req.body.username;
    var pwd = req.body.password;
    mysql.isUser([name, pwd], function(id) {
        if (id) {
            // 此req.session.uid 要配置在rbac.rbac.user_key
            req.session.uid = id;
            return res.redirect('back');
        }
        res.end("登录错误");
    });


});


router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;