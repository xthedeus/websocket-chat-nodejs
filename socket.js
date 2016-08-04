var io = require('socket.io')();

var count = 0;

var port = process.argv[process.argv.length-1];

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
        socket.broadcast.emit('message', {content: msg['message']});
    });

});

io.listen(port);
