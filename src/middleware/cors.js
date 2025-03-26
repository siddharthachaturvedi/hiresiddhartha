import cors from 'cors';
import { config } from '../config/config.js';

const corsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin) {
            return callback(null, true);
        }
        
        const allowedOrigins = config.allowedOrigins;
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

export const corsMiddleware = cors(corsOptions);