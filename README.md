# mysql_rbac

一个基于node+mysql+express的rbac权限管理模块


### 依赖模块.
  - express
  - express-session
  - mysql


### 快速安装

mysql_rbac 需要 [Node.js](https://nodejs.org/) v4+ 才能运行.


```sh

$ cd 你的项目路径

$ npm install mysql_rbac --save

```

### 快速上手

#### 1、在数据库创建必要表及字段

用户表（可自定义表名）

```sh

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` char(20) DEFAULT '',
  `password` char(32) DEFAULT '',
  `logintime` int(10) unsigned DEFAULT '0',
  `loginip` varchar(30) DEFAULT '',
  `loginlock` tinyint(1) unsigned DEFAULT '0',
  `role_id` text COMMENT '所属角色_id *必要',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='用户表';

注意：所属角色id 是储存角色表ID的值 并以 " 1,2,3 " 形式储存 （所属角色字段名可自定义）

```
角色表（可自定义表名）

```sh

CREATE TABLE `role` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `node_id` text COMMENT '所属权限id *必要',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='角色表';

注意：所属权限id 是储存权限表ID的值 并以 " 1,2,3 " 形式储存 （所属权限字段名可自定义）

```
权限表（可自定义表名）

```sh

CREATE TABLE `node` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `route` text COMMENT '所属路由 *必要',
  `method` varchar(10) COMMENT '所属路由方法 GET POST GET/POST *必要',
  `tag` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '权限分类',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='权限表';

注意：所属路由 是储存URL的值 并以 "admin/路由1,路由2/admin, user/路由3/edit" 形式储存 （所属路由字段名可自定义）

```

#### 2，引入mysql_rbac模块并初始化参数


```sh

var rbac = require('mysql_rbac');

app.use(rbac({
    rbac: {
        'rbac_type': 1, //验证类型（1：登录验证， 2：时时验证) *可选 默认为1
        'user_key': 'uid', //用户认证识别号 *可选 默认为uid
        'role': 'role', //角色表名称 *可选 默认为role
        'node': 'node', //权限表名称 *可选 默认为node
        'user': 'user', //用户表名称 *可选 默认为user
        'userTrole': 'role_id', //在用户表储存角色表id的字段 *可选 默认为role_id
        'roleTnode': 'node_id', //在角色表储存权限表id的字段  *可选 默认为node_id 
        'nodeTroute': 'route', //在权限表储存判断权限路由的字段  *可选 默认为route
        'nodeTmethod': 'method', //在权限表储存判断权限路由方法的字段  *可选 默认为method ,
        'userName': 'username', //用户表的用户名字段  *可选 默认为username ,
        'superUser': 'admin' //用户表的用户名，该用户拥有最高权限 *可选 默认为空
    },
    mysql: {
        'host': '127.0.0.1', //IP/域名 *可选 默认为127.0.0.1
        'user': 'root',  //数据库账号 *可选 默认为root
        'password': 'root', //数据库密码 *可选 默认为root
        'database': 'mysql_rbac', //数据库库名 *可选 默认为mysq_rbac
        'port': 3306 // 端口 *可选 默认为3306
    },
    hook: {
        // 在req参数挂载权限状态 如： req.is_root  *可选 默认为is_root
        root: 'is_root', 
        // 在session参数挂载权限, 区分是否（1：登录验证， 2：时时验证) 状态 如： req.session.rbac_route  *可选 默认为rbac_route 
        rbac_route: 'rbac_route'
    }
}));

注意：要在express-session配置参数之后初始化

如： 
var http = require('http');
var express = require('express');
var session = require('express-session');
var rbac = require('mysql_rbac');
var app = express();
<!-- express-session初始化  -->
app.use(session({
    secret: 'mysql_rbac',
    cookie: { maxAge: 60 * 60 * 24 * 1000 },
    name: 'NODESESSID'
}));

<!-- mysql_rbac初始化  -->
app.use(rbac({
  // 参数
}));

以下挂载你的路由
app.use('/', index);
router.get('/rolelist', function(req, res, next) {
  <!-- 权限判断 req.is_root 参数可修改 在 初始化的hoot.root中修改 默认为is_root -->
  req.is_root(function(status){       
        if( !status ){
          <!-- 可在这定义自定模板 -->
          return res.end('没有权限！');
        }
      
    res.end('正常逻辑业务');
        <!-- 以下是 正常处理逻辑业务！ -->

    });
});
http.createServer(app).listen('3000', function() {
    console.log(`NodePress Run！port at 3000`)
});
```

#### 3，使用


```sh

router.get('/rolelist', function(req, res, next) {
  <!-- 权限判断 req.is_root 参数可修改 在 初始化的hoot.root中修改 默认为is_root -->
  req.is_root(function(status){       
        if( !status ){
          <!-- 可在这定义自定模板 -->
          return res.end('没有权限！');
        }
      

      <!-- 以下是 正常处理逻辑业务！ -->

  });
});

```

或者


```sh

router.get('/rolelist', function(req, res, next) {
  <!-- 权限判断 req.is_root 参数可修改 在 初始化的hoot.root中修改 默认为is_root -->
  req.is_root(function(status){       
        if( !status ){
          <!-- 可在这定义自定模板 -->
          return res.end('没有权限！');
        }
      
      next();
  });
}, function(req, res, next) {
      <!-- 以下是 正常处理逻辑业务！ -->

  });
});

```

或者


```sh

var is_root = function(req, res, next) {
  <!-- 权限判断 req.is_root 参数可修改 在 初始化的hoot.root中修改 默认为is_root -->
  req.is_root(function(status){       
        if( !status ){
          <!-- 可在这定义自定模板 -->
          return res.end('没有权限！');
        }
      
      next();
  });
}

router.get('/rolelist', is_root, function(req, res, next) {
      <!-- 以下是 正常处理逻辑业务！ -->

  });
});

```

### 日志

2018-04-02 增加路由表对method的支持,并增加最高权限的字段分配，分别对应`nodeTmethod`,`userName`, `superUser`三个参数

### 许可证

MIT

### 支持

如果觉得对自己有用，记得在[https://github.com/pandashuai/mysql_rbac](https://github.com/pandashuai/mysql_rbac) 点 star 支持一下，你的支持是本人的无限动力！
