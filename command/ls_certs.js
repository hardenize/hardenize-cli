module.exports = function ls_certs(cmd) {
  var self = this;

  var api = this.api('Certificates');

  var opt = {};
  Object.keys(cmd._events||{}).forEach(function(event){
    var m = event.match(/^option:(.+)/);
    if (m && typeof cmd[m[1]] !== 'undefined') opt[m[1]] = cmd[m[1]];
  });

  api.listCertificates(opt, function(error, data, response) {
    if (error) self.exit_api_error(error, response);
    console.log(JSON.stringify(data, null, 2));
  });

};