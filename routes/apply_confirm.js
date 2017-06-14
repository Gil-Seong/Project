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

route.get('/apply_confirm',function(req,res){
  cid = req.query.cid;
  var sql = 'SELECT user.userid, name, gender, DATE_FORMAT(birthday,"%Y-%m-%d") birthday, phonenumber, email,  DATE_FORMAT(apply_date,"%Y년 %m월 %d일") apply_date FROM user,Application_List WHERE cid="'+cid+'" AND user.userid=Application_List.userid';
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
