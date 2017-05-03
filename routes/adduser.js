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



app.get('/adduser',function(req,res){
  res.render('adduser');
});

app.post('/adduser',function(req,res){
  var userid=req.body.userid;
  var salt=userid;
  var pass=req.body.pass;
  var pass2=sha256(pass+salt);
  var classify=req.body.classify;
  var name=req.body.name;
  var gender=req.body.gender;
  var birthday=req.body.birthday;
  var phonenumber=req.body.phonenumber;
  var email=req.body.email;
  var address=req.body.address;
  var a=0;

  var sql1 ='SELECT userid FROM user';

  pool.getConnection(function(err,conn){
    if (err) {
      console.log({"code" : 100, "status" : "Error in connection database"});
      return;
    }
  conn.query(sql1,function(err,rows,fields){
      conn.release();
      if(!err) {


        for(var i=0;i<=rows.length-1;i++){
          if(userid==rows[i].userid){
            a=1;
          }
        }

        if(a==1){
          res.render('adduserfail')
        }else{
          var sql = 'INSERT INTO user (userid,pass,name,classify,gender,birthday,phonenumber,email,address) VALUES(?,?,?,?,?,?,?,?,?)';
          var value = [userid,pass2,name,classify,gender,birthday,phonenumber,email,address];
          conn.query(sql,value,function(err,rows,fields){
            if(err){
              console.log(err);
               res.status(500).send('Internal Server Error');
            }else{
              res.redirect('/login');
            }
          });
        }

      }
  });
});

});

return route;
};
