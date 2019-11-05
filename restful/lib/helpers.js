/**
 * Helpers for all the various tasks
 */

//dependencies
var crypto = require("crypto");
var config = require("./config");
var https = require('https');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');
// container for all the helpers
var helpers = {};

// create a SHA256 hash
helpers.hash = function(str) {
    if (typeof str == "string" && str.length > 0) {
        var hash = crypto
            .createHmac("sha256", config.hashingSecret)
            .update(str)
            .digest("hex");
        return hash;
    } else {
        return false;
    }
};

//  parse JSON string to an object in all cases without throwing error

helpers.parseJsonToObject = function(str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

// create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';

        // start the final string
        var str = '';
        for (var i = 1; i <= strLength; i++) {
            // get the random characters from the possibleCharacters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            //append this character in the final string
            str += randomCharacter;
        }

        return str;
    }
}

helpers.sendTwilioSms = function(phone, msg, callback) {
    // validate the parameters
    phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

    if (phone && msg) {
        // configure the request payload for twilio
        var payload = {
            'From': config.twilio.fromPhone,
            'To': '+91' + phone,
            'Body': msg
        };


        //steingify the payload
        var stringPayload = querystring.stringify(payload);

        //config request
        var requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        };



        // instantiate the request object
        var req = https.request(requestDetails, function(res) {
            // grab the status of sent request
            var status = res.statusCode;
            //callback if request went through
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was' + status);
            }
        });

        // bind to the error event so it doesnt get thrown
        req.on('error', function(e) {
            callback(e);
        });

        // add payload
        req.write(stringPayload);

        //end request
        req.end();
    } else {
        callback('Given parameters were missing or invalid');
    }


}

// get the string content of a template
helpers.getTemplate = function(templateName, callback) {
    templateName = typeof templateName == 'string' && templateName.length > 0 ? templateName : false;
    if (templateName) {
        var templatesDir = path.join(__dirname, './../templates/');
        fs.readFile(templatesDir + templateName + '.html', 'utf8', function(err, str) {
            if (!err && str && str.length > 0) {
                callback(false, str);
            } else {
                callback('No template could be found');
            }
        })

    } else {
        callback('A valid template name was not specified');
    }
}


// export the module
module.exports = helpers;