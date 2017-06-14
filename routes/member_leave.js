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

route.post('/member_leave',function(req,res){

  var userid = req.session.displayName;
  var sql = "DELETE FROM user WHERE userid=?";
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,[userid],function(err,result){
          conn.release();
          if(!err) {

            delete req.session.displayName; //
            req.session.save(function(){ //데이터 스토어에 저장이 끝났을때 실행한다. 보통 redirect문을 쓸때 같이 사용한다.
                res.redirect('/');

            });
          }
      });
  });


  });

return route;
};
