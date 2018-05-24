let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let canvasData;

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected', socket.id);
    // socket.broadcast.to(socket.id).emit('drawing', canvasData);

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('ready', function(msg) {
       console.log(msg);
    });

    socket.on('drawing', function (canvasJson) {
       console.log("Drawing");
       canvasData = canvasJson;
       socket.broadcast.emit('drawing', canvasData);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});