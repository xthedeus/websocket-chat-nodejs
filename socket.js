var io = require('socket.io')();
var fs = require('fs');

var count = 0;

var configurationFile, config;

configurationFile = 'config.json';

try {
    config = JSON.parse(fs.readFileSync(configurationFile));
} catch (ex) {
    console.log("Something bad happended: " + ex);
    return;
}

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

io.listen(config.port);
