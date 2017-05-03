var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/'})
var app = express();


app.set('view engine', 'jade');
app.set('views','./views'); //앞의 views는 필수, 뒤의 ./views는 폴더이름

app.locals.pretty =true; // jade의 소스를 예쁘게 정리한다.

app.get('/',function(req,res){
  res.render('board/upload1');
});
app.post('/upload', upload.single('userfile'), function(req, res){
  console.log("success");
  console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
  res.send('Uploaded! : '+req.file); // object를 리턴함

});
const port = 3002;

app.listen(3002, function(){
  console.log('conneced 3002 port!');
});
