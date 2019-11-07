/**
 * 
 * async hook example
 */


//dependencies
var async_hooks = require('async_hooks');
var fs = require('fs');


//target execution context
var targetExecutionContext = false;

//write an arbitarary async funciton
var whatTimeIsIt = function (callback) {
    setInterval(function () {
        fs.writeSync(1, 'When the setInterval run the execution conext is ' + async_hooks.executionAsyncId() + ' \n');
        callback(Date.now())
    }, 1000)
}


//call function
whatTimeIsIt(function (time) {
    fs.writeSync(1, 'The Time is ' + time + ' \n')
})


//hooks
var hooks = {
    init(asyncId, type, triggerAsyncId, resource) {
        fs.writeSync(1, 'Hooke Init '+asyncId+'\n');
        },
    before(asyncId) {
        fs.writeSync(1, 'Hooke before '+asyncId+'\n');
    },
    after(asyncId) {
        fs.writeSync(1, 'Hooke after '+asyncId+'\n');
    },
    destroy(asyncId) {
        fs.writeSync(1, 'Hooke destroy '+asyncId+'\n');
    },
    promiseResolve(asyncId) {
        fs.writeSync(1, 'Hooke promiseResolve '+asyncId+'\n');
    },
};

// create instance of asyn hooks
var asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();