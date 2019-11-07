/***
 * 
 * Example TCP(net) client
 * sends ping for pong to 6000
 */


 var net = require('net');


 //define message
 var outboundMessage = 'ping';


 //create client
 var client = net.createConnection({'port': 6000}, function() {
     //send message
     client.write(outboundMessage);
 })

//when server write back, log what it says
client.on('data', function(inboundMessage) {
    var messageString = inboundMessage.toString();
    console.log('I wrote '+outboundMessage+' and they said '+messageString);
client.end();
})