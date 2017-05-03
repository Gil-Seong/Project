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

route.get('/detailed_research',function(req,res){
  console.log(req.query.cid);
  var cid = req.query.cid;
  var sql ='SELECT name, gender, birthday, phonenumber, email, address class_title, class_subject, class_student, class_style, experience, expense, self_introduce FROM user, class where cid="'+cid+'" and user.userid=class.userid';
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,function(err,rows,fields){
          conn.release();
          if(!err) {
            console.log(rows[0].experience);
            console.log(rows[0].name);
            res.render('board/detailed_research',{rows:rows[0]});
          }
      });
  });


});

return route;
};