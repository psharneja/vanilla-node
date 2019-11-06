/**
 * Unit testing file
 */
//dependencies
var helpers = require('./../lib/helpers');
var assert = require('assert');
var logs = require('./../lib/logs');
var exampleDebuggineProblem = require('./../lib/exampleDebuggingProblem');

//holder for these tests
var unit = {};

//assert that the getnumber returns a number
unit['helpers.getNumber should return number'] = function (done) {
    var val = helpers.getNumber();
    assert.equal(typeof (val), 'number');
    done();
}

//assert that the getnumber returns a 1
unit['helpers.getNumber should return 1'] = function (done) {
    var val = helpers.getNumber();
    assert.equal(val, 1);
    done();
}

//assert that the getnumber returns a 2
unit['helpers.getNumber should return 2'] = function (done) {
    var val = helpers.getNumber();
    assert.equal(val, 2);
    done();
}

// logs.list should callback an array and a false error
unit['logs list should callback a false error and an array of log names'] = function (done) {
    logs.list(true, function (err, logFileNames) {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    })
}
//logs truncate should not throw if logid doesnt exist
unit['logs.truncate should not throw if the logid doesnt exist, should callback an errror instead'] = function (done) {
    assert.doesNotThrow(function () {
        logs.truncate('I do not exist', function (err) {
            assert.ok(err);
            done();
        })
    }, TypeError)
}

//example debugging problem init should not throw but throws
unit['example debugging problem init  should not throw  but does'] = function (done) {
    assert.doesNotThrow(function () {
        exampleDebuggineProblem.init();
            done();
    }, TypeError)
}



//export tests to runner
module.exports = unit;