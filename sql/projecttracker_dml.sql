-- INSERT queries
INSERT INTO Employees
INSERT INTO Projects
INSERT INTO Tasks
INSERT INTO Managers
INSERT INTO Developers
INSERT INTO AssignedTasks
INSERT INTO ManagedProjects

-- SELECT queries

SELECT FROM Projects
SELECT FROM Tasks
SELECT FROM Managers
SELECT FROM AssignedTasks

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