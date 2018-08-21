var api = require('../../api');

module.exports.command = 'rm <sha256>';

module.exports.desc = process.env.HZ_DEV_MODE ? 'Delete a certificate' : false;

module.exports.builder = {};

module.exports.handler = function rm_certs_handler(argv) {
    if (!process.env.HZ_DEV_MODE) {
        console.error('Not running in dev mode');
        process.exit(1);
    }

    api.init(argv).delCert(argv.sha256)
        .then(function(response){
            if (response.res.status === 204) {
                return console.log('Successfully deleted certificate');
            }
            var err = new Error(response.res.statusText);
            err.res = response.res;
            return Promise.reject(err);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                return console.log('Certificate not found');
            }
            return Promise.reject(err);
        })
        .catch(api.catchError);

};