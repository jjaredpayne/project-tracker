DROP TABLE IF EXISTS Employees;
CREATE TABLE Employees(
  employeeID int(11) NOT NULL AUTO_INCREMENT,
  firstName varchar(255) NOT NULL,
  lastName varchar(255),
  PRIMARY KEY (employeeID)
) ENGINE=InnoDB;

LOCK TABLES Employees WRITE;
INSERT INTO Employees VALUES (1,Jared, Payne);
UNLOCK TABLES;


DROP TABLE IF EXISTS Developers;
CREATE TABLE Developers (
  developerID int(11) NOT NULL DEFAULT 0,
  employeeID int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (developerID),
  KEY employeeID (employeeID),
  CONSTRAINT developers_ibfk_2 FOREIGN KEY (employeeID) REFERENCES Employees (employeeID)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES Developers WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS Managers;
CREATE TABLE Managers (
  managerID int(11) NOT NULL AUTO_INCREMENT,
  employeeID varchar(255) NOT NULL,
  managementStyle varchar(255) DEFAULT NULL,
  PRIMARY KEY (managerID),
  KEY employeeID (employeeID),
  CONSTRAINT managers_employees_ibfk_1 FOREIGN KEY (employeeID) REFERENCES Employees (employeeID)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=latin1;

LOCK TABLES Managers WRITE;
INSERT INTO Managers VALUES (1, 1, Tyrant);
UNLOCK TABLES;


DROP TABLE IF EXISTS AssignedTasks;
CREATE TABLE AssignedTasks (
  developerID int(11) NOT NULL,
  taskID int(11) NOT NULL,
  effectiveness int(11) DEFAULT NULL,
  satisfaction varchar(255) DEFAULT NULL,
  PRIMARY KEY (developerID, taskID),
  CONSTRAINT assignedtasks_ibfk_1 FOREIGN KEY (developerID) REFERENCES Developers (developerID),
  CONSTRAINT assignedtasks_ibfk_1 FOREIGN KEY (taskID) REFERENCES Tasks (taskID)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

LOCK TABLES AssignedTasks WRITE;
INSERT INTO AssignedTasks VALUES (1, 1);
UNLOCK TABLES;


DROP TABLE IF EXISTS Tasks;
CREATE TABLE Tasks (
  taskID int(11) NOT NULL AUTO_INCREMENT,
  projectID varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  taskDetails varChar(255) NOT NULL,
  dueDate date,  
  complete bool NOT NULL,
  PRIMARY KEY (id)
  CONSTRAINT tasks_ibfk_1 FOREIGN KEY (projectID) REFERENCES Projects (projectID)
) ENGINE=InnoDB;

LOCK TABLES Tasks WRITE;
INSERT INTO Tasks VALUES (1, 1, Task 1 Title, Task Details, NULL, 0);
UNLOCK TABLES;


DROP TABLE IF EXISTS Projects;
CREATE TABLE Projects (
  projectID int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  percentComplete int(11) NOT NULL,
  plannedEnd date,  
  status int(11) NOT NULL,
  PRIMARY KEY (projectID)
  CONSTRAINT projects_ibfk_1 FOREIGN KEY (managerID) REFERENCES Managers (managerID)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

LOCK TABLES Projects WRITE;
INSERT INTO Projects VALUES (1, 1, 'Project 1 Title', 0, NULL, NULL, 0);
UNLOCK TABLES;


DROP TABLE IF EXISTS ManagedProjects;
CREATE TABLE ManagedProjects (
  managerID int(11) NOT NULL,
  projectID varchar(255) NOT NULL,
  PRIMARY KEY (managerID,projectID),
  CONSTRAINT managedprojects_ibfk_1 FOREIGN KEY (managerID) REFERENCES Managers (managerID),
  CONSTRAINT managedprojects_ibfk_2 FOREIGN KEY (projectID) REFERENCES ManageProjects (projectID)
  
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

LOCK TABLES ManagedProjects WRITE;
INSERT INTO ManagedProjects VALUES (1, 1);
UNLOCK TABLES;
