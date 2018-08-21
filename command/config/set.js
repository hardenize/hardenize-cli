var settable = [
    'base_url',
    'default_org',
    'disable_tls_validation',
    'password',
    'username',
];

module.exports = function set_config(name, value) {
    if (isValidConfigName(name)) {
        var config = this.read_config({ no_env: true });
        if (config[name] === value) {
            console.log('No change');
        } else {
            config[name] = value;
            this.write_config(config);
            console.log('Configuration saved');
        }
    } else {
        throw new Error('Unknown configuration item: ' + name);
    }
};

function isValidConfigName(name) {
    for (var i = 0; i < settable.length; ++i) {
        if (settable[i] === name) return true;
    }
    return false;
}