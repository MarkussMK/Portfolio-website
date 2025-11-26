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

// Robot Arm Cursor Following Animation - Red Dot Follows Cursor
function initRobotArms() {
  const robotArms = document.querySelectorAll('.robot-arm');
  if (!robotArms.length) return;

  let mouseX = 0;
  let mouseY = 0;

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate each robot arm
  robotArms.forEach((arm, index) => {
    const segment1 = arm.querySelector('.arm-segment-1');
    const segment2 = arm.querySelector('.arm-segment-2');
    const segment3 = arm.querySelector('.arm-segment-3');
    const armEnd = arm.querySelector('.arm-end');
    
    if (!segment1 || !segment2 || !segment3 || !armEnd) return;

    // Smooth interpolation variables for red dot position
    let targetEndX = 0;
    let targetEndY = 0;
    let currentEndX = 0;
    let currentEndY = 0;
    let currentGripperAngle = 0;
    let targetGripperAngle = 0;

    // Segment lengths for calculations
    const segmentLength1 = 60;
    const segmentLength2 = 45;
    const segmentLength3 = 35;
    const maxReach = segmentLength1 + segmentLength2 + segmentLength3;

    function updateArmPosition() {
      const armRect = arm.getBoundingClientRect();
      const baseX = armRect.left + armRect.width / 2;
      const baseY = armRect.bottom - 20; // Adjusted for new base position

      // Calculate target position for red dot (relative to base)
      targetEndX = mouseX - baseX;
      targetEndY = -(mouseY - baseY); // Negative for correct coordinate system

      // Smooth interpolation for red dot movement
      const lerpFactor = 0.12;
      currentEndX += (targetEndX - currentEndX) * lerpFactor;
      currentEndY += (targetEndY - currentEndY) * lerpFactor;

      // Constrain red dot to reachable area
      const distance = Math.sqrt(currentEndX * currentEndX + currentEndY * currentEndY);
      let endX = currentEndX;
      let endY = currentEndY;

      if (distance > maxReach) {
        const scale = maxReach / distance;
        endX = currentEndX * scale;
        endY = currentEndY * scale;
      }

      // Position red dot directly
      armEnd.style.left = `calc(50% + ${endX}px)`;
      armEnd.style.bottom = `${20 + endY}px`;
      armEnd.style.transform = `translateX(-50%)`;

      // Simplified forward kinematics approach
      if (distance > 1) {
        // Calculate base angle towards target, constrained to 120 degrees
        const targetAngle = Math.atan2(endX, endY);
        let angle1 = targetAngle;
        angle1 = Math.max(-Math.PI/3, Math.min(Math.PI/3, angle1)); // ±60° = ±π/3 radians
        
        // Calculate where segment 1 ends
        const joint1X = Math.sin(angle1) * segmentLength1;
        const joint1Y = Math.cos(angle1) * segmentLength1;
        
        // Vector from joint1 to target
        const toTargetX = endX - joint1X;
        const toTargetY = endY - joint1Y;
        const toTargetDistance = Math.sqrt(toTargetX * toTargetX + toTargetY * toTargetY);
        
        // If target is within reach of remaining segments
        if (toTargetDistance <= segmentLength2 + segmentLength3) {
          // Use 2-link inverse kinematics for segments 2 and 3
          const D = toTargetDistance;
          const L1 = segmentLength2;
          const L2 = segmentLength3;
          
          // Law of cosines to find angles
          const cosAngle2 = (L1*L1 + D*D - L2*L2) / (2*L1*D);
          const cosAngle3 = (L1*L1 + L2*L2 - D*D) / (2*L1*L2);
          
          if (cosAngle2 >= -1 && cosAngle2 <= 1 && cosAngle3 >= -1 && cosAngle3 <= 1) {
            const baseAngle = Math.atan2(toTargetX, toTargetY);
            const angle2Offset = Math.acos(cosAngle2);
            const angle3Offset = Math.acos(cosAngle3);
            
            // Segment 2 angle
            const angle2 = baseAngle + angle2Offset;
            
            // Calculate where segment 2 ends
            const joint2X = joint1X + Math.sin(angle2) * segmentLength2;
            const joint2Y = joint1Y + Math.cos(angle2) * segmentLength2;
            
            // Segment 3 angle (from joint2 to target)
            const angle3 = Math.atan2(endX - joint2X, endY - joint2Y);
            
            // Calculate where segment 3 actually ends (red dot position)
            const actualEndX = joint2X + Math.sin(angle3) * segmentLength3;
            const actualEndY = joint2Y + Math.cos(angle3) * segmentLength3;
            
            // Apply transformations
            segment1.style.transform = `translateX(-50%) rotate(${angle1 * (180 / Math.PI)}deg)`;
            
            segment2.style.left = `calc(50% + ${joint1X}px)`;
            segment2.style.bottom = `${20 + joint1Y}px`;
            segment2.style.transform = `translateX(-50%) rotate(${angle2 * (180 / Math.PI)}deg)`;
            
            segment3.style.left = `calc(50% + ${joint2X}px)`;
            segment3.style.bottom = `${20 + joint2Y}px`;
            segment3.style.transform = `translateX(-50%) rotate(${angle3 * (180 / Math.PI)}deg)`;
            
            // Position red dot at the actual end of segment 3 and rotate toward cursor
            // Always calculate angle to cursor for continuous tracking
            targetGripperAngle = Math.atan2(endX - actualEndX, endY - actualEndY) * (180 / Math.PI);
            // Smooth interpolation for gripper rotation
            currentGripperAngle += (targetGripperAngle - currentGripperAngle) * 0.08;
            
            armEnd.style.left = `calc(50% + ${actualEndX}px)`;
            armEnd.style.bottom = `${20 + actualEndY}px`;
            armEnd.style.transform = `translateX(-50%) rotate(${currentGripperAngle}deg)`;
          }
        } else {
          // Target too far, stretch towards it
          const stretchAngle = Math.atan2(toTargetX, toTargetY);
          
          const joint2X = joint1X + Math.sin(stretchAngle) * segmentLength2;
          const joint2Y = joint1Y + Math.cos(stretchAngle) * segmentLength2;
          
          // Calculate actual end position when stretching
          const actualEndX = joint2X + Math.sin(stretchAngle) * segmentLength3;
          const actualEndY = joint2Y + Math.cos(stretchAngle) * segmentLength3;
          
          segment1.style.transform = `translateX(-50%) rotate(${angle1 * (180 / Math.PI)}deg)`;
          
          segment2.style.left = `calc(50% + ${joint1X}px)`;
          segment2.style.bottom = `${20 + joint1Y}px`;
          segment2.style.transform = `translateX(-50%) rotate(${stretchAngle * (180 / Math.PI)}deg)`;
          
          segment3.style.left = `calc(50% + ${joint2X}px)`;
          segment3.style.bottom = `${20 + joint2Y}px`;
          segment3.style.transform = `translateX(-50%) rotate(${stretchAngle * (180 / Math.PI)}deg)`;
          
          // Position red dot at the actual end of segment 3 and rotate toward cursor
          // Always calculate angle to cursor for continuous tracking
          targetGripperAngle = Math.atan2(endX - actualEndX, endY - actualEndY) * (180 / Math.PI);
          // Smooth interpolation for gripper rotation
          currentGripperAngle += (targetGripperAngle - currentGripperAngle) * 0.08;
          
          armEnd.style.left = `calc(50% + ${actualEndX}px)`;
          armEnd.style.bottom = `${20 + actualEndY}px`;
          armEnd.style.transform = `translateX(-50%) rotate(${currentGripperAngle}deg)`;
        }
      }

      requestAnimationFrame(updateArmPosition);
    }

    updateArmPosition();
  });
}

// Scroll-controlled video playback for mobile devices
function initScrollVideos() {
  const videos = document.querySelectorAll('.scroll-video');
  if (!videos.length) return;

  videos.forEach(video => {
    // Preload video metadata
    video.addEventListener('loadedmetadata', () => {
      const videoContainer = video.closest('.about-image');
      if (!videoContainer) return;

      function updateVideoProgress() {
        const containerRect = videoContainer.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        const windowHeight = window.innerHeight;

        // Calculate when container is in viewport
        const startPosition = windowHeight;
        const endPosition = -containerHeight;
        const totalDistance = startPosition - endPosition;
        
        // Calculate scroll progress (0 to 1)
        let progress = (startPosition - containerTop) / totalDistance;
        progress = Math.max(0, Math.min(1, progress));

        // Update video current time based on scroll progress
        if (video.duration) {
          video.currentTime = progress * video.duration;
        }
      }

      // Throttled scroll handler
      let ticking = false;
      function handleScroll() {
        if (!ticking) {
          requestAnimationFrame(() => {
            updateVideoProgress();
            ticking = false;
          });
          ticking = true;
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial update
      updateVideoProgress();
    });
  });
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
    initRobotArms();
    initScrollVideos(); // Add scroll video functionality
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}