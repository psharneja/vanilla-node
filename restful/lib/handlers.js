/**
 *  Request Handlers
 */

// dependencies
var _data = require('./data');
var helpers = require('./helpers');
//define the handlers
var handlers = {};

// users
handlers.users = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}

// container for the users submethod
handlers._users = {};

// Users - post
// required data: firstName, lastName,phone,password, tosAgreement
// optional data:none    
handlers._users.post = function(data, callback) {
    // check that all required fields are filler out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that user doesnt exist
        _data.read('users', phone, function(err, data) {
            if (err) {
                // hash the password
                var hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    // create user Object
                    var userObject = {
                            'firstName': firstName,
                            'lastName': lastName,
                            'phone': phone,
                            'hashedPassword': hashedPassword,
                            tosAgreement: true
                        }
                        // store the user
                    _data.create('users', phone, userObject, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'err': 'could not creata user' });
                        }
                    });
                } else {
                    callback(500, { 'err': 'could not hash user password' });
                }



            } else {
                //user already exists
                callback(400, { 'Err': 'User phone nmbr exist' });

            }

        })
    } else {
        callback(400, { 'Error': 'M?issing required fields' });
    }

}

// Users - get
// required data: phone
// optional data: none
// @TODO only let an authenticated user access their object, don't let access others' data
handlers._users.get = function(data, callback) {
    // check that the provided phoneno is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // lookup the user
        _data.read('users', phone, function(err, data) {
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
        callback(400, { 'Err': 'missing required field' });
    }
}

// Users - put
//required data: phone
// optional data: firstName, lastName(at least one must be there)
// @TODO only let an authenticated user update their own object
handlers._users.put = function(data, callback) {
    // check for required field
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    //check for optional fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // error if phone is invalid
    if (phone) {
        // error if nothing sent
        if (firstName || lastName || password) {
            // lookup user
            _data.read('users', phone, function(err, userData) {
                if (!err && userData) {
                    // update the necessary fields
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = helpers.hash(password);
                    }
                    _data.update('users', phone, userData, function(err) {
                        if (!err) {
                            callback(200)
                        } else {
                            callback(500, { 'Err': 'Could not update the user' });
                        }
                    })
                } else { callback(400, { 'Err': 'specified user doesnt exist' }) };
            })
        }

    } else {
        callback(400, { 'err': 'missing required field' })
    }
}

// Users - delete
// required field: phone
// @TODO only let an authenticated user delete their object; not others
// @TODO cleanup any other data file associated with this user
handlers._users.delete = function(data, callback) {
    //check that phone is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // lookup the user
        _data.read('users', phone, function(err, data) {
            if (!err && data) {
                _data.delete('users', phone, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Err': 'could not delete specified user' });
                    }
                })

            } else {
                callback(404, { 'Err': 'could not find the specified user' });
            }

        });
    } else {
        callback(400, { 'Err': 'missing required field' });
    }
}

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