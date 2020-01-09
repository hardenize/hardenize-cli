var cmd = require('../../../cmd');

exports.command = 'get';

exports.desc = 'Get Management IP Whitelist Config';

exports.handler = function get_mgmt_ip_whitelist_handler(argv) {
    cmd.api(argv).getManagementIpWhitelist()
        .then(function(response){
            cmd.displayResults(argv, response.data);
        })
        .catch(cmd.catchError);
};