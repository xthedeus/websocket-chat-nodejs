var sanitizeHtml = require('sanitize-html');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var count = 0;

var port = process.argv[process.argv.length-1];

app.use(express.static(__dirname));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

io.on('connection', function(socket){
    console.log("new user_connected");
    count++;
    socket.emit('connection_status', {count: count});
    socket.broadcast.emit('connection_status', {count: count});

    socket.on('disconnect', function () {
        console.log("new user_disconnected");
        count--;
        socket.broadcast.emit('connection_status', {count: count});
    });

    socket.on('message', function (msg) {
        socket.broadcast.emit('message', {content: sanitizeHtml(msg['message'])});
    });

});

server.listen(port);