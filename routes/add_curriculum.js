module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var route = express.Router();
var MySQLStore = require('express-mysql-session')(expressSession);
var mysql = require('mysql');
var os = require('os');
var ifaces = os.networkInterfaces();
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : '210.123.254.226',
    user     : 'root',
    password : 'wjdrlftjd123',
    database : 'bono915',
    debug    :  false
});
var smtpTransport = nodemailer.createTransport(smtpTransport({ //이메일 보내기
    host : "smtp.gmail.com",
    secureConnection : false,
    port: 587,
    auth : {
        user : "bonoqwe915@gmail.com",
        pass : "wjdrlftjd06"
    }
}));

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




app.post('/sendtitle',function(req,res){
  var place_title = req.body.title;
  var place_position = req.body.place.toString().split(',');
  var split1 = place_position[0].split('(');
  var split2 = place_position[1].split(')');
  var place_position2 = split1[1]+','+split2[0];

  console.log(place_title);
  console.log(place_position);
  console.log(place_position2);
  res.send({place_title:place_title,place_position:place_position2})
});

route.get('/add_curriculum',function(req,res){
  var phonenumber1=req.query.phonenumber1;
  var phonenumber2=req.query.phonenumber2;

  console.log(phonenumber1);
  console.log(phonenumber2);

  res.render('board/add_curriculum',{phonenumber1:phonenumber1,phonenumber2:phonenumber2});
});

route.post('/add_curriculum',function(req,res){ //커리큘럼 등록
  var place_title = req.body.place_title;
  var place_position = req.body.place_position;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var class_date = req.body.class_date;
  var curriculum_title = req.body.curriculum_title;
  var comment = req.body.comment;
  var p_phonenumber=req.body.phonenumber1;
  var s_phonenumber=req.body.phonenumber2;
  var userid = req.session.displayName;
  var count = req.body.count; //숙제 갯수
  var countArr=new Array(7);
  countArr[0]=req.body.homework1; //숙제 1
  countArr[1]=req.body.homework2; //숙제 2
  countArr[2]=req.body.homework3; //숙제 3
  countArr[3]=req.body.homework4; //숙제 4
  countArr[4]=req.body.homework5; //숙제 5
  countArr[5]=req.body.homework6; //숙제 1
  countArr[6]=req.body.homework7; //숙제 2


  console.log(place_title);
  console.log(start_time);
  console.log(end_time);
  console.log(class_date);
  console.log(curriculum_title);
  console.log(comment);
  console.log(userid);
  console.log(p_phonenumber);
  console.log(s_phonenumber);
  var s_email;
  var p_email;

  var sql2 ='SELECT email FROM user where phonenumber="'+s_phonenumber+'"';
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql2,function(err,rows,fields){
          conn.release();
          if(!err) {
            if(rows.length>0){
            s_email=rows[0].email;
          }
          }
      });
  });

  var sql3 ='SELECT email FROM user where phonenumber="'+p_phonenumber+'"';
  pool.getConnection(function(err,conn){
      if (err) {
        console.log({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      conn.query(sql3,function(err,rows,fields){
          conn.release();
          if(!err) {
            if(rows.length>0){
            p_email=rows[0].email;
          }
          }
      });
  });


  pool.getConnection(function(err,conn){
    if (err) {
      console.log({"code" : 100, "status" : "Error in connection database"});
      return;
    }
          var sql = 'INSERT INTO curriculum (curriculum_title, start_time, end_time, class_date, place_title, place_position, comment, p_phonenumber, s_phonenumber, userid) VALUES(?,?,?,?,?,?,?,?,?,?)';
          var value = [curriculum_title, start_time, end_time, class_date, place_title, place_position, comment, p_phonenumber, s_phonenumber, userid];
          conn.query(sql,value,function(err,rows,fields){
                conn.release();
            if(err){
              console.log(err);
               res.status(500).send('Internal Server Error');
            }else{

              console.log('countnum:'+count);
              if(count!=0){
              var sql2 ='SELECT curriculum_id FROM curriculum where curriculum_title="'+curriculum_title+'" order by curriculum_id desc;';
              pool.getConnection(function(err,conn){
                  if (err) {
                    console.log({"code" : 100, "status" : "Error in connection database"});
                    return;
                  }
                  conn.query(sql2,function(err,rows2,fields){
                      conn.release();
                      if(!err) {
                        if(rows2.length>0){
                        console.log('curritest:'+rows2[0].curriculum_id);





                          console.log('count :'+count);
                        pool.getConnection(function(err,conn){
                            if (err) {
                              console.log({"code" : 100, "status" : "Error in connection database"});
                              return;
                            }
                            var sql3 ='INSERT INTO homework (homework_content,curriculum_id ) VALUES(?,?)';
                            for(var i=0;i<count;i++){
                            var value = [countArr[i], rows2[0].curriculum_id];
                            conn.query(sql3,value,function(err,rows3,fields){
                                if(!err) {

                                }
                            });
                            }
                            res.redirect('/mystudy');
                        });



                      }
                      }
                  });
              });
            }else{
              res.redirect('/mystudy');
            }

              console.log('p_email:'+p_email);
              console.log('s_email:'+s_email);

          if((p_email!=null)||(s_email!=null)){
              var mailOptions={
              from : "bonoqwe915@gmail.com",
              to : '"'+p_email+'","'+s_email+'"',
              subject : "[누구나과외] 커리큘럼 등록",
              text : '커리큘럼이 등록되었습니다. [누구나 과외]앱에서 확인하세요.\n http://'+ip_address+':3001'
          }

            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                    res.end("error");
                }else{
                    console.log(response.response.toString());
                    console.log("Message sent: " + response.message);
                    res.end("sent");
                }
            });
            }

            }
          });
});


});


return route;
};
