module.exports = function get_config(name) {
    var config = this.read_config();
    if (typeof name === 'undefined') {
        console.log(JSON.stringify(config, null, 2));
    } else if (config.hasOwnProperty(name)) {
        console.log(config[name]);
    } else {
        throw new Error('No such configuration item');
    }
};