var HardenizeApi = require('@hardenize/api');
var config       = require('./config');
var YAML         = require('yaml').default;

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

    return new HardenizeApi(apiConfig);
};

module.exports.displayResults = function(argv, data) {

    var format = argv.format;
    if (!format) {
        var conf = config.read(argv);
        format = conf.default_format || 'yaml';
    }
    if (format !== 'json' && format !== 'yaml') {
        console.error('Error: Invalid --format');
        process.exit(1);
    }

    if (format === 'json') {
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log(YAML.stringify(data).replace(/[\r\n]+$/, ''));
    }
};

module.exports.catchError = function(err){

    if (err.data) {
        if (err.data.errors) {
            err.data.errors.forEach(function(error){
                var message = error.message;
                if (error.param) message = '"' + error.param + '" param: ' + message;
                console.error('Error: ' + message);
            });
        } else {
            console.error('Error: ' + JSON.stringify(err.data, null, 2));
        }
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