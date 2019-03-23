/* eslint-disable */
const os = require('os');

const getLocalHost = () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (let k in interfaces) {
        for (let k2 in interfaces[k]) {
            const address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }

    return addresses[0] || 'localhost';
};

const envConfig = {
    local: {
        'REQUEST-ORIGIN': 'http://' + getLocalHost() + ':8090',
    },
    online: {
        'REQUEST-ORIGIN': 'https://iamswf.163.com'
    }
};

module.exports = envConfig;
