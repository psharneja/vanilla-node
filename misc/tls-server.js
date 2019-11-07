/**
 * 
 * Example TCP(tls) server
 * listens to 6000, pongs to ping
 */


 //dependencies
 var tls = require('tls');
 var fs = require('fs');
var path = require('path');

//server options
var options = {
    key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))  
};

 //cretae server
 var server = tls.createServer(options, function(connection) {
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