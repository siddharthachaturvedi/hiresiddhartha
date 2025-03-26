import dotenv from 'dotenv';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    azure: {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        deployment: process.env.GPT4O_DEPLOYMENT
    },
    anthropic: {
        apiKey: process.env.CLAUDE_API_KEY,
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20250219'
    },
    systemPrompt: process.env.SYSTEM_PROMPT || 'You are a helpful AI assistant.'
};

// Initialize API clients
export const azureClient = new OpenAI({
    apiKey: config.azure.apiKey,
    baseURL: `${config.azure.endpoint}/openai/deployments/${config.azure.deployment}`,
    defaultHeaders: { 'api-key': config.azure.apiKey },
    defaultQuery: { 'api-version': '2024-02-15-preview' }
});

export const anthropicClient = new Anthropic({
    apiKey: config.anthropic.apiKey
});