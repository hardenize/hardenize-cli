var cmd = require('../../cmd');

exports.command = 'ls';

exports.desc = 'List groups';

exports.handler = function ls_groups_handler(argv) {

    cmd.api(argv).getGroups()
        .then(function(response){
            cmd.displayResults(argv, response.data.groups);
        })
        .catch(cmd.catchError);

};