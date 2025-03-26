class ChatUI {
    constructor() {
        this.chatWindow = document.getElementById('chat-window');
        this.inputText = document.getElementById('input-text');
        this.sendButton = document.getElementById('send-button');
        this.typingIndicator = null;
        this.apiEndpoint = window.location.hostname === 'localhost' ? '/api/chat' : '/.netlify/functions/chat';
        
        this.isTyping = false;
        this.messageQueue = [];
        this.typingSpeed = {
            min: 20,
            max: 50
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.inputText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.inputText.addEventListener('input', () => {
            this.sendButton.disabled = !this.inputText.value.trim();
        });
    }

    startChat() {
        document.getElementById('introduction-container')?.classList.add('hidden');
        document.getElementById('chat-container')?.classList.remove('hidden');
    }

    showTypingIndicator() {
        if (!this.typingIndicator) {
            this.typingIndicator = document.createElement('div');
            this.typingIndicator.className = 'typing-indicator';
            this.typingIndicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
            this.chatWindow.appendChild(this.typingIndicator);
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
    }

    async appendMessage(message, isUser = false) {
        if (isUser) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message user-message`;
            messageDiv.textContent = message;
            this.chatWindow.appendChild(messageDiv);
            this.scrollToBottom();
            return;
        }

        // For assistant messages, show typing animation
        this.showTypingIndicator();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message assistant-message`;
        this.chatWindow.insertBefore(messageDiv, this.typingIndicator);

        // Stream the message character by character
        let displayedText = '';
        for (let i = 0; i < message.length; i++) {
            displayedText += message[i];
            messageDiv.textContent = displayedText;
            this.scrollToBottom();
            
            // Random delay between characters for natural typing feel
            const delay = Math.random() * (this.typingSpeed.max - this.typingSpeed.min) + this.typingSpeed.min;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        this.hideTypingIndicator();
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }

    async sendMessage() {
        const message = this.inputText.value.trim();
        if (!message || this.isTyping) return;

        this.inputText.value = '';
        this.sendButton.disabled = true;
        this.isTyping = true;

        // Show user message
        await this.appendMessage(message, true);
        this.showTypingIndicator();

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.headers?.get("content-type")?.includes("application/json")) {
                throw new TypeError("Response was not JSON");
            }

            const data = await response.json();
            
            if (data.success) {
                await this.appendMessage(data.message);
            } else {
                await this.appendMessage(data.error || 'Sorry, there was an error processing your message.');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error instanceof TypeError ? 
                'Sorry, there was an error with the server response.' : 
                'Sorry, there was an error connecting to the server. Please try again later.';
            await this.appendMessage(errorMessage);
        } finally {
            this.hideTypingIndicator();
            this.isTyping = false;
            this.sendButton.disabled = !this.inputText.value.trim();
        }
    }
}

// Initialize chat UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    const chatUI = new ChatUI();
    // Make startChat function available globally
    window.startChat = () => chatUI.startChat();
});