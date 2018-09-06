var api = require('../../api');

exports.command = 'add <tag>';

exports.desc = 'Add a tag';

exports.handler = function add_tag_handler(argv) {

    api.init(argv).addTag(argv.tag)
        .then(function(){
            console.log('Tag added');
        })
        .catch(function(err){
            if (err.data && err.data.errors && err.data.errors.length === 1 && err.data.errors[0].param === 'body/name') {
                console.warn('Tag ' + err.data.errors[0].message);
                process.exit(1);
            }
            api.catchError(err);
        });
}