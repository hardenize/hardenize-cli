var cmd = require('../../../cmd');

exports.command = 'get <id>';

exports.desc = 'Get a host discovery';

exports.handler = function get_host_discovery_handler(argv) {
    cmd.api(argv).getHostDiscovery(argv.id)
        .then(function(response){
            cmd.displayResults(argv, response.data.hostDiscovery);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Discovery not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};
