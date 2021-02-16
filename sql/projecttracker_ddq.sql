USE cs340_payneje;

DROP TABLE IF EXISTS Employees;
CREATE TABLE Employees(
  employeeID int(11) NOT NULL AUTO_INCREMENT,
  firstName varchar(255) NOT NULL,
  lastName varchar(255),
  PRIMARY KEY (employeeID)
) ENGINE=InnoDB;

INSERT INTO Employees(firstName, lastName)
VALUES ("Sarah", "Bell");
VALUES ("Jared", "Payne");
VALUES ("Peanut", "Hamper");

DROP TABLE IF EXISTS Developers;
CREATE TABLE Developers (
  developerID int(11) NOT NULL AUTO_INCREMENT,
  employeeID int(11) NOT NULL,
  PRIMARY KEY (developerID),
  KEY employeeID (employeeID),
  CONSTRAINT developers_ibfk_1 FOREIGN KEY (employeeID) REFERENCES Employees (employeeID)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES Developers WRITE;
INSERT INTO Developers (employeeID)
VALUES (1),(2);
UNLOCK TABLES;


DROP TABLE IF EXISTS Managers;
CREATE TABLE Managers (
  managerID int(11) NOT NULL AUTO_INCREMENT,
  employeeID int(11) NOT NULL,
  managementStyle varchar(255) DEFAULT NULL,
  PRIMARY KEY (managerID),
  KEY employeeID (employeeID),
  CONSTRAINT managers_ibfk_1 FOREIGN KEY (employeeID) REFERENCES Employees (employeeID)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES Managers WRITE;
INSERT INTO Managers(employeeID, managementStyle)
VALUES (1, 'Zen');
UNLOCK TABLES;


DROP TABLE IF EXISTS AssignedTasks;
CREATE TABLE AssignedTasks (
  developerID int(11) NOT NULL,
  taskID int(11) NOT NULL,
  effectiveness varchar(255) DEFAULT NULL,
  satisfaction varchar(255) DEFAULT NULL,
  PRIMARY KEY (developerID, taskID),
  CONSTRAINT assignedtasks_ibfk_1 FOREIGN KEY (developerID) REFERENCES Developers(developerID),
  CONSTRAINT assignedtasks_ibfk_2 FOREIGN KEY (taskID) REFERENCES Tasks(taskID)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES AssignedTasks WRITE;
INSERT INTO AssignedTasks (developerID, taskID, effectiveness, satisfaction)
VALUES (1, 1, 'Very Effective', 'Very Satisfied');
VALUES (2, 2, 'Very Effective', 'Very Satisfied');
UNLOCK TABLES;


DROP TABLE IF EXISTS Tasks;
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
VALUES (1, 'P1 SunTask', 'SunTaskDetails', '', 0);
VALUES (1, 'P1 MoonTask', 'MoonTaskDetails', '', 0);
UNLOCK TABLES;


DROP TABLE IF EXISTS Projects;
CREATE TABLE Projects (
  projectID int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  percentComplete int(11) NOT NULL,
  plannedEnd date,  
  status int(11) NOT NULL,
  PRIMARY KEY (projectID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES Projects WRITE;
INSERT INTO Projects(title, percentComplete, plannedEnd, status)
VALUES ('Project 1 Title', 0, NULL, 0);
UNLOCK TABLES;


DROP TABLE IF EXISTS ManagedProjects;
CREATE TABLE ManagedProjects (
  managerID int(11) NOT NULL,
  projectID int(11) NOT NULL,
  PRIMARY KEY (managerID, projectID),
  CONSTRAINT managedprojects_ibfk_1 FOREIGN KEY (managerID) REFERENCES Managers (managerID),
  CONSTRAINT managedprojects_ibfk_2 FOREIGN KEY (projectID) REFERENCES ManageProjects (projectID)
  
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

LOCK TABLES ManagedProjects WRITE;
INSERT INTO ManagedProjects(managerID, projectID)
VALUES (1, 1);
UNLOCK TABLES;