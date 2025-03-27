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

    // Typewriter effect phrases
    const phrases = [
        'AI Innovation Architect',
        'Healthcare AI Pioneer',
        'AI for Scientific Discovery Expert',
        'Agentic AI Systems Builder',
        'Research Product Leader'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 200;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        const dynamicText = document.getElementById('dynamic-text');
        
        if (isDeleting) {
            dynamicText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            dynamicText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingDelay = 3000; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingDelay = 80; // Speed between phrases
        }

        setTimeout(typeEffect, isDeleting ? 50 : typingDelay);
    }

    // Start the typing effect
    typeEffect();

    // Initialize scroll behavior
    const scrollTopButton = document.querySelector('.scroll-top');
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollTopButton?.classList.add('visible');
            header?.classList.add('scrolled');
        } else {
            scrollTopButton?.classList.remove('visible');
            header?.classList.remove('scrolled');
        }
    });

    // Mobile navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    burger?.addEventListener('click', () => {
        nav?.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (nav?.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.burger')) {
            nav.classList.remove('active');
            burger?.classList.remove('active');
        }
    });
});