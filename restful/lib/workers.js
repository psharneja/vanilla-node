/**
 *
 * worker related
 */

var path = require("path");
var fs = require("fs");
var _data = require("./data");
var https = require("https");
var http = require("http");
var helpers = require("./helpers");
var url = require("url");
var _logs = require('./logs.js');
var util = require('util');
var debug = util.debuglog('workers');
//instantiate worker object
var workers = {};

//lookup all checks, get timer data, send to validator
workers.gatherAllChecks = function() {
    _data.list("checks", function(err, checks) {
        if (!err && checks && checks.length > 0) {
            checks.forEach(function(check) {
                //read in the check data
                _data.read("checks", check, function(err, originalCheckData) {
                    if (!err && originalCheckData) {
                        //pass the data to check validator, and let that function continute or log error as needed
                        workers.validateCheckData(originalCheckData);
                    } else {
                        debug("error reading one of the checkss data");
                    }
                });
            });
        } else {
            debug("could not find any checks to process");
        }
    });
};

//sanity check the check data
workers.validateCheckData = function(originalCheckData) {

    originalCheckData =
        typeof originalCheckData == "object" && originalCheckData !== null ?
        originalCheckData : {};
    originalCheckData.id =
        typeof originalCheckData.id == "string" &&
        originalCheckData.id.trim().length == 20 ?
        originalCheckData.id.trim() :
        false;
    originalCheckData.userPhone =
        typeof originalCheckData.userPhone == "string" &&
        originalCheckData.userPhone.trim().length == 10 ?
        originalCheckData.userPhone.trim() :
        false;
    originalCheckData.protocol =
        typeof originalCheckData.protocol == "string" && ["http", "https"].indexOf(originalCheckData.protocol) > -1 ?
        originalCheckData.protocol :
        false;
    originalCheckData.url =
        typeof originalCheckData.url == "string" &&
        originalCheckData.url.trim().length > 0 ?
        originalCheckData.url.trim() :
        false;
    originalCheckData.method =
        typeof originalCheckData.method == "string" && ["post", "get", "put", "delete"].indexOf(originalCheckData.method) > -1 ?
        originalCheckData.method :
        false;
    originalCheckData.successCodes =
        typeof originalCheckData.successCodes == "object" &&
        originalCheckData.successCodes instanceof Array &&
        originalCheckData.successCodes.length > 0 ?
        originalCheckData.successCodes :
        false;
    originalCheckData.timeoutSeconds =
        typeof originalCheckData.timeoutSeconds == "number" &&
        originalCheckData.timeoutSeconds % 1 === 0 &&
        originalCheckData.timeoutSeconds >= 1 &&
        originalCheckData.timeoutSeconds <= 5 ?
        originalCheckData.timeoutSeconds :
        false;

    //set the keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state =
        typeof originalCheckData.state == "string" && ["up", "down"].indexOf(originalCheckData.state) > -1 ?
        originalCheckData.state :
        "down";
    originalCheckData.lastChecked =
        typeof originalCheckData.lastChecked == "number" &&
        originalCheckData.timeoutSeconds > 0 ?
        originalCheckData.timeoutSeconds :
        false;
    debug(originalCheckData, 'heyaa')
        //if all the checks pass, pasas the data to the next step in the process
    if (
        originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds
    ) {
        workers.performCheck(originalCheckData);
    } else {
        debug(
            "Error: omne of the checks is not properly formatted, skipping it."
        );
    }
};

//perfor check, send the originalCheckData ansd outcome of the check to next step
workers.performCheck = function(originalCheckData) {
    //prepare the initia;l check outcome3
    var checkOutcome = {
        error: false,
        response: false
    };

    //mark that the outcome is not sen t yet
    var outcomeSent = false;

    //parse the hostname and thepath  out of the origimnal check data
    var parselUrl = url.parse(
        originalCheckData.protocol + "://" + originalCheckData.url,
        true
    );
    var hostName = parselUrl.hostname;
    var path = parselUrl.path; //usinf path and not pathnod, cos we want query strings also

    //construct request
    var requestDetails = {
        protocol: originalCheckData.protocol + ":",
        hostname: hostName,
        method: originalCheckData.method.toUpperCase(),
        path: path,
        timeout: originalCheckData.timeoutSeconds * 1000
    };

    // instantiate the request object (using either http orhttps module)
    var _moduleToUse = originalCheckData.protocol == "http" ? http : https;
    var req = _moduleToUse.request(requestDetails, function(res) {
        //grab the status of the sent request
        var status = res.statusCode;

        //udate the checkoutcome and pass the data along
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    //bind to the error event so it doesnt get thrown
    req.on("error", function(e) {
        //udate the checkoutcome and pass the data along
        checkOutcome.error = { err: true, value: e };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on("timeout", function(e) {
        //udate the checkoutcome and pass the data along
        checkOutcome.error = { err: true, value: "timeout" };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // end req
    req.end();
};

//process the check outcome and update the check data as needed, trigger an alert if needed
//special login for accomodsting a check that has never been tested before

workers.processCheckOutcome = function(originalCheckData, checkOutcome) {
    //decide if the check is considered up or donw in current state
    var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    //decide if an alert is warranted
    var alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;


    //log the outcome
    var timeofCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeofCheck);

    //update the check data
    var newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeofCheck;


    //save the updates
    _data.update('checks', newCheckData.id, newCheckData, function(err) {
        if (!err) {
            //send to the next phase'
            if (alertWarranted) {
                workers.alertUserTostatusChanges(newCheckData);

            } else {
                debug('checkOutcome not changed, no alert needed');
            }

        } else {
            debug('trying error to save update of one of the checks')
        }
    })
};

//alert
workers.alertUserTostatusChanges = function(newCheckData) {
    var msg = 'Alert: Your check for ' + newCheckData.method.toUpperCase() + ' ' + newCheckData.protocol + '://' + newCheckData.url + 'is currently' + newCheckData.state;
    helpers.sendTwilioSms(newCheckData.userPhone, msg, function(err) {
        if (!err) { debug('Success: user alerted for status change') } else { debug('error: could jnot send sms alert to user') }
    });

}

//log
workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeofCheck) {
    //form the log data
    var logData = {
        'check': originalCheckData,
        'outcome': checkOutcome,
        state,
        alert: alertWarranted,
        'time': timeofCheck
    }

    //convert data to string
    var logString = JSON.stringify(logData);

    //determine the name of log file
    var logFileName = originalCheckData.id;

    // append the log string to the file we want to write to
    _logs.append(logFileName, logString, function(err) {
        if (!err) {
            debug('logging to files succeeded');
        } else {
            debug('logging to file failed');
        }
    })
}


//timer to execute worker process once per minute
workers.loop = function() {
    setInterval(function() {
        workers.gatherAllChecks();
    }, 1000 * 5);
};

// timer to execute the log rotation every 24 hours
workers.logRotationLoop = function() {
    setInterval(function() {
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24);
};

//rotate
workers.rotateLogs = function() {
    //list all non compressed files
    _logs.list(false, function(err, logs) {
        if (!err && logs && logs.length > 0) {
            logs.forEach(function(logName) {
                //compressthe data to different file
                var logId = logName.replace('.log', '');
                var newFileId = logId + '-' + Date.now();
                _logs.compress(logId, newFileId, function(err) {
                    if (!err) {
                        //truncate log
                        _logs.truncate(logId, function(err) {
                            if (!err) {
                                debug("success in truncating logs")
                            } else {
                                debug('error truncating log files');
                            }
                        });
                    } else {
                        debug('error compressing one of the log files');
                    }
                })

            })
        } else {
            debug('Error: could not find any logs to rotate')
        }
    })
}

workers.init = function() {

    //send to console in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');
    //execute all the checks
    workers.gatherAllChecks();

    //call the loop so that checks will execute later on
    workers.loop();

    //compress all the log immediately
    workers.rotateLogs();

    //call the compression loop so logs will be compressed later on
    workers.logRotationLoop();
};

//export
module.exports = workers;