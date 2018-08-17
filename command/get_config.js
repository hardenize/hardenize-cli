module.exports = function get_config() {
    console.log(JSON.stringify(this.read_config(), null, 2));
};