/**
 * 
 * Example http2 client
 */

 //dependency
 var http2 = require('http2');


 //create a client
 var client = http2.connect('http://localhost:6000');


 //create the request
 var req = client.request({
     ':path': '/',
 });


 //when message is received, add pieces until u reach end
 var str = '';
 req.on('data', function(chunk) {
     str+=chunk;

 });


 req.on('end', function(){
     console.log(str);
 })

 req.end();