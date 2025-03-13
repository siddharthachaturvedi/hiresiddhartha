document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS with refined settings
    AOS.init({
        duration: 900,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        once: false,
        mirror: true,
        offset: 50
    });

    // Dynamic Typing Effect with enhanced timing
    const dynamicText = document.getElementById('dynamic-text');
    const phrases = [
        "AI Innovation Architect",
        "Research-Product Leader",
        "Healthcare AI Pioneer",
        "AI for Scientific Discovery Expert",
        "Agentic AI Systems Builder"
    ];

    function typePhrase(phrase, index = 0) {
        if (index < phrase.length) {
            dynamicText.textContent = phrase.substring(0, index + 1);
            // Randomize typing speed slightly for more natural effect
            const speed = Math.random() * 30 + 80;
            setTimeout(() => typePhrase(phrase, index + 1), speed);
        } else {
            setTimeout(() => erasePhrase(phrase), 2800);
        }
    }

    function erasePhrase(phrase, index = phrase.length) {
        if (index > 0) {
            dynamicText.textContent = phrase.substring(0, index - 1);
            // Faster erase speed
            setTimeout(() => erasePhrase(phrase, index - 1), 40);
        } else {
            const nextPhrase = phrases[(phrases.indexOf(phrase) + 1) % phrases.length];
            setTimeout(() => typePhrase(nextPhrase), 700);
        }
    }

    // Start typing animation
    typePhrase(phrases[0]);

    // Enhanced header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/hide scroll button
        if (scrollY > 300) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });

    // Smooth Scrolling with refined easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Chat Functionality with luxury feel
    const chatContainer = document.getElementById('chat-container');
    const introContainer = document.getElementById('introduction-container');
    const chatWindow = document.getElementById('chat-window');
    const inputText = document.getElementById('input-text');
    const sendButton = document.getElementById('send-button');
    const startChatButton = document.getElementById('start-chat-button');

    function showThinking() {
        const thinking = document.createElement('div');
        thinking.classList.add('thinking-message');
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('thinking-dot');
            thinking.appendChild(dot);
        }
        chatWindow.appendChild(thinking);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return thinking;
    }

    function simulateTyping(messageElement, text) {
        return new Promise(resolve => {
            let i = 0;
            messageElement.textContent = '';
            
            function type() {
                if (i < text.length) {
                    messageElement.textContent += text[i];
                    i++;
                    // More natural typing with variable speed
                    const delay = Math.random() * 25 + 25;
                    setTimeout(type, delay);
                } else {
                    resolve();
                }
            }
            
            type();
        });
    }

    async function addMessage(text, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isUser ? 'user-message' : 'response-message');
        chatWindow.appendChild(messageElement);
        
        if (!isUser) {
            const thinking = showThinking();
            // More natural thinking time variation
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 800));
            thinking.remove();
            await simulateTyping(messageElement, text);
        } else {
            messageElement.textContent = text;
        }
        
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return messageElement;
    }

    async function initializeChat() {
        const welcomeMessages = [
            "Hello! I'm Siddhartha's AI assistant.",
            "I can tell you about his experience in AI innovation, his work at Microsoft, and his vision for human-AI collaboration.",
            "What would you like to know?"
        ];
        
        for (const message of welcomeMessages) {
            await addMessage(message);
            await new Promise(resolve => setTimeout(resolve, 700));
        }
    }

    // Chat Event Listeners
    startChatButton?.addEventListener('click', startChat);
    sendButton?.addEventListener('click', sendMessage);
    inputText?.addEventListener('input', () => {
        sendButton.disabled = !inputText.value.trim();
    });
    inputText?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendButton.disabled) sendMessage();
        }
    });

    // More sophisticated message responses with detailed content
    const possibleResponses = {
        about: [
            "Siddhartha brings 13+ years of experience building multi-modal Agentic AI systems that reshape industries.",
            "He uniquely combines technical expertise with strategic vision, having returned to study Computer Science 18 years after his first degree while serving as a Director at Microsoft.",
            "His approach bridges AI research and real-world deployment, focusing on systems that enhance human capability rather than just automation."
        ],
        microsoft: [
            "At Microsoft, Siddhartha works as a Director of Product Management, focusing on Strategic Missions and Technologies.",
            "He led Generative AI adoption for the US Federal Market, ensuring models were securely deployed in classified environments at scale.",
            "His notable projects include launching Azure OpenAI Service for Federal Clouds, developing Biomedical NLP solutions, and spearheading the award-winning Premonition biothreat detection system."
        ],
        education: [
            "Siddhartha holds an MBA from INSEAD, one of the world's leading business schools, which shaped his global approach to innovation and leadership.",
            "Interestingly, he returned to study Computer Science at BITS Pilani 18 years after his first degree, maintaining an impressive 9.49 CGPA while working as a Director at Microsoft.",
            "This combination of technical depth and business acumen allows him to effectively bridge research innovations and practical implementation."
        ],
        ai: [
            "Siddhartha specializes in building multi-modal Agentic AI systems that move beyond prototypes to reshape industries.",
            "He's particularly focused on human-AI collaboration, believing AI should empower human discovery rather than just automate tasks.",
            "His work spans Generative AI, LLMs, biomedical NLP, and responsible AI governance frameworks that ensure ethical deployment."
        ],
        achievements: [
            "Siddhartha led the development of Microsoft Premonition, an AI-powered biothreat detection system recognized as Fast Company's World Changing Idea.",
            "He orchestrated major healthcare partnerships applying AI to accelerate drug discovery and healthcare automation.",
            "As an entrepreneur, he co-founded a healthcare startup selected for MIT's Global Entrepreneurship Bootcamp, focusing on predictive AI models for rural healthcare."
        ],
        default: [
            "Siddhartha operates at the nexus of AI research, engineering, and product strategy.",
            "His experience spans from leading Generative AI adoption at Microsoft to co-founding an AI healthcare startup recognized by MIT.",
            "Is there a specific aspect of his expertise in AI innovation or leadership you'd like to explore?"
        ]
    };

    function determineResponseCategory(message) {
        message = message.toLowerCase();
        if (message.includes('microsoft') || message.includes('work') || message.includes('job') || message.includes('career')) {
            return 'microsoft';
        } else if (message.includes('education') || message.includes('mba') || message.includes('insead') || message.includes('study') || message.includes('degree')) {
            return 'education';
        } else if (message.includes('ai') || message.includes('artificial intelligence') || message.includes('tech') || message.includes('research')) {
            return 'ai';
        } else if (message.includes('about') || message.includes('who') || message.includes('background') || message.includes('experience')) {
            return 'about';
        } else if (message.includes('achievement') || message.includes('impact') || message.includes('award') || message.includes('accomplish') || message.includes('project')) {
            return 'achievements';
        } else {
            return 'default';
        }
    }

    async function sendMessage() {
        const message = inputText.value.trim();
        if (message) {
            // Clear input and disable button
            inputText.value = '';
            inputText.style.height = 'auto';
            sendButton.disabled = true;
            
            // Send user message
            await addMessage(message, true);
            
            // Determine response category and select appropriate responses
            const category = determineResponseCategory(message);
            const responses = possibleResponses[category];
            
            // Show responses with natural delays
            await addMessage(responses[0]);
            
            for (let i = 1; i < responses.length; i++) {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 700));
                await addMessage(responses[i]);
            }
        }
    }

    // Enhanced Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    function toggleMenu(shouldOpen) {
        burger?.classList.toggle('active', shouldOpen);
        nav?.classList.toggle('active', shouldOpen);
        
        // Create staggered animation effect for menu items
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1 + 0.2}s`;
            }
        });

        // Prevent body scroll when menu is open
        if (shouldOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    burger?.addEventListener('click', () => {
        toggleMenu(!burger.classList.contains('active'));
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav?.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.burger')) {
            toggleMenu(false);
        }
    });

    // Improved textarea resizing
    if (inputText) {
        const resizeObserver = new ResizeObserver(() => {
            adjustChatHeight();
        });
        resizeObserver.observe(inputText);

        // Auto-resize textarea with smoothness
        inputText.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            sendButton.disabled = !this.value.trim();
        });
    }

    // Scroll to Top Button with smooth animation
    const scrollTopButton = document.querySelector('.scroll-top');

    // Refined smooth scroll with cubic-bezier easing
    function smoothScrollWithEasing(target, duration) {
        const startPosition = window.scrollY;
        const distance = target - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = cubicBezier(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function cubicBezier(t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        }

        requestAnimationFrame(animation);
    }

    // Update scroll handler with enhanced animation
    scrollTopButton?.addEventListener('click', (e) => {
        e.preventDefault();
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            smoothScrollWithEasing(0, 800); // More luxurious 800ms duration
        }
    });

    // Advanced chat height calculation
    function adjustChatHeight() {
        if (chatWindow) {
            // Get viewport height excluding browser UI
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const inputContainerHeight = document.getElementById('input-container').offsetHeight;
            const padding = 30; // More generous padding for luxury feel
            
            // Use custom vh unit for more accurate mobile height
            chatWindow.style.height = `calc((var(--vh, 1vh) * 100) - ${headerHeight + inputContainerHeight + padding}px)`;
        }
    }

    // Listen for various window events to maintain perfect layout
    window.addEventListener('resize', adjustChatHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(adjustChatHeight, 100);
    });
    window.addEventListener('load', adjustChatHeight);

    // Initial height adjustment
    setTimeout(adjustChatHeight, 100);

    // Enhanced touch interactions for mobile menu
    let touchStartY = 0;
    const mobileNav = document.querySelector('.nav-links');

    mobileNav?.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    mobileNav?.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY;

        // If user is scrolling down and menu is at top, close it with a smoother threshold
        if (deltaY > 70) {
            toggleMenu(false);
        }
    }, { passive: true });

    // Auto-focus chat input on mobile after animation with perfect timing
    if (startChatButton) {
        startChatButton.addEventListener('click', () => {
            setTimeout(() => {
                inputText?.focus();
            }, 800); // Wait for animations to complete
        });
    }

    // Add scroll fade effect to chat window
    function updateChatScrollState() {
        if (chatWindow) {
            const isScrolledToTop = chatWindow.scrollTop === 0;
            const isScrolledToBottom = 
                Math.abs(chatWindow.scrollHeight - chatWindow.scrollTop - chatWindow.clientHeight) < 2;
            
            chatWindow.classList.toggle('scrolled-top', !isScrolledToTop);
            chatWindow.classList.toggle('scrolled-bottom', !isScrolledToBottom);
        }
    }

    chatWindow?.addEventListener('scroll', updateChatScrollState);
    window.addEventListener('resize', updateChatScrollState);

    // Update scroll state after messages with improved observer
    const chatWindowObserver = new MutationObserver(updateChatScrollState);
    if (chatWindow) {
        chatWindowObserver.observe(chatWindow, { childList: true, subtree: true });
    }

    // Animated chat transition with luxury timing
    async function startChat() {
        // Fade out introduction with elegance
        introContainer.style.opacity = '0';
        
        // Wait for fade out animation
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Hide intro and show chat
        introContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        
        // Trigger fade in animation
        setTimeout(() => {
            chatContainer.classList.add('visible');
            initializeChat();
            inputText?.focus();
        }, 200);
    }

    // Initialize parallax effect for luxury orb
    document.addEventListener('mousemove', (e) => {
        const luxuryOrb = document.querySelector('.luxury-orb');
        if (luxuryOrb) {
            const x = (e.clientX - window.innerWidth / 2) / 20;
            const y = (e.clientY - window.innerHeight / 2) / 20;
            luxuryOrb.style.transform = `translate(${x}px, calc(-50% + ${y}px))`;
        }
    });

    // Enhance animations for sections as they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('transition-section');
        sectionObserver.observe(section);
    });
});
