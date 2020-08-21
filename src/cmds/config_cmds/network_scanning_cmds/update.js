var cmd = require('../../../cmd');

exports.command = 'update';

exports.desc = 'Update Network Scanning Config';

exports.builder = function(yargs) {
    yargs.option('exclusions', { type: 'array',   description: 'Excluded network ranges'  });
    yargs.option('static',     { type: 'boolean', description: 'Static network scanning'  });
    yargs.option('dynamic',    { type: 'boolean', description: 'Dynamic network scanning' });
}

exports.handler = function update_network_scanning_handler(argv) {

    var changes = {};
    if (argv.hasOwnProperty('exclusions')) changes.netscanExclusions = argv.exclusions;
    if (argv.hasOwnProperty('static'))     changes.netscanStatic     = argv.static;
    if (argv.hasOwnProperty('dynamic'))    changes.netscanDynamic    = argv.dynamic;

    cmd.api(argv).updateNetworkScanningConfig(changes)
        .then(function(response){
            cmd.displayResults(argv, response.data);
        })
        .catch(cmd.catchError);
};