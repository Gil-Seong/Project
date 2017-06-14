module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var sha256 = require('sha256');
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

route.use(expressSession({
  secret:'gedga1gdfs$@%$%SDasda23',
  resave:false,
  saveUninitialized:true,
  store:new MySQLStore({ //다중 사용자가 가능하게 하기위해서 세션을 DB에 저장해야 한다.

      host: '210.123.254.226',
      port: 3306,
      user: 'root',
      password: 'wjdrlftjd123',
      database: 'bono915'
  })
}));

route.get('/login',function(req,res){
  res.render('login');
});

route.post('/login',function(req,res){
  var userid=req.body.userid; //사용자가 현재 입력한 id값.
  var pass=req.body.pass; // 사용자가 현재 입력한 password값.
  var salt=userid;
  var pass2=sha256(pass+salt);
  var sql ='SELECT userid,pass FROM user WHERE userid="' + userid +'" and pass="'+pass2+'"';


  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql,function(err,rows,fields){
          conn.release();
          if(!err) {
            if(rows.length>0){
             console.log(rows[0].userid);
             console.log(rows[0].pass);

                 req.session.displayName = userid;
                 res.redirect('/');
                 //res.render('home',{userid:userid, session:req.session.displayName});


               }else{
                 console.log('일치xx');
                 res.render('../views/login',{inconsistency:'inconsistency'});
               }
          }
      });
  });

  });

  route.get('/logout',function(req,res){
    delete req.session.displayName; //
    req.session.save(function(){ //데이터 스토어에 저장이 끝났을때 실행한다. 보통 redirect문을 쓸때 같이 사용한다.
        res.redirect('/');
        console.log('세션을 삭제하고 로그아웃 되었습니다.');
    });

  });


return route;
};
