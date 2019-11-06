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

// initialization method
app.init = function (callback) {
    //start servwer
    server.init();

    //start workers
    workers.init();

    //start cli, but make sure it starts last
    setTimeout(function () {
        cli.init();
        callback();
    }, 50)

};

//slef envoking only if required directly
if (require.main === module) {
    app.init(function () { });

}


//export app
module.exports = app;