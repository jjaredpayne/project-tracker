
(function ($) {
    "use strict";

        
    

})(jQuery);

// Responsive nav menu code
$(document).ready(function() {
    $(".menu_toggle").click(function() {
      $("nav").toggleClass("active");
    });
  });

//Express boilerplate code
var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');

const getAllQuery =`"SELECT projectID, title, CONCAT(Employees.firstname, ' ', Employees.lastname) AS owner, percentComplete, projectStatus, plannedEnd AS dueDate
  FROM Projects 
  JOIN ManagedProjects ON
    ManagedProjects.projectID = Projects.projectID
  JOIN Managers ON
    Managers.managerID = ManagedProjects.managerID
  JOIN Employees ON
    Managers.employeeID = Employees.employeeID;`
const insertQuery = "INSERT INTO Project (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?,?,?,?,?)";
//const updateQuery = "UPDATE workouts SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=? ";
//const deleteQuery = "DELETE FROM workouts WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS workouts";
const makeTableQuery = `CREATE TABLE workouts(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        unit VARCHAR(255) NOT NULL,
                        date DATE);`;

// unit of 0 is lbs, unit of 1 is kg

//select all for the page
const getAllData = () => {
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if (err) {
      next(err);
      return;
    }
    res.json({rows: rows});
  });
};

//import Trail_API
// ** This Trail_API is mock data because we were locked out of the API **
const Trail_API = require('./new_trail_api.js.js.js').Trail_API;

//import ZipToLatLong to convert zip codes to latitude and longitude
const ZipToLatLong = require('./zip_to_lat_long.js.js.js').ZipToLatLong;
const zipToCoords = new ZipToLatLong();

const ForYouFilter = require('./foryou.js.js.js').ForYouFilter;
const { callbackify } = require('util');

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

//load projects page
app.get('/',function(req, res){
  res.render('user');
});

//load projects page after a post
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

//ping the API for the location of the trail and return the trailList
async function pingTrailAPI(latitude,longitude, forYouDropDown, user, res) {
  const myTrails = new Trail_API(latitude, longitude);
  myTrails.getTrails()
  .then(() => {
      // myTrails.makeTrailsList(result);
      const filteredTrails = new ForYouFilter(user,myTrails,forYouDropDown);
      return filteredTrails.allTrailsList.getTrails();
  }).then((trails)=>{
    res.render('trails', {"trailList": trails});
  }).catch(err => console.log(err))
  
}