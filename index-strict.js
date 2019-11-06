"use strict"; 
/**
 *
 * Primary file for API
 *
 */


// dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');


// declare the app
var app = {};
//declare a global that strict mode should catch
foo='bar';
// initialization method
app.init = function() {
    //start servwer
    server.init();

    //start workers
    workers.init();

    //start cli, but make sure it starts last
    setTimeout(function() {
        cli.init();
    },50)

};

//exec method
app.init();


//export app
module.exports = app;