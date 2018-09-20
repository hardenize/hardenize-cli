var HardenizeApi = require('@hardenize/api');
var config       = require('./config');
var YAML         = require('yaml').default;
var json2csv     = require('json2csv').parse;

module.exports.init = function api(argv) {
    var conf = config.read(argv);

    if (!conf.username || !conf.password) {
        console.error('You must configure API credentials first. Run: hardenize config init');
        process.exit(1);
    }

    var orgLabel = argv.org || conf.default_org;
    if (!orgLabel) {
        console.error('Either set a default org in the config, or specify --org');
        process.exit(1);
    }

    if (conf.disable_tls_validation) process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    var apiConfig = {
        user: conf.username,
        pass: conf.password,
        org:  orgLabel,
    };
    if (conf.base_url) apiConfig.url = conf.base_url;

    var api = new HardenizeApi(apiConfig);

    if (argv.debug) {
        var start_time;
        api.on('request', function(req){
            start_time = Date.now();
            console.warn('**** DEBUG: Sending API Request (+0ms)\n');
            console.warn('  ' + req.method + ' ' + req.url);
            debugHeaders(req.headers);
            debugBody(req.body, true);
            console.warn('');
        });
        api.on('response', function(res){
            console.warn('**** DEBUG: Received API Response (+' + (Date.now() - start_time) + 'ms)\n');
            console.warn('  ' + res.status + ' ' + res.statusText + '\n');
            debugHeaders(res.headers);
            console.warn('');
        });
        api.on('body', function(body){
            console.warn('**** DEBUG: Received API Response Body (+' + (Date.now() - start_time) + 'ms)\n');
            debugBody(body, false);
            console.warn('');
        });
    }

    return api;
};

function debugHeaders(headers){
    console.warn('  Headers:');
    for (var name of headers.keys()) {
        var value = headers.get(name);
        name = name.split(/-/).map(function(part){
            return part[0].toUpperCase() + part.slice(1);
        }).join('-');
        console.warn('    ' + name + ': ' + value);
    }
}

function debugBody(body, mark) {
    if (typeof body !== 'string' || body.length === 0) return;
    if (mark) console.warn('  Body:');
    var spacer = mark ? '    ' : '  ';
    console.warn(body.split(/\r?\n/).map(function(line){
        return spacer + line;
    }).join('\n'));
}

module.exports.displayResults = function(argv, data) {

    if (argv.debug) console.warn('**** DEBUG: Normal command output follows\n');

    var format = argv.format;
    if (!format) {
        var conf = config.read(argv);
        format = conf.default_format || 'yaml';
    }
    if (format !== 'json' && format !== 'yaml' && format !== 'csv') {
        console.error('Error: Invalid --format');
        process.exit(1);
    }

    switch (format) {
        case 'csv':  printCsv(data);  break;
        case 'json': printJson(data); break;
        case 'yaml': printYaml(data); break;
    }
};

module.exports.catchError = function(err){
    if (typeof err === 'string') err = new Error(err);

    if (err.data && err.data.errors && err.data.errors.length) {
        err.data.errors.forEach(function(error){
            var message = error.message;
            if (error.param) message = '"' + error.param + '" param: ' + message;
            console.error('Error: ' + message);
        });
    } else {
        var message = err.message;
        if (err.res) {
            message = err.res.status + ' ' + err.res.statusText;
            if (err.res.statusText !== err.message && err.message.length) message += ': ' + err.message;
        }

        console.error('Error: ' + message);
    }
    process.exit(1);
};

module.exports.version = HardenizeApi.version;

function printCsv(data) {
    var csvData = [].concat(data).reduce(function(o, row){
        Object.keys(row).forEach(function(k){
            row[k] = flattenObjectForCsv(row[k]);
        });
        o.push(row);
        return o;
    }, []);
    console.log(json2csv(csvData));
}

function printJson(data) {
    console.log(JSON.stringify(data, null, 2));
}

function printYaml(data) {
    [].concat(data).forEach(function(item){
        console.log('---\n' + YAML.stringify(item).replace(/[\r\n]+$/, ''));
    });
}

function flattenObjectForCsv(obj) {
    if (Array.isArray(obj)) {
        return obj.map(flattenObjectForCsv).join(', ');
    } else if (typeof obj === 'object') {
        return JSON.stringify(obj);
    }
    return obj;
}