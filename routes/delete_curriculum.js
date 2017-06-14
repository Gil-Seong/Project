module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var route = express.Router();
var MySQLStore = require('express-mysql-session')(expressSession);
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : '210.123.254.226',
    user     : 'root',
    password : 'wjdrlftjd123',
    database : 'bono915',
    debug    :  false
});

route.post('/delete_curriculum',function(req,res){

  var curriculum_id=req.body.curriculum_id;
  var sql = "DELETE FROM curriculum WHERE curriculum_id=?";
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,[curriculum_id],function(err,result){
          conn.release();
          if(!err) {
                res.redirect('/mystudy');
          }
      });
  });

  });
return route;
};
