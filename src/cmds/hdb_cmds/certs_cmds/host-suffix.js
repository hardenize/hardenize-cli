var cmd = require('../../../cmd');

exports.command = 'host-suffix <host-suffix>';

exports.desc = 'Search HDB for certificates by host suffix';

exports.builder = function(yargs) {
    yargs.option('exact',       { type: 'boolean', description: 'Include exact matches'     });
    yargs.option('wildcard',    { type: 'boolean', description: 'Include wildcard matches'  });
    yargs.option('subdomains',  { type: 'boolean', description: 'Include subdomain matches' });
    yargs.option('pem',         { type: 'boolean', description: 'Include raw PEM'           });
    yargs.option('expired',     { type: 'boolean', description: 'Include expired certs'     });
    yargs.option('limit',       { type: 'integer', description: 'Limit results'             });
}

exports.handler = function hdb_certs_host_suffix_handler(argv) {

    var options = {};

    if (argv.pem)        options.pem        = true;
    if (argv.expired)    options.expired    = true;
    if (argv.limit)      options.limit      = argv.limit;
    if (argv.exact)      options.exact      = true;
    if (argv.wildcard)   options.wildcard   = true;
    if (argv.subdomains) options.subdomains = true;

    cmd.api(argv).getHdbCertsByHostSuffix(argv.hostSuffix, options)
        .then(function(response){
            cmd.displayResults(argv, response.data.certs);
        })
        .catch(cmd.catchError);
};