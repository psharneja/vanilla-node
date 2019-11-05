//container for frontend app
var app = {};

//config
app.config = {
    'sessionToken': false
};

// AJAX client for the restful API
app.client = {};

// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback) {
    headers = typeof headers == 'object' && headers !== null ? headers : {};
    path = typeof path == 'string' ? path : '/';
    method = typeof method == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof queryStringObject == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof payload == 'object' && payload !== null ? payload : {};
    callback = typeof callback == 'function' ? callback : false;


    // for each query string parameter send, add it to the path
    var requestUrl = path + '?';
    var counter = 0;
    for (var queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++;
            //if at least one query string paramter has already been added, 
            //prepend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&';
            }
            // add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }
    }

    //form the http request as json type
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Content-Type", 'application/json');

    //for each header send, add it to request
    for (var headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }


    if (app.config.sessionToken) {
        xhr.setRequestHeader('token', app.config.sessionToken.id);
    }

    //when the request comesback, handle the response
    xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var statusCode = xhr.status;
                var responseReturend = xhr.responseText;

                //callback if requested
                if (callback) {
                    try {
                        var parsedResponse = JSON.parse(responseReturend);
                        callback(statusCode, parsedResponse);

                    } catch (e) {
                        callback(statusCode, false);
                    }
                }
            }
        }
        //send tyhe payload as json
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
}