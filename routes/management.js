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
route.get('/management/user',function(req,res){
  var sql = "SELECT * FROM user";

  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,function(err,rows,fields){
          conn.release();
          if(!err) {

              res.render('management/management_user', {rows:rows, count:1});
          }
      });
  });
  });

route.post('/user_delete',function(req,res){
    var userid=req.body.userid;
    var sql = "DELETE FROM user WHERE userid=?";

    pool.getConnection(function(err,conn){
        if (err) {
          console.log({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        conn.query(sql,[userid],function(err,result){
            conn.release();
            if(!err) {
                res.redirect('management/user');
            }
        });
    });
  });

  route.get('/management/class',function(req,res){
    var sql = "SELECT cid, class_title, class_subject, expense, userid FROM class";

    pool.getConnection(function(err,conn){
        if (err) {
          console.log({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        conn.query(sql,function(err,rows,fields){
            conn.release();
            if(!err) {

                res.render('management/management_class', {rows:rows, count:1});
            }
        });
    });
    });

    route.post('/class_delete',function(req,res){
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
                    res.redirect('management/class');
                }
            });
        });
      });

      route.get('/management/curriculum',function(req,res){
        var sql = 'SELECT curriculum_id, curriculum_title, DATE_FORMAT(class_date,"%Y-%m-%d") class_date, place_title FROM curriculum';

        pool.getConnection(function(err,conn){
            if (err) {
              console.log({"code" : 100, "status" : "Error in connection database"});
              return;
            }
            conn.query(sql,function(err,rows,fields){
                conn.release();
                if(!err) {

                    res.render('management/management_curriculum', {rows:rows, count:1});
                }
            });
        });
        });

        route.post('/curriculum_delete',function(req,res){
            var curriculum_id=req.body.curriculum_id;
            var sql = "DELETE FROM curriculum WHERE curriculum_id=?";

            pool.getConnection(function(err,conn){
                if (err) {
                  console.log({"code" : 100, "status" : "Error in connection database"});
                  return;
                }
                conn.query(sql,[curriculum_id],function(err,result){
                    conn.release();
                    if(!err) {
                        res.redirect('management/curriculum');
                    }
                });
            });
          });


return route;
};
