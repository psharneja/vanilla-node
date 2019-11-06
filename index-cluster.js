/**
 *
 * Primary file for API
 *
 */


// dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var cluster = require('cluster');
var os = require('os');


// declare the app
var app = {};

// initialization method
app.init = function (callback) {
    //if on master thread, start workers n cli
    if (cluster.isMaster) {

        //start workers
        workers.init();

        //start cli, but make sure it starts last
        setTimeout(function () {
            cli.init();
            callback();
        }, 50)

        //fork the process
        for(var i = 0; i<os.cpus().length; i++) {
            cluster.fork();
        }

    } else {

        
        
        //start servwer
        //running on multiple cores
        // if not on master thread, start http
        server.init();
    }


};

//slef envoking only if required directly
if (require.main === module) {
    app.init(function () { });

}


//export app
module.exports = app;