/**
 *
 * Create & export config variables
 */

// container for all the environments
var environment = {};

// staging (default) environment
environment.staging = {
    'httpPort': 3000,
    'envName': 'staging',
    'httpsPort': '3001',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken': '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone': '+15005550006'
    }

};



//production environment
environment.production = {
    'httpPort': 5000,
    'envName': 'production',
    'httpsPort': 5001,
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken': '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone': '+15005550006'
    }


};


// determine which env was passed as cli argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


// check that the current environment is the one of environment above, if not, default to staging
var environmentToExport = typeof(environment[currentEnvironment]) == 'object' ? environment[currentEnvironment] : environment['staging'];


module.exports = environmentToExport;