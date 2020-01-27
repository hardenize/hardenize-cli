var cmd = require('../../../cmd');

exports.command = 'spki <spki>';

exports.desc = 'Search HDB for certificates by spki';

exports.builder = function(yargs) {
    yargs.option('pem',   { type: 'boolean', description: 'Include raw PEM' });
    yargs.option('limit', { type: 'integer', description: 'Limit results'   });
}

exports.handler = function hdb_certs_spki_handler(argv) {

    var options = {};

    if (argv.pem)   options.pem   = true;
    if (argv.limit) options.limit = argv.limit;

    cmd.api(argv).getHdbCertsBySpki(argv.spki, options)
        .then(function(response){
            cmd.displayResults(argv, response.data.certs);
        })
        .catch(cmd.catchError);
};