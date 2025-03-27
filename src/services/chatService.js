import { config, azureClient, anthropicClient } from '../config/config.js';

class ChatError extends Error {
    constructor(message, source) {
        super(message);
        this.name = 'ChatError';
        this.source = source;
    }
}

const addThinkingDelay = async () => {
    const minDelay = 500;
    const maxDelay = 1500;
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await new Promise(resolve => setTimeout(resolve, delay));
};

export async function processMessage(message) {
    try {
        // Try Azure OpenAI first
        if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
            try {
                const completion = await azureClient.chat.completions.create({
                    messages: [
                        { role: "system", content: config.systemPrompt },
                        { role: "user", content: message }
                    ],
                    model: process.env.GPT4O_DEPLOYMENT || config.defaultModels.gpt4,
                    max_tokens: 1000
                });
                
                if (completion.choices?.[0]?.message?.content) {
                    return {
                        success: true,
                        message: completion.choices[0].message.content,
                        source: 'azure'
                    };
                }
                throw new ChatError('Invalid response format from Azure', 'azure');
            } catch (azureError) {
                console.log('Azure OpenAI Error:', azureError);
                // Fall through to Claude
            }
        }
        
        // Fall back to Claude
        if (process.env.CLAUDE_API_KEY) {
            const claudeResponse = await anthropicClient.messages.create({
                model: process.env.CLAUDE_MODEL || config.defaultModels.claude,
                max_tokens: 1024,
                system: config.systemPrompt,
                messages: [{ role: "user", content: message }]
            });

            if (claudeResponse.content?.[0]?.text) {
                return {
                    success: true,
                    message: claudeResponse.content[0].text,
                    source: 'claude'
                };
            }
            throw new ChatError('Invalid response format from Claude', 'claude');
        }

        throw new ChatError('No valid AI service configuration found', 'config');
    } catch (error) {
        console.error('Chat service error:', error);
        return {
            success: false,
            error: error.message || 'Failed to process message'
        };
    }
}