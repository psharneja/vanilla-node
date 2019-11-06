/**
 * 
 * This library demonstrates something which throws error on init
 * 
 */


 //container for the module
 var example  = {};



 example.init = function() {


//this is an error created intentionally
var foo = bar;

};


 //export
 module.exports = example;