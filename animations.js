// Portfolio Website Animations
// Centralized JavaScript file for all scroll animations and interactions

// Utility function to create Intersection Observer
function createObserver(callback, options = {}) {
  const defaultOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

// Generic animation trigger function
function triggerAnimation(entry) {
  if (entry.isIntersecting) {
    requestAnimationFrame(() => {
      entry.target.classList.add('animate-in');
    });
    return true; // Indicates element should be unobserved
  }
  return false;
}

// Hero parallax animation (index.html only)
function initHeroParallax() {
  const img = document.querySelector('.hero-img');
  const header = document.querySelector('header');
  const sub = document.querySelector('.subheader');
  if (!img) return;

  // Ensure hero fills container
  function updateHeroMax() {
    img.style.height = '100%';
    img.style.width = '100%';
  }

  // Parallax (wider screens)
  let ticking = false;
  function onScroll() {
    if (window.innerWidth < 720) return; // disabled on small screens
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        // translate with clamp
        const translate = Math.min(Math.max(scrolled * 0.24, -120), 240);
        img.style.transform = `translate3d(0, ${translate}px, 0)`;
        ticking = false;
      });
      ticking = true;
    }
  }

  // Reset transform on resize
  function onResize() {
    img.style.transform = 'translate3d(0,0,0)';
    updateHeroMax();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  updateHeroMax();
}

// Scroll indicator animation (index.html only)
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;

  let hasScrolled = false;
  let ticking = false;

  function updateScrollIndicator() {
    const scrollY = window.scrollY;

    // Start fading when user scrolls past 80px
    if (!hasScrolled && scrollY > 80) {
      hasScrolled = true;

      // Add fade-out class for smooth transition
      scrollIndicator.classList.add('fade-out');

      // Remove from DOM after animation completes
      setTimeout(() => {
        scrollIndicator.style.display = 'none';
      }, 1500);
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking && !hasScrolled) {
      requestAnimationFrame(updateScrollIndicator);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

// About Me section animations (index.html only)
function initAboutMeAnimations() {
  const aboutTitle = document.querySelector('.about-section h2');
  const aboutRows = document.querySelectorAll('.about-row');

  if (!aboutTitle && !aboutRows.length) return;

  const observer = createObserver((entries) => {
    entries.forEach(entry => {
      if (triggerAnimation(entry)) {
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  // Observe the title first
  if (aboutTitle) {
    observer.observe(aboutTitle);
  }

  // Observe each About Me row for staggered animation
  aboutRows.forEach((row, index) => {
    // Add a slight delay for each row to create staggered effect
    setTimeout(() => {
      observer.observe(row);
    }, index * 100);
  });
}

// Project cards animations
function initProjectCardAnimations() {
  const projectCards = document.querySelectorAll('.project-card');
  if (!projectCards.length) return;

  const observer = createObserver((entries) => {
    entries.forEach(entry => {
      if (triggerAnimation(entry)) {
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -30px 0px'
  });

  // Start observing each project card
  projectCards.forEach(card => {
    observer.observe(card);
  });
}

// Homepage contact section animations (index.html only)
function initHomepageContactAnimations() {
  const contactElements = [
    { selector: '#contact h2', delay: 0 },
    { selector: '#contact .profile-image', delay: 200 },
    { selector: '#contact .contact-info', delay: 400 },
    { selector: '#contact .social-buttons', delay: 600 }
  ];

  const socialBubbles = document.querySelectorAll('#contact .social-bubble');

  const observer = createObserver((entries) => {
    entries.forEach(entry => {
      if (triggerAnimation(entry)) {
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe main contact elements with staggered timing
  contactElements.forEach(({ selector, delay }) => {
    const element = document.querySelector(selector);
    if (element) {
      if (delay > 0) {
        setTimeout(() => observer.observe(element), delay);
      } else {
        observer.observe(element);
      }
    }
  });

  // Observe social bubbles separately for staggered animation
  if (socialBubbles.length) {
    const socialObserver = createObserver((entries) => {
      entries.forEach(entry => {
        if (triggerAnimation(entry)) {
          socialObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -30px 0px'
    });

    socialBubbles.forEach(bubble => {
      socialObserver.observe(bubble);
    });
  }
}

// Experience page bullet point animations
function initBulletPointAnimations() {
  const bulletPoints = document.querySelectorAll('.bullet-point');
  if (!bulletPoints.length) return;

  const observer = createObserver((entries) => {
    entries.forEach(entry => {
      if (triggerAnimation(entry)) {
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -20px 0px'
  });

  // Start observing each bullet point
  bulletPoints.forEach(bullet => {
    observer.observe(bullet);
  });
}

// Experience page skills section animations
function initSkillsAnimations() {
  const skillItems = document.querySelectorAll('.skill-item');
  if (!skillItems.length) return;

  const observer = createObserver((entries) => {
    entries.forEach(entry => {
      if (triggerAnimation(entry)) {
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  // Start observing each skill item
  skillItems.forEach(item => {
    observer.observe(item);
  });
}

// Contact page animations
function initContactPageAnimations() {
  const elements = [
    { selector: '.contact-page h2', delay: 0 },
    { selector: '.contact-page .profile-image', delay: 200 },
    { selector: '.contact-page .contact-form', delay: 400 },
    { selector: '.contact-page .social-buttons', delay: 600 }
  ];

  const socialBubbles = document.querySelectorAll('.contact-page .social-bubble');

  const observer = createObserver((entries) => {
    entries.forEach(entry => {
      if (triggerAnimation(entry)) {
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe main elements
  elements.forEach(({ selector, delay }) => {
    const element = document.querySelector(selector);
    if (element) {
      if (delay > 0) {
        setTimeout(() => observer.observe(element), delay);
      } else {
        observer.observe(element);
      }
    }
  });

  // Observe social bubbles separately for staggered animation
  if (socialBubbles.length) {
    const socialObserver = createObserver((entries) => {
      entries.forEach(entry => {
        if (triggerAnimation(entry)) {
          socialObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -30px 0px'
    });

    socialBubbles.forEach(bubble => {
      socialObserver.observe(bubble);
    });
  }
}

// Contact form functionality
function initContactForm() {
  const FORM_ENDPOINT = 'https://formspree.io/f/xqagrkya';
  const form = document.getElementById('contactForm');
  const successNote = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill name, email and message.');
      return;
    }

    try {
      const payload = { name, email, subject, message };
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess();
        form.reset();
      } else {
        console.error('Form submission error', res.status);
        alert('Submission failed. Please try again or use the email link.');
      }
    } catch (err) {
      console.error('Network/form error', err);
      alert('Submission failed due to a network error. Please try again or use the email link.');
    }
  });

  function showSuccess() {
    if (successNote) {
      successNote.style.display = 'block';
      setTimeout(() => successNote.style.display = 'none', 6000);
    }
  }
}

// Main initialization function
function initAnimations() {
  // Always available animations
  initBulletPointAnimations();
  initSkillsAnimations();
  initProjectCardAnimations();
  initContactPageAnimations();
  initContactForm();

  // Homepage-specific animations
  if (document.body.classList.contains('has-hero')) {
    initHeroParallax();
    initScrollIndicator();
    initAboutMeAnimations();
    initHomepageContactAnimations();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}