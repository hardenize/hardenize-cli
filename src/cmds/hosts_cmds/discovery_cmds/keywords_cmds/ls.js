var cmd = require('../../../../cmd');

exports.command = 'ls';

exports.desc = 'List host discovery keywords';

exports.handler = function ls_host_discovery_keywords_handler(argv) {

    cmd.api(argv).getHostDiscoveryKeywords()
        .then(function(response){
            cmd.displayResults(argv, response.data.hostDiscoveryKeywords);
        })
        .catch(cmd.catchError);

};