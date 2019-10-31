/**
 *
 * Primary file for API
 *
 */


// dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');


// declare the app
var app = {};

// initialization method
app.init = function() {
    //start servwer
    server.init();

    //start workers
    workers.init();
};

//exec method
app.init();


//export app
module.exports = app;