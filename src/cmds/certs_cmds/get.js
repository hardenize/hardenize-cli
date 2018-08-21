var api = require('../../api');

exports.command = 'get <sha256>';

exports.desc = 'Get a certificate';

exports.handler = function get_certs_handler(argv) {

    api.init(argv).getCert(argv.sha256)
        .then(function(response){
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                return console.warn('Certificate not found');
            }
            return Promise.reject(err);
        })
        .catch(api.catchError);
};