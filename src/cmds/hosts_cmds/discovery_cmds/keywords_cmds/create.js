var cmd = require('../../../../cmd');

exports.command = 'create <keyword>';

exports.desc = 'Create a host discovery keyword';

exports.builder = function(yargs) {
    yargs.option('exclusion', { type: 'array', description: 'Supply as "type:value", e.g: "substring:hardenize"' });
};

exports.handler = function create_host_discovery_keyword_handler(argv) {

    var opt = {};
    if (argv.exclusion && argv.exclusion.length) {
        opt.exclusions = argv.exclusion.map(function(value){
            var m = value.match(/^([^]+):(.+)$/);
            if (!m) cmd.catchError('Invalid exclusion: ' + value);
            return {
                type:      m[1],
                exclusion: m[2],
            };
        });
    }

    cmd.api(argv).createHostDiscoveryKeyword(argv.keyword, opt)
        .then(function(response){
            cmd.displayResults(argv, response.data.hostDiscoveryKeyword);
        })
        .catch(cmd.catchError);
};
