const cors = require('cors');
const { config } = require('../config/config');

const corsMiddleware = cors({
    origin: function(origin, callback) {
        if (!origin || config.allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true
});

module.exports = corsMiddleware;