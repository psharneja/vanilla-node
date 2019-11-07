/**
 * Example udp server
 * creating udp datagram server on 6000
 */

 //dependencies
 var dgram = require('dgram');
 

 //creating server
 var server = dgram.createSocket('udp4');



server.on('message', function(messageBuffer, sender) {
    //do something with the incoming message or do something with the sender
    var messageString = messageBuffer.toString();
    console.log(messageString);
})


//bind to 6000
server.bind(6000);