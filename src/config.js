const path = require('path');

const config = {
    all: {
        env: process.env.NODE_ENV || 'development',
        root: path.join(__dirname, '..'),
        port: process.env.PORT || 3200,
        ip: process.env.IP || '0.0.0.0',
        modelPath: path.join(__dirname, '..', '/public', '/models')
    },
    production: {
        ip: process.env.IP || '0.0.0.0',
        port: process.env.PORT || 3200
    }
}

module.exports = { ...config.all, ...(config[config.all.env]) };