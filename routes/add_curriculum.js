module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var route = express.Router();
var MySQLStore = require('express-mysql-session')(expressSession);
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'wjd0606',
    database : 'o4',
    debug    :  false
});

app.post('/sendtitle',function(req,res){
  var place_title = req.body.title;
  var place_position = req.body.place
  console.log(place_title);
  console.log(place_position);

  res.send({place_title:place_title,place_position:place_position})
});

route.get('/add_curriculum',function(req,res){
  var phonenumber1=req.query.phonenumber1;
  var phonenumber2=req.query.phonenumber2;

  console.log(phonenumber1);
  console.log(phonenumber2);

  res.render('board/add_curriculum');
});

//
// route.post('/add_curriculum', function(req,res){
//
// });

return route;
};
