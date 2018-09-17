var api = require('../../api');

exports.command = 'create <id>';

exports.desc = 'Create a group';

exports.builder = function(yargs) {
    yargs.option('name', { type: 'string', description: 'Display name (if different from id)', required: true });
}

exports.handler = function create_group_handler(argv) {

    var options = {};
    if (argv.hasOwnProperty('name')) options.name = argv.name;

    api.init(argv).createGroup(argv.id, options)
        .then(function(){
            console.log('Group created');
        })
        .catch(api.catchError);
}