/**
 * Example udp client
 *  sending message to udp server on 6000
 */


 //dependencies
 var dgram = require('dgram');

 //client
 var client = dgram.createSocket('udp4');

 //define the messasge, pull into buffer
 var messageString = 'this is a message';

 var messageBuffer = Buffer.from(messageString);


 //send off the message
 client.send(messageBuffer, 6000, 'localhost', function(err) {
     client.close();
 })