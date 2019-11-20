var color = require('cli-color');

module.exports = debug;

function debug(api) {
    var start_time;
    api.on('request', function(req){
        start_time = Date.now();
        console.warn(color.blue('\n**** DEBUG: Sending API Request (+0ms)\n'));
        console.warn('  ' + req.method + ' ' + req.url + '\n');
        debugHeaders(req.headers);
        debugBody(req.body, true);
        console.warn('');
    });
    api.on('response', function(res){
        console.warn(color.blue('**** DEBUG: Received API Response (+' + (Date.now() - start_time) + 'ms)\n'));
        console.warn('  ' + res.status + ' ' + res.statusText + '\n');
        debugHeaders(res.headers);
        console.warn('');
    });
    api.on('body', function(body){
        console.warn(color.blue('**** DEBUG: Received API Response Body (+' + (Date.now() - start_time) + 'ms)\n'));
        debugBody(body, false);
        console.warn('');
    });
}

function debugHeaders(headers){
    console.warn(color.bold('  Headers:'));
    for (var name of headers.keys()) {
        var value = headers.get(name);
        name = name.split(/-/).map(function(part){
            return part[0].toUpperCase() + part.slice(1);
        }).join('-');
        console.warn('    ' + name + ': ' + value);
    }
}

function debugBody(body, mark) {
    if (body instanceof Buffer) body = body.toString();
    if (typeof body !== 'string' || body.length === 0) return;
    if (body.startsWith('{')) {
        try {
            body = JSON.stringify(JSON.parse(body), null, 2);
        } catch (err) {
            // Ignore. Just not JSON
        }
    }

    if (mark) console.warn(color.bold('\n  Body:'));
    var spacer = mark ? '    ' : '  ';
    console.warn(body.split(/\r?\n/).map(function(line){
        return spacer + line;
    }).join('\n'));
}