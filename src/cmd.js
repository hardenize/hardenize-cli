var HardenizeApi = require('@hardenize/api');
var color        = require('cli-color');
var config       = require('./config');
var debug        = require('./debug');
var printCsv     = require('./output/csv');
var printJson    = require('./output/json');
var printTable   = require('./output/table');
var printYaml    = require('./output/yaml');

module.exports.api            = api;
module.exports.api_version    = HardenizeApi.version;
module.exports.catchError     = catchError;
module.exports.displayResults = displayResults;
module.exports.error          = error;
module.exports.fail           = fail;
module.exports.warn           = warn;

function api(argv) {
    var conf = config.read(argv);

    if (!conf.username || !conf.password) {
        fail('You must configure API credentials first. Run: hardenize config init');
    }

    var orgLabel = argv.org || conf.default_org;
    if (!orgLabel) {
        fail('Either set a default org in the config, or specify --org');
    }

    if (conf.disable_tls_validation) process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    var apiConfig = {
        user: conf.username,
        pass: conf.password,
        org:  orgLabel,
    };
    if (conf.base_url) apiConfig.url = conf.base_url;

    var api = new HardenizeApi(apiConfig);
    if (argv.debug) debug(api);
    return api;
}

function catchError(err) {
    if (typeof err === 'string') err = new Error(err);

    if (err.data && err.data.errors && err.data.errors.length) {
        err.data.errors.forEach(function(error){
            var message = error.message;
            if (error.param) message = '"' + error.param + '" param: ' + message;
            warn(message);
        });
        fail();
    } else {
        var message = err.message;
        if (err.res) {
            message = err.res.status + ' ' + err.res.statusText;
            if (err.res.statusText !== err.message && err.message.length) message += ': ' + err.message;
        }
        fail(message);
    }
}

function displayResults(argv, data) {

    if (argv.debug) console.warn(color.blue('**** DEBUG: Normal command output follows\n'));

    var format = argv.format;
    if (!format) {
        var conf = config.read(argv);
        format = conf.default_format || 'table';
    }
    if (format !== 'json' && format !== 'yaml' && format !== 'csv' && format !== 'table') {
        fail('Invalid --format');
    }

    switch (format) {
        case 'csv':   printCsv(data);  break;
        case 'json':  printJson(data); break;
        case 'table': printTable(data); break;
        case 'yaml':  printYaml(data); break;
    }
}

function warn() {
    var args = Array.from(arguments);
    if (args[0] instanceof Error) args[0] = args[0].message;
    args = args.map(function(arg){
        return typeof arg === 'string' || typeof arg === 'number' ? color.yellow(arg) : arg;
    });
    console.warn.apply(null, args);
}

function error() {
    var args = Array.from(arguments);
    if (args[0] instanceof Error) args[0] = args[0].message;
    args = args.map(function(arg){
        return typeof arg === 'string' || typeof arg === 'number' ? color.red(arg) : arg;
    });
    console.error.apply(null, args);
}

function fail() {
    if (arguments.length) error.apply(null, arguments);
    process.exit(1);
}