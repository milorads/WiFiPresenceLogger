-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: wifi_presence_logger_logs
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mac_id` int(10) unsigned DEFAULT NULL,
  `mac` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `sync_level` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'x',
  `is_present` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`log_id`),
  UNIQUE KEY `log_id_UNIQUE` (`log_id`),
  KEY `log_mac_idx` (`mac_id`),
  CONSTRAINT `log_mac` FOREIGN KEY (`mac_id`) REFERENCES `mac` (`mac_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mac`
--

DROP TABLE IF EXISTS `mac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mac` (
  `mac_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mac_address` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sync_level` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'x',
  PRIMARY KEY (`mac_id`),
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
-- Table structure for table `proffessor`
--

DROP TABLE IF EXISTS `proffessor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proffessor` (
  `user_id` int(10) unsigned NOT NULL,
  `identification` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `identification_UNIQUE` (`identification`),
  CONSTRAINT `proffessor_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proffessor`
--

LOCK TABLES `proffessor` WRITE;
/*!40000 ALTER TABLE `proffessor` DISABLE KEYS */;
/*!40000 ALTER TABLE `proffessor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `user_id` int(10) unsigned NOT NULL,
  `index` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `index_UNIQUE` (`index`),
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `sync_level` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'x',
  `server_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `server_id_UNIQUE` (`server_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'wifi_presence_logger_logs'
--
/*!50003 DROP PROCEDURE IF EXISTS `changeUserMac` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `changeUserMac`(
    IN `_type` char,
    IN `_id` int(10),
    IN `_mac` varchar(45)
)
BEGIN
	DECLARE `_user_id` INT(10) DEFAULT NULL;
    DECLARE `_time` DATETIME DEFAULT NULL;
    
    IF `_type` = 'p' THEN CALL __getProffessorId(`_user_id`, `_id`);
	ELSE
    IF `_type` = 's' THEN CALL __getStudentId(`_user_id`, `_id`);
    END IF;
    END IF;
    
    SET `_time` = NOW();
    
    IF (
			SELECT u.`sync_level`
				FROM `user` u
				WHERE u.`user_id` = `_user_id`
		) NOT IN ('k')
		THEN BEGIN
			CALL __insertMac(`_user_id`, `_mac`, `_time`);
		END;
	END IF;
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
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteLogs`()
BEGIN
	DELETE FROM `log`;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteLogs_byDate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteLogs_byDate`(
	IN `_date` date
)
BEGIN
	DELETE FROM `log`
		WHERE CAST(l.`start_time` AS DATE) = `_date`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `endAllLogs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `endAllLogs`(
	IN `_end_time` DATETIME
)
BEGIN
	UPDATE `log`
		SET `log`.`end_time` = `_end_time`,
			`log`.`is_present` = 0
        WHERE `log`.`end_time` IS NULL
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `exportAndDeleteLogs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `exportAndDeleteLogs`()
BEGIN
	CALL exportLogs;
    
    DELETE FROM `log`
		WHERE `log`.`sync_level` = 's'
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `exportLogs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `exportLogs`()
BEGIN
	SELECT
		u.`server_id` AS 'server_id',
		l.`mac` AS 'mac',
        l.`start_time` AS 's_time',
        l.`end_time` AS 'e_time'
        FROM `log` l
        LEFT JOIN `mac` m ON m.`mac_id` = l.`mac_id`
        LEFT JOIN `user` u ON u.`user_id` = m.`user_id`
        WHERE l.`sync_level` IN ('x')
        AND l.`end_time` IS NOT NULL
	;
    
    UPDATE `log`
		SET `log`.`sync_level` = 's'
        WHERE `log`.`sync_level` IN ('x')
		AND `log`.`end_time` IS NOT NULL
	;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `exportMacs`()
BEGIN
	SELECT
		m.`mac_address` AS 'mac',
        m.`start_time` AS 'time',
        u.`server_id` AS 'server_id'
        FROM `mac` m
        INNER JOIN `user` u ON u.`user_id` = m.`user_id`
        WHERE u.`sync_level` IN ('s', 'n')
        AND m.`sync_level` IN ('x')
        ORDER BY m.`start_time` ASC
	;
    
    UPDATE `mac`
		SET `mac`.`sync_level` = 's'
        WHERE `mac`.`sync_level` IN ('x')
        AND `mac`.`user_id` IN (
			SELECT u.`user_id`
				FROM `user` u
                WHERE u.`sync_level` IN ('s', 'n')
		)
	;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `exportUsers`()
BEGIN
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
        u.`sync_level` AS 'sync_level',
        u.`server_id` AS 'server_id'
        FROM `user` u
        LEFT JOIN `student` s ON s.`user_id` = u.`user_id`
        LEFT JOIN `proffessor` p ON p.`user_id` = u.`user_id`
        WHERE u.`sync_level` IN ('n', 'x')
	;
    
    UPDATE `user`
		SET `user`.`sync_level` = 's'
        WHERE `user`.`sync_level` IN ('n')
	;
    
    UPDATE `user`
		SET `user`.`sync_level` = 'k'
        WHERE `user`.`sync_level` IN ('x')
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `finishLogging` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `finishLogging`(
	`_time` datetime
)
BEGIN
	UPDATE `log`
		SET `log`.`end_time` = `_time`
        WHERE `log`.`is_present` = 0
        AND `log`.`end_time` IS NULL
	;
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
            WHEN p.`user_id` IS NOT NULL THEN 'Proffessor'
            ELSE 'Unregistered'
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
		l.`mac` AS 'mac',
        l.`start_time` AS 'stime',
        l.`end_time` AS 'etime'
        FROM `log` l
        LEFT JOIN `mac` m ON m.`mac_id` = l.`mac_id`
        LEFT JOIN `user` u ON u.`user_id` = m.`user_id`
        LEFT JOIN `student` s ON s.`user_id` = u.`user_id`
        LEFT JOIN `proffessor` p ON p.`user_id` = u.`user_id`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getLogs_byDate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getLogs_byDate`(
	IN `_date` date
)
BEGIN
	SELECT
		CASE
			WHEN s.`user_id` IS NOT NULL THEN 'Student'
            WHEN p.`user_id` IS NOT NULL THEN 'Proffessor'
            ELSE 'Unregistered'
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
		l.`mac` AS 'mac',
        l.`start_time` AS 'stime',
        l.`end_time` AS 'etime'
        FROM `log` l
        LEFT JOIN `mac` m ON m.`mac_id` = l.`mac_id`
        LEFT JOIN `user` u ON u.`user_id` = m.`user_id`
        LEFT JOIN `student` s ON s.`user_id` = u.`user_id`
        LEFT JOIN `proffessor` p ON p.`user_id` = u.`user_id`
		WHERE CAST(l.`start_time` AS DATE) = `_date`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getUser_byMac` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getUser_byMac`(
	IN `_mac` varchar(45)
)
BEGIN
	SELECT
		CASE
			WHEN s.`user_id` IS NOT NULL THEN 'Student'
            WHEN p.`user_id` IS NOT NULL THEN 'Proffessor'
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
			AS 'id'
        FROM `user` u
        LEFT JOIN `student` s ON s.`user_id` = u.`user_id`
        LEFT JOIN `proffessor` p ON p.`user_id` = u.`user_id`
		INNER JOIN `mac` m ON m.`user_id` = u.`user_id`
        WHERE m.`mac_address` = `_mac`
	;
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
	IN `_mac` varchar(45),
    IN `_time` datetime,
    IN `_server_id` int(10)
)
BEGIN
	DECLARE `_user_id` INT(10) DEFAULT NULL;
    SELECT u.`user_id` INTO `_user_id`
		FROM `user` u
        WHERE u.`server_id` = `_server_id`
	;
    
    CALL __insertMac(`_user_id`, `_mac`, `_time`);
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
	IN `_type` char,
    IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_id` varchar(45),
    IN `_sync_level` char,
    IN `_server_id` int(10)
)
BEGIN
	IF `_sync_level` = 'x' THEN CALL __insertImportedUser(
		`_server_id`, `_type`, `_name`, `_surname`, `_id`);
	ELSE
    IF `_sync_level` = 'n' THEN CALL __updateImportedUser(
		`_server_id`, `_name`, `_surname`, `_id`);
	ELSE
    IF `_sync_level` = 'k' THEN CALL __setUserServerId(
		`_type`, `_id`, `_server_id`);
	END IF;
    END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertProffessor` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertProffessor`(
	IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_identification` varchar(45),
    IN `_mac` varchar(45)
)
BEGIN
	DECLARE `_time` DATETIME DEFAULT NULL;
    SET `_time` = NOW();
    
	INSERT INTO `user` (
			`name`, `surname`
		) VALUES (
			`_name`, `_surname`
		)
	;
	
    INSERT INTO `proffessor` (
			`user_id`, `identification`
		) VALUES (
			LAST_INSERT_ID(), `_identification`
		)
	;
    
    CALL __insertMac(LAST_INSERT_ID(), `_mac`, `_time`);
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
	IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_index` varchar(45),
    IN `_mac` varchar(45)
)
BEGIN
	DECLARE `_time` DATETIME DEFAULT NULL;
    SET `_time` = NOW();
    
	INSERT INTO `user` (
			`name`, `surname`
		) VALUES (
			`_name`, `_surname`
		)
	;
	
    INSERT INTO `student` (
			`user_id`, `index`
		) VALUES (
			LAST_INSERT_ID(), `_index`
		)
	;
    
    CALL __insertMac(LAST_INSERT_ID(), `_mac`, `_time`);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `logDevice` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `logDevice`(
	IN `_mac` varchar(45),
	IN `_time` datetime
)
BEGIN
	DECLARE `_log_id` INT(10) DEFAULT NULL;
    SELECT l.`log_id` INTO `_log_id`
		FROM `log` l
        WHERE l.`mac` = `_mac`
        AND l.`end_time` IS NULL
	;
    
    IF `_log_id` IS NULL
		THEN
			INSERT INTO `log` (
                    `mac_id`,
                    `mac`,
                    `start_time`
				) VALUES ( (
						SELECT m.`mac_id`
							FROM `mac` m
							WHERE m.`mac_address` = `_mac`
                            AND m.`is_active` = 1
					),
					`_mac`,
					`_time`
				)
			;
		ELSE
			UPDATE `log`
				SET `log`.`is_present` = 1
                WHERE `log`.`log_id` = `_log_id`
		;
	END IF;
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
    DELETE FROM `mac`;
    DELETE FROM `user`;
    
    ALTER TABLE `log` auto_increment = 1;
    ALTER TABLE `mac` auto_increment = 1;
    ALTER TABLE `user` auto_increment = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `startLogging` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `startLogging`()
BEGIN
	UPDATE `log`
		SET `log`.`is_present` = 0
        WHERE `log`.`end_time` IS NULL
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
    IN `_mac` varchar(45),
	IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_id` varchar(45)
)
BEGIN
	DECLARE `_user_id` INT(10) DEFAULT NULL;
    CALL __getMacsUserId(`_user_id`, `_mac`);
    
    IF (
			SELECT u.`sync_level`
				FROM `user` u
                WHERE u.`user_id` = `_user_id`
		) NOT IN ('k')
        THEN BEGIN
			
            UPDATE `user`
				SET `user`.`name` = COALESCE(`_name`,
					`user`.`name`),
					`user`.`surname` = COALESCE(`_surname`,
                    `user`.`surname`),
					`user`.`sync_level` = (
						CASE WHEN `user`.`sync_level` IN ('x')
							THEN 'x'
							ELSE 'n'
						END
					)
				WHERE `user`.`user_id` = `_user_id`
			;
            
            UPDATE `proffessor`
				SET `proffessor`.`identification` = COALESCE(`_id`,
					`proffessor`.`identification`)
                WHERE `proffessor`.`user_id` = `_user_id`
			;
            
            UPDATE `student`
				SET `student`.`index` = COALESCE(`_id`,
					`student`.`index`)
				WHERE `student`.`user_id` = `_user_id`
			;
		
		END;
	END IF;
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
        AND m.`is_active` = 1
	;
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
	OUT `_logger_id` int(10),
	IN `_logger_mac` varchar(45)
)
BEGIN
	SELECT l.`logger_id` INTO `_logger_id`
		FROM `logger` l
		WHERE l.`mac` = `_logger_mac`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getMacsUserId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getMacsUserId`(
	OUT `_user_id` int(10),
	IN `_mac` varchar(45)
)
BEGIN
	SELECT m.`user_id` INTO `_user_id`
		FROM `mac` m
        WHERE m.`mac_address` = `_mac`
        AND m.`is_active` = 1
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__getProffessorId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__getProffessorId`(
	OUT `_user_id` int(10),
	IN `_identication` varchar(45)
)
BEGIN
	SELECT u.`user_id` INTO `_user_id`
		FROM `user` u
        INNER JOIN `proffessor` p ON p.`user_id` = u.`user_id`
        WHERE p.`identication` = `_identication`
	;
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
	OUT `_user_id` int(10),
	IN `_index` varchar(45)
)
BEGIN
	SELECT u.`user_id` INTO `_user_id`
		FROM `user` u
        INNER JOIN `student` s ON s.`user_id` = u.`user_id`
        WHERE s.`index` = `_index`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__insertImportedUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__insertImportedUser`(
	IN `_server_id` int(10),
    IN `_type` char,
    IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_id` varchar(45)
)
BEGIN
	INSERT INTO `user` (
			`name`, `surname`, `sync_level`, `server_id`
		) VALUES (
			`_name`, `_surname`, 's', `_server_id`
		)
	;
	
    IF `_type` = 'p' THEN
		INSERT INTO `proffessor` (
				`user_id`, `identification`
			) VALUES (
				LAST_INSERT_ID(), `_id`
			)
		;
	ELSE
    IF `_type` = 's' THEN
		INSERT INTO `student` (
				`user_id`, `index`
			) VALUES (
				LAST_INSERT_ID(), `_id`
			)
		;
	END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__insertMac` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__insertMac`(
	IN `_user_id` int(10),
    IN `_mac` varchar(45),
	IN `_time` datetime
)
BEGIN
	UPDATE `mac`
		SET `mac`.`is_active` = 0,
			`mac`.`end_time` = `_time`
		WHERE `mac`.`user_id` = `_user_id`
        AND `mac`.`is_active` = 1
	;
    
	INSERT INTO `mac` (
			`mac_address`, `user_id`, `start_time`
		) VALUES (
			`_mac`, `_user_id`, `_time`
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
/*!50003 DROP PROCEDURE IF EXISTS `__setUserServerId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__setUserServerId`(
	IN `_type` char,
    IN `_id` varchar(45),
    IN `_server_id` int(10)
)
BEGIN
	DECLARE `_user_id` INT(10) DEFAULT NULL;
    
	IF `_type` = 's'
		THEN CALL __getStudentId(`_user_id`, `_id`);
	ELSE IF `_type` = 'p'
		THEN CALL __getProffessorId(`_user_id`, `_id`);
	END IF;
    END IF;
    
    UPDATE `user`
		SET `user`.`server_id` = `_server_id`,
			`user`.`sync_level` = 's'
		WHERE `user`.`user_id` = `_user_id`
	;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `__updateImportedUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `__updateImportedUser`(
	IN `_server_id` varchar(45),
	IN `_name` varchar(45),
    IN `_surname` varchar(45),
    IN `_id` varchar(45)
)
BEGIN
	DECLARE `_user_id` INT(10) DEFAULT NULL;
    SELECT u.`user_id` INTO `_user_id`
		FROM `user` u
        WHERE u.`server_id` = `_server_id`
	;
    
    UPDATE `user`
		SET `user`.`name` = COALESCE(`_name`, `user`.`name`),
			`user`.`surname` = COALESCE(`_surname`,
            `user`.`surname`),
			`user`.`sync_level` = 's'
		WHERE `user`.`user_id` = `_user_id`
	;
    
	UPDATE `proffessor`
		SET `proffessor`.`identification` = COALESCE(`_id`,
			`proffessor`.`identification`)
		WHERE `proffessor`.`user_id` = `_user_id`
	;
    
    UPDATE `student`
		SET `student`.`index` = COALESCE(`_index`,
			`student`.`index`)
		WHERE `student`.`user_id` = `_user_id`
	;
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

-- Dump completed on 2018-09-21 14:28:01
