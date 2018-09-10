var api = require('../../api');

exports.command = 'add <name>';

exports.desc = 'Add a tag';

exports.builder = function(yargs) {
    yargs.option('display-name', { type: 'string', description: 'Display name (if different from name)' });
}

exports.handler = function add_tag_handler(argv) {

    var options = {};
    if (argv.hasOwnProperty('displayName')) options.displayName = argv.displayName;

    api.init(argv).addTag(argv.name, options)
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