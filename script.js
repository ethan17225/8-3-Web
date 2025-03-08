// Global variables

/**
 * Initialize the page when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Setup interactive elements
  setupInteractiveElements();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize new interactive features
  initMouseSparkles();
  initTypingEffects();
  initParallaxEffects();
  initWishesForm();
  initSocialSharing();
});

/**
 * Set up all interactive elements on the page
 */
function setupInteractiveElements() {
  const surpriseButton = document.getElementById('surpriseButton');
  const surpriseMessage = document.getElementById('surpriseMessage');
  const closeBtn = document.getElementById('closeMessage');
  const overlay = document.getElementById('overlay');
  
  // Surprise button click handler
  surpriseButton.addEventListener('click', function() {
    surpriseMessage.classList.remove('hidden');
    surpriseMessage.classList.add('visible');
    overlay.classList.add('visible');
    
    // Trigger confetti effect
    triggerConfetti();
  });
  
  // Close message button handler
  closeBtn.addEventListener('click', function() {
    surpriseMessage.classList.remove('visible');
    overlay.classList.remove('visible');
    
    // Hide the message after transition ends
    setTimeout(() => {
      surpriseMessage.classList.add('hidden');
    }, 500);
  });
  
  // Close on overlay click
  overlay.addEventListener('click', function() {
    surpriseMessage.classList.remove('visible');
    overlay.classList.remove('visible');
    
    setTimeout(() => {
      surpriseMessage.classList.add('hidden');
    }, 500);
  });
}

/**
 * Create a confetti effect using the canvas-confetti library
 */
function triggerConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  
  // Launch multiple bursts of confetti
  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#ff6b95', '#ff9a8b', '#6a5acd', '#ffd1dc', '#ffc6e5']
    });
    
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#ff6b95', '#ff9a8b', '#6a5acd', '#ffd1dc', '#ffc6e5']
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

/**
 * Initialize animations triggered by scrolling
 */
function initScrollAnimations() {
  // Detect when elements enter viewport and animate them
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  
  // Observe quote cards for scroll animations
  const quoteCards = document.querySelectorAll('.quote-card');
  quoteCards.forEach(card => {
    observer.observe(card);
  });
}

/**
 * Create mouse follow sparkle effect
 */
function initMouseSparkles() {
  const sparklesContainer = document.getElementById('sparkles-container');
  let sparkleTimeout;
  
  // Create a sparkle at mouse position
  document.addEventListener('mousemove', function(e) {
    if (sparkleTimeout) return; // Limit rate of sparkle creation
    
    sparkleTimeout = setTimeout(() => {
      sparkleTimeout = null;
    }, 50);
    
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    // Random size and rotation
    const size = Math.random() * 8 + 6;
    const rotation = Math.random() * 360;
    
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${e.clientX - size/2}px`;
    sparkle.style.top = `${e.clientY - size/2}px`;
    sparkle.style.transform = `rotate(${rotation}deg)`;
    
    sparklesContainer.appendChild(sparkle);
    
    // Animate and remove sparkle
    gsap.to(sparkle, {
      duration: 1,
      opacity: 0,
      scale: 0,
      onComplete: () => {
        sparkle.remove();
      }
    });
  });
}

/**
 * Initialize typing effects for quotes
 */
function initTypingEffects() {
  const typingTexts = document.querySelectorAll('.typing-text');
  
  // Function to start typing animation when element is in view
  const startTyping = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Instead of adding the class immediately, add a slight delay between quotes
        const index = Array.from(typingTexts).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('typing');
        }, index * 300); // Stagger animation start
        observer.unobserve(entry.target);
      }
    });
  };
  
  // Create intersection observer for typing effects
  const typingObserver = new IntersectionObserver(startTyping, { 
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px' // Trigger slightly earlier
  });
  
  // Get text from data-text attribute and observe each element
  typingTexts.forEach(text => {
    // Store text in data attribute but clear content
    const content = text.getAttribute('data-text');
    text.textContent = content;
    text.style.width = '0'; // Ensure text starts hidden
    typingObserver.observe(text);
  });
}

/**
 * Add parallax scrolling effects
 */
function initParallaxEffects() {
  // Parallax for header elements
  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    
    // Parallax for header
    const header = document.querySelector('header h1');
    if (header) {
      header.style.transform = `translateY(${scrollPosition * 0.2}px)`;
    }
    
    // Parallax for flowers
    const flowers = document.querySelectorAll('.flower');
    flowers.forEach((flower, index) => {
      const speed = 0.05 * (index + 1);
      flower.style.transform = `translateY(${scrollPosition * speed}px) rotate(${scrollPosition * 0.05}deg)`;
    });
  });
}

/**
 * Initialize wishes form functionality
 */
function initWishesForm() {
  const wishText = document.getElementById('wishMessage');
  const charCounter = document.querySelector('.char-counter');
  const submitBtn = document.getElementById('submitWish');
  const wishesDisplay = document.getElementById('wishesDisplay');
  
  // Character counter
  wishText.addEventListener('input', function() {
    const count = this.value.length;
    charCounter.textContent = `${count}/200`;
    
    // Visual feedback when approaching limit
    if (count > 180) {
      charCounter.style.color = '#ff6b95';
    } else {
      charCounter.style.color = '#777';
    }
  });
  
  // Submit wish
  submitBtn.addEventListener('click', function() {
    const message = wishText.value.trim();
    if (message) {
      addWish(message);
      wishText.value = '';
      charCounter.textContent = '0/200';
      showToast('Your message has been shared! 🎉');
    } else {
      showToast('Please write a message first');
    }
  });
  
  // Add some sample wishes to start
  setTimeout(() => {
    addWish('Happy Women\'s Day to all the incredible women who inspire us daily!');
    addWish('To my mom, sister, and all women in my life - thank you for your strength and love!');
    addWish('Celebrating the achievements and resilience of women everywhere!');
  }, 1000);
  
  /**
   * Add a wish to the display
   */
  function addWish(message) {
    const wishCard = document.createElement('div');
    wishCard.classList.add('wish-card');
    
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    wishCard.innerHTML = `
      <p class="wish-text">${message}</p>
      <p class="wish-date">${formattedDate}</p>
    `;
    
    wishesDisplay.prepend(wishCard);
    
    // Trigger animation after a tiny delay
    setTimeout(() => {
      wishCard.classList.add('visible');
    }, 10);
  }
}

/**
 * Show toast notification
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  
  // Animate the toast notification
  gsap.to(toast, {
    duration: 0.5,
    y: -100,
    opacity: 1,
    onComplete: () => {
      setTimeout(() => {
        gsap.to(toast, {
          duration: 0.5,
          y: 0,
          opacity: 0
        });
      }, 2000);
    }
  });
}

/**
 * Initialize social sharing functionality
 */
function initSocialSharing() {
  const shareButtons = document.querySelectorAll('.share-btn');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', function() {
      const platform = this.dataset.platform;
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('Celebrating International Women\'s Day! Check out this beautiful tribute.');
      
      let shareUrl;
      
      switch(platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${text} ${url}`;
          break;
      }
      
      // Open a popup window for sharing
      if (shareUrl) {
        window.open(shareUrl, 'Share', 'width=600,height=400');
        triggerSmallConfetti();
        showToast('Thanks for sharing! ❤️');
      }
    });
  });
}

/**
 * Smaller confetti burst for secondary actions
 */
function triggerSmallConfetti() {
  confetti({
    particleCount: 30,
    spread: 70,
    origin: { y: 0.9 },
    colors: ['#ff6b95', '#ff9a8b', '#6a5acd']
  });
}
