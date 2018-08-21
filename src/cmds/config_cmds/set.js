var config = require('../../config');

var settable = [
    'base_url',
    'cloudflare_email',
    'cloudflare_key',
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
        console.error('Unknown configuration item: ' + name);
        process.exit(1);
    }
};

function isValidConfigName(name) {
    for (var i = 0; i < settable.length; ++i) {
        if (settable[i] === name) return true;
    }
    return false;
}