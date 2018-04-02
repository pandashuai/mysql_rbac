/*
Navicat MySQL Data Transfer

Source Server         : centOS_rbac
Source Server Version : 50637
Source Host           : 47.95.250.195:3306
Source Database       : rbac

Target Server Type    : MYSQL
Target Server Version : 50637
File Encoding         : 65001

Date: 2018-04-02 17:07:13
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for node
-- ----------------------------
DROP TABLE IF EXISTS `node`;
CREATE TABLE `node` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `route` text COMMENT '路由',
  `method` varchar(10) DEFAULT NULL,
  `tag` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '权限所属id',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='节点表';

-- ----------------------------
-- Records of node
-- ----------------------------
INSERT INTO `node` VALUES ('1', ' 用户列表', '/admin/userlist', 'GET', '1');
INSERT INTO `node` VALUES ('2', '角色列表', '/admin/rolelist', 'GET', '1');
INSERT INTO `node` VALUES ('3', ' 节点列表', '/admin/nodelist', 'GET', '1');
INSERT INTO `node` VALUES ('4', '节点分类列表', '/admin/nodetag', 'GET', '1');
INSERT INTO `node` VALUES ('5', '添加用户', '/admin/adduser', 'GET/POST', '1');
INSERT INTO `node` VALUES ('6', '添加角色', '/admin/addrole', 'GET/POST', '1');
INSERT INTO `node` VALUES ('7', '添加节点', '/admin/addnode', 'GET/POST', '1');
INSERT INTO `node` VALUES ('8', '添加节点分类', '/admin/addnodetag', 'GET/POST', '1');
INSERT INTO `node` VALUES ('9', '编辑角色权限', '/admin/rolelist/edit/:id', 'GET/POST', '1');

-- ----------------------------
-- Table structure for node_tag
-- ----------------------------
DROP TABLE IF EXISTS `node_tag`;
CREATE TABLE `node_tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '分类名称',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='权限分类列表';

-- ----------------------------
-- Records of node_tag
-- ----------------------------
INSERT INTO `node_tag` VALUES ('1', '权限管理');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `node_id` text COMMENT '权限id',
  `status` tinyint(3) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', 'superAdmin', '超级管理员', '1,2,3,4,5,6,7,8,9', '1');
INSERT INTO `role` VALUES ('2', 'edit', '只能编辑', '2,9', '1');
INSERT INTO `role` VALUES ('3', 'readOnly', '只能浏览', '1,2,3,4', '1');
INSERT INTO `role` VALUES ('4', 'addTo', '拥有添加权限', '5,6,7,8', '1');

-- ----------------------------
-- Table structure for user
-- ----------------------------
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

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admin', '123456', '1489549404', '1', '0', '1');
INSERT INTO `user` VALUES ('2', 'xiaoming', '123456', '1489549508', '1', '0', '3');
INSERT INTO `user` VALUES ('3', 'xiaosan', '123456', '1489549569', '1', '0', '2');
INSERT INTO `user` VALUES ('4', 'rw', '123456', '1489550312', '1', '0', '2,3');
