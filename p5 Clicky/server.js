/**
 * Created by Ryan on 8/2/2017.
 */
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

var blobs = [];
var score = 0;

function Blob(id, x, y, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
}

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat() {
    io.sockets.emit('heartbeat', blobs);
}

function resetTimer() {
    currentMillis = millis();
    projectedMillis = currentMillis + 30000;
    timeLeft = projectedMillis - currentMillis;
}

function newLocation() {
    x = random(ellipseDiameter / 2,
        canvasWidth - ellipseDiameter / 2);
    y = random(ellipseDiameter / 2,
        canvasHeight - ellipseDiameter / 2);
}



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',


    // We are given a websocket object in our function
    function(socket) {

        console.log("We have a new client: " + socket.id);


        socket.on('start',
            function(data) {
                console.log("started");
            }
        );

        socket.on('update',
            function(data) {
                //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
               console.log("updating user: "+socket.id);
               score++;


            }
        );



        socket.on('disconnect', function() {
            console.log("Client has disconnected");
        });
    }
);