var cmd = require('../../../cmd');

exports.command = 'get';

exports.desc = 'Get Network Scanning Config';

exports.handler = function get_network_scanning_handler(argv) {
    cmd.api(argv).getNetworkScanningConfig()
        .then(function(response){
            cmd.displayResults(argv, response.data);
        })
        .catch(cmd.catchError);
};