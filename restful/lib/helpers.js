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

// export the module
module.exports = helpers;