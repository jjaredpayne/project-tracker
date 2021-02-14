-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: bsg
-- ------------------------------------------------------
-- Server version	10.1.37-MariaDB

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
-- Table structure for table 'Employees'
--

DROP TABLE IF EXISTS 'Employees';
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE 'Employees' (
  'employeeID' int(11) NOT NULL AUTO_INCREMENT,
  'firstName' varchar(255) NOT NULL,
  'lastName' varchar(255),
  PRIMARY KEY ('employeeID')
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table 'Employees'
--

LOCK TABLES 'Employees' WRITE;
/*!40000 ALTER TABLE 'Employees' DISABLE KEYS */;
INSERT INTO 'Employees' VALUES (1,'Jared', 'Payne');
/*!40000 ALTER TABLE 'Employees' ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table 'Developers'
--

DROP TABLE IF EXISTS 'Developers';
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE 'Developers' (
  'developerID' int(11) NOT NULL DEFAULT '0',
  'employeeID' int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY ('developerID'),
  KEY 'employeeID' ('employeeID'),
  CONSTRAINT 'developers_ibfk_2' FOREIGN KEY ('employeeID') REFERENCES 'Employees' ('employeeID')
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table 'Developers'
--

LOCK TABLES 'Developers' WRITE;
/*!40000 ALTER TABLE 'bsg_cert_people' DISABLE KEYS */;
/*!40000 ALTER TABLE 'bsg_cert_people' ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table 'Managers'
--

DROP TABLE IF EXISTS 'Managers';
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE 'Managers' (
  'managerID' int(11) NOT NULL AUTO_INCREMENT,
  'employeeID' varchar(255) NOT NULL,
  'managementStyle' varchar(255) DEFAULT NULL,
  PRIMARY KEY ('managerID'),
  KEY 'employeeID' ('employeeID'),
  CONSTRAINT 'managers_employees_ibfk_1' FOREIGN KEY ('employeeID') REFERENCES 'Employees' ('employeeID')
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table 'Managers'
--

LOCK TABLES 'Managers' WRITE;
/*!40000 ALTER TABLE 'bsg_people' DISABLE KEYS */;
INSERT INTO 'Managers' VALUES (1, 1, 'Tyrant');
/*!40000 ALTER TABLE 'bsg_people' ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table 'bsg_planets'
--

DROP TABLE IF EXISTS 'AssignedTasks';
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE 'AssignedTasks' (
  'developerID' int(11) NOT NULL,
  'taskID' int(11) NOT NULL,
  'effectiveness' int(11) DEFAULT NULL,
  'satisfaction' varchar(255) DEFAULT NULL,
  PRIMARY KEY ('developerID', 'taskID'),
  CONSTRAINT 'assignedtasks_ibfk_1' FOREIGN KEY ('developerID') REFERENCES 'Developers' ('developerID')
  CONSTRAINT 'assignedtasks_ibfk_1' FOREIGN KEY ('taskID') REFERENCES 'Tasks' ('taskID')
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table 'AssignedTasks'
--

LOCK TABLES 'AssignedTasks' WRITE;

/*!40000 ALTER TABLE 'bsg_planets' DISABLE KEYS */;
/*!40000 ALTER TABLE 'bsg_planets' ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table 'Tasks'
--

DROP TABLE IF EXISTS 'Tasks';
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE 'Tasks' (
  'taskID' int(11) NOT NULL AUTO_INCREMENT,
  'projectID' varchar(255) NOT NULL,
  'title' varchar(255) NOT NULL,
  'taskDetails' varChar(255) NOT NULL,
  'dueDate' date,  
  'complete' bool NOT NULL,
  PRIMARY KEY ('id')
  CONSTRAINT 'tasks_ibfk_1' FOREIGN KEY ('projectID') REFERENCES 'Projects' ('projectID')
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table 'Tasks'
--

LOCK TABLES 'Tasks' WRITE;
/*!40000 ALTER TABLE 'Tasks' DISABLE KEYS */;
INSERT INTO 'Tasks' VALUES (1, 1, 'Task 1 Title', 'Task Details', NULL, 0);
/*!40000 ALTER TABLE 'Tasks' ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table 'Tasks'
--

DROP TABLE IF EXISTS 'Projects';
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE 'Projects' (
  'projectID' int(11) NOT NULL AUTO_INCREMENT,
  'title' varchar(255) NOT NULL,
  'percentComplete' int(11) NOT NULL,
  'plannedEnd' date,  
  'status' int(11) NOT NULL,
  PRIMARY KEY ('projectID')
  CONSTRAINT 'projects_ibfk_1' FOREIGN KEY ('managerID') REFERENCES 'Managers' ('managerID')
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table 'Projects'
--

LOCK TABLES 'Projects' WRITE;
/*!40000 ALTER TABLE 'Projects' DISABLE KEYS */;
INSERT INTO 'Projects' VALUES (1, 1, 'Project 1 Title', 0, NULL, NULL, 0);
/*!40000 ALTER TABLE 'Projects' ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table 'Tasks'
--

DROP TABLE IF EXISTS 'ManagedProjects';
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE 'ManagedProjects' (
  'managerID' int(11) NOT NULL,
  'projectID' varchar(255) NOT NULL,
  PRIMARY KEY ('managerID','projectID'),
  CONSTRAINT 'managedprojects_ibfk_1' FOREIGN KEY ('managerID') REFERENCES 'Managers' ('managerID'),
  CONSTRAINT 'managedprojects_ibfk_2' FOREIGN KEY ('projectID') REFERENCES 'ManageProjects' ('projectID')
  
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table 'ManagedProjects'
--

LOCK TABLES 'ManagedProjects' WRITE;
/*!40000 ALTER TABLE 'ManagedProjects' DISABLE KEYS */;
INSERT INTO 'ManagedProjects' VALUES (1, 1);
/*!40000 ALTER TABLE 'ManagedProjects' ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-03  0:38:33
