var cmd = require('../../../cmd');

exports.command = 'update <ids...>';

exports.desc = 'Updates host discoveries';

exports.builder = function(yargs) {
    yargs.option('resolution',         { type: 'string',  description: 'Resolution to set', required: true });
    yargs.option('effective-hostname', { type: 'string',  description: 'Effective hostname to set (only valid when updating a single discovery, and preview isn\'t set)' });
    yargs.option('preview',            { type: 'boolean', description: 'Do not apply changes. Just return a list of discoveries that would have been affected' });
};

exports.handler = function update_host_discoveries_handler(argv) {

    var changes = {};
    var opt     = {};

    if (argv.resolution)  changes.resolution = argv.resolution;
    if (argv.effectiveHostname) changes.effectiveHostname = argv.effectiveHostname;
    if (argv.preview) opt.preview = true;

    if (argv.ids.length === 1 && !argv.preview) {
        cmd.api(argv).updateHostDiscovery(argv.ids[0], changes)
            .then(function(response){
                cmd.displayResults(argv, response.data.hostDiscovery);
            })
            .catch(function(err){
                if (err.res && err.res.status === 404) cmd.fail('Discovery not found');
                return Promise.reject(err);
            })
            .catch(cmd.catchError);
    } else {
        if (changes.hasOwnProperty('effectiveHostname')) {
            if (opt.preview) {
                cmd.fail('You can not use --effective-hostname and --preview together');
            } else {
                cmd.fail('You can not use --effective-hostname unless you have specified exactly 1 id');
            }
        }
        cmd.api(argv).updateHostDiscoveries(argv.ids, changes, opt)
            .then(function(response){
                cmd.displayResults(argv, response.data.hostDiscoveries);
            })
            .catch(cmd.catchError);
    }
};