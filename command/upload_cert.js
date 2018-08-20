module.exports = function upload_cert(cmd) {

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  var buffer = '';
  process.stdin.on('data', function(chunk) {
    buffer += chunk;
  });

  var api = this.api();
  return new Promise(function(resolve, reject){
    process.stdin.on('end', function() {
      return api.uploadCert(buffer)
        .catch(reject)
        .then(function(response){
          switch (response.res.status) {
            case 201: console.log('Certificate successfully created'); break;
            case 204: console.log('Certificate already exists');       break;
            default: {
              var err = new Error('Unexpected response code');
              err.res = response.res;
              return reject(err);
            }
          }
          resolve();
        });
    });
  });

};