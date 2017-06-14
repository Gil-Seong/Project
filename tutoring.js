var express = require('express');
var expressSession = require('express-session');
var MySQLStore = require('express-mysql-session')(expressSession);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var sha256 = require('sha256');
var cluster = require('cluster');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++ ) {
        // Create a worker
        cluster.fork();
    }
} else {


app.set('view engine', 'jade');
app.set('views','./views'); //앞의 views는 필수, 뒤의 ./views는 폴더이름
app.locals.pretty =true; // jade의 소스를 예쁘게 정리한다.
app.use(bodyParser.urlencoded({extended:false})) // body-parser을 사용하기 위한 명령어
app.use(express.static('uploads/')); //이미지 저장소
app.use(express.static('public')); //정적인 페이지 사용

var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : '210.123.254.226',
    user     : 'root',
    password : 'wjdrlftjd123',
    database : 'bono915',
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

var management = require('./routes/management')(app);
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

var study_apply = require('./routes/study_apply')(app);
app.use(study_apply);

var login = require('./routes/login')(app);
app.use(login);

app.get('/welcome', function(req,res){
  console.log('welcome test');
  res.redirect('/');
});

app.get('/chatting',function(req, res){
  res.render('menu/chatting');
  //res.sendfile('views/menu/chatting.jade');
  //res.sendfile("views/menu/client.html");
});

var count=1;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);

  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
  });

  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

var adduser = require('./routes/adduser')(app);
app.use(adduser);

var add_class = require('./routes/add_class')(app);
app.use(add_class);

// var chatting = require('./routes/chatting')(app);
// app.use(chatting);

var mypage = require('./routes/mypage')(app);
app.use(mypage);

var mystudy = require('./routes/mystudy')(app);
app.use(mystudy);

var add_curriculum = require('./routes/add_curriculum')(app);
app.use(add_curriculum);

app.get('/plus',function(req,res){
  res.render('menu/plus');
});

var apply_confirm = require('./routes/apply_confirm')(app);
app.use(apply_confirm);


var detailed_research = require('./routes/detailed_research')(app);
app.use(detailed_research);

var detailed_mystudy = require('./routes/detailed_mystudy')(app);
app.use(detailed_mystudy);


var research = require('./routes/research')(app);
app.use(research);

var update_class = require('./routes/update_class')(app);
app.use(update_class);

var delete_class = require('./routes/delete_class')(app);
app.use(delete_class);

var delete_curriculum = require('./routes/delete_curriculum')(app);
app.use(delete_curriculum);

var member_leave = require('./routes/member_leave')(app);
app.use(member_leave);

member_leave
//const hostname = '127.0.0.1';
const port = 3001;
http.listen(3001, function(){
  console.log('conneced 3001 port!');
});
}
