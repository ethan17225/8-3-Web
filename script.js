document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            hamburger.classList.toggle('active');
            
            if (hamburger.classList.contains('active')) {
                hamburger.querySelector('span:first-child').style.transform = 'rotate(45deg) translate(5px, 6px)';
                hamburger.querySelector('span:nth-child(2)').style.opacity = '0';
                hamburger.querySelector('span:last-child').style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                hamburger.querySelector('span:first-child').style.transform = 'none';
                hamburger.querySelector('span:nth-child(2)').style.opacity = '1';
                hamburger.querySelector('span:last-child').style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                hamburger.querySelector('span:first-child').style.transform = 'none';
                hamburger.querySelector('span:nth-child(2)').style.opacity = '1';
                hamburger.querySelector('span:last-child').style.transform = 'none';
            }
        });
    });
    
    // Testimonial Carousel
    const quotes = document.querySelectorAll('.quote');
    const dots = document.querySelectorAll('.dot');
    let currentQuote = 0;
    
    function changeQuote(n) {
        // Hide all quotes and remove active class from dots
        for (let i = 0; i < quotes.length; i++) {
            quotes[i].classList.remove('active');
            dots[i].classList.remove('active');
        }
        
        // Show the selected quote and activate the corresponding dot
        currentQuote = (n + quotes.length) % quotes.length;
        quotes[currentQuote].classList.add('active');
        dots[currentQuote].classList.add('active');
    }
    
    // Auto rotate quotes every 5 seconds
    let quoteInterval = setInterval(() => {
        changeQuote(currentQuote + 1);
    }, 5000);
    
    // Add click event to dots for manual navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(quoteInterval); // Stop auto rotation when manually clicked
            changeQuote(index);
            
            // Restart auto rotation
            quoteInterval = setInterval(() => {
                changeQuote(currentQuote + 1);
            }, 5000);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect - add shadow and reduce padding
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Add animation to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            ctaButton.style.transform = 'translateY(-5px)';
        });
        
        ctaButton.addEventListener('mouseleave', () => {
            ctaButton.style.transform = 'translateY(0)';
        });
        
        ctaButton.addEventListener('click', () => {
            alert('Thank you for your interest in International Women\'s Day 2025! Join us in celebrating women\'s achievements worldwide.');
        });
    }
});
