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

route.get('/mystudy',function(req,res){
  var userid = req.session.displayName;
    console.log("displayname test2 : " +req.session.displayName);
  var sql = 'SELECT classify FROM user WHERE userid="'+userid+'"';

  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,function(err,rows,fields){
        console.log(rows[0].classify);
          conn.release();
          if(!err) {
            if(rows[0].classify=='선'){
              res.render('menu/t_mystudy');
            }else{
              res.render('menu/s_mystudy');
            }


          }
      });
  });


});

return route;
};
