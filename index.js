
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
  res.render('profile');
  // console.log("displayDefault")
  // console.log("WorkRole" + req.query.workRole)
  //  //SELECT all Developer profiles when page is first loaded.
  // if(req.query.workRole === "1" || req.query.workRole === undefined){
  //   var createString = "SELECT * FROM Employees JOIN Developers ON Employees.employeeID = Developers.employeeID;"
  //   pool.query(createString, function (err, results) {
  //     console.log(results);
  //     context.sqlresults = results;
  //     res.render('profile', context); //render handlebars
  //     console.log('Finished Writing Developers');
  //   });
  //   return;
  // }
  // else if (req.query.workRole === "2"){
  //   let context = {};
  //   console.log("displayManagers")
  //   var createString = "SELECT * FROM Employees JOIN Managers ON Employees.employeeID = Managers.employeeID;"
  //   pool.query(createString, function (err, results) {
  //     console.log(results);
  //     context.sqlresults = results;
  //     res.render('profile', context);
  //     console.log('Finished Writing Managers');
  //   });
  //   return;
  // }
});

app.get('/displayProfile', function (req, res, next) {
  let context = {};
  // if(req.query.firstName === null || req.query.lastName === null){
  if(req.query.workRole === "1" || req.query.workRole === undefined){
    let context = {};
    console.log("displayDevelopers")
    var selectString = "SELECT * FROM Employees JOIN Developers ON Employees.employeeID = Developers.employeeID;"
    pool.query(selectString, function (err, results) {
      console.log(results);
      context.sqlresults = results;
      res.render('profile', context);
    });
    return;
  }
  else{
    let context = {};
    console.log("displayManagers")
    var selectString = "SELECT * FROM Employees JOIN Managers ON Employees.employeeID = Managers.employeeID;"
    pool.query(selectString, function (err, results) {
      console.log(results);
      context.sqlresults = results;
      res.render('profile', context);
    });
    return;
  }
});

app.get('/insertemployee', function (req, res, next) {
  console.log("insert employee")
  var context = {};

  pool.query("INSERT INTO Employees (`lastName`, `firstName`) VALUES (?, ?)", [req.query.lastName, req.query.firstName], function (err, result) {
      if (err) {
          next(err);
          return;
      }
      context.results = "Inserted id " + result.insertId;
      console.log('insert context' + context);
      res.send(context);
  });
  
});

app.get('/insertmanager', function (req, res, next) {
  console.log("insert manager")
  var context = {};
  reqLastName = req.query.lastName;
  reqFirstName = req.query.firstName;
  pool.query("INSERT INTO Managers (employeeID) SELECT employeeID FROM Employees WHERE lastName = '" + req.query.lastName + "' AND firstName = '" + req.query.firstName + "';", function (err, result) {
      if (err) {
          next(err);
          return;
      }
      context.results = "Inserted id " + result.insertId;
      console.log('insert context' + context);
      res.send(context);
  });
  
});

app.get('/insertdeveloper', function (req, res, next) {
  console.log("insert developer")
  var context = {};
  pool.query("INSERT INTO Developers (employeeID) SELECT employeeID FROM Employees WHERE lastName = '" + req.query.lastName + "' AND firstName = '" + req.query.firstName + "';", function (err, result) {
      if (err) {
          next(err);
          return;
      }
      context.results = "Inserted id " + result.insertId;
      console.log('insert context' + context);
      res.send(context);
  });
});



app.get('/projectlist.html',function(req,res,next){
  res.render('projectlist');
});

app.get('/tasklist.html',function(req,res,next){
  res.render('tasklist');
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
