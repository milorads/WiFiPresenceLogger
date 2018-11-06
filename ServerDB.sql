-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: wifi_presence_logger
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `log` (
  `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mac_id` int(10) unsigned DEFAULT NULL,
  `sector_id` int(10) unsigned DEFAULT NULL,
  `mac` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  UNIQUE KEY `log_id_UNIQUE` (`log_id`),
  KEY `log_sector_idx` (`sector_id`),
  KEY `log_mac_idx` (`mac_id`),
  CONSTRAINT `log_mac` FOREIGN KEY (`mac_id`) REFERENCES `mac` (`mac_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `log_sector` FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='A log received by a logger device. Contains information about students'' presence';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logger`
--

DROP TABLE IF EXISTS `logger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `logger` (
  `logger_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mac` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `ip` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_tick` datetime DEFAULT NULL,
  `sector_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`logger_id`),
  UNIQUE KEY `mac_UNIQUE` (`mac`),
  UNIQUE KEY `logger_id_UNIQUE` (`logger_id`),
  UNIQUE KEY `ip_UNIQUE` (`ip`),
  KEY `logger_sector_idx` (`sector_id`),
  CONSTRAINT `logger_sector` FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Device which logs the presence of students. All these devices should be connected to the server. Server has a table of all devices which are configured to this exact server.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logger`
--

LOCK TABLES `logger` WRITE;
/*!40000 ALTER TABLE `logger` DISABLE KEYS */;
/*!40000 ALTER TABLE `logger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mac`
--

DROP TABLE IF EXISTS `mac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `mac` (
  `mac_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mac_address` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`mac_id`),
  UNIQUE KEY `mac_id_UNIQUE` (`mac_id`),
  KEY `mac_user_idx` (`user_id`),
  CONSTRAINT `mac_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mac`
--

LOCK TABLES `mac` WRITE;
/*!40000 ALTER TABLE `mac` DISABLE KEYS */;
/*!40000 ALTER TABLE `mac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mac_sync`
--

DROP TABLE IF EXISTS `mac_sync`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `mac_sync` (
  `logger_id` int(10) unsigned NOT NULL,
  `mac_id` int(10) unsigned NOT NULL,
  `level` char(1) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'x',
  PRIMARY KEY (`logger_id`,`mac_id`),
  KEY `mac_sync_mac_idx` (`mac_id`),
  CONSTRAINT `mac_sync_logger` FOREIGN KEY (`logger_id`) REFERENCES `logger` (`logger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mac_sync_mac` FOREIGN KEY (`mac_id`) REFERENCES `mac` (`mac_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mac_sync`
--

LOCK TABLES `mac_sync` WRITE;
/*!40000 ALTER TABLE `mac_sync` DISABLE KEYS */;
/*!40000 ALTER TABLE `mac_sync` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `professor` (
  `user_id` int(10) unsigned NOT NULL,
  `identification` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `identification_UNIQUE` (`identification`),
  CONSTRAINT `user_professor` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
/*!40000 ALTER TABLE `professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector`
--

DROP TABLE IF EXISTS `sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `sector` (
  `sector_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`sector_id`),
  UNIQUE KEY `sector_id_UNIQUE` (`sector_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector`
--

LOCK TABLES `sector` WRITE;
/*!40000 ALTER TABLE `sector` DISABLE KEYS */;
/*!40000 ALTER TABLE `sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `student` (
  `user_id` int(10) unsigned NOT NULL,
  `index` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `index_UNIQUE` (`index`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  CONSTRAINT `student_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='A user registered on the system.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sync`
--

DROP TABLE IF EXISTS `user_sync`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `user_sync` (
  `logger_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `level` char(1) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'x',
  PRIMARY KEY (`logger_id`,`user_id`),
  KEY `user_sync_user_idx` (`user_id`),
  CONSTRAINT `user_sync_logger` FOREIGN KEY (`logger_id`) REFERENCES `logger` (`logger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sync_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sync`
--

LOCK TABLES `user_sync` WRITE;
/*!40000 ALTER TABLE `user_sync` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sync` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'wifi_presence_logger'
--
/*!50003 DROP PROCEDURE IF EXISTS `checkLoggerTicks` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `checkLoggerTicks`()
BEGIN
	DECLARE `threshold` DATETIME DEFAULT NULL;
    SET `threshold` = SUBTIME(NOW(), "0:01:00");
    
	SELECT l.`mac` AS 'MAC', l.`ip` AS 'IP', s.`name` AS 'Sector'
		FROM `logger` l
        LEFT JOIN `sector` s ON s.`sector_id` = l.`sector_id`
        WHERE l.`last_tick` < `threshold`
		OR l.`last_tick` IS NULL;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteLogger` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteLogger`(
	IN `_mac` varchar(45)
)
BEGIN
	DECLARE `_sector_id` INT(10) DEFAULT 0;
    SELECT l.`sector_id` INTO `_sector_id`
		FROM `logger` l
        WHERE l.`mac` = `_mac`;
	
	DELETE FROM `logger`
		WHERE `logger`.`mac` = `_mac`;
    
    SELECT s.`name` AS 'Sector name',
		COUNT(l.`logger_id`) AS 'No. of remaining loggers'
		FROM `sector` s
        LEFT JOIN `logger` l
			ON s.`sector_id` = l.`sector_id`
		WHERE s.`sector_id` = `_sector_id`
        GROUP BY s.`name`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteLogs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteLogs`()
BEGIN
	DELETE FROM `log`;
    ALTER TABLE `log` auto_increment = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteProfessor` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteProfessor`(
	IN `_identification` varchar(45)
)
BEGIN
	DECLARE `_user_id` INT(10) DEFAULT NULL;
    CALL __getProfessorId(`_user_id`, `_identification`);
    
	DELETE FROM `user`
		WHERE `user`.`user_id` = `_user_id`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteSector` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteSector`(
	IN `_name` varchar(45)
)
BEGIN
	DELETE FROM `sector`
		WHERE `sector`.`name` = `_name`;
    
    CALL getFreeLoggers;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteStudent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteStudent`(
	IN `_index` varchar(45)
)
BEGIN
	DECLARE `_user_id` INT(10) DEFAULT NULL;
    CALL __getStudentId(`_user_id`, `_index`);
    
	DELETE FROM `user`
		WHERE `user`.`user_id` = `_user_id`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUser`(
	IN `_mac` varchar(45)
)
BEGIN
	DECLARE `_user_id` INT(10) DEFAULT NULL;
    CALL __getActiveMacId(`_user_id`, `_mac`);
    
	DELETE FROM `user`
		WHERE `user`.`user_id` = `_user_id`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `exportMacs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `exportMacs`(
	IN `_mac` varchar(45)
)
BEGIN
	DECLARE `_logger_id` INT(10) DEFAULT NULL;
    CALL __getLoggerId(`_logger_id`, `_mac`);
    
	SELECT
        m.`mac_address` AS 'mac',
        m.`start_time` AS 'time',
        m.`user_id` AS 'server_id'
        FROM `mac` m
        INNER JOIN `mac_sync` ms
			ON ms.`mac_id` = m.`mac_id`
			AND ms.`logger_id` = `_logger_id`
        WHERE ms.`level` IN ('x')
        ORDER BY m.`start_time` ASC;
    
    UPDATE `mac_sync`
        SET `mac_sync`.`level` = 's'
		WHERE `mac_sync`.`logger_id` = `_logger_id`
        AND `mac_sync`.`level` IN ('x');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `exportUsers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `exportUsers`(
	IN `_mac` varchar(45)
)
BEGIN
	DECLARE `_logger_id` INT(10) DEFAULT NULL;
    CALL __getLoggerId(`_logger_id`, `_mac`);
    
	SELECT
		CASE
			WHEN s.`user_id` IS NOT NULL THEN 's'
            WHEN p.`user_id` IS NOT NULL THEN 'p'
		END
			AS 'type',
		u.`name` AS 'name',
        u.`surname` AS 'surname',
        CASE
			WHEN s.`user_id` IS NOT NULL
				THEN s.`index`
			WHEN p.`user_id` IS NOT NULL
				THEN p.`identification`
		END
			AS 'id',
        us.`level` AS 'sync_level',
        u.`user_id` AS 'server_id'
        FROM `user` u
        LEFT JOIN `student` s ON s.`user_id` = u.`user_id`
        LEFT JOIN `professor` p ON p.`user_id` = u.`user_id`
        INNER JOIN `user_sync` us
			ON us.`user_id` = u.`user_id`
			AND us.`logger_id` = `_logger_id`
        WHERE us.`level` NOT IN ('s');
    
    UPDATE `user_sync`
        SET `user_sync`.`level` = 's'
		WHERE `user_sync`.`logger_id` = `_logger_id`
        AND `user_sync`.`level` NOT IN ('s');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getFreeLoggers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getFreeLoggers`()
BEGIN
	SELECT l.`mac` AS 'MAC', l.`ip` AS 'IP'
		FROM `logger` l
        WHERE l.`sector_id` IS NULL;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getLoggers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getLoggers`()
BEGIN
	SELECT l.`mac` AS 'MAC', l.`ip` AS 'IP', s.`name` AS 'Sector'
		FROM `logger` l
        LEFT JOIN `sector` s ON s.`sector_id` = l.`sector_id`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getLoggersForSector` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getLoggersForSector`(
	IN `_name` varchar(45)
)
BEGIN
	SELECT l.`mac` AS 'MAC', l.`ip` AS 'IP'
		FROM `logger` l
        INNER JOIN `sector` s ON s.`sector_id` = l.`sector_id`
        WHERE s.`name` = `_name`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getLogs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getLogs`()
BEGIN
	SELECT
		CASE
			WHEN s.`user_id` IS NOT NULL THEN 'Student'
            WHEN p.`user_id` IS NOT NULL THEN 'Professor'
            ELSE 'Unregistered'
		END
			AS 'Type',
		u.`name` AS 'Name',
        u.`surname` AS 'Surname',
        CASE
			WHEN s.`user_id` IS NOT NULL
				THEN s.`index`
			WHEN p.`user_id` IS NOT NULL
				THEN p.`identification`
		END
			AS 'ID',
		l.`mac` AS 'MAC',
        sec.`name` AS 'Sector',
        l.`start_time` AS 'Entry time',
        l.`end_time` AS 'Leaving time'
        FROM `log` l
        LEFT JOIN `mac` m
			ON m.`mac_id` = l.`mac_id`
            AND m.`is_active` = 1
        LEFT JOIN `user` u ON u.`user_id` = m.`user_id`
        LEFT JOIN `student` s ON s.`user_id` = u.`user_id`
        LEFT JOIN `professor` p ON p.`user_id` = u.`user_id`
        LEFT JOIN `sector` sec ON sec.`sector_id` = l.`sector_id`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getLogsForSector` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getLogsForSector`(
	IN `_name` varchar(45)
)
BEGIN
	SELECT
		CASE
			WHEN s.`user_id` IS NOT NULL THEN 'Student'
            WHEN p.`user_id` IS NOT NULL THEN 'Professor'
            ELSE 'Unregistered'
		END
			AS 'Type',
		u.`name` AS 'Name',
        u.`surname` AS 'Surname',
        CASE
			WHEN s.`user_id` IS NOT NULL
				THEN s.`index`
			WHEN p.`user_id` IS NOT NULL
				THEN p.`identification`
		END
			AS 'ID',
		l.`mac` AS 'MAC',
        l.`start_time` AS 'Entry time',
        l.`end_time` AS 'Leaving time'
        FROM `log` l
        LEFT JOIN `mac` m
			ON m.`mac_id` = l.`mac_id`
            AND m.`is_active` = 1
        LEFT JOIN `user` u ON u.`user_id` = m.`user_id`
        LEFT JOIN `student` s ON s.`user_id` = u.`user_id`
        LEFT JOIN `professor` p ON p.`user_id` = u.`user_id`
        INNER JOIN `sector` sec ON sec.`sector_id` = l.`sector_id`
        WHERE sec.`name` = `_name`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getProfessors` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getProfessors`()
BEGIN
	SELECT
		u.`name` AS 'Name',
        u.`surname` AS 'Surname',
        p.`identification` AS 'ID',
        m.`mac_address` AS 'MAC'
        FROM `user` u
        INNER JOIN `professor` p ON p.`user_id` = u.`user_id`
        LEFT JOIN `mac` m
			ON m.`user_id` = u.`user_id`
            AND m.`is_active` = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getStudents` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getStudents`()
BEGIN
	SELECT
		u.`name` AS 'Name',
        u.`surname` AS 'Surname',
        s.`index` AS 'Index',
        m.`mac_address` AS 'MAC'
        FROM `user` u
        INNER JOIN `student` s ON s.`user_id` = u.`user_id`
        LEFT JOIN `mac` m
			ON m.`user_id` = u.`user_id`
            AND m.`is_active` = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `giveIpAddress` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `giveIpAddress`(
	IN `_mac` varchar(45),
    IN `_ip` varchar(45)
)
BEGIN
	UPDATE `logger`
		SET `logger`.`ip` = `_ip`
        WHERE `logger`.`mac` = `_mac`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `importMac` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `importMac`(
	IN `_logger_mac` int(10),
	IN `_user_id` int(10),
    IN `_mac` varchar(45),
    IN `_time` datetime
)
BEGIN
    DECLARE `_logger_id` INT(10) DEFAULT NULL;
    DECLARE `_mac_id` INT(10) DEFAULT NULL;
    DECLARE `_user_sync_level` CHAR DEFAULT NULL;
    DECLARE `_mac_sync_level` CHAR DEFAULT NULL;
    
    CALL __getLoggerId(`_logger_id`, `_logger_mac`);
    CALL __getActiveMacId(`_mac_id`, `_user_id`);
    
    CALL __getUserSyncLevel(`_user_sync_level`,
		`_logger_id`, `_user_id`);
	CALL __getMacSyncLevel(`_mac_sync_level`,
		`_logger_id`, `_mac_id`);
    
    
    IF `_user_sync_level` IN ('s', 'n')
        AND `_mac_sync_level` IN ('s')
		
        THEN CALL insertMac(`_logger_id`, `_user_id`,
			`_mac`, `_time`);
		
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `importUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `importUser`(
	IN `_logger_mac` varchar(45),
    IN `_type` char,
	IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_id` varchar(45),
    IN `_sync_level` char,
    IN `_server_id` int
)
BEGIN
	CASE
		WHEN `_sync_level` = 'n' THEN
			CALL updateUser
            (`_logger_mac`, `_server_id`, `_name`, `_surname`, `_id`);
	
		WHEN `_sync_level` = 'x' THEN
			CASE
			
                WHEN `_type` = 'p' THEN
					CALL insertProfessor
                    (`_logger_mac`, `_name`, `_surname`, `_id`);
                    
				WHEN `_type` = 's' THEN
					CALL insertStudent
					(`_logger_mac`, `_name`, `_surname`, `_id`);
                    
			END CASE;
    END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertLog` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertLog`(
	IN `_logger_mac` varchar(45),
	IN `_mac` varchar(45),
	IN `_start_time` varchar(45),
    IN `_end_time` varchar(45)
)
BEGIN
	INSERT INTO `log`
		(`mac_id`, `sector_id`, `mac`, `start_time`, `end_time`)
        VALUES
        ((SELECT m.`mac_id`
			FROM `mac` m
			WHERE m.`mac_address` = `_mac`
			AND m.`is_active` = 1),
		
        (SELECT l.`sector_id`
			FROM `logger` l
			WHERE l.`mac` = `_logger_mac`),
		
        `_mac`, `_start_time`, `_end_time`);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertLogger` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertLogger`(
	IN `_mac` varchar(45)
)
BEGIN
	INSERT INTO `logger` (`mac`) VALUES (`_mac`);
    
    INSERT INTO `user_sync` (`logger_id`, `user_id`)
		SELECT LAST_INSERT_ID(), u.`user_id`
			FROM `user` u;
    
    INSERT INTO `mac_sync` (`logger_id`, `mac_id`)
		SELECT LAST_INSERT_ID(), m.`mac_id`
			FROM `mac` m;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertMac` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertMac`(
	IN `_logger_id` int(10),
	IN `_user_id` int(10),
    IN `_mac` varchar(45),
    IN `_time` datetime
)
BEGIN
    DECLARE `_mac_id` INT(10) DEFAULT NULL;
    CALL __getActiveMacId(`_mac_id`, `_user_id`);
    
	UPDATE `mac`
		SET `mac`.`is_active` = 0,
			`mac`.`end_time` = `_time`
		WHERE `mac`.`mac_id` = `_mac_id`;
    
    INSERT INTO `mac`
		(`mac_address`, `user_id`, `start_time`)
        VALUES
        (`_mac`, `_user_id`, `_time`);
    
    INSERT INTO `mac_sync` (`logger_id`, `mac_id`)
		SELECT l.`logger_id`, LAST_INSERT_ID()
			FROM `logger` l
            WHERE l.`logger_id` <> `_logger_id`
	;
    INSERT INTO `mac_sync` (
			`logger_id`, `mac_id`, `level`
		) VALUES (
			`_logger_id`, LAST_INSERT_ID(), 's'
		)
	;
    
    UPDATE `log`
		SET `log`.`mac_id` = LAST_INSERT_ID()
        WHERE `log`.`mac` = `_mac`
        AND `log`.`mac_id` IS NULL
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertProfessor` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertProfessor`(
	IN `_logger_mac` varchar(45),
	IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_identification` varchar(45)
)
BEGIN
	DECLARE `_logger_id` INT(10) DEFAULT NULL;
    DECLARE `_user_id` INT(10) DEFAULT NULL;
    
    CALL __getLoggerId(`_logger_id`, `_logger_mac`);
    
    CALL __insertUser(`_user_id`, `_logger_id`,
		`_name`, `_surname`
	);
    
    INSERT INTO `professor` (
			`user_id`, `identification`
		) VALUES (
			`_user_id`, `_identification`
		)
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertSector` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertSector`(
	IN `_name` varchar(45)
)
BEGIN
	INSERT INTO `sector` (`name`) VALUES (`_name`);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertStudent` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertStudent`(
	IN `_logger_mac` varchar(45),
	IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_index` varchar(45)
)
BEGIN
	DECLARE `_logger_id` INT(10) DEFAULT NULL;
    DECLARE `_user_id` INT(10) DEFAULT NULL;
    
    CALL __getLoggerId(`_logger_id`, `_logger_mac`);
    
    CALL __insertUser(`_user_id`, `_logger_id`,
		`_name`, `_surname`
	);
    
    INSERT INTO `student` (
			`user_id`, `index`
		) VALUES (
			`_user_id`, `_index`
		)
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `purge` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `purge`()
BEGIN
	DELETE FROM `log`;
    DELETE FROM `user`;
    DELETE FROM `logger`;
    DELETE FROM `sector`;
    
    ALTER TABLE `log` auto_increment = 1;
    ALTER TABLE `user` auto_increment = 1;
    ALTER TABLE `logger` auto_increment = 1;
    ALTER TABLE `sector` auto_increment = 1;
    ALTER TABLE `mac` auto_increment = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `putLoggerIntoSector` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `putLoggerIntoSector`(
	IN `_mac` varchar(45),
    IN `_name` varchar(45)
)
BEGIN
	UPDATE `logger`
		SET `logger`.`sector_id` = (
			SELECT s.`sector_id`
				FROM `sector` s
                WHERE s.`name` = `_name`
		)
        WHERE `logger`.`mac` = `_mac`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `removeLoggerFromSector` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `removeLoggerFromSector`(
	IN `_mac` varchar(45)
)
BEGIN
	DECLARE `_sector_id` INT(10) DEFAULT 0;
    SELECT l.`sector_id` INTO `_sector_id`
		FROM `logger` l
        WHERE l.`mac` = `_mac`
	;
	
	UPDATE `logger`
		SET `logger`.`sector_id` = NULL
        WHERE `logger`.`mac` = `_mac`
	;
    
    SELECT s.`name` AS 'Sector name',
		COUNT(l.`logger_id`) AS 'No. of remaining loggers'
		FROM `sector` s
        LEFT JOIN `logger` l
			ON s.`sector_id` = l.`sector_id`
		WHERE s.`sector_id` = `_sector_id`
        GROUP BY s.`name`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `takeIpAddress` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `takeIpAddress`(
	IN `_mac` varchar(45)
)
BEGIN
	UPDATE `logger`
		SET `logger`.`ip` = NULL
        WHERE `logger`.`mac` = `_mac`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tickLogger` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tickLogger`(
	IN `_mac` varchar(45)
)
BEGIN
	UPDATE `logger`
		SET `logger`.`last_tick` = NOW()
		WHERE `logger`.`mac` = `_mac`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateUser`(
	IN `_logger_mac` varchar(45),
    IN `_user_id` int(10),
	IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_id` varchar(45)
)
BEGIN
	DECLARE `_logger_id` INT(10) DEFAULT NULL;
    DECLARE `_sync_level` CHAR DEFAULT NULL;
    CALL __getLoggerId(`logger_id`, `_logger_mac`);
	CALL __getUserSyncLevel(`_sync_level`, `_logger_id`, `_user_id`);
    
    IF `_sync_level` IN ('s') THEN BEGIN
	
		UPDATE `user_sync`
			SET `user_sync`.`level` = 'n'
			WHERE `user_sync`.`logger_id` <> `_logger_id`
			AND `user_sync`.`user_id` = `_user_id`
			AND `user_sync`.`level` IN ('s')
		;
            
		UPDATE `user`
			SET `user`.`name` = COALESCE(`_name`, `user`.`name`),
				`user`.`surname` = COALESCE(`_surname`,
                `user`.`surname`)
			WHERE `user`.`user_id` = `_user_id`
		;
            
		UPDATE `professor`
			SET `professor`.`identification` = COALESCE(`_id`,
				`professor`.`identification`)
			WHERE `professor`.`user_id` = `_user_id`
		;
            
		UPDATE `student`
			SET `student`.`index` = COALESCE(`_id`,
				`student`.`index`)
            WHERE `student`.`user_id` = `_user_id`
		;
	
    END; END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getActiveMacId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getActiveMacId`(
	OUT `_mac_id` int(10),
    IN `_user_id` int(10)
)
BEGIN
	SELECT m.`mac_id` INTO `_mac_id`
		FROM `mac` m
        WHERE m.`user_id` = `_user_id`
        AND m.`is_active` = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getLoggerId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getLoggerId`(
	OUT `_id` int(10),
	IN `_mac` varchar(45)
)
BEGIN
	SELECT l.`logger_id` INTO `_id`
		FROM `logger` l
		WHERE l.`mac` = `_mac`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getMacSyncLevel` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getMacSyncLevel`(
	OUT `_sync_level` char,
    IN `_logger_id` int(10),
    IN `_mac_id` int(10)
)
BEGIN
	SELECT ms.`level` INTO `_sync_level`
		FROM `mac_sync` ms
        WHERE ms.`logger_id` = `_logger_id`
        AND ms.`mac_id` = `_mac_id`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getProfessorId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getProfessorId`(
	OUT `_id` int(10),
	IN `_identication` varchar(45)
)
BEGIN
	SELECT u.`user_id` INTO `_id`
		FROM `user` u
        INNER JOIN `professor` p ON p.`user_id` = u.`user_id`
        WHERE p.`identication` = `_identication`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getStudentId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getStudentId`(
	OUT `_id` int(10),
	IN `_index` varchar(45)
)
BEGIN
	SELECT u.`user_id` INTO `_id`
		FROM `user` u
        INNER JOIN `student` s ON s.`user_id` = u.`user_id`
        WHERE s.`index` = `_index`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getUserId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getUserId`(
	OUT `_id` int(10),
	IN `_mac` varchar(45)
)
BEGIN
	SELECT u.`user_id` INTO `_id`
		FROM `user` u
        INNER JOIN `mac` m ON m.`user_id` = u.`user_id`
        WHERE m.`mac_address` = `_mac`
        AND m.`is_active` = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getUserSyncLevel` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getUserSyncLevel`(
	OUT `_sync_level` char,
    IN `_logger_id` int(10),
    IN `_user_id` int(10)
)
BEGIN
	SELECT us.`level` INTO `_sync_level`
		FROM `user_sync` us
        WHERE us.`logger_id` = `_logger_id`
        AND us.`user_id` = `_user_id`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__insertUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__insertUser`(
	OUT `_user_id` int(10),
	IN `_logger_id` int(10),
	IN `_name` varchar(45),
    IN `_surname` varchar(45)
)
BEGIN
	INSERT INTO `user`
		(`name`, `surname`)
        VALUES
        (`_name`, `_surname`);
	
    SET `_user_id` = LAST_INSERT_ID();
    
    INSERT INTO `user_sync`
		(`logger_id`, `user_id`)
		SELECT l.`logger_id`, `_user_id`
			FROM `logger` l
            WHERE l.`logger_id` <> `_logger_id`;
            
    INSERT INTO `user_sync`
		(`logger_id`, `user_id`, `level`)
        VALUES
        (`_logger_id`, `_user_id`, 'k');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-06 13:45:15
