require('../commonUtils/StringFromat');
module.exports = {
    port: 3000,
    session: {
        secret: 'freshmanblog',
        key: 'freshmanblog',
        maxAge: 2592000000
    },
    apiUrl: 'http://127.0.0.1:5000/api'
};