var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fetch = require('node-fetch');

app.use(express.static('public'));
var connectCounter = 0;

//Whenever someone connects, this gets executed
io.on('connection', function(socket) {
    console.log('A user is connected.');
    console.log("Number of clients: " + connectCounter++);

    socket.emit('testdisplay', 'Client # ' + connectCounter);
    
    
    //Send a message after a timeout of 2 seconds
    socket.on('clientEvent', function(data) {
        var from = data.from;
        var to = data.to;
        var amount = data.amount;

        var string_concat_url = from + "_" + to;
        if(amount != "") {
            fetch('https://free.currconv.com/api/v7/convert?q=' + string_concat_url + '&compact=ultra&apiKey=b836b52a95e45878de89')
            .then(res => res.json())
            .then(json => socket.send((json[string_concat_url] * amount).toFixed(3)))
        }else{
            socket.send("0.00");
        }
    });
    
    //Whenever someone disconnects, this get executed

    socket.on('disconnect', function() {
        
        console.log('A user disconnected.');
        console.log("Number of clients:" + connectCounter--);
    });
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});
