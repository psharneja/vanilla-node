/**
 * Library for storing and editing data
 *
 */


// Dependencies
var fs = require('fs');
var path = require('path');


//container for thie module (to be exported)
var lib = {};

// define the base directory of data folder
lib.baseDir = path.join(__dirname, '/../.data/')

// write data to a file
lib.create = function(dir, file, data, callback) {
    // open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // convert data to string
            var stringData = JSON.stringify(data);

            //write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err) {
                if (!err) {
                    fs.close(fileDescriptor, function(err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            console.log(err, fileDescriptor)
            callback('Could not create new file, it may already exist')
        }

    });
};


// Read data from the file
lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data) {
        callback(err, data);
    })
}


//update existing file
lib.update = function(dir, file, data, callback) {
    // open the file for updating
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);

            fs.truncate(fileDescriptor, function(err) {
                if (!err) {
                    // write to the file & close it
                    fs.writeFile(fileDescriptor, stringData, function(err) {
                        if (!err) {
                            fs.close(fileDescriptor, function(err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('err err closing error');
                                }
                            });

                        } else { callback('Error writing to sxisting file') }
                    })
                } else {
                    callback('Error truncating file');
                }
            })
        } else {
            callback('could not open the file for updating, it may not exist');
        }
    })

}


// delete a file
lib.delete = function(dir, file, callback) {
    // unlink a file
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err) {
        if (!err) {
            callback(false);
        } else {
            callback(err);
        }
    })
}



//export the module
module.exports = lib;