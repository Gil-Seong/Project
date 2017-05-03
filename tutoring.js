var express = require('express');
var expressSession = require('express-session');
var MySQLStore = require('express-mysql-session')(expressSession);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var sha256 = require('sha256');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++ ) {
        // Create a worker
        cluster.fork();
    }
} else {

var app = express();


app.set('view engine', 'jade');
app.set('views','./views'); //앞의 views는 필수, 뒤의 ./views는 폴더이름

app.locals.pretty =true; // jade의 소스를 예쁘게 정리한다.
app.use(bodyParser.urlencoded({extended:false})) // body-parser을 사용하기 위한 명령어
app.use(express.static('uploads/')); //이미지 저장소
app.use(express.static('public')); //정적인 페이지 사용


var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'wjd0606',
    database : 'o4',
    debug    :  false
});


app.use(expressSession({
  secret:'gedga1gdfs$@%$%SDasda23',
  resave:false,
  saveUninitialized:true,
  store:new MySQLStore({ //다중 사용자가 가능하게 하기위해서 세션을 DB에 저장해야 한다.

      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'wjd0606',
      database: 'o4'
  })
}));





app.get('/',function(req,res){


  if(req.session.displayName){
        res.render('home',{session:req.session.displayName});
      console.log(req.session.displayName);


  }else{
    //  res.render('home',{session:req.session.displayName});
    res.render('home');
    console.log(req.session.displayName);
    console.log('세션이 없다.');
  }

});

var management = require('./routes/management')(app); //app을 p1.js에게 제공 할 수 있다.
app.use(management);

        //ajax에서 오는 요청을 받을 요청명 /check_id
		app.post('/check_id', function(req, res) {
            console.log(req.body.userid);
            var userid = req.body.userid; //회원가입자가 입력한 id값
            var sql = "SELECT userid FROM user WHERE userid='"+userid+"'";
            pool.getConnection(function(err,conn){
                if (err) {
                  console.log({"code" : 100, "status" : "Error in connection database"});
                  return;
                }
                conn.query(sql,function(err,rows,fields){
                    conn.release();
                    if(!err) {
                      if(rows.length<=0){
                      var msg = '사용가능한 ID입니다.'
                        res.send({result:true, userid:msg});
                      }else {
                      var msg = '중복된 ID입니다.'
                      res.send({result:true, userid:msg});
                      }
                    }
                });
            });
		});

var login = require('./routes/login')(app); //app을 p1.js에게 제공 할 수 있다.
app.use(login);

app.get('/welcome', function(req,res){
  console.log('welcome test');
  res.redirect('/');
});


var adduser = require('./routes/adduser')(app); //app을 p1.js에게 제공 할 수 있다.
app.use(adduser);


var add_class = require('./routes/add_class')(app); //app을 p1.js에게 제공 할 수 있다.
app.use(add_class);


var mypage = require('./routes/mypage')(app); //app을 p1.js에게 제공 할 수 있다.
app.use(mypage);

app.get('/mystudy',function(req,res){
  res.render('menu/mystudy');
});
app.get('/plus',function(req,res){
  res.render('menu/plus');
});

var detailed_research = require('./routes/detailed_research')(app);
app.use(detailed_research);

var research = require('./routes/research')(app); //app을 p1.js에게 제공 할 수 있다.
app.use(research);


//const hostname = '127.0.0.1';
const port = 3001;

app.listen(3001, function(){
  console.log('conneced 3001 port!');
});
}