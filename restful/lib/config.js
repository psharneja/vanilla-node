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
    'hashingSecret': 'thisIsASecret'

};



//production environment
environment.production = {
    'httpPort': 5000,
    'envName': 'production',
    'httpsPort': 5001,
    'hashingSecret': 'thisIsASecret'

};


// determine which env was passed as cli argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


// check that the current environment is the one of environment above, if not, default to staging
var environmentToExport = typeof(environment[currentEnvironment]) == 'object' ? environment[currentEnvironment] : environment['staging'];


module.exports = environmentToExport;