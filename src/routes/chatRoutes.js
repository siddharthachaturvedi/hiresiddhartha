import express from 'express';
import { processMessage } from '../services/chatService.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Invalid message format'
            });
        }

        const result = await processMessage(message);
        res.json(result);
    } catch (error) {
        console.error('Chat route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

export default router;