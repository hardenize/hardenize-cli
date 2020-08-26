var cmd = require('../../../cmd');

exports.command = 'get';

exports.desc = 'Get Access Control Config';

exports.handler = function get_access_control_handler(argv) {
    cmd.api(argv).getAccessControlConfig()
        .then(function(response){
            cmd.displayResults(argv, response.data);
        })
        .catch(cmd.catchError);
};