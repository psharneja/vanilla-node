/**
 * Helpers for all the various tasks
 */

//dependencies
var crypto = require("crypto");
var config = require("./config");
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


// export the module
module.exports = helpers;