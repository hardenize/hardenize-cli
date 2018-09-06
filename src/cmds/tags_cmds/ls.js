var api = require('../../api');

exports.command = 'ls';

exports.desc = 'List tags';

exports.handler = function ls_tags_handler(argv) {

    api.init(argv).getTags()
        .then(function(response){
            api.displayResults(argv, response.data.tags);
        })
        .catch(api.catchError);

};