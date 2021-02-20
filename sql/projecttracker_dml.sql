-- INSERT queries
INSERT INTO Employees
INSERT INTO Projects
INSERT INTO Tasks
INSERT INTO Managers
INSERT INTO Developers
INSERT INTO AssignedTasks
INSERT INTO ManagedProjects

-- SELECT queries
-- This query will generate the Project List page.
SELECT 
    title, 
    CONCAT(Employees.firstName, ' ', Employees.lastName), 
    percentComplete, 
    projectStatus, 
    plannedEnd 
FROM Projects
JOIN ManagedProjects ON
    ManagedProjects.projectID = Projects.projectID
JOIN Managers ON
    Managers.managerID = ManagedProjects.managerID
JOIN Employees ON
    Managers.employeeID = Employees.employeeID;

-- This query will generate the Project page.

-- Projet Header Info
SELECT 
    title, 
    CONCAT(Employees.firstName, ' ', Employees.lastName), 
    percentComplete, 
    projectStatus, 
    plannedEnd 
FROM Projects
JOIN ManagedProjects ON
    ManagedProjects.projectID = Projects.projectID
JOIN Managers ON
    Managers.managerID = ManagedProjects.managerID
JOIN Employees ON
    Managers.employeeID = Employees.employeeID
WHERE 
    projectID = :projectID_selected_from_GETreq;

-- Task List
SELECT 
    taskID,
    title,
    taskDetails,
    AssignedTasks.developerID AS "developerID",
    CONCAT(Employees.firstName, ' ', Employees.lastName) AS "owner", 
    dueDate,
    AssignedTasks.satisfaction AS "satisfaction"
FROM Tasks 
JOIN AssignedTasks ON
    AssignedTasks.taskID = Tasks.taskID
JOIN Developers ON
    Developers.developerID = AssignedTasks.developerID
JOIN Employees ON
    Employees.employeeID = Developers.employeeID
WHERE projectID = :projectID_selected_from_GETreq
    AND completed = 0;

-- This query will generate the profile
SELECT FROM Managers

-- This query will generate the TaskList page.
SELECT 
    title,
    taskDetails,
    CONCAT(Employees.firstName, ' ', Employees.lastName), 
    dueDate
FROM Tasks 
JOIN AssignedTasks ON
    AssignedTasks.taskID = Tasks.taskID
JOIN Developers ON
    Developers.developerID = AssignedTasks.developerID
JOIN Employees ON
    Employees.employeeID = Developers.employeeID
WHERE employeeID = :employeeID_selected_from_GETreq
    AND completed = 0;

-- DELETE queries
-- Project Deletion needs to delete from multiple tables
DELETE Projects.*, ManagedProjects.* FROM Projects
LEFT JOIN ManagedProjects
    ON ManagedProjects.projectID = Projects.projectID
WHERE projectId= :projectId_selected_from_projectlist

-- Task Deletion needs to delete from multiple tables
DELETE Tasks.*, AssignedTasks.* FROM Tasks
LEFT JOIN AssignedTasks
    ON AssignedTasks.taskId = Tasks.taskID
WHERE taskId= :taskId_selected_from_tasklist

-- Employee deletion needs to delete from multiple tables.
DELETE Employees.*, Managers.*, Developers.* FROM Employees
LEFT JOIN Managers
    ON Managers.employeeID = Employees.employeeID
LEFT JOIN Developers
    ON Developers.employeeID = Employees.employeeID
WHERE employeeID = :employeeID_selected_from_profile

DELETE FROM Managers WHERE managerID = :managerID_selected_from_profile
DELETE FROM AssignedTasks WHERE taskID = taskId_selected_from_tasklist AND developerID_selected_from_tasklist

DELETE FROM ManagedProjects WHERE projectID= :projectId_selected_from_projectlist

DELETE FROM Developers WHERE developerID = :developerID_selected_from_profile

-- UPDATE queries
UPDATE Projects
UPDATE Tasks
UPDATE Employees