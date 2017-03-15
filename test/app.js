var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// -------------------------------------------------
// 引入模块
var session = require('express-session');
var rbac = require('mysql_rbac');
var mysqyconfig = require('./database/config');
// -------------------------------------------------

var index = require('./routes/index');
// var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------
// 设置并配置sessions
app.use(session({
    secret: 'mysql_rbac@',
    cookie: { maxAge: 60 * 60 * 24 * 1000 },
    name: 'NODESESSID'
}));

// 设置并配置rbac
app.use(rbac({
    rbac: {
        'rbac_type': 1, //验证类型（1：登录验证， 2：时时验证) *可选 默认为1
        'user_key': 'uid', //用户认证识别号 *可选 默认为uid
        'role': 'role', //角色表名称 *可选 默认为role
        'node': 'node', //权限表名称 *可选 默认为node
        'user': 'user', //用户表名称 *可选 默认为user
        'userTrole': 'role_id', //在用户表储存角色表id的字段 *可选 默认为role_id
        'roleTnode': 'node_id', //在角色表储存权限表id的字段  *可选 默认为node_id 
        'nodeTroute': 'route' //在权限表储存判断权限路由的字段  *可选 默认为route 
    },
    mysql: {
        'host': mysqyconfig.host, //IP/域名 *可选 默认为127.0.0.1
        'user': mysqyconfig.user, //数据库账号 *可选 默认为root
        'password': mysqyconfig.password, //数据库密码 *可选 默认为root
        'database': mysqyconfig.database, //数据库库名 *可选 默认为mysq_rbac
        'port': mysqyconfig.port // 端口 *可选 默认为3306
    },
    hook: {
        // 在req参数挂载权限状态 如： req.is_root  *可选 默认为is_root
        root: 'is_root',
        // 在session参数挂载权限, 区分是否（1：登录验证， 2：时时验证) 状态 如： req.session.rbac_route  *可选 默认为rbac_route
        rbac_route: 'rbac_route'
    }
}));
// -------------------------------------------------
app.use((req, res, next) => {
    // 索引值
    res.locals.indexType = req.query.indextype || 'null';
    next();
});
app.use('/', index);

app.use('/admin', function(req, res, next) {
    // 此req.session.uid 要配置在rbac.rbac.user_key
    if (!req.session.uid) {
        return res.redirect('/login');
    }
    next();
});

// app.use('/users', users);
// 
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

console.log('访问： http://localhost:3000');
module.exports = app;
