var cmd = require('../../../cmd');

exports.command = 'sha256 <sha256>';

exports.desc = 'Search HDB for certificates by sha256';

exports.builder = function(yargs) {
    yargs.option('unpacked', { type: 'boolean', description: 'Include unpacked info' });
}

exports.handler = function hdb_certs_sha256_handler(argv) {

    var options = {};
    if (argv.unpacked) options.unpacked = true;

    cmd.api(argv).getHdbCertBySha256(argv.sha256, options)
        .then(function(response){
            cmd.displayResults(argv, response.data.cert);
        })
        .catch(cmd.catchError);
};