var api = require('../../api');

exports.command = 'get <hostname>';

exports.desc = 'Get a host';

exports.handler = function get_hosts_handler(argv) {

    api.init(argv).getHost(argv.hostname)
        .then(function(response){
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                return console.warn('Host not found');
            }
            return Promise.reject(err);
        })
        .catch(api.catchError);
};