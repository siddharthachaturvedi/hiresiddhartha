// Load chat module
import './js/chat.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Chat functionality
    const chatWindow = document.getElementById('chat-window');
    const inputText = document.getElementById('input-text');
    const sendButton = document.getElementById('send-button');
    
    function startChat() {
        document.getElementById('introduction-container').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
    }

    function createLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            loadingDiv.appendChild(dot);
        }
        return loadingDiv;
    }

    function typeMessage(messageDiv, text) {
        let index = 0;
        messageDiv.textContent = '';
        
        function type() {
            if (index < text.length) {
                messageDiv.textContent += text[index];
                index++;
                setTimeout(type, Math.random() * 30 + 20); // Random delay between 20-50ms
            }
        }
        
        type();
    }

    function appendMessage(message, isUser = false, withTyping = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        
        if (!isUser && withTyping) {
            // Add loading indicator first
            const loadingDiv = createLoadingIndicator();
            messageDiv.appendChild(loadingDiv);
            chatWindow.appendChild(messageDiv);
            chatWindow.scrollTop = chatWindow.scrollHeight;
            
            // Start typing effect after a brief delay
            setTimeout(() => {
                messageDiv.removeChild(loadingDiv);
                typeMessage(messageDiv, message);
            }, 500);
        } else {
            messageDiv.textContent = message;
        }
        
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Enable/disable send button based on input
    inputText.addEventListener('input', () => {
        sendButton.disabled = !inputText.value.trim();
    });

    // Handle message sending
    async function sendMessage() {
        const message = inputText.value.trim();
        if (!message) return;

        // Clear input and disable button
        inputText.value = '';
        sendButton.disabled = true;
        inputText.disabled = true;

        // Show user message
        appendMessage(message, true);

        try {
            // Add loading indicator message
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'message assistant-message loading';
            const loadingIndicator = createLoadingIndicator();
            loadingMessage.appendChild(loadingIndicator);
            chatWindow.appendChild(loadingMessage);
            chatWindow.scrollTop = chatWindow.scrollHeight;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            // Remove loading message
            chatWindow.removeChild(loadingMessage);
            
            if (data.success) {
                appendMessage(data.message, false, true);
            } else {
                appendMessage('Sorry, there was an error processing your message.');
            }
        } catch (error) {
            console.error('Error:', error);
            appendMessage('Sorry, there was an error connecting to the server.');
        } finally {
            // Re-enable input
            inputText.disabled = false;
            inputText.focus();
        }
    }

    // Add event listeners
    sendButton.addEventListener('click', sendMessage);
    inputText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Make startChat function available globally
    window.startChat = startChat;
});