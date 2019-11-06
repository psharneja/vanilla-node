/**
 *
 * Primary file for API
 *
 */


// dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');


// declare the app
var app = {};

// initialization method
app.init = function() {
    debugger;
    //start servwer
    server.init();
    debugger;

    //start workers
    debugger;

    workers.init();
    debugger;

    //start cli, but make sure it starts last
    debugger;

    setTimeout(function() {
        cli.init();
    },50)
    debugger;

    debugger;

    var foo = 1;
    debugger;

    //incremenrt foo
    debugger;

    foo++;
    debugger;

    //square it
    debugger;

    foo=foo*foo;
    debugger;


    //convet tto string
    debugger;

    foo = foo.toString();
    debugger;

    //call the init script for error
    debugger;

    exampleDebuggingProblem.init();
    debugger;

};

//exec method
app.init();


//export app
module.exports = app;