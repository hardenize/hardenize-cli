var api = require('../../api');

exports.command = 'ls';

exports.desc = 'List organizations';

exports.handler = function ls_suborgs_handler(argv) {

    api.init(argv).getSubOrgs()
        .then(function(response){
            api.displayResults(argv, response.data.orgs);
        })
        .catch(api.catchError);

};