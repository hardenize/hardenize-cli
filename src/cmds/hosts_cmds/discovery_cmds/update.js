var cmd = require('../../../cmd');

exports.command = 'update <id>';

exports.desc = 'Updates a host discovery';

exports.builder = function(yargs) {
    yargs.option('triage-resolution',  { type: 'string', description: 'Triage resolution to set' });
    yargs.option('effective-hostname', { type: 'string', description: 'Effective hostname to set' });
};

exports.handler = function update_host_discovery_handler(argv) {

    var opt = {};

    if (argv.triageResolution)  opt.triageResolution = argv.triageResolution;
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
