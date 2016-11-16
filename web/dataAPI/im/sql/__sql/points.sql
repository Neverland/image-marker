/*
Navicat MySQL Data Transfer

Source Server         : imageMarker
Source Server Version : 60004
Source Host           : localhost:3306
Source Database       : image_marker

Target Server Type    : MYSQL
Target Server Version : 60004
File Encoding         : 65001

Date: 2014-03-26 11:25:01
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for points
-- ----------------------------
DROP TABLE IF EXISTS `points`;
CREATE TABLE `points` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL,
  `axis` varchar(64) NOT NULL,
  `desc` varchar(128) DEFAULT NULL,
  `link` varchar(256) DEFAULT NULL,
  `img` varchar(36) DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `kys` varchar(36) NOT NULL,
  `size` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_im_points` (`img`,`kys`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
