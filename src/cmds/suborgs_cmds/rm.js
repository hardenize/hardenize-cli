var api = require('../../api');

exports.command = 'rm <id>';

exports.desc = 'Delete an organization';

exports.handler = function rm_suborg_handler(argv) {
    api.init(argv).deleteSubOrg(argv.id)
        .then(function(){
            console.log('Organization deleted');
        })
        .catch(function(err){
            if (err.res) {
                switch (err.res.status) {
                    case 403: err = 'Account doesn\'t support suborganizations'; break;
                    case 404: err = 'Organization doesn\'t exist';               break;
                }
            }
            api.catchError(err);
        });
}