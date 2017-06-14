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
      cb(null, req.session.displayName);
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


route.get('/update_class',function(req,res){
  res.render('../views/board/update_class');
});

route.post('/update_class', upload.single('userfile'), function(req,res){

if(req.file.size!=null){
var userfile = req.session.displayName+req.file.originalname;
}else {
  console.log('없다');
}

  var class_title = req.body.class_title;
  var class_subject = req.body.class_subject;
  var class_student = req.body.class_student.toString();
  var class_style = req.body.class_style.toString();
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
