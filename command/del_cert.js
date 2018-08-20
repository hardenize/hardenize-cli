module.exports = function del_cert(sha256) {

    return this.api().delCert(sha256)
        .then(function(response){
            if (response.res.status === 204) {
                return console.log('Successfully deleted certificate');
            }
            var err = new Error(response.res.statusText);
            err.res = response.res;
            return Promise.reject(err);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                return console.log('Certificate not found');
            }
            return Promise.reject(err);
        });

};