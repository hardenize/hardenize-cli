var cmd = require('../../../../cmd');

exports.command = 'rm <keyword>';

exports.desc = 'Deletes a host discovery keyword';

exports.handler = function rm_host_discovery_keyword_handler(argv) {
    cmd.api(argv).deleteHostDiscoveryKeyword(argv.keyword)
        .then(function(){
            console.log('Keyword successfully deleted');
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Keyword not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};
