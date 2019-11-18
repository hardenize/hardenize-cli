var cmd = require('../../cmd');

exports.command = 'rm <networkRange>';

exports.desc = 'Delete a network range';

exports.handler = function rm_network_range_handler(argv) {
    cmd.api(argv).deleteNetworkRange(argv.networkRange)
        .then(function(){
            console.log('Network range deleted');
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                cmd.fail('Network range not found');
            }
            if (err.data && err.data.errors && err.data.errors.length === 1 && err.data.errors[0].param === 'range') {
                cmd.fail(err.data.errors[0].message);
            }
            cmd.catchError(err);
        });
}