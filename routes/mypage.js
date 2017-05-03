module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var sha256 = require('sha256');
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

app.get('/mypage',function(req,res){
  res.render('menu/mypage');
});

app.get('/mypage/user_info_update',function(req,res){

  var userid = req.session.displayName;
    console.log("displayname test1 : " +req.session.displayName);
  var sql = 'SELECT * FROM user WHERE userid="'+userid+'"';

  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,function(err,rows,fields){
        console.log(rows[0]);
          conn.release();
          if(!err) {
              res.render('menu/user_information_update',{rows:rows[0]});
          }
      });
  });


});

app.post('/mypage/user_info_update',function(req,res){
  console.log("displayname test2 : " +req.session.displayName);
  var pass = req.body.password;
  var salt=req.session.displayName;
  var pass2=sha256(pass+salt);
  var phonenumber = req.body.phonenumber;
  var email = req.body.email;
  var address = req.body.address;
  console.log("displayname test3 : " +req.session.displayName);
  console.log(pass);
  console.log(phonenumber);
  console.log(email);
  console.log(address);


  sql = 'UPDATE user set pass="'+pass2+'", phonenumber="'+phonenumber+'", email="'+email+'", address="'+address+'" WHERE userid="'+req.session.displayName+'"';

  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,function(err,rows,fields){

          conn.release();
          if(!err) {
            req.session.save(function(){
              res.redirect('/mypage');
            });
          }
      });
  });


});

return route;
};
