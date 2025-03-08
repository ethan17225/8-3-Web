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
  enhanceAccessibility();
  
  // Initialize new interactive sections
  initInspiringWomenGallery();
  initPledgeSystem();
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
 * Initialize quotes display (showing immediately without typing effect)
 */
function initTypingEffects() {
  const typingTexts = document.querySelectorAll('.typing-text');
  const quoteCards = document.querySelectorAll('.quote-card');
  
  // Function to show quotes when they enter the viewport
  const showQuote = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Make quote card visible immediately without typing animation
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };
  
  // Create intersection observer for quotes
  const quoteObserver = new IntersectionObserver(showQuote, { 
    threshold: 0.2
  });
  
  // Remove animation class and observe each quote card
  typingTexts.forEach(text => {
    // Get text from data attribute and display it directly
    const content = text.getAttribute('data-text');
    text.textContent = content;
    text.style.width = '100%'; // Ensure full width immediately
  });
  
  // Observe quote cards for visibility animation only
  quoteCards.forEach(card => {
    quoteObserver.observe(card);
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

/**
 * Enhance accessibility features
 */
function enhanceAccessibility() {
  // Add keyboard navigation for interactive elements
  const interactiveElements = document.querySelectorAll('.btn-surprise, .btn-wish, .share-btn');
  
  interactiveElements.forEach(el => {
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // Add ARIA attributes to dynamic elements
  document.querySelectorAll('.quote-card').forEach((card, index) => {
    card.setAttribute('aria-label', `Quote ${index + 1}`);
  });

  // Add screen reader announcements for toast messages
  const toastElement = document.getElementById('toast');
  toastElement.setAttribute('role', 'status');
  toastElement.setAttribute('aria-live', 'polite');
}

/**
 * Initialize the Inspiring Women Gallery interactive cards
 */
function initInspiringWomenGallery() {
  const womanCards = document.querySelectorAll('.woman-card');
  
  // Add click event for each card
  womanCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.add('flipped');
    });
    
    // Add close button functionality
    const closeBtn = card.querySelector('.close-card');
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click event
      card.classList.remove('flipped');
    });
  });
  
  // Add new nominee button functionality
  const addWomanBtn = document.getElementById('add-woman-btn');
  addWomanBtn.addEventListener('click', function() {
    showNominationForm();
  });
  
  // Load any saved nominations
  loadSavedNominations();
}

/**
 * Show form to nominate an inspiring woman
 */
function showNominationForm() {
  // Create nomination form container
  const formHTML = `
    <div class="nomination-form">
      <button class="close-btn" id="closeNomination"><i class="fas fa-times"></i></button>
      <h3>Nominate an Inspiring Woman</h3>
      <p>Share a woman who inspires you with our community.</p>
      <form id="nominateForm">
        <div class="form-group">
          <label for="nomineeName">Name</label>
          <input type="text" id="nomineeName" required placeholder="Name of inspiring woman">
        </div>
        <div class="form-group">
          <label for="nomineeAchievement">Achievement/Contribution</label>
          <textarea id="nomineeAchievement" required placeholder="What makes her inspiring?"></textarea>
        </div>
        <div class="form-group">
          <label for="nomineeImage">Image URL (optional)</label>
          <input type="url" id="nomineeImage" placeholder="https://example.com/image.jpg">
        </div>
        <button type="submit" class="btn-submit-nomination">Submit Nomination</button>
      </form>
    </div>
  `;
  
  // Create container for the form
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('nomination-modal');
  modalContainer.innerHTML = formHTML;
  
  // Add to page and show
  document.body.appendChild(modalContainer);
  document.getElementById('overlay').classList.add('visible');
  
  // Animation to show form
  gsap.fromTo(modalContainer, {
    opacity: 0,
    y: 20
  }, {
    opacity: 1,
    y: 0,
    duration: 0.5
  });
  
  // Close button functionality
  document.getElementById('closeNomination').addEventListener('click', closeNominationForm);
  document.getElementById('overlay').addEventListener('click', closeNominationForm);
  
  // Form submission
  document.getElementById('nominateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('nomineeName').value;
    const achievement = document.getElementById('nomineeAchievement').value;
    const imageUrl = document.getElementById('nomineeImage').value || 'https://place-hold.it/400x300/e6e6fa/6a5acd?text=Inspiring+Woman&bold=true';
    
    // Create new woman card
    addNewWomanCard(name, achievement, imageUrl);
    
    showToast(`Thank you for nominating ${name}! Your nomination has been added.`);
    triggerSmallConfetti();
    closeNominationForm();
  });
  
  /**
   * Close nomination form
   */
  function closeNominationForm() {
    gsap.to(modalContainer, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        modalContainer.remove();
        document.getElementById('overlay').classList.remove('visible');
      }
    });
  }
}

/**
 * Add a new woman card to the gallery from nomination
 */
function addNewWomanCard(name, achievement, imageUrl) {
  // Generate unique ID for the card
  const cardId = 'nominated-' + Date.now();
  
  // Create the HTML for the new card
  const cardHTML = `
    <div class="woman-card" data-id="${cardId}">
      <div class="card-front">
        <img src="${imageUrl}" alt="${name}">
        <h3>${name}</h3>
        <span class="card-hint">Click to learn more</span>
      </div>
      <div class="card-back">
        <button class="close-card"><i class="fas fa-times"></i></button>
        <h3>${name}</h3>
        <p>${achievement}</p>
        <div class="achievement-tags">
          <span class="tag">Community Nomination</span>
        </div>
      </div>
    </div>
  `;
  
  // Create DOM element from HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cardHTML.trim();
  const newCard = tempDiv.firstChild;
  
  // Get the gallery container
  const womenGallery = document.querySelector('.women-gallery');
  
  // Add the new card at the beginning
  womenGallery.prepend(newCard);
  
  // Add event listeners to the new card
  newCard.addEventListener('click', function() {
    this.classList.add('flipped');
  });
  
  const closeBtn = newCard.querySelector('.close-card');
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent card click event
    newCard.classList.remove('flipped');
  });
  
  // Animate the new card
  gsap.fromTo(newCard, 
    {scale: 0.8, opacity: 0}, 
    {scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)"}
  );
  
  // Save nominations to localStorage
  saveNomination(cardId, name, achievement, imageUrl);
}

/**
 * Save nomination to localStorage to persist between sessions
 */
function saveNomination(id, name, achievement, imageUrl) {
  // Get existing nominations or initialize empty array
  const nominations = JSON.parse(localStorage.getItem('nominations')) || [];
  
  // Add new nomination
  nominations.push({
    id: id,
    name: name,
    achievement: achievement,
    imageUrl: imageUrl,
    date: new Date().toISOString()
  });
  
  // Save back to localStorage
  localStorage.setItem('nominations', JSON.stringify(nominations));
}

/**
 * Load existing nominations from localStorage on page load
 */
function loadSavedNominations() {
  const nominations = JSON.parse(localStorage.getItem('nominations')) || [];
  
  // Create a card for each saved nomination
  nominations.forEach(nomination => {
    addNewWomanCard(nomination.name, nomination.achievement, nomination.imageUrl);
  });
}

/**
 * Initialize the Pledge System
 */
function initPledgeSystem() {
  const pledgeButtons = document.querySelectorAll('.btn-pledge-action');
  const pledgesList = document.getElementById('pledges-list');
  const myPledgesSection = document.getElementById('my-pledges');
  const pledgeCountElement = document.getElementById('pledge-count');
  const sharePledgesButton = document.getElementById('share-pledges');
  
  // Initial pledge count from localStorage or default to random number for social proof
  let totalPledges = localStorage.getItem('totalPledges') || Math.floor(Math.random() * 50) + 100;
  pledgeCountElement.textContent = totalPledges;
  
  // Get user pledges from localStorage
  const userPledges = JSON.parse(localStorage.getItem('userPledges')) || [];
  
  // If user has previous pledges, restore them
  if (userPledges.length > 0) {
    myPledgesSection.classList.remove('hidden');
    
    // Mark pledged cards and populate the list
    userPledges.forEach(pledge => {
      const pledgeCard = document.querySelector(`.pledge-card[data-pledge="${pledge.id}"]`);
      if (pledgeCard) {
        pledgeCard.classList.add('pledged');
        addPledgeToList(pledge.text);
      }
    });
  }
  
  // Handle pledge button clicks
  pledgeButtons.forEach(button => {
    const pledgeCard = button.closest('.pledge-card');
    const pledgeId = pledgeCard.dataset.pledge;
    const pledgeText = pledgeCard.querySelector('h3').textContent;
    
    // Check if already pledged
    if (userPledges.some(p => p.id === pledgeId)) {
      pledgeCard.classList.add('pledged');
    }
    
    button.addEventListener('click', function() {
      // Only allow if not already pledged
      if (!pledgeCard.classList.contains('pledged')) {
        // Add to pledged cards
        pledgeCard.classList.add('pledged');
        
        // Increment counter
        totalPledges++;
        pledgeCountElement.textContent = totalPledges;
        localStorage.setItem('totalPledges', totalPledges);
        
        // Add visual indication with counter animation
        gsap.fromTo(pledgeCountElement, 
          {scale: 1.2, color: 'var(--primary)'}, 
          {scale: 1, color: 'var(--accent)', duration: 0.8}
        );
        
        // Add to user pledges
        userPledges.push({id: pledgeId, text: pledgeText});
        localStorage.setItem('userPledges', JSON.stringify(userPledges));
        
        // Show pledges list if first pledge
        if (userPledges.length === 1) {
          myPledgesSection.classList.remove('hidden');
        }
        
        // Add to list 
        addPledgeToList(pledgeText);
        
        // Show confirmation
        showToast('Thank you for your pledge!');
        triggerSmallConfetti();
      }
    });
  });
  
  // Share pledges functionality
  sharePledgesButton.addEventListener('click', function() {
    const pledgeText = userPledges.map(p => p.text).join(", ");
    const shareText = encodeURIComponent(`For International Women's Day, I've pledged to: ${pledgeText}. Make your pledge too!`);
    const shareUrl = encodeURIComponent(window.location.href);
    
    // Open share dialog
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, 'Share Your Pledges', 'width=600,height=400');
    
    showToast('Thank you for sharing your pledges!');
    triggerSmallConfetti();
  });
  
  /**
   * Add pledge to the user's pledges list
   */
  function addPledgeToList(text) {
    const listItem = document.createElement('li');
    listItem.textContent = text;
    pledgesList.appendChild(listItem);
    
    // Animate the new item
    gsap.fromTo(listItem, 
      {opacity: 0, x: -20}, 
      {opacity: 1, x: 0, duration: 0.5}
    );
  }
}
