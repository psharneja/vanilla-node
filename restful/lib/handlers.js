/**
 *  Request Handlers
 */

// dependencies
var _data = require("./data");
var helpers = require("./helpers");
var config = require("./config");
//define the handlers
var handlers = {};

/**
 *
 * HTML HANDLERS SECTION
 */
handlers.index = function(data, callback) {
    //reject request that isn't GET
    if (data.method == "get") {
        //prepare data for interpolation
        var templateData = {
            "head.title": "This is the Uptime Monitoring, made simple!",
            "head.description": "We offer free simple uptime monitoring for http/ http ssites of all kinds, will let u knoe when ur site goes down",
            "body.class": "index"
        };

        //read in a template as a string
        helpers.getTemplate("index", templateData, function(err, str) {
            if (!err && str) {
                //add the universal header n footer
                helpers.addUniversalTemplates(str, templateData, function(err, str) {
                    if (!err && str) {
                        //return as html
                        callback(200, str, "html");
                    } else {
                        callback(500, undefined, "html");
                    }
                });
            } else {
                callback(500, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
};

handlers.accountCreate = function(data, callback) {
    //reject request that isn't GET
    if (data.method == "get") {
        //prepare data for interpolation
        var templateData = {
            "head.title": "Create an account",
            "head.description": "signup is easy and only takes a few seconds",
            "body.class": "accountCreate"
        };

        //read in a template as a string
        helpers.getTemplate("accountCreate", templateData, function(err, str) {
            if (!err && str) {
                //add the universal header n footer
                helpers.addUniversalTemplates(str, templateData, function(err, str) {
                    if (!err && str) {
                        //return as html
                        callback(200, str, "html");
                    } else {
                        callback(500, undefined, "html");
                    }
                });
            } else {
                callback(500, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
}

handlers.sessionCreate = function(data, callback) {
    //reject request that isn't GET
    if (data.method == "get") {
        //prepare data for interpolation
        var templateData = {
            "head.title": "Login to your acccount",
            "head.description": "please login ur phone no n password to login",
            "body.class": "sessionCreate"
        };

        //read in a template as a string
        helpers.getTemplate("sessionCreate", templateData, function(err, str) {
            if (!err && str) {
                //add the universal header n footer
                helpers.addUniversalTemplates(str, templateData, function(err, str) {
                    if (!err && str) {
                        //return as html
                        callback(200, str, "html");
                    } else {
                        callback(500, undefined, "html");
                    }
                });
            } else {
                callback(500, undefined, "html");
            }
        });
    } else {
        callback(405, undefined, "html");
    }
}

handlers.sessionDeleted = function(data, callback) {
        //reject request that isn't GET
        if (data.method == "get") {
            //prepare data for interpolation
            var templateData = {
                "head.title": "Logged Out",
                "head.description": "youve been logged out of your account",
                "body.class": "sessionDeleted"
            };

            //read in a template as a string
            helpers.getTemplate("sessionDeleted", templateData, function(err, str) {
                if (!err && str) {
                    //add the universal header n footer
                    helpers.addUniversalTemplates(str, templateData, function(err, str) {
                        if (!err && str) {
                            //return as html
                            callback(200, str, "html");
                        } else {
                            callback(500, undefined, "html");
                        }
                    });
                } else {
                    callback(500, undefined, "html");
                }
            });
        } else {
            callback(405, undefined, "html");
        }
    }
//edit account
    handlers.accountEdit = function(data, callback) {
        //reject request that isn't GET
        if (data.method == "get") {
            //prepare data for interpolation
            var templateData = {
                "head.title": "Account Settings",
                "body.class": "accountEdit"
            };

            //read in a template as a string
            helpers.getTemplate("accountEdit", templateData, function(err, str) {
                if (!err && str) {
                    //add the universal header n footer
                    helpers.addUniversalTemplates(str, templateData, function(err, str) {
                        if (!err && str) {
                            //return as html
                            callback(200, str, "html");
                        } else {
                            callback(500, undefined, "html");
                        }
                    });
                } else {
                    callback(500, undefined, "html");
                }
            });
        } else {
            callback(405, undefined, "html");
        }
    }

    //deleted account redirect to this page
    handlers.accountDeleted = function(data, callback) {
        //reject request that isn't GET
        if (data.method == "get") {
            //prepare data for interpolation
            var templateData = {
                "head.title": "Account Deleted",
                "jhead.description": "Your account has been deleted",
                "body.class": "accountDeleted"
            };

            //read in a template as a string
            helpers.getTemplate("accountDeleted", templateData, function(err, str) {
                if (!err && str) {
                    //add the universal header n footer
                    helpers.addUniversalTemplates(str, templateData, function(err, str) {
                        if (!err && str) {
                            //return as html
                            callback(200, str, "html");
                        } else {
                            callback(500, undefined, "html");
                        }
                    });
                } else {
                    callback(500, undefined, "html");
                }
            });
        } else {
            callback(405, undefined, "html");
        }
    }
    //favicon hjandler
handlers.favicon = function(data, callback) {
    if (data.method == "get") {
        //read in the favicons data
        helpers.getStaticAsset("favicon.ico", function(err, data) {
            if (!err && data) {
                //callnback the data
                callback(200, data, "favicon");
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
};


//public assets
handlers.public = function(data, callback) {
    if (data.method == 'get') {
        var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
        if (trimmedAssetName.length > 0) {
            helpers.getStaticAsset(trimmedAssetName, function(err, data) {
                if (!err && data) {
                    //determine the content type and default to plain text
                    var contentType = 'plain';
                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }
                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }
                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }
                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }

                    // Callback the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                }
            })
        }

    }
}

/**
 *
 * Everything below is JSON API HANDLER
 */
// users
handlers.users = function(data, callback) {
    var acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// container for the users submethod
handlers._users = {};

// Users - post
// required data: firstName, lastName,phone,password, tosAgreement
// optional data:none
handlers._users.post = function(data, callback) {
    // check that all required fields are filler out
    var firstName =
        typeof data.payload.firstName == "string" &&
        data.payload.firstName.trim().length > 0 ?
        data.payload.firstName.trim() :
        false;
    var lastName =
        typeof data.payload.lastName == "string" &&
        data.payload.lastName.trim().length > 0 ?
        data.payload.lastName.trim() :
        false;
    var phone =
        typeof data.payload.phone == "string" &&
        data.payload.phone.trim().length == 10 ?
        data.payload.phone.trim() :
        false;
    var password =
        typeof data.payload.password == "string" &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() :
        false;
    var tosAgreement =
        typeof data.payload.tosAgreement == "boolean" &&
        data.payload.tosAgreement == true ?
        true :
        false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that user doesnt exist
        _data.read("users", phone, function(err, data) {
            if (err) {
                // hash the password
                var hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    // create user Object
                    var userObject = {
                        firstName: firstName,
                        lastName: lastName,
                        phone: phone,
                        hashedPassword: hashedPassword,
                        tosAgreement: true
                    };
                    // store the user
                    _data.create("users", phone, userObject, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { err: "could not creata user" });
                        }
                    });
                } else {
                    callback(500, { err: "could not hash user password" });
                }
            } else {
                //user already exists
                callback(400, { Err: "User phone nmbr exist" });
            }
        });
    } else {
        callback(400, { Error: "M?issing required fields" });
    }
};

// Users - get
// required data: phone
// optional data: none
handlers._users.get = function(data, callback) {
    // check that the provided phoneno is valid
    var phone =
        typeof data.queryStringObject.phone == "string" &&
        data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone.trim() :
        false;
    if (phone) {
        // get token  from the header
        var token =
            typeof data.headers.token == "string" ? data.headers.token : false;
        // verify given token is valid for phone#
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (tokenIsValid) {
                // lookup the user
                _data.read("users", phone, function(err, data) {
                    if (!err && data) {
                        //  Remove the hashed password from the user object b4 return the response
                        delete data.password;
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, {
                    Error: "Missing required token in header, or token is invalid"
                });
            }
        });
    } else {
        callback(400, { Err: "missing required field" });
    }
};

// Users - put
//required data: phone
// optional data: firstName, lastName(at least one must be there)
handlers._users.put = function(data, callback) {
    console.log('called')
    // check for required field
    var phone =
        typeof data.payload.phone == "string" &&
        data.payload.phone.trim().length == 10 ?
        data.payload.phone.trim() :
        false;

    //check for optional fields
    var firstName =
        typeof data.payload.firstName == "string" &&
        data.payload.firstName.trim().length > 0 ?
        data.payload.firstName.trim() :
        false;
    var lastName =
        typeof data.payload.lastName == "string" &&
        data.payload.lastName.trim().length > 0 ?
        data.payload.lastName.trim() :
        false;
    var password =
        typeof data.payload.password == "string" &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() :
        false;

    // error if phone is invalid
    if (phone) {
        // error if nothing sent
        if (firstName || lastName || password) {
            var token =
                typeof data.headers.token == "string" ? data.headers.token : false;
            // verify given token is valid for phone#
            handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
                if (tokenIsValid) {
                    // lookup user
                    _data.read("users", phone, function(err, userData) {
                        if (!err && userData) {
                            // update the necessary fields
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            _data.update("users", phone, userData, function(err) {
                                if (!err) {
                                    console.log('b4success')
                                    callback(200);
                                } else {
                                    callback(500, { Err: "Could not update the user" });
                                }
                            });
                        } else {
                            callback(400, { Err: "specified user doesnt exist" });
                        }
                    });
                } else {
                    callback(403, {
                        Error: "Missing required token in header, or token is invalid"
                    });
                }
            });
        }
    } else {
        callback(400, { err: "missing required field" });
    }
};

// Users - delete
// required field: phone
handlers._users.delete = function(data, callback) {
    //check that phone is valid
    var phone =
        typeof data.queryStringObject.phone == "string" &&
        data.queryStringObject.phone.trim().length == 10 ?
        data.queryStringObject.phone.trim() :
        false;
    if (phone) {
        var token =
            typeof data.headers.token == "string" ? data.headers.token : false;
        // verify given token is valid for phone#
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (tokenIsValid) {
                // lookup the user
                _data.read("users", phone, function(err, userData) {
                    if (!err && userData) {
                        _data.delete("users", phone, function(err) {
                            if (!err) {
                                //delete checks associated with user
                                var userChecks =
                                    typeof userData.checks == "object" &&
                                    userData.checks instanceof Array ?
                                    userData.checks : [];
                                var checksToDelete = userChecks.length;
                                if (checksToDelete > 0) {
                                    var checksDeleted = 0;
                                    var deletionErrors = false;
                                    //loop through checks
                                    userChecks.forEach(function(checkId) {
                                        //delete one check
                                        _data.delete("checks", checkId, function(err) {
                                            if (err) {
                                                deletionErrors = true;
                                            } else {
                                                checksDeleted++;
                                                if (checksDeleted == checksToDelete) {
                                                    if (!deletionErrors) {
                                                        callback(200);
                                                    } else {
                                                        callback(500, {
                                                            Err: "errors encountered while attempting to delete users checks"
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    callback(200);
                                }
                            } else {
                                callback(500, { Err: "could not delete specified user" });
                            }
                        });
                    } else {
                        callback(404, { Err: "could not find the specified user" });
                    }
                });
            } else {
                callback(403, {
                    Error: "Missing required token in header, or token is invalid"
                });
            }
        });
    } else {
        callback(400, { Err: "missing required field" });
    }
};

// tokens handler
handlers.tokens = function(data, callback) {
    var acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// container for tokens methods

handlers._tokens = {};

// Tokens - Post
// Required data: phone, password
// optional: none
handlers._tokens.post = function(data, callback) {
    var phone =
        typeof data.payload.phone == "string" &&
        data.payload.phone.trim().length == 10 ?
        data.payload.phone.trim() :
        false;
    var password =
        typeof data.payload.password == "string" &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() :
        false;

        console.log('phone password checked')
    if (phone && password) {
        // lookup the user who matches that phone number
        _data.read("users", phone, function(err, userData) {
            if (!err && userData) {
                // Hash the sent password, and compare to the password stored
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.hashedPassword) {
                    // if valid, creata a new token with a random name, set expiration date 1 hour future
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var tokenObject = {
                        phone: phone,
                        id: tokenId,
                        expires: expires
                    };

                    // store the token
                    _data.create("tokens", tokenId, tokenObject, function(err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { Error: "Could not create the new tokenn" });
                        }
                    });
                } else {
                    callback(400, { Error: "Password did not match the specified user" });
                }
            }else {
                callback(400,{'Error' : 'Could not find the specified user.'});
              }
        });
    } else {
        callback(400, { Error: "Missing required field(s)" });
    }
};
// Tokens - get
// required data: id
// optional data: none
handlers._tokens.get = function(data, callback) {
    //check that the sent id is valid
    var id =
        typeof data.queryStringObject.id == "string" &&
        data.queryStringObject.id.trim().length == 20 ?
        data.queryStringObject.id.trim() :
        false;
    if (id) {
        // lookup the user
        _data.read("tokens", id, function(err, tokenData) {
            if (!err && tokenData) {
                //  Remove the hashed password from the user object b4 return the response
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Err: "missing required field" });
    }
};

// Tokens - put
// required: id, extend
//optional data: none
handlers._tokens.put = function(data, callback) {
    var id =
        typeof data.payload.id == "string" && data.payload.id.trim().length == 20 ?
        data.payload.id.trim() :
        false;
    var extend =
        typeof data.payload.extend == "boolean" && data.payload.extend == true ?
        true :
        false;
    if (id && extend) {
        _data.read("tokens", id, function(err, tokenData) {
            if (!err && tokenData) {
                //check to make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    //store the new updates
                    _data.update("tokens", id, tokenData, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                Error: "could not update the token's expiration"
                            });
                        }
                    });
                } else {
                    callback(400, {
                        Error: "the token has already expired and cannnot be extended"
                    });
                }
            } else {
                callback(400, { Error: "specified token doesnot exist" });
            }
        });
    } else {
        callback(400, {
            Error: "Missing required field(s) or field(s) are invalid"
        });
    }
};

// Tokens - delete
//requires: id
// optional: none
handlers._tokens.delete = function(data, callback) {
    //check that id is valid
    var id =
        typeof data.queryStringObject.id == "string" &&
        data.queryStringObject.id.trim().length == 20 ?
        data.queryStringObject.id.trim() :
        false;
    if (id) {
        // lookup the user
        _data.read("tokens", id, function(err, data) {
            if (!err && data) {
                _data.delete("tokens", id, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { Err: "could not delete specified token" });
                    }
                });
            } else {
                callback(404, { Err: "could not find the specified token" });
            }
        });
    } else {
        callback(400, { Err: "missing required field" });
    }
};

// verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback) {
    //lookup the token
    _data.read("tokens", id, function(err, tokenData) {
        if (!err && tokenData) {
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

//checks handler
handlers.checks = function(data, callback) {
    var acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

// container for all checks methods
handlers._checks = {};

// checks - post
// required data: protocol, url, method, successCodes, timeoutSeconds
// optional data: none
handlers._checks.post = function(data, callback) {
    // validate all inputs
    var protocol =
        typeof data.payload.protocol == "string" && ["https", "http"].indexOf(data.payload.protocol) > -1 ?
        data.payload.protocol :
        false;
    var url =
        typeof data.payload.url == "string" && data.payload.url.trim().length > 0 ?
        data.payload.url.trim() :
        false;
    var method =
        typeof data.payload.method == "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ?
        data.payload.method :
        false;
    var successCodes =
        typeof data.payload.successCodes == "object" &&
        data.payload.successCodes instanceof Array &&
        data.payload.successCodes.length > 0 ?
        data.payload.successCodes :
        false;
    var timeoutSeconds =
        typeof data.payload.timeoutSeconds == "number" &&
        data.payload.timeoutSeconds % 1 === 0 &&
        data.payload.timeoutSeconds >= 1 &&
        data.payload.timeoutSeconds <= 5 ?
        data.payload.timeoutSeconds :
        false;

    if (protocol && url && successCodes && timeoutSeconds) {
        // get the token from the headers
        var token =
            typeof data.headers.token == "string" ? data.headers.token : false;

        // lookup the user by reading the token
        _data.read("tokens", token, function(err, tokenData) {
            if (!err && tokenData) {
                var userPhone = tokenData.phone;

                //lookup the user data
                _data.read("users", userPhone, function(err, userData) {
                    if (!err && userData) {
                        var userChecks =
                            typeof userData.checks == "object" &&
                            userData.checks instanceof Array ?
                            userData.checks : [];
                        // verify the user has less than the number of max checks per user
                        if (userChecks.length < config.maxChecks) {
                            var checkId = helpers.createRandomString(20);

                            //create the check object and include the users phone
                            var checkObject = {
                                id: checkId,
                                userPhone: userPhone,
                                url: url,
                                method: method,
                                protocol: protocol,
                                successCodes: successCodes,
                                timeoutSeconds: timeoutSeconds
                            };

                            // save object
                            _data.create("checks", checkId, checkObject, function(err) {
                                if (!err) {
                                    // add the check id to the user's object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);

                                    // save the new user data
                                    _data.update("users", userPhone, userData, function(err) {
                                        if (!err) {
                                            //return the data about new check
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, { Err: "could not update with new check" });
                                        }
                                    });
                                } else {
                                    callback(500, { Error: "could not create the new check" });
                                }
                            });
                        } else {
                            callback(400, {
                                Error: "USer already has maximum number of checks(" +
                                    config.maxChecks +
                                    ")"
                            });
                        }
                    }
                });
            } else {
                callback(403);
            }
        });
    } else {
        callback(400, { Error: "Missing required inpuits, inputs are invalid" });
    }
};

// get for checks
// required: id
// optional: none
handlers._checks.get = function(data, callback) {
    // check that the provided phoneno is valid
    var id =
        typeof data.queryStringObject.id == "string" &&
        data.queryStringObject.id.trim().length == 20 ?
        data.queryStringObject.id.trim() :
        false;
    if (id) {
        // llookup the checks
        _data.read("checks", id, function(err, checkData) {
            if (!err && checkData) {
                // get token  from the header
                var token =
                    typeof data.headers.token == "string" ? data.headers.token : false;
                // verify given token is valid for phone#
                handlers._tokens.verifyToken(token, checkData.userPhone, function(
                    tokenIsValid
                ) {
                    if (tokenIsValid) {
                        // return the check data
                        callback(200, checkData);
                    } else {
                        callback(403, {
                            Error: "Missing required token in header, or token is invalid"
                        });
                    }
                });
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Err: "missing required field" });
    }
};

// checks - put
// required data: id
// optional data: protocol, url, method, successCodes, timeoutSeconds (at least 1 must be there)
handlers._checks.put = function(data, callback) {
    // check for required field
    var id =
        typeof data.payload.id == "string" && data.payload.id.trim().length == 20 ?
        data.payload.id.trim() :
        false;

    //check for optional fields
    var protocol =
        typeof data.payload.protocol == "string" && ["https", "http"].indexOf(data.payload.protocol) > -1 ?
        data.payload.protocol :
        false;
    var url =
        typeof data.payload.url == "string" && data.payload.url.trim().length > 0 ?
        data.payload.url.trim() :
        false;
    var method =
        typeof data.payload.method == "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ?
        data.payload.method :
        false;
    var successCodes =
        typeof data.payload.successCodes == "object" &&
        data.payload.successCodes instanceof Array &&
        data.payload.successCodes.length > 0 ?
        data.payload.successCodes :
        false;
    var timeoutSeconds =
        typeof data.payload.timeoutSeconds == "number" &&
        data.payload.timeoutSeconds % 1 === 0 &&
        data.payload.timeoutSeconds >= 1 &&
        data.payload.timeoutSeconds <= 5 ?
        data.payload.timeoutSeconds :
        false;

    // error if phone is invalid
    if (id) {
        // error if nothing sent
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // lookup checks
            _data.read("checks", id, function(err, checkData) {
                if (!err && checkData) {
                    // get token  from the header
                    var token =
                        typeof data.headers.token == "string" ? data.headers.token : false;
                    // verify given token is valid for phone#
                    handlers._tokens.verifyToken(token, checkData.userPhone, function(
                        tokenIsValid
                    ) {
                        if (tokenIsValid) {
                            // update the check data
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }

                            if (method) {
                                checkData.method = method;
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            }

                            //update
                            _data.update("checks", id, checkData, function(err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, { Err: "could not update the checks" });
                                }
                            });
                        } else {
                            callback(403, {
                                Error: "Missing required token in header, or token is invalid"
                            });
                        }
                    });
                } else {
                    callback(400, { Err: " checkid doesnt exist" });
                }
            });
        } else {
            callback(400, { err: "missing fields to update" });
        }
    } else {
        callback(400, { err: "missing required field" });
    }
};

// id
//optional : none
handlers._checks.delete = function(data, callback) {
    //check that phone is valid
    var id =
        typeof data.queryStringObject.id == "string" &&
        data.queryStringObject.id.trim().length == 20 ?
        data.queryStringObject.id.trim() :
        false;
    if (id) {
        _data.read("checks", id, function(err, checkData) {
            if (!err && checkData) {
                var token =
                    typeof data.headers.token == "string" ? data.headers.token : false;
                // verify given token is valid for phone#
                handlers._tokens.verifyToken(token, checkData.userPhone, function(
                    tokenIsValid
                ) {
                    if (tokenIsValid) {
                        // delete  the check
                        _data.delete("checks", id, function(err) {
                            if (!err) {
                                _data.read("users", checkData.userPhone, function(
                                    err,
                                    userData
                                ) {
                                    if (!err && userData) {
                                        var userChecks =
                                            typeof userData.checks == "object" &&
                                            userData.checks instanceof Array ?
                                            userData.checks : [];

                                        // remove the check from list of checks
                                        var checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);

                                            // resave the user data
                                            _data.update(
                                                "users",
                                                checkData.userPhone,
                                                userData,
                                                function(err) {
                                                    if (!err) {
                                                        callback(200);
                                                    } else {
                                                        callback(500, { Err: "could not update the user" });
                                                    }
                                                }
                                            );
                                        } else {
                                            callback(500, {
                                                Error: "could not find the check on the users object so could not remove it"
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            Err: "could not find the user who created the check, so could not remove check from user"
                                        });
                                    }
                                });
                            } else {
                                callback(404, { Err: "could not delete the specified check" });
                            }
                        });
                    } else {
                        callback(403, {
                            Error: "Missing required token in header, or token is invalid"
                        });
                    }
                });
            } else {
                callback(400, { Error: "the specified checkid doesnt exits" });
            }
        });
    } else {
        callback(400, { Err: "missing required field" });
    }
};
// ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

// not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// export the module
module.exports = handlers;