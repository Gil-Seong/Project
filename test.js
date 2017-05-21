var redis = require('redis');
var redisClient = redis.createClient({host : 'localhost', port : 6379});

redisClient.on('ready',function() {
 console.log("Redis is ready");
});

redisClient.on('error',function() {
 console.log("Error in Redis");
});

redisClient.set("language","nodejs",function(err,reply) {
 console.log(err);
 console.log(reply);
});

redisClient.get("language",function(err,reply) {
 console.log(err);
 console.log(reply);
});

redisClient.hmset("tools","webserver","expressjs","database","mongoDB","devops","jenkins",function(err,reply){
 console.log(err);
 console.log(reply);//hmset = tools안에 변수와 값을 순서대로 나열한다.
});

redisClient.hgetall("tools",function(err,reply) { //hgetall = tools에있는 값들을 전부 불러온다.
 console.log(err);
 console.log(reply);
});

redisClient.rpush(["languages","angularjs","nodejs","go"],function(err,reply) { //화면에 인쇄됀 값이 2지만 실제로 3이넘음
 console.log(err);
 console.log(reply);
});

redisClient.sadd(["devopstools","jenkins","codeship","jenkins"],function(err,reply) {//중복값 2개가 필터링 되었음.
 console.log(err);
 console.log(reply);
});

redisClient.exists('language',function(err,reply) {
 if(!err) {
  if(reply === 1) {
   console.log("Key exists");
  } else {
   console.log("Does't exists");
  }
 }
});

redisClient.expire('redisClient', 30); // Expirty time for 30 seconds.
