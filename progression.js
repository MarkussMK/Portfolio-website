// Update character tracker display
function updateCharacterDisplay(stateOverride) {
    const state = stateOverride || getProgressionState();
    const currentLevel = calculateLevel(state.totalXP);
    const level = characterLevels[currentLevel];
    const xpInfo = getXPForCurrentLevel(state.totalXP);

    const spriteEl = document.getElementById('character-sprite');
    const titleEl = document.getElementById('character-title');
    const currentXPEl = document.getElementById('current-xp');
    const neededXPEl = document.getElementById('needed-xp');
    const xpBarFill = document.getElementById('xp-bar-fill');

    if (spriteEl) spriteEl.textContent = level.sprite;
    if (titleEl) titleEl.textContent = level.title;

    if (xpInfo.isFinal) {
        if (currentXPEl) currentXPEl.textContent = 'MAX';
        if (neededXPEl) neededXPEl.textContent = 'LEVEL';
        if (xpBarFill) xpBarFill.style.width = '100%';
    } else {
        if (currentXPEl) currentXPEl.textContent = xpInfo.current;
        if (neededXPEl) neededXPEl.textContent = xpInfo.needed;
        const progress = (xpInfo.current / xpInfo.needed) * 100;
        if (xpBarFill) xpBarFill.style.width = progress + '%';
    }
    // Optional cumulative total display
    const totalXPEl = document.getElementById('total-xp');
    if (totalXPEl) totalXPEl.textContent = state.totalXP;
}
// Portfolio Progression System - Cross-page XP and Level Tracking

// Page configuration: each page is a level
const PAGE_LEVELS = {
    'index.html': { level: 1, name: 'Main Terminal', nextPage: 'Experience.html' },
    'Experience.html': { level: 2, name: 'System Specs', nextPage: 'Projects.html' },
    'Projects.html': { level: 3, name: 'Data Archives', nextPage: 'Contact.html' },
    'Contact.html': { level: 4, name: 'Communication Hub', nextPage: null }
};

// Character levels configuration
const characterLevels = [
    { title: 'Intern', sprite: '🔰', xpNeeded: 40 },
    { title: 'Junior Engineer', sprite: '🧑‍💻', xpNeeded: 80 },
    { title: 'Automation Specialist', sprite: '🤖', xpNeeded: 120 },
    { title: 'Web Developer', sprite: '💻', xpNeeded: 160 },
    { title: 'You made it this far, send a message!', sprite: '👨‍🚀', xpNeeded: 0 }
];

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
}

// Get progression state from localStorage
function getProgressionState() {
    let stored = null;
    try {
        stored = localStorage.getItem('portfolioProgression');
    } catch (e) {
        // Ignore localStorage access errors
    }
    if (!stored && window.name && window.name.startsWith('portfolioProgression:')) {
        stored = window.name.substring('portfolioProgression:'.length);
    }
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            // Corrupt data fallback
        }
    }
    return {
        currentLevel: 0,
        totalXP: 0,
        unlockedPages: ['index.html'],
        completedPages: [],
        visitedSections: {}
    };
}

// Save progression state to localStorage
function saveProgressionState(state) {
    const serialized = JSON.stringify(state);
    try {
        localStorage.setItem('portfolioProgression', serialized);
    } catch (e) {
        // Ignore write errors
    }
    window.name = 'portfolioProgression:' + serialized;
}

// Calculate current level based on total XP
function calculateLevel(totalXP) {
    let xpSum = 0;
    for (let i = 0; i < characterLevels.length; i++) {
        if (characterLevels[i].xpNeeded === 0) {
            return i; // Final level
        }
        xpSum += characterLevels[i].xpNeeded;
        if (totalXP < xpSum) {
            return i;
        }
    }
    return characterLevels.length - 1;
}

// Get XP needed for current level
function getXPForCurrentLevel(totalXP) {
    const currentLevel = calculateLevel(totalXP);
    if (currentLevel >= characterLevels.length - 1) {
        return { current: 0, needed: 0, isFinal: true };
    }
    
    let xpSum = 0;
    for (let i = 0; i < currentLevel; i++) {
        xpSum += characterLevels[i].xpNeeded;
    }
    
    const currentInLevel = totalXP - xpSum;
    const neededForLevel = characterLevels[currentLevel].xpNeeded;
    
        return { current: currentInLevel, needed: neededForLevel, isFinal: false };
    }

// Award XP and update state
function gainXP(amount, stateOverride) {
    const state = stateOverride || getProgressionState();
    const oldLevel = calculateLevel(state.totalXP);
    // Cap XP on first page to 40
    const currentPage = getCurrentPage();
    if (currentPage === 'index.html') {
        const maxXP = characterLevels[0].xpNeeded;
        if (state.totalXP + amount > maxXP) {
            amount = maxXP - state.totalXP;
            if (amount < 0) amount = 0;
        }
    }
    state.totalXP += amount;
    const newLevel = calculateLevel(state.totalXP);
    // Only persist immediately if not using external state batching
    if (!stateOverride) {
        saveProgressionState(state);
    }
    updateCharacterDisplay(state);
    if (amount > 0) showFloatingXP(amount);
    if (newLevel > oldLevel) {
        const levelTitle = characterLevels[newLevel].title;
        showUnifiedUnlockNotification(levelTitle, null, null);
    }
    return state;
}

// Show floating XP notification
function showFloatingXP(amount) {
    const tracker = document.getElementById('character-tracker');
    if (!tracker) return;
    
    const floatingXP = document.createElement('div');
    floatingXP.className = 'floating-xp-gain';
    floatingXP.textContent = `+${amount} XP`;
    floatingXP.style.left = (Math.random() * 50 + 25) + '%';
    tracker.appendChild(floatingXP);
    
    setTimeout(() => floatingXP.remove(), 2000);
}

// Unified level-up + area unlock notification
function showUnifiedUnlockNotification(levelTitle, unlockedPageHref, unlockedPageName) {
    // Save current scroll position before any animations
    const scrollPosition = window.scrollY || window.pageYOffset;

    // Disable scrolling during animation
    document.body.style.overflow = 'hidden';

    // Show XP tracker as popup on mobile (add .show-xp-footer)
    const tracker = document.getElementById('character-tracker');
    let xpPopupActive = false;
    if (tracker && window.matchMedia('(max-width: 768px)').matches) {
        tracker.classList.add('show-xp-footer');
        xpPopupActive = true;
    }

    const existing = document.querySelector('.level-up-notification');
    if (existing) existing.remove();
    const notification = document.createElement('div');
    notification.className = 'level-up-notification dramatic';
    const areaLine = unlockedPageHref ? `<p style="margin-top:18px;color:#00f7ff;font-size:1.15em;font-weight:bold;animation: dramaticFadeIn 1.2s;">🚀 Unlocked Area: <span style='color:#fff;'>${unlockedPageName}</span></p>` : '';
    notification.innerHTML = `
        <div class="notification-content">
            <h3 style="font-size:2.5em;animation: dramaticPop 1.2s;">🎉 LEVEL UP! 🎉</h3>
            <p style="color:#ff2a6d;font-size:1.35em;margin:18px 0 0 0;font-weight:bold;animation: dramaticFadeIn 1.5s;">New Clearance: <span style='color:#fff;'>${levelTitle}</span></p>
            <div style="margin-top:22px;animation: dramaticPulse 2.5s infinite alternate;font-size:1.2em;color:#00f7ff;">✨ Abilities Upgraded ✨</div>
            ${areaLine}
        </div>
    `;
    document.body.appendChild(notification);

    // If a page was unlocked, animate the button unlock
    if (unlockedPageHref) {
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.quest-menu .nav-link');
            const targetButton = Array.from(navLinks).find(a => a.getAttribute('href') === unlockedPageHref);

            if (targetButton) {
                // Remove click handler immediately to prevent interference
                targetButton.removeAttribute('data-lock-handler');
                const newButton = targetButton.cloneNode(true);
                targetButton.parentNode.replaceChild(newButton, targetButton);

                // Ensure button is in locked state before animating unlock
                if (!newButton.classList.contains('locked')) {
                    newButton.classList.add('locked');
                    newButton.style.opacity = '0.4';
                }

                // Ensure lock icon exists
                let lockIcon = newButton.querySelector('.lock-icon');
                if (!lockIcon) {
                    lockIcon = document.createElement('span');
                    lockIcon.className = 'lock-icon';
                    lockIcon.textContent = '🔒';
                    lockIcon.style.marginLeft = '4px';
                    newButton.appendChild(lockIcon);
                }

                // Animate lock icon fading
                lockIcon.classList.add('fading');
                setTimeout(() => lockIcon.remove(), 600);

                // Animate button unlocking
                newButton.classList.add('unlocking');

                // Remove locked state after animation and enable clicking
                setTimeout(() => {
                    newButton.classList.remove('locked', 'unlocking');
                    newButton.removeAttribute('aria-disabled');
                    newButton.removeAttribute('tabindex');
                    newButton.style.opacity = '1';

                    // Add glow/pulse effect after unlock
                    newButton.classList.add('unlock-pulse');
                    setTimeout(() => newButton.classList.remove('unlock-pulse'), 2600);

                    // Add completed icon if needed
                    const state = getProgressionState();
                    if (state.completedPages.includes(unlockedPageHref) && !newButton.querySelector('.completed-icon')) {
                        const span = document.createElement('span');
                        span.className = 'completed-icon';
                        span.textContent = '✓';
                        span.style.marginLeft = '4px';
                        newButton.appendChild(span);
                    }
                }, 800);
            }
        }, 800);
    }

    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);

    // After all animations complete, scroll back to original position and re-enable scrolling
    setTimeout(() => {
        notification.remove();
        // Hide XP tracker popup on mobile after notification closes
        if (tracker && xpPopupActive) {
            tracker.classList.remove('show-xp-footer');
        }
        // Smooth scroll back to where user was
        setTimeout(() => {
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            // Re-enable scrolling after scroll animation completes
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 800);
        }, 300);
    }, 5200);
}

// Mark page as completed and unlock next
function completeCurrentPage() {
    const currentPage = getCurrentPage();
    let state = getProgressionState();
    
    if (!state.completedPages.includes(currentPage)) {
        state.completedPages.push(currentPage);
        
        // Calculate XP needed to reach next level (not cumulative)
        const currentLevel = calculateLevel(state.totalXP);
        const nextLevelXP = characterLevels[currentLevel].xpNeeded;
        const xpInCurrentLevel = (() => {
            let xpSum = 0;
            for (let i = 0; i < currentLevel; i++) {
                xpSum += characterLevels[i].xpNeeded;
            }
            return state.totalXP - xpSum;
        })();
        // Award bonus XP to reach next level if not already there
        if (xpInCurrentLevel < nextLevelXP && nextLevelXP > 0) {
            let bonus = nextLevelXP - xpInCurrentLevel;
            // Cap XP on first page to 40
            if (currentPage === 'index.html') {
                const maxXP = characterLevels[0].xpNeeded;
                if (state.totalXP + bonus > maxXP) {
                    bonus = maxXP - state.totalXP;
                    if (bonus < 0) bonus = 0;
                }
            }
            state.totalXP += bonus;
            if (bonus > 0) showFloatingXP(bonus);
        }

        // Unlock next page
        const pageConfig = PAGE_LEVELS[currentPage];
        let unlockedNewHref = null;
        let unlockedNewName = null;
        if (pageConfig && pageConfig.nextPage && !state.unlockedPages.includes(pageConfig.nextPage)) {
            state.unlockedPages.push(pageConfig.nextPage);
            unlockedNewHref = pageConfig.nextPage;
            unlockedNewName = (PAGE_LEVELS[pageConfig.nextPage] && PAGE_LEVELS[pageConfig.nextPage].name) || pageConfig.nextPage;
        }
        
        saveProgressionState(state);
        updateCharacterDisplay();
        
        // Unified popup if a new area unlocked or level threshold crossed
        const currentLevelIndex = calculateLevel(state.totalXP);
        const levelTitle = characterLevels[currentLevelIndex].title;
        if (unlockedNewHref) {
            // Update navigation locks but skip the button that will be animated
            updateNavigationLocks(unlockedNewHref);
            // Small delay to ensure DOM updates, then show popup with animation
            setTimeout(() => {
                showUnifiedUnlockNotification(levelTitle, unlockedNewHref, unlockedNewName);
            }, 100);
        } else {
            updateNavigationLocks();
        }
    }
}

// Update navigation to show locked/unlocked states
function updateNavigationLocks(skipHref) {
    const state = getProgressionState();
    const navLinks = document.querySelectorAll('.quest-menu .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Skip this link if it's being animated
        if (skipHref && href === skipHref) return;
        
        const isUnlocked = state.unlockedPages.includes(href);
        const isCompleted = state.completedPages.includes(href);
        
        // Clean any previous state markers to avoid duplication
        link.querySelectorAll('.lock-icon, .completed-icon').forEach(el => el.remove());

        if (!isUnlocked) {
            link.classList.add('locked');
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('tabindex', '-1');
            link.style.opacity = '0.4';
            // Add click prevention handler if not already present
            if (!link.hasAttribute('data-lock-handler')) {
                link.setAttribute('data-lock-handler', 'true');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lockNote = document.createElement('div');
                    lockNote.className = 'level-up-notification';
                    lockNote.innerHTML = '<div class="notification-content"><h3>🔐 Locked</h3><p>Complete previous page to unlock this area.</p></div>';
                    document.body.appendChild(lockNote);
                    setTimeout(() => lockNote.remove(), 1800);
                });
            }
            // Keep link clickable for focus but prevent navigation via handler
            if (!link.querySelector('.lock-icon')) {
                const span = document.createElement('span');
                span.className = 'lock-icon';
                span.textContent = '🔒';
                span.style.marginLeft = '4px';
                link.appendChild(span);
            }
        } else {
            link.classList.remove('locked');
            link.removeAttribute('aria-disabled');
            link.removeAttribute('tabindex');
            link.style.opacity = '1';
            if (isCompleted && !link.querySelector('.completed-icon')) {
                const span = document.createElement('span');
                span.className = 'completed-icon';
                span.textContent = '✓';
                span.style.marginLeft = '4px';
                link.appendChild(span);
            }
        }
    });
}

// Setup scroll tracking for current page
function setupScrollTracking() {
    const currentPage = getCurrentPage();
    let state = getProgressionState();
    
    // Initialize visited sections for this page if not exists
    if (!state.visitedSections[currentPage]) {
        state.visitedSections[currentPage] = [];
    }
    
    const readSections = Array.from(document.querySelectorAll('.read-section'));
    const revealTargets = document.querySelectorAll('.read-section, .path-card, .achievement-card');
    
    // Reveal + progress observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add in-view class when entering viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
            
            // Award XP when section leaves viewport (scrolled past)
            if (!entry.isIntersecting && entry.target.classList.contains('in-view') && entry.target.classList.contains('read-section')) {
                const sectionId = entry.target.getAttribute('data-section');
                if (sectionId && !state.visitedSections[currentPage].includes(sectionId)) {
                    // Check if section is above viewport (scrolled past, not below)
                    const rect = entry.target.getBoundingClientRect();
                    if (rect.bottom < 0) {
                        state.visitedSections[currentPage].push(sectionId);
                        const xpValue = parseInt(entry.target.getAttribute('data-xp'), 10) || 10;
                        state = gainXP(xpValue, state);
                        updateReadingProgress(readSections.length, state.visitedSections[currentPage].length);
                        if (state.visitedSections[currentPage].length >= readSections.length) {
                            // Persist before completion bonus logic
                            saveProgressionState(state);
                            completeCurrentPage();
                            // Reload state after completion adjustments
                            state = getProgressionState();
                        } else {
                            saveProgressionState(state);
                        }
                    }
                }
            }
        });
    }, { threshold: 0 });
    
    revealTargets.forEach(el => observer.observe(el));

    saveProgressionState(state);
    updateCharacterDisplay(state);
    updateReadingProgress(readSections.length, state.visitedSections[currentPage].length);

    // Fallback manual visibility evaluation (in case IntersectionObserver fails)
    let fallbackScheduled = false;
    function fallbackEvaluate() {
        if (fallbackScheduled) return;
        fallbackScheduled = true;
        requestAnimationFrame(() => {
            fallbackScheduled = false;
            let s = getProgressionState();
            const page = getCurrentPage();
            const sections = Array.from(document.querySelectorAll('.read-section'));
            let awarded = false;
            sections.forEach(sec => {
                const id = sec.getAttribute('data-section');
                if (!id) return;
                if (!s.visitedSections[page].includes(id)) {
                    const r = sec.getBoundingClientRect();
                    // Award XP if section is above viewport (scrolled past)
                    if (r.bottom < 0) {
                        s.visitedSections[page].push(id);
                        const xpVal = parseInt(sec.getAttribute('data-xp'), 10) || 10;
                        s = gainXP(xpVal, s);
                        awarded = true;
                    }
                }
            });
            if (awarded) {
                saveProgressionState(s);
                updateReadingProgress(sections.length, s.visitedSections[page].length);
                if (s.visitedSections[page].length >= sections.length) {
                    completeCurrentPage();
                }
            }
        });
    }
    window.addEventListener('scroll', fallbackEvaluate, { passive: true });
    window.addEventListener('resize', fallbackEvaluate);
    // Delayed evaluations to catch late layout
    setTimeout(fallbackEvaluate, 300);
    setTimeout(fallbackEvaluate, 900);
}

// Update reading progress bar
function updateReadingProgress(total, completed) {
    const bar = document.getElementById('reading-progress');
    const counter = document.getElementById('sections-read');
    if (!bar || !counter) return;
    
    const pct = total === 0 ? 0 : (completed / total) * 100;
    bar.style.width = pct + '%';
    counter.textContent = completed;
}

// Initialize progression system on page load
function createManualResetControl() {
    if (document.getElementById('progress-reset-btn')) return;
    const tracker = document.getElementById('character-tracker');
    if (!tracker) return;
    const btn = document.createElement('button');
    btn.id = 'progress-reset-btn';
    btn.className = 'rpg-button reset-progress-btn';
    btn.type = 'button';
    btn.textContent = '🔄 Reset Progress';
    btn.style.marginTop = '8px';
    btn.addEventListener('click', () => {
        localStorage.removeItem('portfolioProgression');
        window.name = '';
        // Provide quick visual feedback
        const notice = document.createElement('div');
        notice.className = 'level-up-notification';
        notice.innerHTML = '<div class="notification-content"><h3>🧹 Progress Reset</h3><p>All XP & unlocks cleared.</p></div>';
        document.body.appendChild(notice);
        setTimeout(() => {
            notice.remove();
            window.location.href = 'index.html';
            setTimeout(() => { window.location.reload(); }, 100);
        }, 1200);
        // Reinitialize state
        const fresh = { currentLevel:0,totalXP:0,unlockedPages:['index.html'],completedPages:[],visitedSections:{} };
        saveProgressionState(fresh);
        updateCharacterDisplay(fresh);
        updateNavigationLocks();
    });
    tracker.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', function() {
        // Fallback: Level up when footer is visible (for unorthodox screens)
        const footer = document.querySelector('footer.game-footer');
        if (footer) {
            let footerTriggered = false;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !footerTriggered) {
                        footerTriggered = true;
                        completeCurrentPage();
                    }
                });
            }, { threshold: 0.9 });
            observer.observe(footer);
        }
    // Update character display
    updateCharacterDisplay();
    // Update navigation locks
    updateNavigationLocks();
    // Remove hard redirect; instead prevent navigation via click handler if locked
    const state = getProgressionState();
    const current = getCurrentPage();
    if (!state.unlockedPages.includes(current) && current !== 'index.html') {
        // Show soft warning overlay once
        const warn = document.createElement('div');
        warn.className = 'level-up-notification';
        warn.innerHTML = '<div class="notification-content"><h3>🔒 Area Locked</h3><p>Return to Main Terminal and complete it to unlock.</p></div>';
        document.body.appendChild(warn);
        setTimeout(()=>warn.remove(),2500);
    }
    // Setup scroll tracking if read sections exist
    if (document.querySelector('.read-section')) {
        setupScrollTracking();
    }
    // Always attach manual reset button (global availability)
    createManualResetControl();
    // Start the portfolio RPG if available
    if (window.PortfolioRPG) {
        window.portfolioGame = new PortfolioRPG();
    }
});