module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var route = express.Router();
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, req.session.displayName+file.originalname);
  }
});
var upload = multer({ storage: _storage})
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


route.get('/add_class',function(req,res){
  res.render('../views/board/add_class');
});

route.get('/test',function(req,res){
  res.render('../views/menu/test');
});

route.post('/add_class', upload.single('userfile'), function(req,res){

var userfile = req.session.displayName+req.file.originalname;


  var class_title = req.body.class_title;
  var class_subject = req.body.class_subject;
  var class_student;
  var class_style;
  if(req.body.class_student!=null){ //희망 학생이 null이 아닐 때
    class_student=req.body.class_student.toString();
  }else{ //희망 학생이 null일 때
    class_student=req.body.class_student;
  }
  if(req.body.class_style!=null){ //과외 스타일이 null이 아닐 때
    class_style=req.body.class_style.toString();
  }else{ //과외 스타일이 null일 때
    class_style=req.body.class_style;
  }

  var experience = req.body.experience;
  var expense = req.body.expense;
  var self_introduce = req.body.self_introduce;
  var userid = req.session.displayName;
  console.log(class_title);
  console.log(class_subject);
  console.log(class_student);
  console.log(class_style);
  console.log(experience);
  console.log(expense);
  console.log(self_introduce);
  console.log(userfile);

  pool.getConnection(function(err,conn){
    if (err) {
      console.log({"code" : 100, "status" : "Error in connection database"});
      return;
    }
          var sql = 'INSERT INTO class (userfile, class_title, class_subject, class_student, class_style, experience, expense, self_introduce, userid) VALUES(?,?,?,?,?,?,?,?,?)';
          var value = [userfile,class_title,class_subject,class_student,class_style,experience,expense,self_introduce,userid];
          conn.query(sql,value,function(err,rows,fields){
                conn.release();
            if(err){
              console.log(err);
               res.status(500).send('Internal Server Error');
            }else{
                res.redirect('research');
            }
          });
});


});

return route;
};
