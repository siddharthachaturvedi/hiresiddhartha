class ChatUI {
    constructor() {
        this.chatWindow = document.getElementById('chat-window');
        this.inputText = document.getElementById('input-text');
        this.sendButton = document.getElementById('send-button');
        this.typingIndicator = null;
        
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
            this.typingIndicator.className = 'message assistant-message typing';
            this.typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
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

    appendMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        messageDiv.textContent = message;
        
        // If there's a typing indicator, insert before it
        if (this.typingIndicator) {
            this.chatWindow.insertBefore(messageDiv, this.typingIndicator);
        } else {
            this.chatWindow.appendChild(messageDiv);
        }
        
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }

    async sendMessage() {
        const message = this.inputText.value.trim();
        if (!message) return;

        // Clear input and disable send button
        this.inputText.value = '';
        this.sendButton.disabled = true;

        // Show user message
        this.appendMessage(message, true);
        this.showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Response was not JSON");
            }

            const data = await response.json();
            
            this.hideTypingIndicator();
            
            if (data.success) {
                this.appendMessage(data.message);
            } else {
                this.appendMessage('Sorry, there was an error processing your message.');
            }
        } catch (error) {
            console.error('Error:', error);
            this.hideTypingIndicator();
            this.appendMessage('Sorry, there was an error connecting to the server. Please try again later.');
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