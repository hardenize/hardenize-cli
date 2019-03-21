var cmd = require('../../../cmd');

exports.command = 'update <id>';

exports.desc = 'Updates a host discovery';

exports.builder = function(yargs) {
    yargs.option('resolution',         { type: 'string', description: 'Resolution to set', required: true });
    yargs.option('effective-hostname', { type: 'string', description: 'Effective hostname to set' });
};

exports.handler = function update_host_discovery_handler(argv) {

    var opt = {};

    if (argv.resolution)  opt.resolution = argv.resolution;
    if (argv.effectiveHostname) opt.effectiveHostname = argv.effectiveHostname;

    cmd.api(argv).updateHostDiscovery(argv.id, opt)
        .then(function(response){
            cmd.displayResults(argv, response.data.hostDiscovery);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Discovery not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};