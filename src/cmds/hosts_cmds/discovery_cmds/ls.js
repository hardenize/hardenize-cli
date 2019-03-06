var cmd = require('../../../cmd');

exports.command = 'ls';

exports.desc = 'List host discoveries';

exports.builder = function(yargs) {
    yargs.option('discovered-since',  { type: 'date',    description: 'Return only discoveries made since the specified date' });
    yargs.option('limit',             { type: 'integer', description: 'Return only up to the specified number of discoveries' });
    yargs.option('triage-resolution', { type: 'string',  description: 'Return only discoveries with this resolution'  });
    yargs.option('match-location',    { type: 'string',  description: 'Return only discoveries made at this location' });
    yargs.option('match-reason',      { type: 'string',  description: 'Return only discoveries made for this reason'  });
}

exports.handler = function ls_host_discoveries_handler(argv) {

    var opt = ['discoveredSince', 'limit', 'triageResolution', 'matchLocation', 'matchReason']
        .reduce(function(o, name) {
            if (argv.hasOwnProperty(name)) o[name] = argv[name];
            return o;
        }, {});

    cmd.api(argv).getHostDiscoveries(opt)
        .then(function(response){
            cmd.displayResults(argv, response.data.hostDiscoveries);
        })
        .catch(cmd.catchError);

};