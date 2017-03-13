#必要表及字段

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

CREATE TABLE `role` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `node_id` text COMMENT '权限id *必要',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='角色表';


CREATE TABLE `node` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `route` text COMMENT '路由 *必要',
  `tag` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '权限分类',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='权限表';



