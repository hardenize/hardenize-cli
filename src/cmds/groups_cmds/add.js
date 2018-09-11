var api = require('../../api');

exports.command = 'add <id>';

exports.desc = 'Add a group';

exports.builder = function(yargs) {
    yargs.option('name', { type: 'string', description: 'Display name (if different from id)', required: true });
}

exports.handler = function add_group_handler(argv) {

    var options = {};
    if (argv.hasOwnProperty('name')) options.name = argv.name;

    api.init(argv).addGroup(argv.id, options)
        .then(function(){
            console.log('Group added');
        })
        .catch(api.catchError);
}