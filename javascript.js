// Pinterest Blogging Course Landing Page JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initScrollAnimations();
    initParallaxEffects();
    initMobileMenu();
    initHeaderScroll();
    initFormEnhancements();
    initPerformanceOptimizations();
    initAccessibilityFeatures();
});

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
                
                // Focus management for accessibility
                targetElement.focus();
                targetElement.setAttribute('tabindex', '-1');
            }
        });
    });
}

// Scroll-triggered Animations using Intersection Observer
function initScrollAnimations() {
    // Animation options
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('animate');
                    
                    // Trigger staggered animations for child elements
                    if (element.classList.contains('benefits-grid')) {
                        staggerChildAnimations(element, '.benefit-item', 200);
                    }
                    
                    if (element.classList.contains('clients-grid')) {
                        staggerChildAnimations(element, '.client-item', 150);
                    }
                    
                    if (element.classList.contains('module-preview')) {
                        staggerChildAnimations(element, '.module-item', 300);
                    }
                }, delay);
                
                // Unobserve after animation to improve performance
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animation elements
    const animationElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .fade-in-bottom');
    animationElements.forEach(el => observer.observe(el));
}

// Staggered animations for child elements
function staggerChildAnimations(parent, childSelector, delay) {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate');
        }, index * delay);
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length === 0) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle aria-expanded
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle mobile menu
        navLinks.classList.toggle('mobile-menu-open');
        
        // Animate hamburger lines
        const lines = this.querySelectorAll('.hamburger-line');
        lines.forEach((line, index) => {
            line.style.transform = !isExpanded ? getHamburgerTransform(index) : '';
        });
    });
    
    // Close mobile menu when clicking on links
    const mobileLinks = navLinks.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-menu-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            
            const lines = mobileToggle.querySelectorAll('.hamburger-line');
            lines.forEach(line => {
                line.style.transform = '';
            });
        });
    });
}

// Hamburger animation transforms
function getHamburgerTransform(index) {
    const transforms = [
        'rotate(45deg) translate(5px, 5px)',
        'opacity: 0',
        'rotate(-45deg) translate(7px, -6px)'
    ];
    return transforms[index];
}

// Header Scroll Effects
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestHeaderTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestHeaderTick, { passive: true });
}

// Form Enhancements
function initFormEnhancements() {
    const enrollmentForm = document.querySelector('.enrollment-form');
    
    if (enrollmentForm) {
        // Add loading state
        enrollmentForm.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transition = 'opacity 0.5s ease';
        });
        
        // Handle form submission feedback
        enrollmentForm.addEventListener('submit', function() {
            showFormFeedback('Thank you for your enrollment! We will contact you soon.');
        });
    }
    
    // Enhanced button interactions
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
    
    // Contact button enhancements
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track button clicks for analytics
            trackButtonClick(this.textContent.trim());
        });
    });
}

// Show form feedback message
function showFormFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #0073e6;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 115, 230, 0.3);
        z-index: 10000;
        animation: fadeInScale 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'fadeOutScale 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 3000);
}

// Create ripple effect on button click
function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'https://i.postimg.cc/xTx655F8/Untitled-design-1.png',
        'https://i.postimg.cc/k4sQ4M0G/Untitled-design-2.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Optimize scroll performance
function optimizeScrollPerformance() {
    let scrollTimer = null;
    
    window.addEventListener('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        
        scrollTimer = setTimeout(function() {
            // Scroll ended - perform any cleanup
            document.body.classList.remove('scrolling');
        }, 150);
        
        document.body.classList.add('scrolling');
    }, { passive: true });
}

// Accessibility Features
function initAccessibilityFeatures() {
    // Keyboard navigation enhancements
    document.addEventListener('keydown', function(e) {
        // Skip to main content with Ctrl+/
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.nav-links.mobile-menu-open');
            if (mobileMenu) {
                mobileMenu.classList.remove('mobile-menu-open');
                const toggle = document.querySelector('.mobile-menu-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            }
        }
    });
    
    // Focus management for dynamic content
    manageFocusForAnimations();
    
    // Announce page changes to screen readers
    announcePageChanges();
    
    // Respect user preferences
    respectUserPreferences();
}

// Manage focus for animated elements
function manageFocusForAnimations() {
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            // Ensure focused element is visible
            if (!isElementInViewport(this)) {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

// Check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Announce page changes to screen readers
function announcePageChanges() {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
    
    // Announce section changes during scroll
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionTitle = entry.target.querySelector('h2');
                if (sectionTitle) {
                    announcer.textContent = `Now viewing: ${sectionTitle.textContent}`;
                }
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => sectionObserver.observe(section));
}

// Respect user preferences
function respectUserPreferences() {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(e) {
        if (e.matches) {
            document.body.classList.add('reduce-motion');
            // Disable complex animations
            disableComplexAnimations();
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }
    
    prefersReducedMotion.addListener(handleReducedMotion);
    handleReducedMotion(prefersReducedMotion);
    
    // Respect high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    function handleHighContrast(e) {
        if (e.matches) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    prefersHighContrast.addListener(handleHighContrast);
    handleHighContrast(prefersHighContrast);
}

// Disable complex animations for reduced motion
function disableComplexAnimations() {
    const complexAnimations = document.querySelectorAll('.floating-element, .pulse-glow, .floating-bounce');
    complexAnimations.forEach(element => {
        element.style.animation = 'none';
    });
}

// Track button clicks for analytics
function trackButtonClick(buttonText) {
    // This would integrate with your analytics service
    console.log(`Button clicked: ${buttonText}`);
    
    // Example: Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'engagement',
            event_label: buttonText
        });
    }
}

// Utility function to debounce function calls
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

// Utility function to throttle function calls
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes fadeOutScale {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
    
    .scrolling * {
        pointer-events: none;
    }
    
    .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .high-contrast .cta-button {
        border: 2px solid currentColor;
    }
    
    .mobile-menu-open {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-radius: 0 0 15px 15px;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-open .nav-link {
            padding: 1rem 0;
            border-bottom: 1px solid rgba(0, 115, 230, 0.1);
        }
        
        .mobile-menu-open .nav-link:last-child {
            border-bottom: none;
        }
    }
`;
document.head.appendChild(style);

// Initialize error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to monitoring service
});

// Initialize performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

