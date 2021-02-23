//JJared Payne 8.10.20

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
app.use('/css',express.static('css'));
app.use('/css',express.static('images'));
app.use('/vendor',express.static('vendor'));
app.use('/js',express.static('js'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8916);

//Create mysql pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs290_payneje',
    password: 'Seattleites',
    database: 'cs290_payneje'
});

module.exports.pool = pool;

app.get('/', function (req, res, next) {
  res.render('index');
});

app.get('/profile', function (req, res, next) {
  res.render('profile');
});

app.get('/project',function(req,res,next){
  res.render('project');
});

app.get('/projectlist',function(req,res,next){
  res.render('projectlist');
});

app.get('/registeremployee',function(req,res,next){
  res.render('registeremployee');
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