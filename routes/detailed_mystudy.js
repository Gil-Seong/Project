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


route.get('/detailed_mystudy',function(req,res){
  console.log('test:'+req.query.curriculum_id);
    var userid =req.session.displayName;
    var curriculum_id = req.query.curriculum_id;
    var sql ='SELECT user.userid, curriculum_title, TIME_FORMAT(start_time,"%p %h:%i") start_time, TIME_FORMAT(end_time,"%p %h:%i") end_time, DATE_FORMAT(class_date,"%Y-%m-%d") class_date, place_title, place_position, comment FROM user, curriculum where curriculum_id="'+curriculum_id+'" AND user.userid = curriculum.userid';

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
              var sql2 ='SELECT homework_content FROM homework where curriculum_id="'+curriculum_id+'"';
              pool.getConnection(function(err,conn){
                  if (err) {
                    console.log({"code" : 100, "status" : "Error in connection database"});
                    return;
                  }
                  conn.query(sql2,function(err,rows2,fields){
                      conn.release();
                      if(!err) {
                        if(rows2.length>0){
                          res.render('board/detailed_mystudy',{rows:rows[0],cert:certification,rows2:rows2,count:1,curriculum_id:curriculum_id});
                        }else{
                          res.render('board/detailed_mystudy',{rows:rows[0],cert:certification,curriculum_id:curriculum_id});
                        }
                      }
                  });
              });





                //res.render('board/detailed_mystudy',{rows:rows[0]});
            }
        });
    });

});


return route;
};
