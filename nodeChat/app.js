var http    = require('http');
var fs      = require('fs');
var express = require('express');
var app     = express();
var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  });

app.use(session);

// Home
app.get('/', function(req, res) {

    res.sendFile(__dirname + '/index.html');
});

var server = http.createServer(app);
var io     = require('socket.io').listen(server);

///////////////// Connexions : ///////////////////


io.sockets.on('connection', function (socket) {

    if(session.pseudo == undefined) {
        session.pseudo = [];
    }
    
    socket.on('login', function (hash) {
        if(hash == false){
            hash = socket.id;
            socket.emit('hash', hash); 
        }

        if(session.pseudo[hash] == undefined) {
            session.pseudo[hash] = 'Guest' +(Math.floor((Math.random() * 100) + 1) );
        }

        var client = session.pseudo[hash];

        socket.emit('pseudo', client); 
        socket.broadcast.emit('connected', {msg : 'connected', client});


    });

    socket.on('editperso', function (data) {
        msg = session.pseudo[data.hash] + ' is now ' + data.np + ' !';
        session.pseudo[data.hash] = data.np;

        socket.broadcast.emit('info', {msg});
    });

    socket.on('message', function (message) {
        var msg = message.msg, pseudo = session.pseudo[message.hash];
        socket.broadcast.emit('message', {msg, pseudo});
    });

});

server.listen(8080);
