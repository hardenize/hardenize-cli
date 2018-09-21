var cmd = require('../../cmd');

exports.command = 'get <sha256>';

exports.desc = 'Get a certificate';

exports.handler = function get_cert_handler(argv) {
    return cmd.api(argv).getCert(argv.sha256)
        .then(function(response){
            cmd.displayResults(argv, response.data.cert);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Certificate not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};