var http = require('http');
var fs = require('fs');
var express    = require('express');
var app = express();

var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (error, content) {
        res.writeHead('200', {'Content-Type': "text/html"});
        res.end(content);
    });
});

var io = require('socket.io').listen(server);

var session = require("express-session");

io.sockets.on('connection', function (socket) {
      
    socket.on('newperso', function (pseudo) {
        session.pseudo = pseudo;
        socket.emit('welcome', {msg: 'Bienvenue', pseudo});
        socket.broadcast.emit('connected', {msg : 'connected', pseudo});
    });

    socket.on('message', function (message) {
        var msg = message.msg, pseudo = message.pseudo;
        socket.broadcast.emit('message', {msg, pseudo});
    });

});

server.listen(8080);
