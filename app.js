var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fetch = require('node-fetch');
var path  = require('path');

app.use(express.static(path.join(__dirname, 'public/css')));
app.get('/', function(req, res) {
   res.sendfile('index.html');   
});


//Whenever someone connects, this gets executed
io.on('connection', function(socket) {
    // setTimeout(function() {
    //     socket.emit('testdisplay', 'Grp JCZ');
    // },2000);
    
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
    });
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});