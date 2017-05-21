module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var route = express.Router();
var MySQLStore = require('express-mysql-session')(expressSession);
var mysql = require('mysql');
var os = require('os');
var ifaces = os.networkInterfaces();
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'wjd0606',
    database : 'o4',
    debug    :  false
});

var ip_address = null;
Object.keys(ifaces).forEach(function (ifname) { //ip 주소를 가져옴.
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    ip_address =iface.address
  });
});
console.log(ip_address);
route.get('/research',function(req,res){
                 var userid=req.session.displayName;
                 var sql1 ='SELECT classify FROM user where userid="'+userid+'"';
                 pool.getConnection(function(err,conn){
                     if (err) {
                       console.log({"code" : 100, "status" : "Error in connection database"});
                       return;
                     }
                     conn.query(sql1,function(err,rows,fields){
                         conn.release();
                         if(!err) {
                           console.log(rows[0].classify);
                           if(rows[0].classify == '선'){
                             pool.getConnection(function(err,conn){
                               var sql2 = 'SELECT name,cid,userfile,class_title,expense FROM user,class WHERE user.userid=class.userid AND class.userid="'+userid+'"';
                                 if (err) {
                                   console.log({"code" : 100, "status" : "Error in connection database"});
                                   return;
                                 }
                                 conn.query(sql2,function(err,rows1,fields){
                                   console.log(rows[0]);
                                     conn.release();
                                     if(!err) {
                                         res.render('menu/t_research',{rows1:rows1,ip_address:ip_address});
                                     }
                                 });
                             });


                           }else {
                             pool.getConnection(function(err,conn){
                               var sql2 = 'SELECT name,cid,userfile,class_title,expense FROM user,class WHERE user.userid=class.userid';
                                 if (err) {
                                   console.log({"code" : 100, "status" : "Error in connection database"});
                                   return;
                                 }
                                 conn.query(sql2,function(err,rows1,fields){
                                   console.log(rows[0]);
                                     conn.release();
                                     if(!err) {
                                         res.render('menu/s_research',{rows1:rows1,ip_address:ip_address});
                                     }
                                 });
                             });

                           }
                         }
                     });
                 });
  ///////////////////////////////////////////////////////////// 과외 찾기 페이지를 "선생", "학생&학부모" 분류하기 위한 소스

});

return route;
};
