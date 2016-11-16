/*
Navicat MySQL Data Transfer

Source Server         : imageMarker
Source Server Version : 60004
Source Host           : localhost:3306
Source Database       : image_marker

Target Server Type    : MYSQL
Target Server Version : 60004
File Encoding         : 65001

Date: 2014-03-26 11:25:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for des
-- ----------------------------
DROP TABLE IF EXISTS `des`;
CREATE TABLE `des` (
  `id` int(11) NOT NULL,
  `pos` tinyint(11) NOT NULL,
  `dw` varchar(128) DEFAULT NULL,
  `kys` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_im_desc` (`kys`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
