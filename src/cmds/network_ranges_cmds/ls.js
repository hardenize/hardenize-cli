var cmd = require('../../cmd');

exports.command = 'ls';

exports.desc = 'List network ranges';

exports.handler = function ls_network_ranges_handler(argv) {

    cmd.api(argv).getNetworkRanges()
        .then(function(response){
            cmd.displayResults(argv, response.data.networkRanges);
        })
        .catch(cmd.catchError);
};