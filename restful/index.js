/**
 *
 * Primary file for API
 *
 */

// Dependencies
var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./lib/config");
var fs = require("fs");
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');
// the server start on http
var httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res);
});

//start the server and have it listen to port 3000
httpServer.listen(config.httpPort, function() {
    console.log("the server is listening on port " + config.httpPort);
});

//instantiate https server
var httpsServerOptions = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem")
};
var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifiedServer(req, res);
});

//start https server
httpsServer.listen(config.httpsPort, function() {
    console.log("the server is listening on port " + config.httpsPort);
});

// all the server logic for both http n https
var unifiedServer = function(req, res) {
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
            typeof router[trimmedPath] !== "undefined" ?
            router[trimmedPath] :
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
            console.log("request received with payload", buffer);
        });
    });
};

// define a request router
var router = {
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks
};