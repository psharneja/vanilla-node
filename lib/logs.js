/**
 * Libraery for storing n rotating logs
 */

//dependencies
var fs = require("fs");
var path = require("path");
var zlib = require("zlib");

// container for the module
var lib = {};

lib.baseDir = path.join(__dirname, "/../.logs/");

//append a string to file, create file if doesnt exist.

lib.append = function(file, str, callback) {
    //open file for appending
    fs.open(lib.baseDir + file + ".log", "a", function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            fs.appendFile(fileDescriptor, str + "\n", function(err) {
                if (!err) {
                    fs.close(fileDescriptor, function(err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("error closing file that was being appended");
                        }
                    });
                } else {
                    callback("Error appending to file");
                }
            });
        } else {
            callback("could not open file for appending");
        }
    });
};

lib.list = function(includeCompressedLogs, callback) {
    fs.readdir(lib.baseDir, function(err, data) {
        if (!err && data && data.length > 0) {
            var trimmedFileNames = [];
            data.forEach(function(fileName) {
                //add the .log files
                if (fileName.indexOf(".log" > -1)) {
                    trimmedFileNames.push(fileName.replace(".log", ""));
                }

                //add on the .gzip compressed file base64 encoded
                if (fileName.indexOf(".gz.b64") > -1 && includeCompressedLogs) {
                    trimmedFileNames.push(file.replace(".gz.b64", ""));
                }
            });
            callback(false, trimmedFileNames);
        } else {}
    });
};

//compress .log to .gz.b64
lib.compress = function(logId, newFileId, callback) {
    var sourceFile = logId + ".log";
    var destFile = newFileId + ".gz.b64";

    // read the source file
    fs.readFile(lib.baseDir + sourceFile, "utf8", function(err, inputString) {
        if (!err && inputString) {
            //compress the data using gzip
            zlib.gzip(inputString, function(err, buffer) {
                if (!err && buffer) {
                    //send the data to the destination file
                    fs.open(lib.baseDir + destFile, "wx", function(err, fileDescriptor) {
                        if (!err && fileDescriptor) {
                            //write tot he destination file
                            fs.writeFile(fileDescriptor, buffer.toString("base64"), function(
                                err
                            ) {
                                if (!err) {
                                    //close the destination file
                                    fs.close(fileDescriptor, function(err) {
                                        if (!err) {
                                            callback(false);
                                        } else {
                                            callback(err);
                                        }
                                    });
                                } else {
                                    callback(err);
                                }
                            });
                        } else {
                            callback(err);
                        }
                    });
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        }
    });
};

//decompress content of .gx.b64 to string variable
lib.decompress = function(fileId, callback) {
    var fileName = fileId + ".gz.b64";
    fs.readFile(lib.baseDir + fileName, "utf8", function(err, str) {
        if (!err && str) {
            //decmpress to buffer
            var inputBuffer = Buffer.from(str, "base64");

            zlib.unzip(inputBuffer, function(err, outputBuffer) {
                if (!err && outputBuffer) {
                    var str = outputBuffer.toString();
                    callback(false, str);
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        }
    });
};


//truncate log file
lib.truncate = function(logId, callback) {
    fs.truncate(lib.baseDir + logId + '.log', 0, function(err) {
        if (!err) {
            callback(false);
        } else {
            callback(err)
        }
    })
}


//exporting
module.exports = lib;