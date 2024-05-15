document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 200
    });

    // Mobile Menu Toggle
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    burger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Typewriter Effect for Hero Text
    const texts = ["Tech Tinkerer", "Eternal Student", "Empirical Learner"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";

    function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];
        letter = currentText.slice(0, ++index);

        document.getElementById('dynamic-text').textContent = letter;
        if (letter.length === currentText.length) {
            count++;
            index = 0;
            setTimeout(type, 2000); // Delay before starting next text
        } else {
            setTimeout(type, 150); // Speed of typing effect
        }
    }

    type(); // Start the typewriter effect

    // Scroll-to-Top Button
    const scrollTopBtn = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('show', window.pageYOffset > 300);
    });

    scrollTopBtn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scrolling for navigation links and scroll button
    document.querySelectorAll('.nav-links a, .scroll-down').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Chat functionality
function startChat() {
    const introContainer = document.getElementById('introduction-container');
    const chatContainer = document.getElementById('chat-container');
    introContainer.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    document.getElementById('send-button').disabled = true;
}

async function sendMessage() {
    const input = document.getElementById('input-text').value;
    const chatWindow = document.getElementById('chat-window');
    const url = 'https://hiresiddhartha.azurewebsites.net/api/message?code=fJNFB37wyqjoK_asybYDptvMtOgtcov3NfPFXZ5evqziAzFumzp7NA%3D%3D'; // Replace with your function URL

    // Add user's message
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.textContent = input;
    chatWindow.appendChild(userDiv);

    // Clear input and disable Send button
    const sendButton = document.getElementById('send-button');
    document.getElementById('input-text').value = '';
    sendButton.disabled = true;
    sendButton.classList.remove('enabled');
    sendButton.style.cursor = 'not-allowed';

    // Adding thinking animation
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'message thinking-message';
    thinkingDiv.innerHTML = '<span class="thinking-dot"></span><span class="thinking-dot"></span><span class="thinking-dot"></span>';
    chatWindow.appendChild(thinkingDiv);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: input })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Oops: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
        }

        // Remove thinking animation and add response message
        chatWindow.removeChild(thinkingDiv);
        const result = await response.json();
        const responseDiv = document.createElement('div');
        responseDiv.className = 'message response-message';
        responseDiv.innerHTML = result.message.replace(/\n/g, '<br>');
        chatWindow.appendChild(responseDiv);
    } catch (error) {
        chatWindow.removeChild(thinkingDiv);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error-message';
        errorDiv.textContent = `Error: ${error.message}`;
        chatWindow.appendChild(errorDiv);
    }
}

// Event listeners to send message with the Enter key or Send button
document.getElementById('input-text').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

document.getElementById('send-button').addEventListener('click', function () {
    if (!this.disabled) sendMessage();
});

document.getElementById('input-text').addEventListener('input', function () {
    const sendButton = document.getElementById('send-button');
    const isEmpty = this.value.trim() === '';
    sendButton.disabled = isEmpty;
    sendButton.classList.toggle('enabled', !isEmpty);
    sendButton.style.cursor = isEmpty ? 'not-allowed' : 'pointer';
});
