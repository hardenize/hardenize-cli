var fs     = require('fs');
var api    = require('../api');
var config = require('../config');

module.exports.command = 'call <endpoint>';

module.exports.builder = function(yargs) {
    yargs.option('method', {
        description: 'Status for hosts found in zone file',
        choices:     ['delete', 'get', 'patch', 'post', 'put'],
        default:     'get',
    });
    yargs.option('qs', {
        description: 'HTTP request query string',
        type:        'array',
    });
    yargs.option('body', {
        description: 'HTTP request body',
        type:        'string',
    });
    yargs.option('content-type', {
        alias:       'ct',
        description: 'HTTP request content type',
        default:     'application/json',
    })
};

module.exports.handler = function call_handler(argv) {

    var fetchOptions = {};
    var qsOptions    = {};

    fetchOptions.method  = argv.method;
    fetchOptions.headers = { 'Content-Type': argv.contentType };

    if (argv.qs) {
        argv.qs.forEach(function(param){
            var m = param.match(/^(.+?)=(.+)/);
            if (m) {
                qsOptions[m[1]] = m[2];
            } else {
                qsOptions[param] = true;
            }
        });
    }

    if (argv.hasOwnProperty('body')) {
        if (argv.body === '') {
            read_stdin(function(data){
                fetchOptions.body = data;
                call_api(argv, fetchOptions, qsOptions);        
            });
        } else {
            fs.readFile(argv.body, function(err, data){
                if (err) fail(err);
                fetchOptions.body = data.toString();
                call_api(argv, fetchOptions, qsOptions);        
            });
        }
    } else {
        call_api(argv, fetchOptions, qsOptions);
    }
};

function call_api(argv, fetchOptions, qsOptions) {
    api.init(argv)
        .apiCall(argv.endpoint, fetchOptions, qsOptions)
        .then(function(response){
            var ct = response.res.headers.get('Content-Type') || '';
            if (ct.match(/^application\/json(\s*;.*?)?$/i)) {
                console.log(JSON.stringify(response.data, null, 2));
            } else if (response.data) {
                console.log(response.data);
            } else {
                console.warn(response.res.status + ' ' + response.res.statusText);
            }
        })
        .catch(api.catchError);
}

function read_stdin(callback) {

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var buffer = '';
    process.stdin.on('data', function(chunk) {
        buffer += chunk;
    });

    process.stdin.on('end', function() {
        callback(buffer);
    });
}

function fail(err) {
    if (err instanceof Error) err = err.message;
    console.error(err);
    process.exit(1);
}