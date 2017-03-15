# Host: 127.0.0.1  (Version: 5.5.40)
# Date: 2017-03-15 14:57:30
# Generator: MySQL-Front 5.3  (Build 4.120)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "node"
#
DROP DATABASE IF EXISTS `mysql_rabc`;
CREATE DATABASE `mysql_rabc`;

use mysql_rabc;

DROP TABLE IF EXISTS `node`;
CREATE TABLE `node` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `route` text COMMENT '路由',
  `tag` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '权限所属id',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='节点表';

#
# Data for table "node"
#

/*!40000 ALTER TABLE `node` DISABLE KEYS */;
INSERT INTO `node` VALUES (1,' 用户列表','admin/userlist',1),(2,'角色列表','admin/rolelist',1),(3,' 节点列表','admin/nodelist',1),(4,'节点分类列表','admin/nodetag',1),(5,'添加用户','admin/adduser',1),(6,'添加角色','admin/addrole',1),(7,'添加节点','admin/addnode',1),(8,'添加节点分类','admin/addnodetag',1),(9,'编辑角色权限','admin/rolelist/edit',1);
/*!40000 ALTER TABLE `node` ENABLE KEYS */;

#
# Structure for table "node_tag"
#

DROP TABLE IF EXISTS `node_tag`;
CREATE TABLE `node_tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '分类名称',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='权限分类列表';

#
# Data for table "node_tag"
#

/*!40000 ALTER TABLE `node_tag` DISABLE KEYS */;
INSERT INTO `node_tag` VALUES (1,'权限管理');
/*!40000 ALTER TABLE `node_tag` ENABLE KEYS */;

#
# Structure for table "role"
#

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `node_id` text COMMENT '权限id',
  `status` tinyint(3) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='角色表';

#
# Data for table "role"
#

/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'superAdmin','超级管理员','1,2,3,4,5,6,7,8,9',1),(2,'edit','只能编辑','2,9',1),(3,'readOnly','只能浏览','1,2,3,4',1),(4,'addTo','拥有添加权限','5,6,7,8',1);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;

#
# Structure for table "user"
#

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` char(20) DEFAULT '',
  `password` char(32) DEFAULT '',
  `logintime` int(10) unsigned DEFAULT '0',
  `loginip` varchar(30) DEFAULT '',
  `loginlock` tinyint(1) unsigned DEFAULT '0',
  `role_id` text COMMENT '所属角色_id',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='用户表';

#
# Data for table "user"
#

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','123456',1489549404,'1',0,'1'),(2,'xiaoming','123456',1489549508,'1',0,'3'),(3,'xiaosan','123456',1489549569,'1',0,'2'),(4,'rw','123456',1489550312,'1',0,'2,3');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
