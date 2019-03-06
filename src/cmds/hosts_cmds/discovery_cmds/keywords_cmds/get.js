var cmd = require('../../../../cmd');

exports.command = 'get <keyword>';

exports.desc = 'Gets a host discovery keyword';

exports.handler = function get_host_discovery_keyword_handler(argv) {
    cmd.api(argv).getHostDiscoveryKeyword(argv.keyword)
        .then(function(response){
            cmd.displayResults(argv, response.data.hostDiscoveryKeyword);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Keyword not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};
