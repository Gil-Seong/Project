/*
 * 사용자 정보 처리 모듈
 * 데이터베이스 관련 객체들을 req.app.get('database')로 참조
 *
 * @date 2016-11-10
 * @author Mike
 */

var listuser = function(req, res) {
	console.log('user(user2.js) 모듈 안에 있는 login 호출됨.');


    // 데이터베이스 객체 참조
	var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
	if (database.db) {
    database.UserModel.findAll(function(err,results){


      // 에러 발생 시, 클라이언트로 에러 전송
      if (err) {
                console.error('사용자 로그인 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>사용자 로그인 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
        res.end();
            return;
    }
    if (results) {
      console.dir(results);

      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write(JSON.stringift(results));
      res.end();
    } else{

    }




  );


module.exports.listuser = listuser;
