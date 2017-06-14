var redisInfo = {
    host: '127.0.0.1',
    port: 6379
};
var app = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io').listen(app);
var redis = require('socket.io-redis');

console.log(process.argv[0]);
process.argv[0] = 7000;
process.argv[1] = 7001;
process.argv[2] = 7002;
process.argv[3] = 7003;

if (process.argv.length < 3){
    console.log('ex) node app <port>');
    process.exit(1);
}
app.listen(process.argv[2]);
console.log(process.argv[2] +' Server Started!! ')

function handler(req, res) {
    fs.readFile('/client4.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading client4.html');
            }
            res.writeHead(200);
            data = data.toString('utf-8').replace('<%=host%>', req.headers.host);
            res.end(data);
        });
}
io.adapter(redis({host:'localhost',port:6379}));

io.sockets.on('connection', function (socket) {
    socket.on('message', function(data){
        socket.broadcast.emit('message', data);
    });
});
