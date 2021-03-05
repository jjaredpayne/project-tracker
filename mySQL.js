//Express boilerplate code
var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 8157);
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(CORS());

//var session = require('express-session');
//var cookieParser = require('cookie-parser');

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
const insertProjectQuery = "INSERT INTO Projects(`title`, `percentComplete`, `plannedEnd`, `projectStatus`) VALUES (?,?,?,?) ";
const insertManagedProjectQuery = "INSERT INTO ManagedProjects (`projectID`, `managerID`) VALUES (?,?) ";
const insertTaskQuery = "INSERT INTO Tasks (`projectID`, `title`, `taskDetails`, `dueDate`) VALUES (?,?,?,?) ";
const deleteProjectQuery = "DELETE FROM Projects WHERE projectID=? ";
const deleteTaskQuery = "DELETE FROM Tasks WHERE taskID=? ";
const updateProjectQuery = "UPDATE Projects SET title=?, percentComplete=?, plannedEnd=?, projectStatus=? WHERE projectID=? ";
const updateTaskQuery = "UPDATE Tasks SET title=?, taskDetails=?, dueDate=?, completed=? WHERE taskID=? ";

var app = express();
app.use(session({secret:'SuperSecretPassword'}));
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', '56654');


//establish static page for js and css files
app.use(express.static(path.join(__dirname, 'static')));

app.get('/projectlist.html',function(req,res,next){
  var context = {};
  mysql.pool.query(getProjectQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
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
    res.send(context);
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

//error status 404
app.use(function(req,res){
  res.status(404);
  res.render('404');
});


//error 505
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

//display page on localhost:3000
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
