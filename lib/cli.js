/**
 * 
 * CLI rerlated tasks
 */


// dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');

class _events extends events { };

var e = new _events();

//instantiate the cli module object
var cli = {};


//input handlers, to be bound to the events
e.on('man', function (str) {
    cli.responders.help();
});

e.on('help', function (str) {
    cli.responders.help();
});

e.on('exit', function (str) {
    cli.responders.exit();
});
e.on('stats', function (str) {
    cli.responders.stats();
});

e.on('list users', function (str) {
    cli.responders.listUsers();
});

e.on('more user info', function (str) {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', function (str) {
    cli.responders.listChecks(str);
});
e.on('more check info', function (str) {
    cli.responders.moreCheckInfo(str);
});
e.on('list logs', function (str) {
    cli.responders.listLogs();
});
e.on('more log info', function (str) {
    cli.responders.moreLogInfo(str);
});
//responders onbject
cli.responders = {};

//help/ man
cli.responders.help = function () {
    var commands = {
        'exit': 'kill the cli and the rest of the application',
        'man': 'show this help page',
        'help': 'Alias for the man command',
        'stats': 'get statistics on the underlying OS and resource utilization',
        'list users': 'show list of all registered users in the system',
        'more user info --{userId}': 'show details of a specific user',
        'list checks --up --down': 'show a list of all the active checks in the system, including their state. the "--up" and "--down" are optional',
        'more check info --{checkId}': 'show details of a specified check',
        'list logs': 'show list of all the uncompressed or compressed logs available',
        'more log info --{fileName}': 'show details of a specified log file'
    };

    //show header for the help page that is as wide as screen
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    //show each command, followed by its explanation in white and yellow respectively
    for (var key in commands) {
        if (commands.hasOwnProperty(key)) {
            var value = commands[key];
            var line = '      \x1b[33m '+key+'      \x1b[0m';
            var padding = 60 - line.length;
            for (i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);
    cli.horizontalLine();
}

//exit
cli.responders.exit = function () {
    console.log('\x1b[35m%s\x1b[0m', 'byeee');
    process.exit(0);
}

//stats
cli.responders.stats = function () {
    console.log('you asked for stats, didnt you?');
}

//list users
cli.responders.listUsers = function () {
    console.log('you asked to lsit users?');
}

//more user info
cli.responders.moreUserInfo = function (str) {
    console.log('you asked for more user info');
}

//list checks
cli.responders.listChecks = function () {
    console.log('you asked to lsit check?');
}

//more checks info
cli.responders.moreCheckInfo = function (str) {
    console.log('you asked for more check info', str);
}

//list checks
cli.responders.listLogs = function () {
    console.log('you asked to logs check?');
}

//more checks info
cli.responders.moreLogInfo = function (str) {
    console.log('you asked for more logs info', str);
}

//vertical space
cli.verticalSpace = function (lines) {
    lines == typeof lines == 'number' && lines > 0 ? lines : 1;
    for (i = 0; i < lines; i++) {
        console.log('')
    }

}

//horizontal line
cli.horizontalLine = function () {
    //get available screen size
    var width = process.stdout.columns;
    var line = '';
    for (i = 0; i < width; i++) {
        line += '-';
    }
    console.log(line);

}

//create centeres text
cli.centered = function(str) {
    str = typeof str == 'string' && str.trim().length > 0 ? str.trim(): '';
    //get screen size
    var width = process.stdout.columns;

    //calculate left padding there should be
    var leftPadding = Math.floor((width - str.length) / 2);

    //put in left padded spaces before the string itself
    var line = '';
    for(i=0;i<leftPadding;i++) {
        line+=' ';
    }
    line+=str;
    console.log(line);
}



//input processor
cli.processInput = function (str) {
    str = typeof str == 'string' && str.trim().length > 0 ? str.trim() : false;
    //only process the input if the user actually wrote something
    if (str) {
        // codify the unique strings that identify the unique questions allowed to be asked
        var uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        //go through the possible inputs, emit an event when a match is found
        var matchFound = false;
        var counter = 0;
        uniqueInputs.some(function (input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                //emit an eventmatching the unique input and include the full string given
                e.emit(input, str);
                return true;
            }
        });
        //if no match is found; tell the user to try again
        if (!matchFound) {
            console.log("sorry, try again!");
        }
    }
}


//init script
cli.init = function () {
    //send the start message to console in dark blue
    console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');


    //start the interface
    var _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'ps>' //define the prompt
    });


    //create initial prompt
    _interface.prompt();

    //handle each line of input separately
    _interface.on('line', function (str) {
        //send to input processor
        cli.processInput(str);

        //reinitialize the prompt
        _interface.prompt();
    });

    //if the user stops the CLI, kill the associted processes
    _interface.on('close', function () {
        process.exit(0);
    })



}


//export
module.exports = cli;