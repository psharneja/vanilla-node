/*
 * server related tasks
 */
// Dependencies
var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var fs = require("fs");
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');
var util = require('util');
var debug = util.debuglog('server')

// instantiate server module object
var server = {};




//@TODO get rid of this
// helpers.sendTwilioSms('9711838993', 'Hello', function(err) {
//     debug(err, 'ok');
// })

// the server start on http
server.httpServer = http.createServer(function(req, res) {
    server.unifiedServer(req, res);
});



//instantiate https server
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))
};
server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res) {
    server.unifiedServer(req, res);
});



// all the server logic for both http n https
server.unifiedServer = function(req, res) {
    // get url and parse it
    var parsedUrl = url.parse(req.url, true);

    // get the path from url
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // get the query string as an object
    var queryStringObject = parsedUrl.query;

    // get the http method
    var method = req.method.toLowerCase();

    // get the header as object
    var headers = req.headers;

    // get the payload, if any
    var decoder = new StringDecoder("utf-8");
    var buffer = "";
    req.on("data", function(data) {
        buffer += decoder.write(data);
    });

    req.on("end", function() {
        buffer += decoder.end();

        // choose the handler this request should go to
        var chosenHandler =
            typeof server.router[trimmedPath] !== "undefined" ?
            server.router[trimmedPath] :
            handlers.notFound;

        var data = {
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: helpers.parseJsonToObject(buffer)
        };

        // route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            // use the status code callback or default 200
            statusCode = typeof statusCode == "number" ? statusCode : 200;

            //use the payload callback or define empty object
            payload = typeof payload == "object" ? payload : {};

            // convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // return response
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);

            // send response
            res.end(payloadString);

            // log the request path
            // if response is 220, print green otherwise red
            if (statusCode == 200) {
                debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            }
        });
    });
};

// define a request router
server.router = {
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks
};
//init method
server.init = function() {
    //start the http server
    //start the server and have it listen to port 3000
    server.httpServer.listen(config.httpPort, function() {

        console.log('\x1b[36m%s\x1b[0m', "the server is listening on port " + config.httpPort);
    });
    //start the https server
    //start https server
    server.httpsServer.listen(config.httpsPort, function() {
        console.log('\x1b[35m%s\x1b[0m', "the server is listening on port " + config.httpsPort);
    });
}


//export the module
module.exports = server;