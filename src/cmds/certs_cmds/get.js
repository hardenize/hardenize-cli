var api = require('../../api');

exports.command = 'get <sha256>';

exports.desc = 'Get a certificate';

exports.handler = function get_cert_handler(argv) {
    return api.init(argv).getCert(argv.sha256)
        .then(function(response){
            api.displayResults(argv, response.data.cert);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                return console.warn('Certificate not found');
            }
            return Promise.reject(err);
        })
        .catch(api.catchError);
};