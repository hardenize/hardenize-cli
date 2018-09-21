var cmd = require('../../cmd');

exports.command = 'get <hostname>';

exports.desc = 'Get a host';

exports.handler = function get_host_handler(argv) {

    cmd.api(argv).getHost(argv.hostname)
        .then(function(response){
            cmd.displayResults(argv, response.data.host);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Host not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};