/***
 * 
 * Example TCP(tls) client
 * sends ping for pong to 6000
 */



//dependencies
var tls = require('tls');
var fs = require('fs');
var path = require('path');

//server options
var options = {
    'ca': fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))  //only required on self signed certificates
};
//define message
var outboundMessage = 'ping';


//create client
var client = tls.connect(6000, options, function () {
    //send message
    client.write(outboundMessage);
})

//when server write back, log what it says
client.on('data', function (inboundMessage) {
    var messageString = inboundMessage.toString();
    console.log('I wrote ' + outboundMessage + ' and they said ' + messageString);
    client.end();
})