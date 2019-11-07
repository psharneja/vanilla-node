/**
 * 
 * Example TCP(net) server
 * listens to 6000, pongs to ping
 */


 //dependencies
 var net = require('net');

 //cretae server
 var server = net.createServer(function(connection) {
     //send 'pong
     var outboundMessage = 'pong';
     connection.write(outboundMessage);

     //when client write we log it out
     connection.on('data', function(inboundMessage) {
         var messageString = inboundMessage.toString();
         console.log('I wrote '+outboundMessage+' and they said '+messageString);

     });
 })




 server.listen(6000);