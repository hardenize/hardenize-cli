var api = require('../../api');

exports.command = 'ls';

exports.desc = 'List groups';

exports.handler = function ls_groups_handler(argv) {

    api.init(argv).getGroups()
        .then(function(response){
            api.displayResults(argv, response.data.groups);
        })
        .catch(api.catchError);

};