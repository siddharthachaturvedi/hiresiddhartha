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