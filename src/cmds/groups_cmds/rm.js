var cmd = require('../../cmd');

exports.command = 'rm <id>';

exports.desc = 'Delete a group';

exports.builder = function(yargs) {
    yargs.option('force', { type: 'boolean', description: 'Force removal, even if group is in use' });
}

exports.handler = function rm_group_handler(argv) {

    var opt = {};
    if (argv.force) opt.force = true;

    cmd.api(argv).deleteGroup(argv.id, opt)
        .then(function(){
            console.log('Group deleted');
        })
        .catch(function(err){
            if (err.data && err.data.errors && err.data.errors.length === 1 && err.data.errors[0].param === 'name') {
                cmd.fail(err.data.errors[0].message);
            }
            cmd.catchError(err);
        });
}