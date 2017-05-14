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

route.get('/apply_confirm',function(req,res){
  cid = req.query.cid;
  var sql = 'SELECT user.userid, name, gender, birthday, phonenumber, email, apply_date FROM user,application_list WHERE cid="'+cid+'" AND user.userid=application_list.userid';
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,function(err,rows,fields){
          conn.release();
          if(!err) {
             //if(rows.lengtn>0){
               res.render('board/apply_confirm', {rows:rows,count:1});
            //  }else{
            //    res.render('board/apply_confirm');
            //  }

          }
      });
  });
  });



return route;
};
