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

route.get('/mystudy',function(req,res){
  var userid = req.session.displayName;
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
             var sql2 = 'SELECT curriculum_id, curriculum_title, DATE_FORMAT(class_date,"%Y년 %m월 %d일") class_date FROM curriculum WHERE userid="'+userid+'"';

             pool.getConnection(function(err,conn){
                 if (err) {
                   console.log({"code" : 100, "status" : "Error in connection database"});
                   return;
                 }
                 conn.query(sql2,function(err,rows2,fields){
                     conn.release();
                     if(!err) {

                         res.render('menu/t_mystudy',{rows:rows2});
                     }
                 });
             });
           }else{
             var sql2 = 'SELECT phonenumber FROM user WHERE userid="'+userid+'"';
             pool.getConnection(function(err,conn){
                 if (err) {
                   console.log({"code" : 100, "status" : "Error in connection database"});
                   return;
                 }
                 conn.query(sql2,function(err,rows2,fields){
                     conn.release();
                     if(!err) {
                       var phonenumber = rows2[0].phonenumber;
                       console.log(phonenumber);
                       var sql3 = 'SELECT curriculum_id, curriculum_title, class_date FROM curriculum WHERE p_phonenumber="'+phonenumber+'" or s_phonenumber="'+phonenumber+'"';

                       pool.getConnection(function(err,conn){
                           if (err) {
                             console.log({"code" : 100, "status" : "Error in connection database"});
                             return;
                           }
                           conn.query(sql3,function(err,rows3,fields){
                               conn.release();
                               if(!err) {
                                 console.log(rows3.length);
                                 if(rows3.length>=1){
                                   res.render('menu/s_mystudy',{rows:rows3});
                                 }else if(rows3.length==0){
                                   console.log('값이 없다.');
                                   res.render('menu/s_mystudy');
                                 }
                               }
                           });
                       });
                     }
                 });
             });
           }
         }
     });
 });

});

return route;
};
