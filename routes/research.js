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

app.get('/research',function(req,res){
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      var sql = 'SELECT name,cid,userfile,class_title,expense FROM user,class WHERE user.userid=class.userid';
      conn.query(sql,function(err1,rows1,fields1){
          conn.release();
          if(!err1) {
                 var userid=req.session.displayName;
                 var sql1 ='SELECT classify FROM user where userid="'+userid+'"';
                 pool.getConnection(function(err,conn){
                     if (err) {
                       console.log({"code" : 100, "status" : "Error in connection database"});
                       return;
                     }
                     conn.query(sql1,function(err,rows,fields){
                         conn.release();
                         if(!err) {
                           console.log(rows[0].classify);
                           if(rows[0].classify == '선'){
                             res.render('menu/t_research',{rows1:rows1});
                           }else {
                             res.render('menu/s_research',{rows1:rows1});
                           }
                         }
                     });
                 });
          }
      });
  });


  ///////////////////////////////////////////////////////////// 과외 찾기 페이지를 "선생", "학생&학부모" 분류하기 위한 소스

});

return route;
};
