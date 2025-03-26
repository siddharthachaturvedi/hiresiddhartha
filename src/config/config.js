require('dotenv').config();

const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

const config = {
    port: process.env.PORT || 3000,
    allowedOrigins: process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(',') : 
        ['http://localhost:3000', 'https://sidc.ai', 'https://www.sidc.ai']
};

// Initialize API clients only if credentials are available
let azureClient = null;
let anthropicClient = null;

if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
    azureClient = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.GPT4O_DEPLOYMENT || 'gpt-4'}`,
        defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
        defaultQuery: { 'api-version': '2024-02-15-preview' }
    });
}

if (process.env.CLAUDE_API_KEY) {
    anthropicClient = new Anthropic({
        apiKey: process.env.CLAUDE_API_KEY
    });
}

module.exports = { config, azureClient, anthropicClient };