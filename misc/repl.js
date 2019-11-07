/**
 * Example repl server
 */

 var repl = require('repl');


 //start repl
 repl.start({
     'prompt': 'ps',
     'eval': function(str) {
         //evaluate
         console.log('at eval fstage'+str);

         //if user fizz i fuzz
         if(str.indexOf('fizz') > -1) {
             console.log('fuzz');

         }
     }
 });