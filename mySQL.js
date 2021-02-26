//Express boilerplate code
var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');

const getProjectQuery =`"SELECT 
    projectID, title, CONCAT(Employees.firstname, ' ', Employees.lastname) AS owner, percentComplete, projectStatus AS status, plannedEnd AS dueDate
  FROM Projects 
  JOIN ManagedProjects ON
    ManagedProjects.projectID = Projects.projectID
  JOIN Managers ON
    Managers.managerID = ManagedProjects.managerID
  JOIN Employees ON
    Managers.employeeID = Employees.employeeID;"`
const getTaskQuery = `"SELECT
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
  AND completed = 0;"`
const insertProjectQuery = "INSERT INTO Projects(`title`, `percentComplete`, `plannedEnd`, `projectStatus`) VALUES (?,?,?,?);"
const insertManagedProjectQuery = "INSERT INTO ManagedProjects (`projectID`, `managerID`) VALUES ((SELECT * FROM Projects WHERE projectId=(SELECT max(id) FROM TableName)),?);"
const insertTaskQuery = "INSERT INTO Tasks (`projectID`, `title`, `taskDetails`, `dueDate`) VALUES (?,?,?,?);"
//const updateQuery = "UPDATE workouts SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=? ";
//const deleteQuery = "DELETE FROM workouts WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS workouts";
const makeTableQuery = `CREATE TABLE workouts(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        unit VARCHAR(255) NOT NULL,
                        date DATE);`


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
    [title, percentComplete, plannedEnd, projectstatus], 
    (err, result) =>{
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(insertManagedProjectQuery, 
      [userID], 
      (err, result) =>{
      if(err){
        next(err);
        return;
      }
    //need to write something that will refresh the data on the front end based on the page
    //getAllData();
  });
});

app.post('/project.html',function(req,res,next){
  var {projectID, title, taskDetails, dueDate} = req.body;
  mysql.pool.query(insertTasksQuery, 
    [projectID, title, taskDetails, dueDate], 
    (err, result) =>{
    if(err){
      next(err);
      return;
    }
    //getAllData();
  });
});

/*//load projects page after a post
app.post('/trails',function(req,res){
  //line from foryou.js to be integrated into trail display
  //userProfile = JSON.parse(req.session.userProfile);
  // console.log(req.cookie);
  // We need to find zipToCoords Asynchronously
  zipToCoords.convert(req.body.zipcode)
  .then((result)=>{
    var [request_lat, request_long] = result;
    console.log(request_lat, request_long);
	  var user = cookieParser.JSONCookie(res.cookie.userProfile);
    pingTrailAPI(request_lat, request_long, req.body.forYouDropDown, user, res);
  })
  .catch((error)=>{
      console.log(error);
  });
  
  //, {"trailList": newLocation(la_latitude, la_longitude)});
});*/


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
