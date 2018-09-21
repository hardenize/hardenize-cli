var cmd = require('../../cmd');

exports.command = 'ls';

exports.desc = 'List organizations';

exports.handler = function ls_suborgs_handler(argv) {

    cmd.api(argv).getSubOrgs()
        .then(function(response){
            cmd.displayResults(argv, response.data.orgs);
        })
        .catch(cmd.catchError);

};