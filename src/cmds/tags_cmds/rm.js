var api = require('../../api');

exports.command = 'rm <tag>';

exports.desc = 'Delete a tag';

exports.builder = function(yargs) {
    yargs.option('force', { type: 'boolean', description: 'Force removal, even if tag is in use' });
}

exports.handler = function rm_tag_handler(argv) {

    var opt = {};
    if (argv.force) opt.force = true;

    api.init(argv).deleteTag(argv.tag, opt)
        .then(function(){
            console.log('Tag deleted');
        })
        .catch(function(err){
            if (err.data && err.data.errors && err.data.errors.length === 1 && err.data.errors[0].param === 'name') {
                console.warn(err.data.errors[0].message);
                process.exit(1);
            }
            api.catchError(err);
        });
}