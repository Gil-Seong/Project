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
    host     : 'localhost',
    user     : 'root',
    password : 'wjd0606',
    database : 'o4',
    debug    :  false
});


return route;
};
