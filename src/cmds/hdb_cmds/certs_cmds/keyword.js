var cmd = require('../../../cmd');

exports.command = 'keyword <keyword>';

exports.desc = 'Search HDB for certificates by keyword';

exports.builder = function(yargs) {
    yargs.option('pem',   { type: 'boolean', description: 'Include raw PEM' });
    yargs.option('limit', { type: 'integer', description: 'Limit results'   });
}

exports.handler = function hdb_certs_keyword_handler(argv) {

    var options = {};

    if (argv.pem)   options.pem   = true;
    if (argv.limit) options.limit = argv.limit;

    cmd.api(argv).getHdbCertsByKeyword(argv.keyword, options)
        .then(function(response){
            cmd.displayResults(argv, response.data.certs);
        })
        .catch(cmd.catchError);
};