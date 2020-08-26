var cmd = require('../../../cmd');

exports.command = 'update';

exports.desc = 'Update Access Control Config';

exports.builder = function(yargs) {
    yargs.option('api-networks',         { type: 'array', description: 'Whitelisted network ranges for accessing the API. No values == allow all' });
    yargs.option('api-networks-cascade', { type: 'string', choices: ['enabled', 'disabled'], description: 'Whether or not to cascade to suborgs' });
    yargs.option('app-networks',         { type: 'array', description: 'Whitelisted network ranges for accessing the management web interface. No values == allow all' });
    yargs.option('app-networks-cascade', { type: 'string', choices: ['enabled', 'disabled'], description: 'Whether or not to cascade to suborgs' });
}

exports.handler = function update_access_control_handler(argv) {

    var changes = {};
    if (argv.hasOwnProperty('apiNetworks'))        changes.apiNetworks = argv.apiNetworks;
    if (argv.hasOwnProperty('apiNetworksCascade')) changes.apiNetworksCascade = argv.apiNetworksCascade;
    if (argv.hasOwnProperty('appNetworks'))        changes.appNetworks = argv.appNetworks;
    if (argv.hasOwnProperty('appNetworksCascade')) changes.appNetworksCascade = argv.appNetworksCascade;

    cmd.api(argv).updateAccessControlConfig(changes)
        .then(function(response){
            cmd.displayResults(argv, response.data);
        })
        .catch(cmd.catchError);
};