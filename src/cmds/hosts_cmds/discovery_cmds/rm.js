var cmd = require('../../../cmd');

exports.command = 'rm <ids...>';

exports.desc = 'Deletes host discoveries';

exports.builder = function(yargs) {
    yargs.option('preview', { type: 'boolean', description: 'Do not delete changes. Just return a list of discoveries that would have been deleted' });
};

exports.handler = function delete_host_discoveries_handler(argv) {

    var opt = {};

    if (argv.preview) opt.preview = true;

    cmd.api(argv).deleteHostDiscoveries(argv.ids, opt)
        .then(function(response){
            cmd.displayResults(argv, response.data);
        })
        .catch(cmd.catchError);
};