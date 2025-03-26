import { azureClient, anthropicClient, config } from '../config/config.js';

export async function processMessage(message) {
    try {
        // Try Azure OpenAI first
        try {
            const completion = await azureClient.chat.completions.create({
                messages: [
                    { role: "system", content: config.systemPrompt },
                    { role: "user", content: message }
                ],
                max_tokens: 1000
            });
            
            if (completion.choices && completion.choices[0]) {
                return {
                    success: true,
                    message: completion.choices[0].message.content,
                    source: 'azure'
                };
            }
        } catch (azureError) {
            console.log('Azure OpenAI Error:', azureError);
        }

        // Fall back to Claude
        const claudeResponse = await anthropicClient.messages.create({
            model: config.anthropic.model,
            max_tokens: 1024,
            system: config.systemPrompt,
            messages: [{ role: "user", content: message }]
        });

        return {
            success: true,
            message: claudeResponse.content[0].text,
            source: 'claude'
        };

    } catch (error) {
        console.error('Chat service error:', error);
        throw error;
    }
}