var config = require('../../config');

var settable = [
    'base_url',
    'cloudflare_email',
    'cloudflare_key',
    'default_format',
    'default_org',
    'disable_tls_validation',
    'password',
    'username',
];

module.exports.command = 'set <name> [value]';

module.exports.desc = 'Set a configuration item value. If value not supplied, is true';

module.exports.builder = {};

module.exports.handler = function set_config_handler(argv) {
    var name  = argv.name;
    var value = argv.hasOwnProperty('value') ? argv.value : true;

    if (name === 'default_format' && (value !== 'json' && value !== 'yaml')) fail('Invalid default_format. Must be either yaml or json');

    if (isValidConfigName(name)) {
        var conf = config.read(argv, { no_env: true });
        if (conf[name] === value) {
            console.log('No change');
        } else {
            var prev = conf[name];
            conf[name] = value;
            config.write(argv, conf);
            var message = 'Configuration saved';
            if (typeof prev !== 'undefined') message += ' (was previously ' + prev + ')';
            console.log(message);
        }
    } else {
        fail('Unknown configuration item: ' + name);
    }
};

function isValidConfigName(name) {
    for (var i = 0; i < settable.length; ++i) {
        if (settable[i] === name) return true;
    }
    return false;
}

function fail(err) {
    if (err instanceof Error) err = err.message;
    console.error(err);
    process.exit(1);
}