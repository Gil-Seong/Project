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

route.post('/delete_class',function(req,res){

  var cid=req.body.cid;
  var sql = "DELETE FROM class WHERE cid=?";
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,[cid],function(err,result){
          conn.release();
          if(!err) {
                res.redirect('/research');
          }
      });
  });




  });




return route;
};
