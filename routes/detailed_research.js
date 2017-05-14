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
  var userid =req.session.displayName;
  var cid = req.query.cid;
  var sql ='SELECT user.userid, name, gender, birthday, phonenumber, email, address class_title, class_subject, class_student, class_style, experience, expense, self_introduce FROM user, class where cid="'+cid+'" and user.userid=class.userid';
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,function(err,rows,fields){
          conn.release();
          if(!err) {
            if(userid==rows[0].userid){
              var certification = 1; //글 쓴 사람이 본인 일 때
            }else {
              var certification = 0; //글 쓴 사람이 본인이 아닐 때
            }
            pool.getConnection(function(err,conn){
                if (err) {
                  console.log({"code" : 100, "status" : "Error in connection database"});
                  return;
                }
            var sql2 = 'SELECT aid FROM Application_List where cid="'+cid+'" and userid="'+userid+'"';
            conn.query(sql2,function(err,rows2,fields){
                conn.release();
                if(!err) {
                  if(rows2.length>0){
                    var apply = '신청취소';
                    res.render('board/detailed_research',{rows:rows[0],cid:cid,cert:certification,apply:apply});
                  }else{
                    var apply = '신청하기';
                    res.render('board/detailed_research',{rows:rows[0],cid:cid,cert:certification,apply:apply});
                  }
                }
            });
          });

          }
      });
  });
});

return route;
};
