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
  initTimelineSection();
  initWomenInTech(); // Add new section initialization
  initPostcardCreator();
  initWomensAchievementsQuiz(); // Add new quiz initialization
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

/**
 * Initialize the interactive timeline section
 */
function initTimelineSection() {
  // Timeline data
  const timelineEvents = [
    {
      year: 1848,
      title: "Seneca Falls Convention",
      description: "The first women's rights convention in the United States, marking the beginning of the organized women's rights movement.",
      detail: "The Seneca Falls Convention was the first women's rights convention held in the United States. It was organized by local New York women upon the occasion of a visit by Philadelphia-based Lucretia Mott. The convention resulted in the Declaration of Sentiments, modeled after the Declaration of Independence, which stated: 'We hold these truths to be self-evident: that all men and women are created equal...'"
    },
    {
      year: 1893,
      title: "First Country with Women's Suffrage",
      description: "New Zealand became the first nation to grant women the right to vote.",
      detail: "New Zealand was the first self-governing country to grant women the right to vote in parliamentary elections. The Electoral Act 1893 was passed by both houses of the General Assembly and became law on 19 September 1893. Women voted for the first time in a general election on 28 November 1893."
    },
    {
      year: 1908,
      title: "First International Women's Day",
      description: "First observed in the United States to honor the 1908 garment workers' strike in New York.",
      detail: "The first National Woman's Day was observed in the United States on February 28, 1909, in honor of the 1908 garment workers' strike in New York where women protested against harsh working conditions. The first International Women's Day was observed on March 19, 1911, in Austria, Denmark, Germany and Switzerland."
    },
    {
      year: 1920,
      title: "19th Amendment",
      description: "Women gained the right to vote in the United States with the ratification of the 19th Amendment.",
      detail: "The 19th Amendment to the U.S. Constitution granted American women the right to vote, a right known as women's suffrage. The amendment was first introduced to Congress in 1878. It was not until August 18, 1920, that it was ratified and women could vote in the 1920 election."
    },
    {
      year: 1963,
      title: "Equal Pay Act",
      description: "The United States passed the Equal Pay Act to prohibit sex-based wage discrimination.",
      detail: "The Equal Pay Act of 1963 is a federal law that amended the Fair Labor Standards Act, aimed at abolishing wage disparity based on sex. It was signed into law on June 10, 1963, by President John F. Kennedy as part of his New Frontier Program."
    },
    {
      year: 1979,
      title: "CEDAW Adoption",
      description: "The UN General Assembly adopted the Convention on the Elimination of All Forms of Discrimination against Women.",
      detail: "The Convention on the Elimination of All Forms of Discrimination Against Women (CEDAW) is an international treaty adopted by the UN General Assembly. Described as an international bill of rights for women, it was instituted on December 18, 1979, and has been ratified by 189 countries."
    },
    {
      year: 1995,
      title: "Beijing Declaration",
      description: "The Beijing Platform for Action was adopted at the Fourth World Conference on Women.",
      detail: "The Beijing Declaration and Platform for Action was adopted unanimously by 189 countries at the Fourth World Conference on Women in 1995. It is considered the most progressive blueprint for advancing women's rights. The Platform for Action imagined a world where each woman and girl can exercise her freedoms and choices, and realize all her rights."
    },
    {
      year: 2011,
      title: "UN Women Established",
      description: "UN Women was formed to accelerate progress on meeting the needs of women worldwide.",
      detail: "UN Women, the United Nations Entity for Gender Equality and the Empowerment of Women, was established in July 2010 and became operational in January 2011. It was created by the UN General Assembly to accelerate progress on meeting the needs of women worldwide."
    },
    {
      year: 2014,
      title: "Malala Wins Nobel Peace Prize",
      description: "Malala Yousafzai became the youngest Nobel Prize laureate for her advocacy of education for girls.",
      detail: "At age 17, Malala Yousafzai was awarded the Nobel Peace Prize, becoming the youngest Nobel laureate. She was recognized for her struggle against the suppression of children and young people and for the right of all children to education. Malala survived a targeted assassination attempt by Taliban gunmen in 2012 after becoming a prominent advocate for girls' education."
    },
    {
      year: 2023,
      title: "Narrowing Gender Gaps",
      description: "Continued progress in reducing gender disparities in education, employment, and leadership.",
      detail: "By 2023, significant progress had been made in narrowing gender gaps worldwide, though challenges remain. According to the Global Gender Gap Report, educational attainment gaps were close to being closed in many countries. Women's representation in leadership positions has increased, with more women in political office and corporate leadership than ever before, though parity is still a distant goal."
    }
  ];
  
  // Create timeline elements
  const timelineTrack = document.querySelector('.timeline-track');
  const prevButton = document.querySelector('.timeline-arrow.prev-arrow');
  const nextButton = document.querySelector('.timeline-arrow.next-arrow');
  const detailView = document.querySelector('.timeline-detail-view');
  const detailContent = document.querySelector('.detail-content');
  const closeDetail = document.querySelector('.close-detail');
  
  let currentPosition = 0;
  let eventsPerView = calculateEventsPerView();
  
  // Add event listeners for window resize to recalculate events per view
  window.addEventListener('resize', () => {
    const newEventsPerView = calculateEventsPerView();
    if (eventsPerView !== newEventsPerView) {
      eventsPerView = newEventsPerView;
      updateTimelineNavigation();
    }
  });
  
  // Render timeline events
  timelineEvents.forEach((event, index) => {
    const eventElement = createTimelineEvent(event, index);
    timelineTrack.appendChild(eventElement);
  });
  
  // Add click event to close detail view
  closeDetail.addEventListener('click', () => {
    detailView.classList.remove('visible');
    setTimeout(() => {
      detailView.classList.add('hidden');
    }, 500);
  });
  
  // Add click events to navigation buttons
  prevButton.addEventListener('click', () => {
    if (currentPosition > 0) {
      currentPosition--;
      updateTimelinePosition();
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (currentPosition < timelineEvents.length - eventsPerView) {
      currentPosition++;
      updateTimelinePosition();
    }
  });
  
  // Initial timeline position update
  updateTimelinePosition();
  
  // Show 1848 event by default
  if (timelineEvents.length > 0) {
    showEventDetail(timelineEvents[0]);
    // Mark the first timeline point as selected
    const firstEvent = document.querySelector('.timeline-event');
    if (firstEvent) {
      firstEvent.querySelector('.timeline-point').classList.add('selected');
    }
  }
  
  /**
   * Create a timeline event element
   */
  function createTimelineEvent(event, index) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('timeline-event');
    eventElement.innerHTML = `
      <div class="timeline-point"></div>
      <div class="timeline-year">${event.year}</div>
      <div class="timeline-title">${event.title}</div>
    `;
    
    eventElement.addEventListener('click', () => {
      // Remove selected class from all timeline points
      document.querySelectorAll('.timeline-point').forEach(point => {
        point.classList.remove('selected');
      });
      
      // Add selected class to the clicked timeline point
      eventElement.querySelector('.timeline-point').classList.add('selected');
      
      showEventDetail(event);
    });
    
    return eventElement;
  }
  
  /**
   * Show detailed information about a timeline event
   */
  function showEventDetail(event) {
    detailContent.innerHTML = `
      <h3>${event.title}</h3>
      <h4>${event.year}</h4>
      <p>${event.detail}</p>
    `;
    
    detailView.classList.remove('hidden');
    
    // Use setTimeout to ensure the transition works properly
    setTimeout(() => {
      detailView.classList.add('visible');
    }, 10);
    
    // Smooth scroll to detail view
    detailView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  /**
   * Update the timeline position based on current position
   */
  function updateTimelinePosition() {
    const translateX = -currentPosition * 230; // 180px width + 50px margin
    timelineTrack.style.transform = `translateX(${translateX}px)`;
    updateTimelineNavigation();
  }
  
  /**
   * Update timeline navigation buttons (enable/disable)
   */
  function updateTimelineNavigation() {
    prevButton.classList.toggle('disabled', currentPosition === 0);
    nextButton.classList.toggle('disabled', currentPosition >= timelineEvents.length - eventsPerView);
  }
  
  /**
   * Calculate how many events can be displayed in the viewport
   */
  function calculateEventsPerView() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 600) return 2;
    if (viewportWidth < 900) return 3;
    return 4;
  }
}

/**
 * Initialize the virtual postcard creator
 */
function initPostcardCreator() {
  // Get all required elements directly
  const postcardCanvas = document.getElementById('postcardCanvas');
  const postcardGreeting = document.getElementById('postcardGreeting');
  const postcardMessage = document.getElementById('postcardMessage');
  const postcardSignature = document.getElementById('postcardSignature');
  
  // Get the input elements
  const greetingInput = document.getElementById('greeting');
  const messageInput = document.getElementById('message'); 
  const signatureInput = document.getElementById('signature');
  
  // Debug logging to identify the issue
  console.log('Postcard elements:', { 
    canvas: postcardCanvas, 
    greeting: postcardGreeting, 
    message: postcardMessage, 
    signature: postcardSignature 
  });
  
  // Set default values
  const defaultGreeting = "Happy Women's Day!";
  const defaultMessage = "Thank you for being an inspiration.";
  const defaultSignature = "With love";

  // Only proceed if the necessary elements exist
  if (!postcardMessage) {
    console.warn("Postcard message element not found. Check HTML structure.");
    return; // Exit early if critical elements aren't found
  }
  
  // Initialize input values if they're empty
  if (greetingInput && !greetingInput.value) {
    greetingInput.value = defaultGreeting;
  }
  
  if (messageInput && !messageInput.value) {
    messageInput.value = defaultMessage;
    console.log('Set default message in input field:', defaultMessage);
  }
  
  if (signatureInput && !signatureInput.value) {
    signatureInput.value = defaultSignature;
  }

  // Initialize the text content with the values from inputs
  if (postcardGreeting) postcardGreeting.textContent = greetingInput ? greetingInput.value : defaultGreeting;
  if (postcardMessage) postcardMessage.textContent = messageInput ? messageInput.value : defaultMessage;
  if (postcardSignature) postcardSignature.textContent = signatureInput ? signatureInput.value : defaultSignature;

  console.log('Initial message from input:', messageInput ? messageInput.value : 'none');
  console.log('Initial message in card:', postcardMessage ? postcardMessage.textContent : 'none');

  // First, clear any existing event listeners
  if (greetingInput) {
    greetingInput.oninput = null;
    greetingInput.onchange = null;
    greetingInput.onkeyup = null;
  }

  if (messageInput) {
    messageInput.oninput = null;
    messageInput.onchange = null;
    messageInput.onkeyup = null;
  }

  if (signatureInput) {
    signatureInput.oninput = null;
    signatureInput.onchange = null;
    signatureInput.onkeyup = null;
  }

  // Then add direct event handlers (more reliable than addEventListener)
  if (greetingInput && postcardGreeting) {
    greetingInput.oninput = function() {
      postcardGreeting.textContent = this.value || defaultGreeting;
    };
  }

  if (messageInput && postcardMessage) {
    messageInput.oninput = function() {
      postcardMessage.textContent = this.value || defaultMessage;
    };
  }

  if (signatureInput && postcardSignature) {
    signatureInput.oninput = function() {
      postcardSignature.textContent = this.value || defaultSignature;
    };
  }
  
  // Set up background selector
  const bgOptions = document.querySelectorAll('.bg-option');
  const postcardBg = document.querySelector('.postcard-bg');
  bgOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      bgOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to selected option
      this.classList.add('active');
      
      // Update postcard background
      const bgId = this.getAttribute('data-bg');
      postcardBg.setAttribute('data-bg', bgId);
    });
  });
  
  // Gallery view toggle
  const viewGalleryButton = document.getElementById('viewGallery');
  const closeGalleryButton = document.querySelector('.btn-close-gallery');
  const postcardGallery = document.querySelector('.postcard-gallery');
  if (viewGalleryButton && closeGalleryButton && postcardGallery) {
    viewGalleryButton.addEventListener('click', function() {
      postcardGallery.classList.remove('hidden');
    });
    
    closeGalleryButton.addEventListener('click', function() {
      postcardGallery.classList.add('hidden');
    });
  }
  
  // Share functionality
  const shareButton = document.getElementById('shareCard');
  if (shareButton) {
    shareButton.addEventListener('click', function() {
      // Get current postcard data
      const cardData = {
        greeting: postcardGreeting.textContent,
        message: postcardMessage.textContent,
        signature: postcardSignature.textContent,
        bg: postcardBg.getAttribute('data-bg')
      };
      
      // Add to gallery
      addCardToGallery(cardData);
      
      // Save to localStorage
      saveCardToLocalStorage(cardData);
      
      showToast("Card shared to community gallery!");
      triggerSmallConfetti();
    });
  }
  
  // Download functionality
  const downloadButton = document.getElementById('downloadCard');
  if (downloadButton) {
    downloadButton.addEventListener('click', function() {
      showToast("Preparing your card...");
      
      // Create a canvas directly
      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = 600;
      cardCanvas.height = 400;
      const ctx = cardCanvas.getContext('2d');
      
      // Draw background
      const bgId = postcardBg.getAttribute('data-bg');
      switch (bgId) {
        case "1": ctx.fillStyle = "#ffdee9"; break;
        case "2": ctx.fillStyle = "#ff9a9e"; break;
        case "3": ctx.fillStyle = "#a1c4fd"; break;
        case "4": ctx.fillStyle = "#d4fc79"; break;
        default:  ctx.fillStyle = "#ffdee9";
      }
      ctx.fillRect(0, 0, 600, 400);
      
      // Draw text
      ctx.fillStyle = "#333333";
      
      // Draw greeting
      ctx.font = "bold 40px 'Arial'";
      ctx.textAlign = "center";
      ctx.fillText(postcardGreeting.textContent || defaultGreeting, 300, 80);
      
      // Draw message (multi-line)
      ctx.font = "18px 'Arial'";
      const messageText = postcardMessage.textContent || defaultMessage;
      const messageLines = wrapText(ctx, messageText, 500);
      let y = 180;
      messageLines.forEach(line => {
        ctx.fillText(line, 300, y);
        y += 30;
      });
      
      // Draw signature
      ctx.font = "italic 24px 'Arial'";
      ctx.textAlign = "right";
      ctx.fillText(postcardSignature.textContent || defaultSignature, 500, 350);
      
      // Download the image
      try {
        const link = document.createElement('a');
        link.download = 'womens-day-card.png';
        link.href = cardCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Card downloaded!");
        triggerSmallConfetti();
      } catch (error) {
        console.error("Download error:", error);
        showToast("Sorry, couldn't download the card. Please try again.");
      }
    });
  }
  
  // Helper function to wrap text
  function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
  
  // Load saved cards from localStorage
  loadSavedCards();
  
  /**
   * Add a card to the community gallery
   */
  function addCardToGallery(cardData) {
    const communityCards = document.getElementById('communityCards');
    if (!communityCards) return;
  
    // Create card element
    const cardElement = document.createElement('div');
    cardElement.classList.add('gallery-card');
    
    // Set card background
    const bgClass = `postcard-bg[data-bg="${cardData.bg}"]`;
    cardElement.innerHTML = `
      <div class="gallery-bg" data-bg="${cardData.bg}"></div>
      <div class="gallery-text">
        <h4>${cardData.greeting}</h4>
        <p>${cardData.message}</p>
        <p class="gallery-signature">${cardData.signature}</p>
      </div>
    `;
    
    // Apply background style based on the bg attribute
    const bgElement = cardElement.querySelector('.gallery-bg');
    
    switch(cardData.bg) {
      case "1":
        bgElement.style.background = "linear-gradient(135deg, #ffdee9 0%, #b5fffc 100%)";
        break;
      case "2":
        bgElement.style.background = "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)";
        break;
      case "3":
        bgElement.style.background = "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)";
        break;
      case "4":
        bgElement.style.background = "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)";
        break;
      default:
        bgElement.style.background = "linear-gradient(135deg, #ffdee9 0%, #b5fffc 100%)";
    }
    
    // Add to gallery with animation
    communityCards.prepend(cardElement);
    gsap.fromTo(cardElement, 
      {opacity: 0, y: 20}, 
      {opacity: 1, y: 0, duration: 0.5}
    );
  }
  
  /**
   * Save card to localStorage
   */
  function saveCardToLocalStorage(cardData) {
    // Get existing cards from localStorage or initialize empty array
    const savedCards = JSON.parse(localStorage.getItem('postcards')) || [];
    
    // Add new card with timestamp
    savedCards.push({
      ...cardData,
      timestamp: new Date().toISOString()
    });
    
    // Store back to localStorage (limit to 50 cards to prevent storage issues)
    localStorage.setItem('postcards', JSON.stringify(savedCards.slice(-50)));
  }
  
  /**
   * Load saved cards from localStorage
   */
  function loadSavedCards() {
    const savedCards = JSON.parse(localStorage.getItem('postcards')) || [];
    
    // Show up to 12 most recent cards in the gallery
    savedCards.slice(-12).reverse().forEach(cardData => {
      addCardToGallery(cardData);
    });
    
    // Show message if no cards
    const communityCards = document.getElementById('communityCards');
    if (communityCards && savedCards.length === 0) {
      communityCards.innerHTML = '<p class="no-cards-message">No cards shared yet. Be the first to share!</p>';
    }
  }
  
  // Force update message one more time after a short delay
  setTimeout(() => {
    if (messageInput && messageInput.value && postcardMessage) {
      postcardMessage.textContent = messageInput.value || defaultMessage;
      postcardMessage.style.cssText = "display: block !important; visibility: visible !important; opacity: 1 !important;";
    }
  }, 500);

  // Create a direct updatePostcardMessage function that can be called from anywhere
  function updatePostcardMessage(text) {
    if (!postcardMessage) {
      console.warn("Postcard message element not found");
      return; // Exit if null
    }
    
    const messageToShow = text;
    
    // Update the DOM element content
    postcardMessage.textContent = messageToShow;
    
    // Force visibility with multiple techniques
    postcardMessage.setAttribute('style', 'display: block !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 10 !important;');
    
    // Also set direct style properties as a backup
    postcardMessage.style.display = 'block';
    postcardMessage.style.visibility = 'visible';
    postcardMessage.style.opacity = '1';
    postcardMessage.style.position = 'relative';
    postcardMessage.style.zIndex = '10';
    
    console.log('Message updated to:', messageToShow);
  }
  
  // Set up multiple event listeners for the message input
  if (messageInput) {
    // Clear any existing event handlers
    messageInput.oninput = null;
    messageInput.onkeyup = null;
    messageInput.onchange = null;
    
    // Add multiple event handlers to ensure the message is updated
    ['input', 'keyup', 'change'].forEach(eventType => {
      messageInput.addEventListener(eventType, function() {
        updatePostcardMessage(this.value);
      });
    });
    
    // Initial update when the page loads
    updatePostcardMessage(messageInput.value);
    
    // Focus and blur events to ensure message is visible
    messageInput.addEventListener('focus', () => {
      setTimeout(() => updatePostcardMessage(messageInput.value), 50);
    });
    
    messageInput.addEventListener('blur', () => {
      setTimeout(() => updatePostcardMessage(messageInput.value), 50);
    });
  }
  
  // Set up periodic check to ensure message is visible (handles edge cases)
  let lastMessageValue = messageInput ? messageInput.value : defaultMessage;
  
  const messageCheckInterval = setInterval(() => {
    if (!postcardMessage || !messageInput) {
      clearInterval(messageCheckInterval);
      return;
    }
    
    // If message input value has changed or message is empty, update it
    if (messageInput.value !== lastMessageValue || 
        !postcardMessage.textContent ||
        postcardMessage.textContent.trim() === '') {
      lastMessageValue = messageInput.value;
      updatePostcardMessage(lastMessageValue);
    }
  }, 1000);
  
  // Replace the existing setTimeout with this more robust version
  setTimeout(() => {
    if (messageInput && postcardMessage) {
      updatePostcardMessage(messageInput.value);
    }
  }, 500);

  // Add the update message button functionality
  const updateMessageBtn = document.getElementById('updateMessageBtn');
  
  
  // Add click event handler for the update button
  updateMessageBtn.addEventListener('click', function() {
    // Get the message from the textarea
    const newMessage = messageInput.value;
    
    // Update the postcard message
    updatePostcardMessage(newMessage);
    
    // Visual feedback that the update happened
    this.classList.add('success');
    this.innerHTML = '<i class="fas fa-check"></i> Updated!';
    
    // Reset the button after a brief period
    setTimeout(() => {
      this.classList.remove('success');
      this.innerHTML = '<i class="fas fa-sync-alt"></i> Update Message';
    }, 1500);
    
    // Show toast notification
    showToast('Message updated successfully!');
  });
}


/**
 * Initialize the Women in Tech section
 */
function initWomenInTech() {
  const pioneerCards = document.querySelectorAll('.tech-pioneer-card');
  const techModal = document.getElementById('techModal');
  const techModalBody = techModal.querySelector('.tech-modal-body');
  const closeModalBtn = techModal.querySelector('.close-modal-btn');
  
  // Pioneer information data
  const pioneerData = {
    "lovelace": {
      name: "Ada Lovelace",
      years: "1815-1852",
      title: "First Computer Programmer",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Ada_lovelace.jpg",
      bio: "Augusta Ada King, Countess of Lovelace was an English mathematician and writer, chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine. She was the first to recognize that the machine had applications beyond pure calculation, and published the first algorithm intended to be carried out by such a machine. As a result, she is often regarded as the first computer programmer.",
      achievements: [
        "Wrote the first algorithm for Babbage's Analytical Engine in 1843",
        "First person to recognize the full potential of computers beyond calculations",
        "Developed concepts of loops, subroutines, and conditional jumps",
        "Created the concept of a computer that could manipulate symbols and produce music"
      ],
      quote: "The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.",
      link: "https://en.wikipedia.org/wiki/Ada_Lovelace"
    },
    "hopper": {
      name: "Grace Hopper",
      years: "1906-1992",
      title: "Computer Scientist & Naval Officer",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg",
      bio: "Rear Admiral Grace Murray Hopper was an American computer scientist and United States Navy officer. A pioneer in the field, she was one of the first programmers of the Harvard Mark I computer and invented the first compiler for a computer programming language. She popularized the idea of machine-independent programming languages, which led to the development of COBOL, one of the first high-level programming languages.",
      achievements: [
        "Invented the first compiler (A-0) in 1952",
        "Conceptualized the idea of machine-independent programming languages",
        "Led the team that developed COBOL (Common Business-Oriented Language)",
        "Popularized the term 'debugging' after finding a moth in a computer relay",
        "Retired as a rear admiral from the US Navy at age 79"
      ],
      quote: "The most dangerous phrase in the language is, 'We've always done it this way.'",
      link: "https://en.wikipedia.org/wiki/Grace_Hopper"
    },
    "johnson": {
      name: "Katherine Johnson",
      years: "1918-2020",
      title: "NASA Mathematician",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Katherine_Johnson_1983.jpg",
      bio: "Katherine Johnson was an American mathematician whose calculations of orbital mechanics as a NASA employee were critical to the success of the first and subsequent U.S. crewed spaceflights. During her 35-year career at NASA and its predecessor, she earned a reputation for mastering complex manual calculations and helped pioneer the use of computers to perform the tasks. The space agency noted her 'historical role as one of the first African-American women to work as a NASA scientist'.",
      achievements: [
        "Calculated trajectories for the 1961 Mercury mission of Alan Shepard",
        "Verified computer calculations for John Glenn's orbit around Earth (1962)",
        "Calculated trajectory for the 1969 Apollo 11 mission to the Moon",
        "Contributed to the Space Shuttle program",
        "Received the Presidential Medal of Freedom in 2015"
      ],
      quote: "Like what you do, and then you will do your best.",
      link: "https://en.wikipedia.org/wiki/Katherine_Johnson"
    },
    "lamarr": {
      name: "Hedy Lamarr",
      years: "1914-2000",
      title: "Inventor & Actress",
      image: "https://prod-images.tcm.com/Master-Profile-Images/HedyLamarr.jpg",
      bio: "Hedy Lamarr was an Austrian-American actress, inventor, and film producer. At the beginning of World War II, she and composer George Antheil developed a radio guidance system for Allied torpedoes, which used spread spectrum and frequency hopping technology to defeat the threat of jamming by the Axis powers. Although the US Navy did not adopt the technology until the 1960s, the principles of their work are now incorporated into modern Wi-Fi, CDMA, and Bluetooth technology, and this work led to their induction into the National Inventors Hall of Fame.",
      achievements: [
        "Co-invented frequency hopping spread spectrum technology in 1941",
        "Received a patent for secret communication system (US Patent 2,292,387)",
        "Her technology became a foundation for WiFi, GPS, and Bluetooth",
        "Inducted into the National Inventors Hall of Fame in 2014",
        "Appeared in 30 films during a 28-year career in Hollywood"
      ],
      quote: "The world isn't getting any easier. With all these new inventions, I believe that people are hurried more and pushed more... The hurried way is not the right way; you need time for everything.",
      link: "https://en.wikipedia.org/wiki/Hedy_Lamarr"
    }
  };
  
  // Animate stat numbers
  animateTechStats();
  
  // Add click event to each pioneer card
  pioneerCards.forEach(card => {
    card.addEventListener('click', function() {
      const pioneerId = this.getAttribute('data-tech-id');
      const pioneer = pioneerData[pioneerId];
      
      if (pioneer) {
        // Populate modal with pioneer data
        techModalBody.innerHTML = `
          <div class="modal-pioneer-header">
            <img src="${pioneer.image}" alt="${pioneer.name}" class="modal-pioneer-img">
            <div class="modal-pioneer-title">
              <h2>${pioneer.name}</h2>
              <span class="years">${pioneer.years}</span>
              <p class="pioneer-title">${pioneer.title}</p>
            </div>
          </div>
          <div class="modal-pioneer-bio">${pioneer.bio}</div>
          <div class="achievement-list">
            <h4>Key Achievements</h4>
            <ul>
              ${pioneer.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
          </div>
          <blockquote class="modal-pioneer-quote">${pioneer.quote}</blockquote>
          <a href="${pioneer.link}" target="_blank" class="pioneer-more-link">Learn More</a>
        `;
        
        // Show the modal
        techModal.classList.remove('hidden');
        setTimeout(() => {
          techModal.classList.add('visible');
        }, 10);
      }
    });
  });
  
  // Close modal on button click
  closeModalBtn.addEventListener('click', closeModal);
  
  // Close modal on click outside content
  techModal.addEventListener('click', function(e) {
    if (e.target === techModal) {
      closeModal();
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !techModal.classList.contains('hidden')) {
      closeModal();
    }
  });
  
  /**
   * Close the tech pioneer modal
   */
  function closeModal() {
    techModal.classList.remove('visible');
    setTimeout(() => {
      techModal.classList.add('hidden');
    }, 300);
  }
  
  /**
   * Animate tech statistics with counting effect
   */
  function animateTechStats() {
    const statElements = {
      'stat-graduates': { target: 22, current: 0 },
      'stat-workforce': { target: 26, current: 0 },
      'stat-founders': { target: 17, current: 0 },
      'stat-leadership': { target: 25, current: 0 }
    };
    
    // Set up intersection observer to start animation when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Start animation for all stats
          startStatsAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    // Observe the stats container
    const statsContainer = document.querySelector('.tech-stats-container');
    if (statsContainer) {
      observer.observe(statsContainer);
    }
    
    function startStatsAnimation() {
      // Animate each stat element
      for (const [id, stat] of Object.entries(statElements)) {
        const element = document.getElementById(id);
        if (!element) continue;
        
        const duration = 2000; // Animation duration in ms
        const startTime = performance.now();
        
        function updateStat(timestamp) {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smoother animation
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.round(easedProgress * stat.target);
          element.textContent = currentValue;
          
          if (progress < 1) {
            requestAnimationFrame(updateStat);
          }
        }
        
        requestAnimationFrame(updateStat);
      }
    }
  }
}

/**
 * Initialize the Women's Achievements Quiz section
 */
function initWomensAchievementsQuiz() {
  // Quiz data - questions, options, and correct answers
  const quizData = [
    {
      question: "Who was the first woman to win a Nobel Prize?",
      options: [
        "Marie Curie",
        "Rosalind Franklin",
        "Dorothy Crowfoot Hodgkin",
        "Irène Joliot-Curie"
      ],
      correctAnswer: 0, // Marie Curie
      feedback: "Marie Curie won the Nobel Prize in Physics in 1903, shared with her husband Pierre Curie and physicist Henri Becquerel for their work on radiation. She later won a second Nobel Prize in Chemistry in 1911."
    },
    {
      question: "Which woman is credited with writing the first computer algorithm?",
      options: [
        "Grace Hopper",
        "Ada Lovelace",
        "Katherine Johnson",
        "Annie Easley"
      ],
      correctAnswer: 1, // Ada Lovelace
      feedback: "Ada Lovelace is widely credited with writing the first computer algorithm in the 1840s for Charles Babbage's Analytical Engine, a proposed mechanical general-purpose computer."
    },
    {
      question: "Which woman led the Underground Railroad helping enslaved people escape to freedom?",
      options: [
        "Sojourner Truth",
        "Harriet Tubman",
        "Ida B. Wells",
        "Mary McLeod Bethune"
      ],
      correctAnswer: 1, // Harriet Tubman
      feedback: "Harriet Tubman escaped slavery herself and then made about 13 missions to rescue approximately 70 enslaved people using a network of antislavery activists and safe houses known as the Underground Railroad."
    },
    {
      question: "Who was the first female Prime Minister of the United Kingdom?",
      options: [
        "Theresa May",
        "Angela Merkel",
        "Margaret Thatcher",
        "Indira Gandhi"
      ],
      correctAnswer: 2, // Margaret Thatcher
      feedback: "Margaret Thatcher served as the Prime Minister of the United Kingdom from 1979 to 1990, becoming the first woman to hold this position and the longest-serving British PM of the 20th century."
    },
    {
      question: "Which woman astronaut spent the longest time in space during a single spaceflight?",
      options: [
        "Peggy Whitson",
        "Christina Koch",
        "Valentina Tereshkova",
        "Sally Ride"
      ],
      correctAnswer: 1, // Christina Koch
      feedback: "NASA astronaut Christina Koch set the record for the longest single spaceflight by a woman, with 328 days in space from March 2019 to February 2020."
    },
    {
      question: "Who was the first woman to fly solo across the Atlantic Ocean?",
      options: [
        "Bessie Coleman",
        "Amelia Earhart",
        "Beryl Markham",
        "Jacqueline Cochran"
      ],
      correctAnswer: 1, // Amelia Earhart
      feedback: "Amelia Earhart became the first woman to fly solo across the Atlantic Ocean in 1932, flying from Harbor Grace, Newfoundland to Culmore, Northern Ireland."
    },
    {
      question: "Which woman is often called the 'Mother of the Civil Rights Movement'?",
      options: [
        "Rosa Parks",
        "Coretta Scott King",
        "Ella Baker",
        "Dorothy Height"
      ],
      correctAnswer: 0, // Rosa Parks
      feedback: "Rosa Parks is often referred to as the 'Mother of the Civil Rights Movement' for her pivotal role in the Montgomery Bus Boycott after she refused to give up her seat to a white passenger on a segregated bus in 1955."
    },
    {
      question: "Which female scientist's work was critical to the discovery of the structure of DNA, but was largely uncredited at the time?",
      options: [
        "Dorothy Crowfoot Hodgkin",
        "Barbara McClintock",
        "Rosalind Franklin",
        "Gertrude Elion"
      ],
      correctAnswer: 2, // Rosalind Franklin
      feedback: "Rosalind Franklin's X-ray diffraction images of DNA were crucial to discovering its double helix structure, but her contributions were largely uncredited when Watson and Crick published their model of DNA in 1953."
    },
    {
      question: "Who was the first woman to win an Academy Award for Best Director?",
      options: [
        "Sofia Coppola",
        "Jane Campion",
        "Greta Gerwig",
        "Kathryn Bigelow"
      ],
      correctAnswer: 3, // Kathryn Bigelow
      feedback: "Kathryn Bigelow became the first woman to win the Academy Award for Best Director in 2010 for her film 'The Hurt Locker,' which also won Best Picture."
    },
    {
      question: "Which woman wrote 'Frankenstein; or, The Modern Prometheus'?",
      options: [
        "Mary Shelley",
        "Jane Austen",
        "Charlotte Brontë",
        "Emily Dickinson"
      ],
      correctAnswer: 0, // Mary Shelley
      feedback: "Mary Shelley wrote 'Frankenstein; or, The Modern Prometheus,' which was published anonymously in 1818 when she was just 20 years old. It's considered one of the earliest and most influential works of science fiction."
    },
  ];

  // Get DOM elements
  const quizIntro = document.getElementById('quizIntro');
  const quizQuestions = document.getElementById('quizQuestions');
  const quizResults = document.getElementById('quizResults');
  const startQuizBtn = document.getElementById('startQuiz');
  const questionText = document.getElementById('questionText');
  const answersContainer = document.getElementById('answersContainer');
  const questionFeedback = document.getElementById('questionFeedback');
  const feedbackText = document.getElementById('feedbackText');
  const nextQuestionBtn = document.getElementById('nextQuestion');
  const progressFill = document.getElementById('quizProgress');
  const currentQuestionEl = document.getElementById('currentQuestion');
  const totalQuestionsEl = document.getElementById('totalQuestions');
  const finalScore = document.getElementById('finalScore');
  const resultsMessage = document.getElementById('resultsMessage');
  const retakeQuizBtn = document.getElementById('retakeQuiz');
  const shareResultsBtn = document.getElementById('shareResults');

  // Quiz state variables
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedAnswer = null;

  // Set total questions number in the UI
  totalQuestionsEl.textContent = quizData.length;
  
  // Start quiz button click handler
  startQuizBtn.addEventListener('click', startQuiz);
  retakeQuizBtn.addEventListener('click', resetQuiz);
  nextQuestionBtn.addEventListener('click', goToNextQuestion);
  shareResultsBtn.addEventListener('click', shareQuizResults);

  /**
   * Start the quiz
   */
  function startQuiz() {
    // Hide intro and show questions
    quizIntro.classList.add('hidden');
    quizQuestions.classList.remove('hidden');
    quizResults.classList.add('hidden');
    
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    
    // Show first question
    showQuestion(currentQuestionIndex);
  }
  
  /**
   * Reset the quiz to start again
   */
  function resetQuiz() {
    quizResults.classList.add('hidden');
    startQuiz();
  }
  
  /**
   * Display the current question and answer options
   */
  function showQuestion(index) {
    // Update progress
    currentQuestionEl.textContent = index + 1;
    progressFill.style.width = `${((index + 1) / quizData.length) * 100}%`;
    
    // Reset state for new question
    selectedAnswer = null;
    questionFeedback.classList.remove('visible'); // Remove visible class first
    questionFeedback.classList.add('hidden'); // Then add hidden class
    
    // Get current question data
    const question = quizData[index];
    
    // Set question text
    questionText.textContent = question.question;
    
    // Clear previous answer options
    answersContainer.innerHTML = '';
    
    // Create answer options
    question.options.forEach((option, i) => {
      const answerElement = document.createElement('div');
      answerElement.classList.add('answer-option');
      answerElement.textContent = option;
      answerElement.dataset.index = i;
      
      answerElement.addEventListener('click', () => selectAnswer(i));
      answersContainer.appendChild(answerElement);
    });
  }
  
  /**
   * Handle answer selection
   */
  function selectAnswer(index) {
    // Ignore if already answered
    if (questionFeedback.classList.contains('visible')) return;
    
    const currentQuestion = quizData[currentQuestionIndex];
    const answerOptions = document.querySelectorAll('.answer-option');
    
    // Clear previous selection
    answerOptions.forEach(option => {
      option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Mark the selected answer
    const selectedOption = answerOptions[index];
    selectedOption.classList.add('selected');
    selectedAnswer = index;
    
    // Show correct/incorrect after a small delay
    setTimeout(() => {
      // Check if answer is correct
      const isCorrect = index === currentQuestion.correctAnswer;
      
      if (isCorrect) {
        selectedOption.classList.add('correct');
        score++;
        triggerSmallConfetti();
      } else {
        selectedOption.classList.add('incorrect');
        // Highlight correct answer
        answerOptions[currentQuestion.correctAnswer].classList.add('correct');
      }
      
      // Show feedback
      feedbackText.textContent = currentQuestion.feedback;
      questionFeedback.classList.remove('hidden');
      questionFeedback.classList.add('visible');
      
    }, 500);
  }
  
  /**
   * Go to the next question or finish the quiz
   */
  function goToNextQuestion() {
    // Check if we've reached the end of questions
    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
    } else {
      finishQuiz();
    }
  }
  
  /**
   * Complete the quiz and show results
   */
  function finishQuiz() {
    // Hide questions and show results
    quizQuestions.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    // Update score with a slight delay for animation effect
    setTimeout(() => {
      // Update score
      finalScore.textContent = score;
      
      // Generate results message based on score
      let message = '';
      const percentage = (score / quizData.length) * 100;
      
      if (percentage === 100) {
        message = `<p>Perfect score! You're an expert on women's achievements!</p>
                  <p>Your knowledge of women's contributions to history is exceptional.</p>`;
        triggerConfetti();
      } else if (percentage >= 80) {
        message = `<p>Impressive! You have excellent knowledge about women's contributions to history.</p>
                  <p>You clearly appreciate the important role women have played.</p>`;
        triggerSmallConfetti();
      } else if (percentage >= 60) {
        message = `<p>Good job! You have solid knowledge about women's historical achievements.</p>
                  <p>There's always more to learn about these inspiring stories.</p>`;
      } else if (percentage >= 40) {
        message = `<p>Not bad! You know some important facts about women's contributions.</p>
                  <p>Consider exploring more about these remarkable women's achievements.</p>`;
      } else {
        message = `<p>Thanks for participating! Women's achievements are vast and numerous.</p>
                  <p>This is a great opportunity to discover more about the women who changed history.</p>`;
      }
      
      resultsMessage.innerHTML = message;
    }, 300); // Short delay to allow animation to start after display
  }
  
  /**
   * Share quiz results on social media
   */
  function shareQuizResults() {
    const shareText = encodeURIComponent(`I scored ${score}/${quizData.length} on the Women's Achievements Quiz! Test your knowledge about the amazing women who changed history. #InternationalWomensDay`);
    const shareUrl = encodeURIComponent(window.location.href);
    
    // Open Twitter share dialog
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, 'Share Quiz Results', 'width=600,height=400');
    showToast('Thanks for sharing your quiz results!');
  }
}
