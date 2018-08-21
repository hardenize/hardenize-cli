module.exports = function del_config(name) {
    var config = this.read_config({ no_env: true });
    if (config.hasOwnProperty(name)) {
        delete config[name];
        this.write_config(config);
        console.log('Configuration saved');
    } else {
        console.log('No change');
    }
};