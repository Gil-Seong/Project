module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var route = express.Router();
var MySQLStore = require('express-mysql-session')(expressSession);
var mysql = require('mysql');
var Coolsms = require('coolsms-rest-sdk');
var client = new Coolsms({
  key: 'NCSTXSFO2HJO6QCE',
  secret: '4RNDN5Q8WVY9IZZXJ3EMOBI5KLITBMKK'
});
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'wjd0606',
    database : 'o4',
    debug    :  false
});



route.post('/study_apply', function(req, res) {
  console.log(req.body.apply);
  if(req.body.apply=='신청하기'){
    console.log(req.body.cid);
    console.log(req.session.displayName);
    var apply_date = new Date();
    apply_date = apply_date.getFullYear() + "-" + (apply_date.getMonth() + 1) + "-" + apply_date.getDate();
    var cid = req.body.cid;
    var userid = req.session.displayName;
    console.log(apply_date);

var sql1 = 'SELECT phonenumber FROM class,user WHERE cid="'+cid+'" AND class.userid=user.userid';

    pool.getConnection(function(err,conn){
        if (err) {
          console.log({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        conn.query(sql1,function(err,rows1,fields){
            conn.release();
            if(!err) {
              var phonenumber =rows1[0].phonenumber;
              client.sms.send({
                to: '"'+phonenumber+'"',    // recipient
                from: '01053379159',  // sender
                type: 'SMS',          // SMS, LMS, MMS
                text: '"'+userid+'"님께서 과외를 신청하셨습니다.',
              }, function (error, result) {
                if(error) {
                  console.log(error);
                } else {
                  console.log(result);
                }
              });
            }
        });
    });



    pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
            var sql = 'INSERT INTO Application_List (cid, userid, apply_date) VALUES(?,?,?)';
            var value = [cid,userid,apply_date];
            conn.query(sql,value,function(err,rows,fields){
                  conn.release();
              if(err){
                console.log(err);
                 res.status(500).send('Internal Server Error');
              }else{
                  res.send({apply:true})
              }
            });
  });


}else{

  var cid=req.body.cid;
  var userid = req.session.displayName;
  console.log(cid);
  console.log(userid);



var sql1 = 'SELECT phonenumber FROM class,user WHERE cid="'+cid+'" AND class.userid=user.userid';

  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql1,function(err,rows1,fields){
          conn.release();
          if(!err) {
            var phonenumber =rows1[0].phonenumber;
            client.sms.send({
              to: '"'+phonenumber+'"',    // recipient
              from: '01053379159',  // sender
              type: 'SMS',          // SMS, LMS, MMS
              text: '"'+userid+'"님께서 과외를 취소하셨습니다.',
            }, function (error, result) {
              if(error) {
                console.log(error);
              } else {
                console.log(result);
              }
            });
          }
      });
  });




  var sql = "DELETE FROM Application_List WHERE cid=? AND userid=?"; //cid와 userid값이 일치할 때 삭제한다.
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,[cid,userid],function(err,result){
          conn.release();
          if(!err) {
            res.send({apply:false})
          }
      });
  });
}
});



return route;
};
