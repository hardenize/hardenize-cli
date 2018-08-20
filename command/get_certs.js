module.exports = function get_certs(cmd) {

  var opt = {};
  Object.keys(cmd._events||{}).forEach(function(event){
    var m = event.match(/^option:(.+)/);
    if (m && typeof cmd[m[1]] !== 'undefined') opt[m[1]] = cmd[m[1]];
  });

  return this.api().getCerts(opt)
    .then(function(response){
      console.log(JSON.stringify(response.data, null, 2));
    });

};