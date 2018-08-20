module.exports = function add_dns_zone(root, cmd) {

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    var buffer = '';
    process.stdin.on('data', function(chunk) {
        buffer += chunk;
    });

    var api = this.api();
    return new Promise(function(resolve, reject){
        process.stdin.on('end', function() {

            var options = {};
            if (cmd.status) options.status = cmd.status;

            return api.addDnsZone(root, buffer, options)
                .catch(reject)
                .then(function(_){
                    console.log('Zone successfully added');
                    resolve();
                });
        });
    });
};