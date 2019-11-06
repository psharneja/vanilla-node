/**
 * 
 * This is a test runner
 * 
 * 
 * 
 */

//override the NODE_ENV
process.env.NODE_ENV = 'testing';

//application logic for testrunner
_app = {};

//container for the tests
_app.tests = {

//add on the unit tests
};

_app.tests.unit = require('./unit');
_app.tests.api = require('./api');



_app.countTests = function() {
    var counter = 0;
    for(var key in _app.tests) {
        if(_app.tests.hasOwnProperty(key)) {
            var subTests = _app.tests[key];
            for(var testName in subTests) {
                if(subTests.hasOwnProperty(testName)) {
                    counter++;
                }
            }
        }
    }
    return counter;

}

_app.produceTestReport = function(limit, successes, errors) {
    console.log("");
    console.log("-------------BEGIN TEST REPORT-------------")
    console.log("");
    console.log("Total Tests: ", limit);
    console.log("Passed: ", successes);
    console.log("Failed: ", errors.length);
    console.log("");
    //if there are error, print in detail
    if(errors.length > 0) {
    console.log("");
    console.log("-------------BEGIN ERROR REPORT-------------")
    console.log("");
    errors.forEach(function(testError) {
        console.log('\x1b[31m%s\x1b[0m', testError.name);
        console.log(testError.error);
    })
    console.log("");
    console.log("-------------ENDS ERROR REPORT-------------")
    console.log("");

    }

    console.log("");
    console.log("-------------ENDS TEST REPORT-------------")
    console.log("");
    process.exit(0);

}

//run all tests, collect errors ansd successes
_app.runTests = function () {
    var errors = [];
    var successes = 0;
    var limit = _app.countTests();
    var counter = 0;
    for (var key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            var subTests = _app.tests[key];
            for(var testName in subTests) {

            if (subTests.hasOwnProperty(testName)) {
                (function () {
                    var tempTestName = testName;
                    var testValue = subTests[testName];
                    //call the test
                    try {
                        testValue(function () {
                            //if it callbacks if passed
                            console.log('\x1b[32m%s\x1b[0m', tempTestName);
                            counter++;
                            successes++;
                            if (counter == limit) {
                                _app.produceTestReport(limit, successes, errors);
                            }
                        })
                    } catch (e) {
                        //if it htrows, it fails, so capture and log
                        errors.push({
                            'name': testName,
                            'error': e
                        })
                        
                        console.log('\x1b[31m%s\x1b[0m', tempTestName);
                        counter++;
                        if (counter == limit) {
                            _app.produceTestReport(limit, successes, errors);
                        }

                    }
                })();
            }
        }

        }
    }
}


//run tests
_app.runTests();