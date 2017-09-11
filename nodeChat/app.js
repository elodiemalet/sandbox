"use strict";

// Get Node.js native modules
const http = require("http");

// Get Node.js third party modules
const express = require("express");
const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

// Create app and server and start socket
const app = express();

const server = http.createServer(app);
const io = require("socket.io").listen(server);

// Set session
app.use(session);

// Index route / home
app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");
});

///////////////// Connexions : ///////////////////
io.sockets.on("connection", function (socket) {

    if (session.pseudo === undefined) {

        session.pseudo = [];
    }

    socket.on("login", function (hash) {

        if (!hash) {

            hash = socket.id;
            socket.emit("hash", hash);
        }

        if (session.pseudo[hash] === undefined) {

            session.pseudo[hash] = "Guest #" + (Math.floor((Math.random() * 100) + 1));
        }

        var client = session.pseudo[hash];

        socket.emit("pseudo", client);
        socket.broadcast.emit("connected", {msg: "connected", client});
    });

    socket.on("editperso", function (data) {

        var msg = session.pseudo[data.hash] + " is now " + data.np + " !";

        session.pseudo[data.hash] = data.np;
        socket.broadcast.emit("info", {msg});
    });

    socket.on("message", function (message) {

        var msg = message.msg;
        var pseudo = session.pseudo[message.hash];

        socket.broadcast.emit("message", {msg, pseudo});
    });
});

// Start server
server.listen(8080);
