import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { config } from '../src/config/config.js';
import chatRoutes from '../src/routes/chatRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: config.allowedOrigins,
    credentials: true
}));

// Serve static files from the root directory and public directory
app.use(express.static(path.join(__dirname, '..')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use('/api', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server with port fallback
const startServer = async (port) => {
    try {
        await new Promise((resolve, reject) => {
            const server = app.listen(port, () => {
                console.log(`Server running on port ${port}`);
                resolve();
            });

            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is busy, trying ${port + 1}...`);
                    server.close();
                    startServer(port + 1);
                } else {
                    reject(new Error(`Failed to start server: ${err.message}`));
                }
            });
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(config.port);
