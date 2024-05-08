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

    // Typewriter Effect
    const roles = ['Eternal Student', 'Tech Tinkerer', 'Empirical Learner'];
    let currentTextIndex = 0;
    let currentLetterIndex = 0;
    const dynamicTextElem = document.getElementById('dynamic-text');

    function typewriterEffect() {
        if (currentTextIndex === roles.length) currentTextIndex = 0;
        const currentText = roles[currentTextIndex];
        dynamicTextElem.textContent = currentText.slice(0, ++currentLetterIndex);
        if (currentLetterIndex === currentText.length) {
            setTimeout(eraseEffect, 2000);
        } else {
            setTimeout(typewriterEffect, 120);
        }
    }

    function eraseEffect() {
        const currentText = roles[currentTextIndex];
        dynamicTextElem.textContent = currentText.slice(0, --currentLetterIndex);
        if (currentLetterIndex === 0) {
            currentTextIndex++;
            setTimeout(typewriterEffect, 500);
        } else {
            setTimeout(eraseEffect, 60);
        }
    }

    typewriterEffect(); // Start the typewriter effect

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
    const url = 'https://hiresiddhartha.azurewebsites.net/api/message';
    const key = 'XJez5tp6Z9Pcm12-Vz_ev275gDkaWUGevD3Rzamg_k8KAzFuTFJWDg==';
    const headers = new Headers({
        'x-functions-key': key,
        'Content-Type': 'application/json'
    });

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
            headers,
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
