module.exports = function upload_cert(cmd) {
  var self = this;
  var api = this.api('Certificates');

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  var buffer = '';
  process.stdin.on('data', function(chunk) {
    buffer += chunk;
  });
  process.stdin.on('end', function() {
    api.createACertificate(buffer, function(error, _, response) {
      if (error) self.exit_api_error(error, response);
      switch (response.status) {
        case 201: return console.log('Certificate successfully created');
        case 204: return console.log('Certificate already exists');
        default: throw new Error('Unexpected response code', response.status);
      }
    });
  });
};