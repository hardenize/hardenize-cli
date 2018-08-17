module.exports = function get_cert(sha256) {
  var self = this;

  var api = this.api('Certificates');

  api.retrieveACertificate(sha256, function(error, data, response) {
    if (error) self.exit_api_error(error, response);
    console.log(JSON.stringify(data, null, 2));
  });

};