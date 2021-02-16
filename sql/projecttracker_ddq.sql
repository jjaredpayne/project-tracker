USE cs340_payneje;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS Tasks;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Managers;
DROP TABLE IF EXISTS AssignedTasks;
DROP TABLE IF EXISTS ManagedProjects;
DROP TABLE IF EXISTS Developers;
SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE Projects (
  projectID int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  percentComplete int(11) NOT NULL,
  plannedEnd date,  
  projectStatus int(11) NOT NULL,
  PRIMARY KEY (projectID)
) ENGINE=InnoDB;

LOCK TABLES Projects WRITE;
INSERT INTO Projects(title, percentComplete, plannedEnd, projectStatus)
VALUES ('Project 1 Title', 0, '2021-02-18', 0),('Project 2 Title', 0, NULL, 0), ('Project 3 Title', 0, NULL, 0), ('Project 4 Title', 0, NULL, 0),
('Project 5 Title', 0, '2021-02-15', 0);
UNLOCK TABLES;

DESCRIBE Projects;


CREATE TABLE Tasks (
  taskID int(11) NOT NULL AUTO_INCREMENT,
  projectID int(11) NOT NULL,
  title varchar(255) NOT NULL,
  taskDetails varChar(255) NOT NULL,
  dueDate date,  
  completed int(11) NOT NULL,
  PRIMARY KEY (taskID),
  KEY projectID (projectID),
  CONSTRAINT tasks_ibfk_1 FOREIGN KEY (projectID) REFERENCES Projects (projectID)
) ENGINE=InnoDB;

LOCK TABLES Tasks WRITE;
INSERT INTO Tasks(projectID, title, taskDetails, dueDate, completed)
VALUES (1, 'P1 SunTask', 'SunTaskDetails', '', 0), (1, 'P1 MoonTask', 'MoonTaskDetails', '', 0), (1, 'P2 FireTask', 'SunTaskDetails', '', 0), (1, 'P3 WaterTask', 'MoonTaskDetails', '', 0), (1, 'P4 EtherTask', 'MoonTaskDetails', '', 0);
UNLOCK TABLES;

DESCRIBE Tasks;


CREATE TABLE Employees(
  employeeID int(11) NOT NULL AUTO_INCREMENT,
  firstName varchar(255) NOT NULL,
  lastName varchar(255),
  PRIMARY KEY (employeeID)
) ENGINE=InnoDB;

LOCK TABLES Employees WRITE;
INSERT INTO Employees(firstName, lastName)
VALUES ("Sarah", "Bell"), ("Jared", "Payne"), ("Peanut", "Hamper"), ("Werner", "Hamper"), ("Sandman ", "O'Niell");
UNLOCK TABLES;

DESCRIBE Employees;


CREATE TABLE Managers (
  managerID int(11) NOT NULL AUTO_INCREMENT,
  employeeID int(11) NOT NULL,
  managementStyle varchar(255) DEFAULT NULL,
  PRIMARY KEY (managerID),
  CONSTRAINT managers_ibfk_1 FOREIGN KEY (employeeID) REFERENCES Employees (employeeID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES Managers WRITE;
INSERT INTO Managers(employeeID, managementStyle)
VALUES (1, 'Zen'), (2, 'Tyrant');
UNLOCK TABLES;

DESCRIBE Managers;


CREATE TABLE ManagedProjects (
  managerID int(11) NOT NULL,
  projectID int(11) NOT NULL,
  PRIMARY KEY (managerID, projectID),
  CONSTRAINT managedprojects_ibfk_1 FOREIGN KEY (managerID) REFERENCES Managers (managerID),
  CONSTRAINT managedprojects_ibfk_2 FOREIGN KEY (projectID) REFERENCES Projects (projectID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES ManagedProjects WRITE;
INSERT INTO ManagedProjects(managerID, projectID)
VALUES (1, 1), (1, 2), (2, 3), (2, 4);
UNLOCK TABLES;

DESCRIBE ManagedProjects;


CREATE TABLE Developers (
  developerID int(11) NOT NULL AUTO_INCREMENT,
  employeeID int(11) NOT NULL,
  PRIMARY KEY (developerID),
  CONSTRAINT developers_ibfk_1 FOREIGN KEY (employeeID) REFERENCES Employees(employeeID)
) ENGINE=InnoDB;

LOCK TABLES Developers WRITE;
INSERT INTO Developers(employeeID)
VALUES (1),(2),(3),(4);
UNLOCK TABLES;

DESCRIBE Developers;


CREATE TABLE AssignedTasks (
  developerID int(11) NOT NULL,
  taskID int(11) NOT NULL,
  effectiveness varchar(255) DEFAULT NULL,
  satisfaction varchar(255) DEFAULT NULL,
  PRIMARY KEY (developerID, taskID),
  CONSTRAINT assignedtasks_ibfk_1 FOREIGN KEY (developerID) REFERENCES Developers(developerID),
  CONSTRAINT assignedtasks_ibfk_2 FOREIGN KEY (taskID) REFERENCES Tasks(taskID)
) ENGINE=InnoDB;

LOCK TABLES AssignedTasks WRITE;
INSERT INTO AssignedTasks (developerID, taskID)
VALUES (1, 1),(1, 2),(1, 3),(2, 3),(4,4),(3,5);
UNLOCK TABLES;

DESCRIBE AssignedTasks;