module.exports = function(app){
var expressSession = require('express-session');
var express = require('express');
var route = express.Router();
var http = require('http').Server(route);
var io = require('socket.io')(http);
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


return route;
};
