var api = require('../../api');

exports.command = 'get <hostname>';

exports.desc = 'Get a host';

exports.handler = function get_host_handler(argv) {

    api.init(argv).getHost(argv.hostname)
        .then(function(response){
            api.displayResults(argv, response.data.host);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                return console.warn('Host not found');
            }
            return Promise.reject(err);
        })
        .catch(api.catchError);
};