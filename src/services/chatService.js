import { azureClient, anthropicClient, config } from '../config/config.js';

class ChatError extends Error {
    constructor(message, source) {
        super(message);
        this.name = 'ChatError';
        this.source = source;
    }
}

const addThinkingDelay = async () => {
    // Add a small random delay to simulate thinking
    const minDelay = 500;
    const maxDelay = 1500;
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await new Promise(resolve => setTimeout(resolve, delay));
};

export async function processMessage(message) {
    // Add initial thinking delay
    await addThinkingDelay();

    // Try Azure OpenAI first
    try {
        const completion = await azureClient.chat.completions.create({
            messages: [
                { role: "system", content: config.systemPrompt },
                { role: "user", content: message }
            ],
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
        
        // Add delay before falling back to Claude
        await addThinkingDelay();
        
        // Fall back to Claude
        try {
            const claudeResponse = await anthropicClient.messages.create({
                model: config.anthropic.model,
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
        } catch (claudeError) {
            console.error('Claude Error:', claudeError);
            throw new ChatError(
                'Both AI services failed to process the message',
                'all'
            );
        }
    }
}