var express = require("express");
var app = express();
var socket = require("socket.io");

var server = app.listen(7538, function () {
    console.log("Listening on port 7538");
});

app.use(express.static("public"), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var io = socket(server);

io.on("connection", function (socket) {

    socket.on("chat", function (data) {
        console.log("chat");
        io.sockets.emit("chat", data);
    });

    socket.on("typing", function (data) {
        console.log("typing");
        socket.broadcast.emit("typing", data)
    });

    socket.on("start", function (data) {
        console.log("start");
        io.sockets.emit("start", data);
    });

    socket.on("turn", function (data) {
        console.log("turn");
        io.sockets.emit("turn", data);
    });

});
