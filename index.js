var express = require('express');
var bodyParser = require('body-parser');
var CORS = require('cors');
var session = require('express-session');
var request = require('request');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var mysql = require('mysql');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: 'SuperSecretPassword'}));
app.use(CORS());
app.use(express.static('public'));
app.use(express.static('js'));
app.use(express.static('css'));
app.use(express.static('jquery'));
app.use(express.static('images'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8916);

const selectManagers = "SELECT * FROM Employees JOIN Managers ON Employees.employeeID = Managers.employeeID";
// const selectDevelopers = "SELECT * FROM Employees JOIN Developers ON Employees.employeeID = Developers.employeeID";
// const countTasks = "SELECT COUNT(*) FROM AssignedTasks JOIN Developers ON AssignedTasks.developerID = Developers.developerID"
// const selectDevelopers = "SELECT Employees.employeeID, Employees.firstName, Employees.lastName, Count(AssignedTasks.taskID) as totaltasks FROM Employees JOIN Developers ON Employees.employeeID = Developers.employeeID JOIN AssignedTasks ON Developers.developerID = AssignedTasks.developerID";


const selectDevelopers = 
`SELECT Employees.employeeID, firstName, lastName, COUNT(AssignedTasks.taskID) as totalTasks
FROM Employees
    INNER JOIN Developers ON Employees.employeeID = Developers.employeeID
    LEFT JOIN AssignedTasks ON Developers.developerID  = AssignedTasks.developerID
GROUP BY Employees.employeeID`
const deleteManagedProjects = "DELETE ManagedProjects FROM ManagedProjects WHERE ManagedProjects.managerID IN (SELECT Managers.managerID FROM Managers WHERE Managers.employeeID = ";
const deleteManager = "DELETE FROM Managers WHERE Managers.employeeID = ";
const deleteAssignedProjects = "DELETE AssignedTasks FROM AssignedTasks WHERE AssignedTasks.developerID IN (SELECT Developers.developerID FROM Developers WHERE Developers.employeeID = ";
const deleteDeveloper = "DELETE FROM Developers WHERE Developers.employeeID = ";
const getProjectQuery =`SELECT 
    projectID, title, percentComplete, projectStatus AS status, SUBSTRING(plannedEnd, 1, 10) AS dueDate
  FROM Projects`;
const getIncompleteTasksQuery = `SELECT taskID, Tasks.title as title, taskDetails,
  SUBSTRING(dueDate, 1, 10) AS dueDate, Tasks.projectID, Projects.title AS projectTitle
  FROM Tasks 
  JOIN Projects ON Projects.projectID = Tasks.projectID
  WHERE completed = 0 `;
const getCompleteTasksQuery = `SELECT taskID, title, taskDetails,
  SUBSTRING(dueDate, 1, 10) AS dueDate, Tasks.projectID, Projects.title AS projectTitle
  FROM Tasks 
  JOIN Projects ON Projects.projectID = tasks.ProjectID
  WHERE completed = 0 `;
const insertProjectQuery = "INSERT INTO Projects(`title`, `plannedEnd`, `projectStatus`) VALUES (?,?,?) ";
const deleteProjectQuery = "DELETE FROM Projects WHERE projectID=? ";
const deleteProjectTasks = "DELETE FROM Tasks WHERE projectID=? ";
const deleteTaskQuery = "DELETE FROM Tasks WHERE taskID=? ";
const deleteAssignedTask = "DELETE FROM AssignedTasks WHERE taskID=? "
const updateProjectQuery = "UPDATE Projects SET title=?, percentComplete=?, plannedEnd=?, projectStatus=? WHERE projectID=? ";
const updateTaskQuery = "UPDATE Tasks SET title=?, taskDetails=?, dueDate=?, completed=? WHERE taskID=? ";
const markTaskComplete = "UPDTATE Tasks SET completed=1 WHERE taskID=? "
const getAllProjects = "SELECT title AS name, projectID AS id FROM Projects ";

//Create mysql pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_payneje',
    password: 'Seattleites',
    database: 'cs340_payneje'
});

module.exports.pool = pool;

app.get('/', function (req, res, next) {
  res.render('index');
});

app.get('/index.html', function (req, res, next) {
  res.render('index');
});

app.get('/registeremployee.html',function(req,res,next){
  res.render('registeremployee');
});

app.get('/profile.html', function (req, res, next) {
  let context = {};
  if(req.body.workRole === "2"){
    pool.query(selectManagers, function (err, rows, results) {
      context.sqlresults = JSON.parse(JSON.stringify(rows));
      res.render('profile', context);
    });
  }
  else{
    pool.query(selectDevelopers, function (err, rows, fields) {
      context.sqlresults = JSON.parse(JSON.stringify(rows));
      res.render('profile', context);
    });
  }
});

app.post('/displayEmployees', function (req, res, next) {
  let context = {};
  console.log(req.body)
  if(req.body.firstName !== '' && req.body.lastName === ''){
    if(req.body.workRole === "1"){
      pool.query(selectDevelopers + " WHERE Employees.firstName = '" + req.body.firstName + "';", function (err, rows, results) {
        console.log("firstname not, lastname null")
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        // pool.query(selectDevelopers + " WHERE Employees.firstName ='" + req.body.firstName + "';", function (err, rows2, results) {
        //   console.log(rows);
        //   context.numberoftasks = JSON.parse(JSON.stringify(rows));
        //   context.developerID = 1;
        //   context.managerID = '';
        //   console.log("sql"+context.numberoftasks)
        //   res.render('profile', context);
        // });
      });
    }
    else{
      pool.query(selectManagers + " WHERE Employees.firstName = '" + req.body.firstName + "';", function (err, rows, fields) {
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        for (var key in context.sqlresults){
          console.log(typeof key)
          console.log(context.sqlresults[key].managementStyle)
          if (context.sqlresults[key].managementStyle === 1) context.sqlresults[key].managementStyle = 'Tyrant';
          if (context.sqlresults[key].managementStyle === 2) context.sqlresults[key].managementStyle = 'Nurturer';
          if (context.sqlresults[key].managementStyle === 3) context.sqlresults[key].managementStyle = 'Anything Goes!';
        };
        console.log (context.sqlresults)
        
        context.developerID = '';
        context.managerID = 1;
        res.render('profile', context);
      });
    }
  }
  else if(req.body.firstName === '' && req.body.lastName !== ''){
    if(req.body.workRole === "1"){
      pool.query(selectDevelopers + " WHERE Employees.lastName = '" + req.body.lastName + "';", function (err, rows, results) {
        console.log("firstname null, lastname not")
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        context.developerID = 1;
        context.managerID = '';
        res.render('profile', context);
      });
    }
    else{
      pool.query(selectManagers + " WHERE Employees.lastName = '" + req.body.lastName + "';", function (err, rows, fields) {
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        for (var key in context.sqlresults){
          console.log(typeof key)
          console.log(context.sqlresults[key].managementStyle)
          if (context.sqlresults[key].managementStyle === 1) context.sqlresults[key].managementStyle = 'Tyrant';
          if (context.sqlresults[key].managementStyle === 2) context.sqlresults[key].managementStyle = 'Nurturer';
          if (context.sqlresults[key].managementStyle === 3) context.sqlresults[key].managementStyle = 'Anything Goes!';
        };
        context.developerID = '';
        context.managerID = 1;
        res.render('profile', context);
      });
    }
  }
  else if(req.body.firstName !== '' && req.body.lastName !== ''){
    if(req.body.workRole === "1"){
      pool.query(selectDevelopers + " WHERE Employees.firstName = '" + req.body.firstName + "' AND Employees.lastName = '" + req.body.lastName + "'", function (err, rows, results) {
        console.log("firstname not, lastname not")
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        console.log(context.sqlresults)
        context.developerID = 1;
        context.managerID = '';
        res.render('profile', context);
      });
    }
    else{
      pool.query(selectManagers + " WHERE Employees.firstName = '" + req.body.firstName + "' AND Employees.lastName = '" + req.body.lastName + "'", function (err, rows, fields) {
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        for (var key in context.sqlresults){
          console.log(typeof key)
          console.log(context.sqlresults[key].managementStyle)
          if (context.sqlresults[key].managementStyle === 1) context.sqlresults[key].managementStyle = 'Tyrant';
          if (context.sqlresults[key].managementStyle === 2) context.sqlresults[key].managementStyle = 'Nurturer';
          if (context.sqlresults[key].managementStyle === 3) context.sqlresults[key].managementStyle = 'Anything Goes!';
        };
        context.developerID = '';
        context.managerID = 1;
        res.render('profile', context);
      });
    }
  }
  else if(req.body.firstName === '' && req.body.lastName === ''){
    console.log("firstname null, lastname null")
    if(req.body.workRole === "1"){
      pool.query(selectDevelopers, function (err, rows, results) {
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        context.developerID = 1;
        context.managerID = '';
        console.log(context.sqlresults);
        res.render('profile', context);
      });
    }
    else{
      pool.query(selectManagers, function (err, rows, fields) {
        console.log("display manager")
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        
        for (var key in context.sqlresults){
          console.log(typeof key)
          console.log(context.sqlresults[key].managementStyle)
          if (context.sqlresults[key].managementStyle === 1) context.sqlresults[key].managementStyle = 'Tyrant';
          if (context.sqlresults[key].managementStyle === 2) context.sqlresults[key].managementStyle = 'Nurturer';
          if (context.sqlresults[key].managementStyle === 3) context.sqlresults[key].managementStyle = 'Anything Goes!';
        };
        context.developerID = '';
        context.managerID = 1;
        console.log(context.sqlresults);
        console.log(context.developerID);
        res.render('profile', context);
      });
    }
  }
});

app.post('/deleteDeveloper', function (req, res, next) {
  let context = {};
  console.log("deleting Developer" + req.body.rowId);
  pool.query(deleteAssignedProjects + req.body.rowId +")", function (err, rows, results) {
  });
  console.log(context.sqlresults);
  pool.query(deleteDeveloper + req.body.rowId, function (err, rows, results) {
  });
  console.log(context.sqlresults);
  pool.query(selectDevelopers, function (err, rows, results) {
    context.sqlresults = JSON.parse(JSON.stringify(rows));
    console.log(context.sqlresults);
    res.render('profile', context);
  });
});

app.post('/deleteManager', function (req, res, next) {
  let context = {};
  pool.query(deleteManagedProjects + req.body.rowId +")", function (err, rows, results) {
  });
  pool.query(deleteManager + req.body.rowId, function (err, rows, results) {
  });
  pool.query(selectManagers, function (err, rows, results) {
    context.sqlresults = JSON.parse(JSON.stringify(rows));
    res.render('profile', context);
  });
});

app.post('/updateEmployee', function (req, res, next) {
  let context = {};
  console.log("updatingEmployee" + req.body.submitID);
  console.log("updatingEmployee" + req.body.firstName);
  console.log("updatingEmployee" + req.body.lastName);
  pool.query("UPDATE Employees SET firstName = '" + req.body.firstName + "', lastName = '" + req.body.lastName + "' WHERE employeeID = " + req.body.submitID , function (err, rows, results) {
    console.log(err);
  });
  pool.query(selectManagers, function (err, rows, results) {
    context.sqlresults = JSON.parse(JSON.stringify(rows));
    res.render('profile', context);
  });
});


app.get('/insertemployee', function (req, res, next) {
  console.log("insert employee")
  var context = {};
  pool.query("INSERT INTO Employees (`lastName`, `firstName`) VALUES (?, ?)", [req.query.lastName, req.query.firstName], function (err, result) {
  });
});

app.get('/insertmanager', function (req, res, next) {
  const insertManager1 = "BEGIN; INSERT INTO Employees (lastName, firstName) VALUES( "
  const insertManager2 = "'); INSERT INTO Managers (employeeID, managementStyle) VALUES (LAST_INSERT_ID(), "
  const insertManager3 = "); COMMIT;"
  var insertID = null;

  console.log(insertManager1 + "'" + req.query.lastName + "' , '" + req.query.firstName + insertManager2 + req.query.managementStyle + insertManager3);
  var context = {};
  reqLastName = req.query.lastName;
  reqFirstName = req.query.firstName;
  reqManagementStyle = req.query.managementStyle;

  pool.query("INSERT INTO Employees (lastName, firstName) VALUES(?,?)",[req.query.lastName, req.query.firstName], function (err, result) {
    console.log(err);
    insertID = result.insertId
    pool.query("INSERT INTO Managers (employeeID, managementStyle) VALUES(?,?)", [insertID, req.query.managementStyle], function (err, result) {
    });
  });
});

app.get('/insertdeveloper', function (req, res, next) {
  console.log("insert developer")
  var context = {};
  pool.query("INSERT INTO Employees (lastName, firstName) VALUES(?,?)",[req.query.lastName, req.query.firstName], function (err, result) {
    console.log(err);
    insertID = result.insertId
    pool.query("INSERT INTO Developers (employeeID) VALUES(?)", [insertID], function (err, result) {
    });
  });
});

app.get('/projectlist.html',function(req,res,next){
  var Project = {};
  pool.query(getProjectQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    Project = JSON.parse(JSON.stringify(rows));
    res.render('projectlist', {Project:Project})
  });
});

app.post('/projectlist.html',function(req,res,next){
  pool.query(insertProjectQuery, 
    [req.body.title, req.body.dueDate, req.body.status], 
    (err, result) =>{
    if(err){
      console.log("I am in the error for some reason");
      next(err);
      return;
    }
    console.log("Row added.");
  });
  var Project = {};
  pool.query(getProjectQuery, (err, rows, fields) => {
    if(err){
      console.log("Get query failed.");
      next(err);
      return;
    }
    Project = JSON.parse(JSON.stringify(rows));
    res.render('projectlist', {Project:Project})
  });
});

app.delete('/projectlist.html', function(req,res,next){
  var context = {};
  pool.query(deleteProjectTasks, req.body.id, (err, result) => {
    if(err){
      next(err);
      return;
    }
  });
  pool.query(deleteProjectQuery, req.body.id, (err, result) => {
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});

//"UPDATE Projects SET title=?, percentComplete=?, plannedEnd=?, projectStatus=? WHERE projectID=? ";
app.put('/projectlist.html', function(req,res,next){
  let context = {};
  console.log(req.body)
  console.log(req.body.title)
  pool.query(updateProjectQuery, 
    [req.body.title, req.body.percentComplete, req.body.dueDate, req.body.status, req.body.id] , (err, result) =>{
      if(err){
        next(err);
        return;
      }
      context.results = "Updated " + result.changedRows + " rows.";
      res.send(context);
    });
  });

app.get('/tasklist.html',function(req,res,next){
  var Task = {};
  pool.query(getIncompleteTasksQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    Task = JSON.parse(JSON.stringify(rows));
    res.render('tasklist', {Task:Task})
  });
});

/*app.get('/completeTasks',function(req,res,next){
  var Task = {};
  pool.query(getCompleteTasksQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    Task = JSON.parse(JSON.stringify(rows));
    console.log(Task);
    res.send(Task);
  });
});*/

app.get('/getProjects',function(req,res,next){
  var Project = {};
  pool.query(getAllProjects, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    Project = JSON.parse(JSON.stringify(rows));
    res.send(Project);
  });
});

app.post('/tasklist.html',function(req,res,next) {
  var insertID = null;

  pool.query("INSERT INTO Tasks (title, taskDetails, projectID, dueDate) VALUES(?,?,?,?)",[req.body.title, req.body.comments, req.body.project, req.body.dueDate], function (err, result) {
    console.log(err);
    insertID = result.insertId
    pool.query("INSERT INTO AssignedTasks (taskID, developerID, satisfaction) VALUES (?,?,?)", [insertID, req.body.developer, req.body.satisfaction], function (err, result) {
    });
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});


app.delete('/tasklist.html', function(req,res,next){
  console.log(req.body);
  var context = {};
  console.log(req);
  pool.query(deleteAssignedTask, req.body.id, (err, result) => {
    if(err){
      next(err);
      return;
    }
  });
  pool.query(deleteTaskQuery, req.body.id, (err, result) => {
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});


app.put('/tasklist.html',function(req,res,next){
  var context = {};
  pool.query(updateTaskQuery,
    [req.body.title, req.body.comments, req.body.dueDate, 0, req.body.id],
    (err, result) =>{
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://flip3.engr.oregonstate.edu' + app.get('port') + '; press Ctrl-C to terminate.');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});
