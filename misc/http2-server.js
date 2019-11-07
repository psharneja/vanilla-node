/**
 * 
 * Example http2 server
 * 
 */

 var http2 = require('http2');


 //init server
 var server = http2.createServer();


 //on a stream, send hello world html
 server.on('stream', function(stream, headers) {
     stream.respond({
         status: 200,
         'content-type': 'text/html'
     });
     stream.end('<html><body><p>Hello people!</p></body></html>')

 });



 //listen to 6000
 server.listen(6000);