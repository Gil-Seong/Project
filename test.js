var express = require('express');
var expressSession = require('express-session');
var MySQLStore = require('express-mysql-session')(expressSession);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var sha256 = require('sha256');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        // Create a worker
        cluster.fork();
    }
} else {








var app = express();


app.set('view engine', 'jade');
app.set('views','./views'); //앞의 views는 필수, 뒤의 ./views는 폴더이름

app.locals.pretty =true; // jade의 소스를 예쁘게 정리한다.
app.use(bodyParser.urlencoded({extended:false})) // body-parser을 사용하기 위한 명령어
app.use(express.static('public')); //정적인 페이지 사용


var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'wjd0606',
  database : 'o4'
});

conn.connect();
app.use(expressSession({
  secret:'gedga1gdfs$@%$%SDasda23',
  resave:false,
  saveUninitialized:true,
  store:new MySQLStore({

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
    console.log('없을경우 뭐가찍히니?');
  }
//   if(req.session.displayName){
//   res.send(`
//     <h1> Hello, ${req.session.displayName}</h1>
//     <a href="/logout">Logout</a>
//     `);
// }else{
//   res.send(`
// <h1>11Welcome</h1>
// <a href="/login">Login</a>
//     `);

});
//});

app.get('/management',function(req,res){
  var sql = "SELECT * FROM user";
  conn.query(sql,function(err,rows,fields){
    if(err){
      res.status(500).send('Internal Server Error');
    }else{
        res.render('management', {rows:rows});

    }
  });
});

app.post('/user_delete',function(req,res){
  var userid=req.body.userid;
  var sql = "DELETE FROM user WHERE userid=?"
  conn.query(sql,[userid],function(err,result){

      res.redirect('management');
  })

});


app.get('/login',function(req,res){
  res.render('login');
});

app.post('/login',function(req,res){
  var userid=req.body.userid; //사용자가 현재 입력한 id값.
  var pass=req.body.pass; // 사용자가 현재 입력한 password값.
  var salt=userid;
  var pass2=sha256(pass+salt);
  var sql ='SELECT userid,pass FROM user WHERE userid="' + userid +'" and pass="'+pass2+'"';
  conn.query(sql,function(err,rows,fields){
    if(err){
      console.log(err);
       res.status(500).send('Internal Server Error');
    }else{

         if(rows.length>0){
          console.log(rows[0].userid);
          console.log(rows[0].pass);

              req.session.displayName = userid;

            //  console.log('왜 안가냐');

            //  res.redirect('/');
              res.render('home',{userid:userid, session:req.session.displayName});


            }else{
              console.log('일치xx');
              res.redirect('/');
            }
          }

      //  });
      //}
  //  }

      //console.log(sha256(pass+salt));
    //  for(var i=0;i<=rows.length;i++){ //DB의 id값을 검사
      //  if((rows[i].userid==userid)){
        //  console.log(rows[i].userid);
          //console.log(rows[i].pass);
          // t=1;
        //  for(var j=0;j<=rows.length-1;j++){
          //  console.log(rows[j].pass);
          //  if((rows[j].pass)==pass2){

              // p=1;

              //console.log(req.session.user);

          //  }
      //  }else{
      //    break;
      //  }

      //}
      // if(t==1){
      //   if(p==1){
      //       console.log(req.session.user);
      //   }else{
      //       console.log('아이디와 패스워드가 일치하지 않습니다.');
      //   }
      // }else{
      //     console.log('없는 아이디 입니다.');
      // }

    //}
  });
});

app.get('/welcome', function(req,res){
  console.log('welcome test');
  res.redirect('/');
});

app.get('/logout',function(req,res){
  delete req.session.displayName; //
  req.session.save(function(){ //데이터 스토어에 저장이 끝났을때 실행한다. 보통 redirect문을 쓸때 같이 사용한다.
      res.redirect('/');
      console.log('세션을 삭제하고 로그아웃 되었습니다.');
  });


});


app.get('/adduser',function(req,res){
  res.render('adduser');
});

app.post('/adduser',function(req,res){
  var userid=req.body.userid;
  var salt=userid;
  var pass=req.body.pass;
  var pass2=sha256(pass+salt);
  console.log(pass2);
  var name=req.body.name;
  var phonenumber=req.body.phonenumber;
  var a=0;

  var sql1 ='SELECT userid FROM user';
  conn.query(sql1,function(err,rows,fields){
    if(err){
      console.log(err);
       res.status(500).send('Internal Server Error');
    }else{
      for(var i=0;i<=rows.length-1;i++){
        if(userid==rows[i].userid){
          a=1;
        }
      }

      if(a==1){
        res.render('adduserfail')
      }else{
        var sql = 'INSERT INTO user (userid,pass,name,phonenumber) VALUES(?,?,?,?)';
        var value = [userid,pass2,name,phonenumber];
        conn.query(sql,value,function(err,rows,fields){
          if(err){
            console.log(err);
             res.status(500).send('Internal Server Error');
          }else{
            res.redirect('/login');
          }
        });
      }

}
});

});



app.get('/addboard',function(req,res){
  res.render('board/add_board');
});



app.get('/mypage',function(req,res){
  res.render('menu/mypage');
});


app.get('/mystudy',function(req,res){
  res.render('menu/mystudy');
});
app.get('/plus',function(req,res){
  res.render('menu/plus');
});
app.get('/research',function(req,res){
  res.render('menu/research');
});


//const hostname = '127.0.0.1';
const port = 3001;
app.listen(3001, function(){
  console.log('conneced 3001 port!');
});
}
