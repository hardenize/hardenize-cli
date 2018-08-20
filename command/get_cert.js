module.exports = function get_cert(sha256) {

    return this.api().getCert(sha256)
        .then(function(response){
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                return console.warn('Certificate not found');
            }
            return Promise.reject(err);
        });

};