/**
 * 
 * API Integrationn tests
 */

 //dependencies
 var app = require('./../index');
 var assert = require('assert');
 var http = require('http');
 var config = require('./../lib/config');


 //holder for the tests
 var api =  {};

 //helpers
 var helpers = {};
 helpers.makeGetRequest = function(path, callback) {
     //configure request
     var requestDetails = {
         'protocol': 'http:',
         'hostname': 'localhost',
         'port': config.httpPort,
         method: 'GET',
         'headers': {
             'Content-Type': 'application/json'
         }
     }

     //send request
     var req = http.request(requestDetails, function(res) {
         callback(res);
     });
     req.end();
 }


 api['app.init should start without throwsing'] = function(done) {
     assert.doesNotThrow(function(){
         app.init(function(err) {
             done();
         })
     }, TypeError)
 }

 //make a request to ping
 api['/ping should respond to GET with 200'] = function(done) {
     helpers.makeGetRequest('/ping', function(res) {
         assert.equal(res.statusCode, 200);
         done();
     })
 }

 //make a request to /api/users
 api['/api/users should respond to GET with 400'] = function(done) {
    helpers.makeGetRequest('/api/users', function(res) {
        assert.equal(res.statusCode, 400);
        done();
    })
}

 //make a request to randompath
//  api['random should respond to GET with 404'] = function(done) {
//     helpers.makeGetRequest('/this/path/is/wrong/for/sure', function(res) {
//         assert.equal(res.statusCode, 404);
//         done();
//     })
// }




 //export
 module.exports = api;