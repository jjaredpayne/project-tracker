var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var mysql = require('mysql');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: 'SuperSecretPassword'}));
app.use(express.static('public'));
app.use(express.static('js'));
app.use(express.static('css'));
app.use(express.static('jquery'));
app.use(express.static('images'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8916);

var selectManagers = "SELECT * FROM Employees JOIN Managers ON Employees.employeeID = Managers.employeeID";
var selectDevelopers = "SELECT * FROM Employees JOIN Developers ON Employees.employeeID = Developers.employeeID";
var deleteManagedProjects = "DELETE ManagedProjects FROM ManagedProjects WHERE ManagedProjects.managerID IN (SELECT Managers.managerID FROM Managers WHERE Managers.employeeID = ";
var deleteManager = "DELETE FROM Managers WHERE Managers.employeeID = ";
var deleteAssignedProjects = "DELETE AssignedTasks FROM AssignedTasks WHERE AssignedTasks.developerID IN (SELECT Developers.developerID FROM Developers WHERE Developers.employeeID = ";
var deleteDeveloper = "DELETE FROM Developers WHERE Developers.employeeID = ";
const getProjectQuery =`SELECT 
    projectID, title, CONCAT(Employees.firstname, ' ', Employees.lastname) AS owner, percentComplete, projectStatus AS status, plannedEnd AS dueDate
  FROM Projects 
  JOIN ManagedProjects ON
    ManagedProjects.projectID = Projects.projectID
  JOIN Managers ON
    Managers.managerID = ManagedProjects.managerID
  JOIN Employees ON
    Managers.employeeID = Employees.employeeID`;
const getTaskQuery = `SELECT
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
WHERE projectID = ?
  AND completed = 0`;
const getProjectIDQuery = "SELECT projectID FROM Projects where title=?;"
const getManagersQuery = "SELECT managerID, CONCAT(Employees.firstname, ' ', Employees.lastname) AS name FROM Managers JOIN Employees ON Managers.employeeID = Employees.employeeID"
const insertProjectQuery = "INSERT INTO Projects(`title`, `percentComplete`, `plannedEnd`, `projectStatus`) VALUES (?,?,?,?) ";
const insertManagedProjectQuery = "INSERT INTO ManagedProjects (`projectID`, `managerID`) VALUES (?,?) ";
const insertTaskQuery = "INSERT INTO Tasks (`projectID`, `title`, `taskDetails`, `dueDate`) VALUES (?,?,?,?) ";
const deleteProjectQuery = "DELETE FROM Projects WHERE projectID=? ";
const deleteTaskQuery = "DELETE FROM Tasks WHERE taskID=? ";
const updateProjectQuery = "UPDATE Projects SET title=?, percentComplete=?, plannedEnd=?, projectStatus=? WHERE projectID=? ";
const updateTaskQuery = "UPDATE Tasks SET title=?, taskDetails=?, dueDate=?, completed=? WHERE taskID=? ";


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
        res.render('profile', context);
      });
    }
    else{
      pool.query(selectManagers, function (err, rows, fields) {
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        res.render('profile', context);
      });
    }
  }
  else if(req.body.firstName === '' && req.body.lastName !== ''){
    if(req.body.workRole === "1"){
      pool.query(selectDevelopers + " WHERE Employees.lastName = '" + req.body.lastName + "';", function (err, rows, results) {
        console.log("firstname null, lastname not")
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        res.render('profile', context);
      });
    }
    else{
      pool.query(selectManagers, function (err, rows, fields) {
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        res.render('profile', context);
      });
    }
  }
  else if(req.body.firstName !== '' && req.body.lastName !== ''){
    if(req.body.workRole === "1"){
      pool.query(selectDevelopers + " WHERE Employees.firstName = '" + req.body.firstName + "' AND Employees.lastName = '" + req.body.lastName + "'", function (err, rows, results) {
        console.log("firstname not, lastname not")
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        res.render('profile', context);
      });
    }
    else{
      pool.query(selectManagers, function (err, rows, fields) {
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        res.render('profile', context);
      });
    }
  }
  else if(req.body.firstName === '' && req.body.lastName === ''){
    if(req.body.workRole === "1"){
      pool.query(selectDevelopers, function (err, rows, results) {
        console.log("firstname null, lastname null")
        context.sqlresults = JSON.parse(JSON.stringify(rows));
        res.render('profile', context);
      });
    }
    else{
      pool.query(selectManagers, function (err, rows, fields) {
        context.sqlresults = JSON.parse(JSON.stringify(rows));
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
  console.log("insert manager")
  var context = {};
  reqLastName = req.query.lastName;
  reqFirstName = req.query.firstName;
  pool.query("INSERT INTO Managers (employeeID) SELECT employeeID FROM Employees WHERE lastName = '" + req.query.lastName + "' AND firstName = '" + req.query.firstName + "';", function (err, result) {
  });
});

app.get('/insertdeveloper', function (req, res, next) {
  console.log("insert developer")
  var context = {};
  pool.query("INSERT INTO Developers (employeeID) SELECT employeeID FROM Employees WHERE lastName = '" + req.query.lastName + "' AND firstName = '" + req.query.firstName + "';", function (err, result) {
  });
});

app.get('/projectlist.html',function(req,res,next){
  var context = {};
  mysql.pool.query(getProjectQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    context.Project = JSON.stringify(rows)
  })
  res.render('projectlist', context);
  });
});

app.get('/projectlist.html2',function(req,res,next){
  var context = {};

  mysql.pool.query(getManagersQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    context.Managers = JSON.stringify(rows)
  })
  res.render('projectlist', context);
  });
});

app.get('/project.html',function(req,res,next){
  var context = {};
  mysql.pool.query(getTaskQuery, req.query.id, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.(context);
  });
});

app.post('/projectlist.html',function(req,res,next){
  var {title, percentComplete, plannedEnd, projectStatus, userID} = req.body;
  mysql.pool.query(insertProjectQuery, 
    [title, percentComplete, plannedEnd, projectStatus], 
    (err, result) =>{
    if(err){
      next(err);
      return;
    }
  });

    mysql.pool.query(getProjectIDQuery, title, (err, rows, fields) => {
      if(err){
        next(err);
        return;
      }
      context.results = rows;
  
    mysql.pool.query(insertManagedProjectQuery, 
      context.results, userID,
      (err, result) =>{
      if(err){
        next(err);
        return;
      }

      });
    });

    console.log("Sending result.");
    res.send({result: result});
});

app.post('/project.html',function(req,res,next){
  var {projectID, title, taskDetails, dueDate} = req.body;
  mysql.pool.query(insertTaskQuery, 
    [projectID, title, taskDetails, dueDate], 
    (err, result) =>{
    if(err){
      next(err);
      return;
    }
    //getAllData();
  });
});

app.delete('/projectlist.html',function(req,res,next){
  var context = {};
  var {id} = req.body;
  mysql.pool.query(deleteProjectQuery, [id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.delete('/project.html',function(req,res,next){
  var context = {};
  var {id} = req.body;
  mysql.pool.query(deleteTaskQuery, [id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.put('/projectlist.html',function(req,res,next){
  var context = {};
  var {title, percentComplete, plannedEnd, projectStatus, id} = req.body;
  mysql.pool.query(updateProjectQuery,
    [title, percentComplete, plannedEnd, projectStatus, id],
    (err, result) =>{
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context);
  });
});

app.put('/project.html',function(req,res,next){
  var context = {};
  var {title, taskDetails, dueDate, completed, id} = req.body;
  mysql.pool.query(updateTaskQuery,
    [title, taskDetails, dueDate, completed, id],
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
