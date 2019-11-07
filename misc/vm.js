/**
 * 
 * Example vm
 * runing arbitarary command
 */



 //dependencies
 var vm = require('vm');

 //define the context for script to run in
 var context = {
     'foo': 25
 };


 //define script
 var script = new vm.Script(`
 foo = foo * 2;
 var bar = foo + 1;
 var fizz = 52
 `);


 //run scirpt
 script.runInNewContext(context);
 console.log(context);