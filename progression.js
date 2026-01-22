// Check if leveling system is enabled
function isLevelingEnabled() {
    const choice = localStorage.getItem('levelingSystemChoice');
    return choice === null || choice === 'enabled';
}

// Unlock all pages when leveling system is disabled
function unlockAllPages() {
    const navLinks = document.querySelectorAll('.quest-menu .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Remove all locked states and markers
        link.classList.remove('locked');
        link.removeAttribute('aria-disabled');
        link.removeAttribute('tabindex');
        link.removeAttribute('data-lock-handler');
        link.style.opacity = '1';
        link.style.pointerEvents = 'auto';
        link.style.cursor = 'pointer';
        
        // Remove any lock icons
        const lockIcon = link.querySelector('.lock-icon');
        if (lockIcon) {
            lockIcon.remove();
        }
        
        // Remove click event handlers by cloning the node
        // This is the most reliable way to remove all event listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
    });
}

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

    if (spriteEl) spriteEl.innerHTML = level.sprite;
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
    { title: 'Intern', sprite: '<svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="white" d="M24 22h-24v-20h24v20zm-1-19h-22v18h22v-18zm-4 13v1h-4v-1h4zm-6.002 1h-10.997l-.001-.914c-.004-1.05-.007-2.136 1.711-2.533.789-.182 1.753-.404 1.892-.709.048-.108-.04-.301-.098-.407-1.103-2.036-1.305-3.838-.567-5.078.514-.863 1.448-1.359 2.562-1.359 1.105 0 2.033.488 2.545 1.339.737 1.224.542 3.033-.548 5.095-.057.106-.144.301-.095.41.14.305 1.118.531 1.83.696 1.779.41 1.773 1.503 1.767 2.56l-.001.9zm-9.998-1h8.999c.003-1.014-.055-1.27-.936-1.473-1.171-.27-2.226-.514-2.57-1.267-.174-.381-.134-.816.119-1.294.921-1.739 1.125-3.199.576-4.111-.332-.551-.931-.855-1.688-.855-.764 0-1.369.31-1.703.871-.542.91-.328 2.401.587 4.09.259.476.303.912.13 1.295-.342.757-1.387.997-2.493 1.252-.966.222-1.022.478-1.021 1.492zm18-3v1h-6v-1h6zm0-3v1h-6v-1h6zm0-3v1h-6v-1h6z"/></svg>', xpNeeded: 40 },
    { title: 'Junior Engineer', sprite: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="white" d="M20.581 19.049c-.55-.446-.336-1.431-.907-1.917.553-3.365-.997-6.331-2.845-8.232-1.551-1.595-1.051-3.147-1.051-4.49 0-2.146-.881-4.41-3.55-4.41-2.853 0-3.635 2.38-3.663 3.738-.068 3.262.659 4.11-1.25 6.484-2.246 2.793-2.577 5.579-2.07 7.057-.237.276-.557.582-1.155.835-1.652.72-.441 1.925-.898 2.78-.13.243-.192.497-.192.74 0 .75.596 1.399 1.679 1.302 1.461-.13 2.809.905 3.681.905.77 0 1.402-.438 1.696-1.041 1.377-.339 3.077-.296 4.453.059.247.691.917 1.141 1.662 1.141 1.631 0 1.945-1.849 3.816-2.475.674-.225 1.013-.879 1.013-1.488 0-.39-.139-.761-.419-.988zm-9.147-10.465c-.319 0-.583-.258-1-.568-.528-.392-1.065-.618-1.059-1.03 0-.283.379-.37.869-.681.526-.333.731-.671 1.249-.671.53 0 .69.268 1.41.579.708.307 1.201.427 1.201.773 0 .355-.741.609-1.158.868-.613.378-.928.73-1.512.73zm1.665-5.215c.882.141.981 1.691.559 2.454l-.355-.145c.184-.543.181-1.437-.435-1.494-.391-.036-.643.48-.697.922-.153-.064-.32-.11-.523-.127.062-.923.658-1.737 1.451-1.61zm-3.403.331c.676-.168 1.075.618 1.078 1.435l-.31.19c-.042-.343-.195-.897-.579-.779-.411.128-.344 1.083-.115 1.279l-.306.17c-.42-.707-.419-2.133.232-2.295zm-2.115 19.243c-1.963-.893-2.63-.69-3.005-.69-.777 0-1.031-.579-.739-1.127.248-.465.171-.952.11-1.343-.094-.599-.111-.794.478-1.052.815-.346 1.177-.791 1.447-1.124.758-.937 1.523.537 2.15 1.85.407.851 1.208 1.282 1.455 2.225.227.871-.71 1.801-1.896 1.261zm6.987-1.874c-1.384.673-3.147.982-4.466.299-.195-.563-.507-.927-.843-1.293.539-.142.939-.814.46-1.489-.511-.721-1.555-1.224-2.61-2.04-.987-.763-1.299-2.644.045-4.746-.655 1.862-.272 3.578.057 4.069.068-.988.146-2.638 1.496-4.615.681-.998.691-2.316.706-3.14l.62.424c.456.337.838.708 1.386.708.81 0 1.258-.466 1.882-.853.244-.15.613-.302.923-.513.52 2.476 2.674 5.454 2.795 7.15.501-1.032-.142-3.514-.142-3.514.842 1.285.909 2.356.946 3.67.589.241 1.221.869 1.279 1.696l-.245-.028c-.126-.919-2.607-2.269-2.83-.539-1.19.181-.757 2.066-.997 3.288-.11.559-.314 1.001-.462 1.466zm4.846-.041c-.985.38-1.65 1.187-2.107 1.688-.88.966-2.044.503-2.168-.401-.131-.966.36-1.493.572-2.574.193-.987-.023-2.506.431-2.668.295 1.753 2.066 1.016 2.47.538.657 0 .712.222.859.837.092.385.219.709.578 1.09.418.447.29 1.133-.635 1.49zm-8-13.006c-.651 0-1.138-.433-1.534-.769-.203-.171.05-.487.253-.315.387.328.777.675 1.281.675.607 0 1.142-.519 1.867-.805.247-.097.388.285.143.382-.704.277-1.269.832-2.01.832z"/></svg>', xpNeeded: 80 },
    { title: 'Automation Specialist', sprite: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="white" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>', xpNeeded: 120 },
    { title: 'Web Developer', sprite: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="white" d="M22.825 7.477c2.111-4.696.548-7.477-3.221-7.477-1.792 0-4.258.93-6.012 1.797-6.239-.068-9.823 4.349-10.989 8.536 1.833-2.229 4.182-4.3 5.688-4.729-4.814 3.932-8.291 10.322-8.291 14.506 0 2.31 1.027 3.89 3.41 3.89 1.955 0 3.529-.929 4.989-1.586 1.36.733 2.861 1.168 4.396 1.168 5.62 0 9.18-2.9 10.766-7.582h-6.014c-.897 1.623-2.144 2.616-4.292 2.616-2.642 0-4.522-2.239-4.588-4.616h15.311c.014-.324.022-.643.022-.957 0-2.092-.342-3.943-1.175-5.566zm-19.66 9.002c.803 2.173 2.433 4.164 4.464 5.482-5.967 3.016-6.978-1.131-4.464-5.482zm5.567-5.479c.087-1.777 1.882-4.312 4.704-4.312 2.641 0 4.497 2.224 4.562 4.312h-9.266zm8.579-8.438c3.276-1.529 7.314-1.343 5.056 4.117-1.053-1.619-2.676-2.989-5.056-4.117z"/></svg>', xpNeeded: 160 },
    { title: 'You made it this far, send a message!', sprite: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6ZM4 18L4 9.46455L10.9998 13.5069C11.6187 13.8644 12.3813 13.8644 13.0002 13.5069L20 9.46455V18H4ZM12 11.775L4 7.155V6H20V7.155L12 11.775Z" fill="white"/></svg>', xpNeeded: 0 }
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
    // Don't award XP if leveling system is disabled
    if (!isLevelingEnabled()) {
        return stateOverride || getProgressionState();
    }
    
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
    // Don't show floating XP if leveling is disabled
    if (!isLevelingEnabled()) {
        return;
    }
    
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
    // Don't show notifications if leveling is disabled
    if (!isLevelingEnabled()) {
        return;
    }
    
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
    const areaLine = unlockedPageHref ? `<p style="margin-top:18px;color:#00f7ff;font-size:1.15em;font-weight:bold;animation: dramaticFadeIn 1.2s;"> Unlocked Area: <span style='color:#fff;'>${unlockedPageName}</span></p>` : '';
    notification.innerHTML = `
        <div class="notification-content">
            <h3 style="font-size:2.5em;animation: dramaticPop 1.2s;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><path d="M13.0516 7.64648C13.0598 7.36471 12.8337 7.13182 12.5518 7.13182H11.4486C11.1666 7.13182 10.9403 7.36495 10.9488 7.64685L11.1105 13.0215C11.1115 13.0553 11.1159 13.0882 11.1232 13.1199C11.1747 13.342 11.3738 13.5065 11.6103 13.5065H12.3942C12.6646 13.5065 12.886 13.2914 12.8939 13.0211L13.0516 7.64648Z" fill="white"/><path d="M11.1874 16.7391C11.4143 16.9628 11.686 17.0746 12.0024 17.0746C12.2069 17.0746 12.3955 17.0235 12.5681 16.9212C12.7407 16.8158 12.8797 16.6767 12.9852 16.5042C13.0938 16.3284 13.1498 16.135 13.153 15.9241C13.1498 15.6109 13.0331 15.3424 12.803 15.1187C12.5729 14.895 12.306 14.7831 12.0024 14.7831C11.686 14.7831 11.4143 14.895 11.1874 15.1187C10.9605 15.3424 10.8486 15.6109 10.8518 15.9241C10.8486 16.2405 10.9605 16.5121 11.1874 16.7391Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="white"/></svg> LEVEL UP! <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><path d="M13.0516 7.64648C13.0598 7.36471 12.8337 7.13182 12.5518 7.13182H11.4486C11.1666 7.13182 10.9403 7.36495 10.9488 7.64685L11.1105 13.0215C11.1115 13.0553 11.1159 13.0882 11.1232 13.1199C11.1747 13.342 11.3738 13.5065 11.6103 13.5065H12.3942C12.6646 13.5065 12.886 13.2914 12.8939 13.0211L13.0516 7.64648Z" fill="white"/><path d="M11.1874 16.7391C11.4143 16.9628 11.686 17.0746 12.0024 17.0746C12.2069 17.0746 12.3955 17.0235 12.5681 16.9212C12.7407 16.8158 12.8797 16.6767 12.9852 16.5042C13.0938 16.3284 13.1498 16.135 13.153 15.9241C13.1498 15.6109 13.0331 15.3424 12.803 15.1187C12.5729 14.895 12.306 14.7831 12.0024 14.7831C11.686 14.7831 11.4143 14.895 11.1874 15.1187C10.9605 15.3424 10.8486 15.6109 10.8518 15.9241C10.8486 16.2405 10.9605 16.5121 11.1874 16.7391Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="white"/></svg></h3>
            <p style="color:#ff2a6d;font-size:1.35em;margin:18px 0 0 0;font-weight:bold;animation: dramaticFadeIn 1.5s;">New Clearance: <span style='color:#fff;'>${levelTitle}</span></p>
            <div style="margin-top:22px;animation: dramaticPulse 2.5s infinite alternate;font-size:1.2em;color:#00f7ff;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><g clip-path="url(#clip0_36_883)"><path d="M12 4C11.4477 4 11 3.55229 11 3V1C11 0.447715 11.4477 0 12 0C12.5523 0 13 0.447715 13 1V3C13 3.55229 12.5523 4 12 4Z" fill="white"/><path d="M17.6569 6.34315C17.2663 5.95262 17.2663 5.31946 17.6569 4.92894L19.0711 3.51472C19.4616 3.1242 20.0948 3.1242 20.4853 3.51472C20.8758 3.90525 20.8758 4.53841 20.4853 4.92894L19.0711 6.34315C18.6806 6.73367 18.0474 6.73367 17.6569 6.34315Z" fill="white"/><path d="M21 11C20.4477 11 20 11.4477 20 12C20 12.5523 20.4477 13 21 13H23C23.5523 13 24 12.5523 24 12C24 11.4477 23.5523 11 23 11H21Z" fill="white"/><path d="M17.6569 17.6569C18.0474 17.2663 18.6806 17.2663 19.0711 17.6569L20.4853 19.0711C20.8758 19.4616 20.8758 20.0948 20.4853 20.4853C20.0948 20.8758 19.4616 20.8758 19.0711 20.4853L17.6569 19.0711C17.2663 18.6805 17.2663 18.0474 17.6569 17.6569Z" fill="white"/><path d="M12 24C11.4477 24 11 23.5523 11 23V21C11 20.4477 11.4477 20 12 20C12.5523 20 13 20.4477 13 21V23C13 23.5523 12.5523 24 12 24Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="white"/><path d="M3.51472 3.51472C3.90524 3.1242 4.53841 3.1242 4.92893 3.51472L6.34315 4.92894C6.73367 5.31946 6.73367 5.95263 6.34315 6.34315C5.95262 6.73368 5.31946 6.73368 4.92893 6.34315L3.51472 4.92894C3.1242 4.53841 3.1242 3.90525 3.51472 3.51472Z" fill="white"/><path d="M3.51472 20.4853C3.1242 20.0948 3.1242 19.4616 3.51472 19.0711L4.92894 17.6569C5.31946 17.2663 5.95263 17.2663 6.34315 17.6569C6.73368 18.0474 6.73368 18.6805 6.34315 19.0711L4.92894 20.4853C4.53841 20.8758 3.90525 20.8758 3.51472 20.4853Z" fill="white"/><path d="M0 12C0 11.4477 0.447715 11 1 11H3C3.55229 11 4 11.4477 4 12C4 12.5523 3.55229 13 3 13H1C0.447715 13 0 12.5523 0 12Z" fill="white"/></g><defs><clipPath id="clip0_36_883"><rect width="24" height="24" fill="white"/></clipPath></defs></svg> Abilities Upgraded <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><g clip-path="url(#clip0_36_883)"><path d="M12 4C11.4477 4 11 3.55229 11 3V1C11 0.447715 11.4477 0 12 0C12.5523 0 13 0.447715 13 1V3C13 3.55229 12.5523 4 12 4Z" fill="white"/><path d="M17.6569 6.34315C17.2663 5.95262 17.2663 5.31946 17.6569 4.92894L19.0711 3.51472C19.4616 3.1242 20.0948 3.1242 20.4853 3.51472C20.8758 3.90525 20.8758 4.53841 20.4853 4.92894L19.0711 6.34315C18.6806 6.73367 18.0474 6.73367 17.6569 6.34315Z" fill="white"/><path d="M21 11C20.4477 11 20 11.4477 20 12C20 12.5523 20.4477 13 21 13H23C23.5523 13 24 12.5523 24 12C24 11.4477 23.5523 11 23 11H21Z" fill="white"/><path d="M17.6569 17.6569C18.0474 17.2663 18.6806 17.2663 19.0711 17.6569L20.4853 19.0711C20.8758 19.4616 20.8758 20.0948 20.4853 20.4853C20.0948 20.8758 19.4616 20.8758 19.0711 20.4853L17.6569 19.0711C17.2663 18.6805 17.2663 18.0474 17.6569 17.6569Z" fill="white"/><path d="M12 24C11.4477 24 11 23.5523 11 23V21C11 20.4477 11.4477 20 12 20C12.5523 20 13 20.4477 13 21V23C13 23.5523 12.5523 24 12 24Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="white"/><path d="M3.51472 3.51472C3.90524 3.1242 4.53841 3.1242 4.92893 3.51472L6.34315 4.92894C6.73367 5.31946 6.73367 5.95263 6.34315 6.34315C5.95262 6.73368 5.31946 6.73368 4.92893 6.34315L3.51472 4.92894C3.1242 4.53841 3.1242 3.90525 3.51472 3.51472Z" fill="white"/><path d="M3.51472 20.4853C3.1242 20.0948 3.1242 19.4616 3.51472 19.0711L4.92894 17.6569C5.31946 17.2663 5.95263 17.2663 6.34315 17.6569C6.73368 18.0474 6.73368 18.6805 6.34315 19.0711L4.92894 20.4853C4.53841 20.8758 3.90525 20.8758 3.51472 20.4853Z" fill="white"/><path d="M0 12C0 11.4477 0.447715 11 1 11H3C3.55229 11 4 11.4477 4 12C4 12.5523 3.55229 13 3 13H1C0.447715 13 0 12.5523 0 12Z" fill="white"/></g><defs><clipPath id="clip0_36_883"><rect width="24" height="24" fill="white"/></clipPath></defs></svg></div>
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
                    lockIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C9.23858 1 7 3.23858 7 6V9L5 9.00003C3.89543 9.00003 3 9.89546 3 11V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V11C21 9.89546 20.1046 9.00003 19 9.00003H17V6C17 3.23858 14.7614 1 12 1ZM12 3C10.3431 3 9 4.34315 9 6V9H15V6C15 4.34315 13.6569 3 12 3ZM5 11L5 19H19V11H5Z" fill="white"/></svg>';
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
    // Don't process completions if leveling is disabled
    if (!isLevelingEnabled()) {
        return;
    }
    
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
    // If leveling is disabled, all pages are unlocked
    if (!isLevelingEnabled()) {
        unlockAllPages();
        return;
    }
    
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
                    lockNote.innerHTML = '<div class="notification-content"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;"><path d="M12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C9.23858 1 7 3.23858 7 6V9L5 9.00003C3.89543 9.00003 3 9.89546 3 11V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V11C21 9.89546 20.1046 9.00003 19 9.00003H17V6C17 3.23858 14.7614 1 12 1ZM12 3C10.3431 3 9 4.34315 9 6V9H15V6C15 4.34315 13.6569 3 12 3ZM5 11L5 19H19V11H5Z" fill="white"/></svg>Locked</h3><p>Complete previous page to unlock this area.</p></div>';
                    document.body.appendChild(lockNote);
                    setTimeout(() => lockNote.remove(), 1800);
                });
            }
            // Keep link clickable for focus but prevent navigation via handler
            if (!link.querySelector('.lock-icon')) {
                const span = document.createElement('span');
                span.className = 'lock-icon';
                span.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C9.23858 1 7 3.23858 7 6V9L5 9.00003C3.89543 9.00003 3 9.89546 3 11V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V11C21 9.89546 20.1046 9.00003 19 9.00003H17V6C17 3.23858 14.7614 1 12 1ZM12 3C10.3431 3 9 4.34315 9 6V9H15V6C15 4.34315 13.6569 3 12 3ZM5 11L5 19H19V11H5Z" fill="white"/></svg>';
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
    
    // Skip ALL scroll tracking for Projects page (uses click-based XP)
    if (currentPage === 'Projects.html') {
        let state = getProgressionState();
        if (!state.visitedSections[currentPage]) {
            state.visitedSections[currentPage] = [];
        }
        saveProgressionState(state);
        updateCharacterDisplay(state);
        
        const readSections = Array.from(document.querySelectorAll('.read-section'));
        const totalSections = readSections.length;
        const visitedCount = state.visitedSections[currentPage].length;
        
        if (visitedCount >= totalSections) {
            updateReadingProgress(totalSections, totalSections);
        } else {
            updateReadingProgress(totalSections, visitedCount);
        }
        
        // Don't set up any observers or scroll listeners for Projects page
        return;
    }
    
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
                // NEVER award scroll-based XP on Projects page
                if (currentPage === 'Projects.html') return;
                
                const sectionId = entry.target.getAttribute('data-section');
                if (sectionId && !state.visitedSections[currentPage].includes(sectionId)) {
                    // Check if section is above viewport (scrolled past, not below)
                    const rect = entry.target.getBoundingClientRect();
                    if (rect.bottom < 0) {
                        state.visitedSections[currentPage].push(sectionId);
                        const xpValue = parseInt(entry.target.getAttribute('data-xp'), 10) || 10;
                        state = gainXP(xpValue, state);
                        // Always update progress after XP and completion
                        if (state.visitedSections[currentPage].length >= readSections.length) {
                            saveProgressionState(state);
                            completeCurrentPage();
                            // Reload state after completion adjustments
                            state = getProgressionState();
                            updateReadingProgress(readSections.length, readSections.length);
                        } else {
                            saveProgressionState(state);
                            updateReadingProgress(readSections.length, state.visitedSections[currentPage].length);
                        }
                    }
                }
            }
        });
    }, { threshold: 0 });

    revealTargets.forEach(el => observer.observe(el));

    saveProgressionState(state);
    updateCharacterDisplay(state);
    // If page is completed, always show full progress
    if (state.visitedSections[currentPage].length >= readSections.length) {
        updateReadingProgress(readSections.length, readSections.length);
    } else {
        updateReadingProgress(readSections.length, state.visitedSections[currentPage].length);
    }

    // Fallback manual visibility evaluation (in case IntersectionObserver fails)
    let fallbackScheduled = false;
    function fallbackEvaluate() {
        // Skip fallback for Projects page (uses click-based XP)
        if (currentPage === 'Projects.html') return;
        
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
                // NEVER award scroll-based XP on Projects page
                if (page === 'Projects.html') return;
                
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
                // Always show full progress after completion
                if (s.visitedSections[page].length >= sections.length) {
                    updateReadingProgress(sections.length, sections.length);
                } else {
                    updateReadingProgress(sections.length, s.visitedSections[page].length);
                }
                if (s.visitedSections[page].length >= sections.length) {
                    completeCurrentPage();
                }
            }
        });
    }
    
    // Don't attach scroll listeners for Projects page
    if (currentPage !== 'Projects.html') {
        window.addEventListener('scroll', fallbackEvaluate, { passive: true });
        window.addEventListener('resize', fallbackEvaluate);
        // Delayed evaluations to catch late layout
        setTimeout(fallbackEvaluate, 300);
        setTimeout(fallbackEvaluate, 900);
    }
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
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 4px;"><path d="M20 12C20 16.4183 16.4183 20 12 20C8.22522 20 5.06106 17.3856 4.21945 13.8688C4.10205 13.3782 3.68329 13 3.17885 13H3.15358C2.56224 13 2.09591 13.5126 2.21895 14.091C3.18034 18.6101 7.19429 22 12 22C17.5229 22 22 17.5228 22 12C22 6.47715 17.5229 2 12 2C8.41135 2 5.26421 3.89033 3.5 6.72958V4.5C3.5 3.94772 3.05228 3.5 2.5 3.5C2.46548 3.5 2.43137 3.50175 2.39776 3.50516C1.8935 3.55637 1.5 3.98223 1.5 4.5V9C1.5 9.26522 1.60536 9.51957 1.79289 9.70711C1.98043 9.89464 2.23478 10 2.5 10L7 10C7.55229 10 8 9.55228 8 9C8 8.44771 7.55228 8 7 8L5.07026 8C6.4535 5.60879 9.03887 4 12 4C16.4183 4 20 7.58172 20 12Z" fill="white"/><path d="M12 7.5C11.4477 7.5 11 7.94772 11 8.5V12C11 12.3573 11.1906 12.6874 11.5 12.866L14.9641 14.866C15.0239 14.9005 15.0858 14.9282 15.1488 14.9492C15.5901 15.0963 16.0885 14.9185 16.3301 14.5C16.6063 14.0217 16.4424 13.4101 15.9641 13.134L13 11.4227V8.5C13 7.94772 12.5523 7.5 12 7.5Z" fill="white"/></svg> Reset Progress';
    btn.style.marginTop = '8px';
    btn.addEventListener('click', () => {
        localStorage.removeItem('portfolioProgression');
        window.name = '';
        // Provide quick visual feedback
        const notice = document.createElement('div');
        notice.className = 'level-up-notification';
        notice.innerHTML = '<div class="notification-content"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.8284 8.17157L14 12L17.8284 15.8284C18.5786 16.5786 19 17.596 19 18.6569V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V18.6569C5 17.596 5.42143 16.5786 6.17157 15.8284L10 12L6.17157 8.17157C5.42143 7.42143 5 6.40401 5 5.34315V4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V5.34315C19 6.40401 18.5786 7.42143 17.8284 8.17157ZM12 12.8284L16.4142 17.2426C16.7893 17.6177 17 18.1264 17 18.6569V20H7V18.6569C7 18.1264 7.21071 17.6177 7.58579 17.2426L12 12.8284ZM12 11.1716L16.4142 6.75736C16.7893 6.38229 17 5.87358 17 5.34315V4H7V5.34315C7 5.87358 7.21071 6.38229 7.58579 6.75736L12 11.1716Z" fill="white"/></svg> Progress Reset</h3><p>All XP & unlocks cleared.</p></div>';
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
        // Skip for Projects page (uses click-based XP only)
        const currentPage = getCurrentPage();
        if (currentPage !== 'Projects.html') {
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
        }
    // Update character display
    updateCharacterDisplay();
    // Update navigation locks
    updateNavigationLocks();
    // Remove hard redirect; instead prevent navigation via click handler if locked
    // Only show area locked message if leveling is enabled
    if (isLevelingEnabled()) {
        const state = getProgressionState();
        const current = getCurrentPage();
        if (!state.unlockedPages.includes(current) && current !== 'index.html') {
            // Show soft warning overlay once
            const warn = document.createElement('div');
            warn.className = 'level-up-notification';
            warn.innerHTML = '<div class="notification-content"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;"><path d="M12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C9.23858 1 7 3.23858 7 6V9L5 9.00003C3.89543 9.00003 3 9.89546 3 11V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V11C21 9.89546 20.1046 9.00003 19 9.00003H17V6C17 3.23858 14.7614 1 12 1ZM12 3C10.3431 3 9 4.34315 9 6V9H15V6C15 4.34315 13.6569 3 12 3ZM5 11L5 19H19V11H5Z" fill="white"/></svg>Area Locked</h3><p>Return to Main Terminal and complete it to unlock.</p></div>';
            document.body.appendChild(warn);
            setTimeout(()=>warn.remove(),2500);
        }
    }
    // Setup scroll tracking if read sections exist
    if (document.querySelector('.read-section')) {
        setupScrollTracking();
    }
    // Always attach manual reset button (global availability)
    createManualResetControl();
    // Setup appropriate XP tracker toggle based on screen size
    if (window.innerWidth <= 768) {
        setupMobileXPToggle();
    } else {
        setupDesktopXPToggle();
    }
    // Start the portfolio RPG if available
    if (window.PortfolioRPG) {
        window.portfolioGame = new PortfolioRPG();
    }
});

// Mobile XP Tracker Toggle Function
function setupMobileXPToggle() {
    // Don't setup toggle if leveling is disabled
    if (!isLevelingEnabled()) {
        return;
    }
    
    // Check if already initialized
    if (document.querySelector('.mobile-xp-toggle')) {
        return;
    }
    
    const tracker = document.querySelector('.character-tracker') || document.getElementById('character-tracker');
    if (!tracker) {
        console.log('No character tracker found');
        return;
    }
    
    // Create toggle button
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'mobile-xp-toggle';
    toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.0001 12C16.0001 14.2091 14.2092 16 12.0001 16C9.79097 16 8.0001 14.2091 8.0001 12C8.0001 9.79086 9.79097 8 12.0001 8C14.2092 8 16.0001 9.79086 16.0001 12ZM14.0001 12C14.0001 13.1046 13.1047 14 12.0001 14C10.8955 14 10.0001 13.1046 10.0001 12C10.0001 10.8954 10.8955 10 12.0001 10C13.1047 10 14.0001 10.8954 14.0001 12Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.6059 12.7781C22.8745 12.2893 22.8745 11.7107 22.6059 11.2219C21.5011 9.21142 18.0534 4 12.0001 4C5.94677 4 2.49915 9.21141 1.39435 11.2219C1.12571 11.7107 1.12571 12.2893 1.39435 12.7781C2.49915 14.7886 5.94677 20 12.0001 20C18.0534 20 21.5011 14.7886 22.6059 12.7781ZM20.7495 12C20.2262 11.0814 19.2538 9.61152 17.8334 8.35493C16.3304 7.02516 14.4072 6 12.0001 6C9.59298 6 7.66981 7.02516 6.16677 8.35493C4.74644 9.61152 3.77399 11.0814 3.25071 12C3.77399 12.9186 4.74644 14.3885 6.16677 15.6451C7.66981 16.9748 9.59298 18 12.0001 18C14.4072 18 16.3304 16.9748 17.8334 15.6451C19.2538 14.3885 20.2262 12.9186 20.7495 12Z" fill="white"/></svg>';
    toggleBtn.setAttribute('aria-label', 'Toggle XP Tracker');
    
    document.body.appendChild(toggleBtn);
    
    // Toggle functionality
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tracker.classList.toggle('expanded');
        toggleBtn.classList.toggle('active');
        
        // Move button to tracker when active
        if (tracker.classList.contains('expanded')) {
            tracker.appendChild(toggleBtn);
            toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.41431 3.00005C3.02379 2.60952 2.39062 2.60952 2.0001 3.00005C1.60958 3.39057 1.60958 4.02374 2.0001 4.41426L4.63205 7.04621C2.99403 8.55552 1.92448 10.2572 1.39435 11.2219C1.12571 11.7108 1.12571 12.2893 1.39435 12.7782C2.49915 14.7886 5.94677 20.0001 12.0001 20.0001C13.7147 20.0001 15.2202 19.5819 16.5227 18.9369L19.5859 22.0001C19.9764 22.3906 20.6096 22.3906 21.0001 22.0001C21.3906 21.6095 21.3906 20.9764 21.0001 20.5858L18.2746 17.8604M3.25071 12C3.75923 11.1073 4.69194 9.69405 6.04764 8.4618L8.23423 10.6484C8.08267 11.0706 8.0001 11.5257 8.0001 12C8.0001 14.2092 9.79096 16.0001 12.0001 16.0001C12.4745 16.0001 12.9295 15.9175 13.3518 15.7659L15.0097 17.4239C14.104 17.7849 13.1028 18.0001 12.0001 18.0001C9.59297 18.0001 7.66981 16.9749 6.16676 15.6451C4.74644 14.3885 3.77399 12.9187 3.25071 12Z" fill="white"/><path d="M3.41431 3.00005L6.21165 5.79738L3.41431 3.00005Z" fill="white"/><path d="M6.21165 5.79738L7.65919 7.24486L6.21165 5.79738Z" fill="white"/><path d="M16.842 16.4278L18.2746 17.8604L16.842 16.4278Z" fill="white"/><path d="M15.9396 12.6969L11.3033 8.06053C11.5296 8.02078 11.7624 8.00005 12.0001 8.00005C14.2092 8.00005 16.0001 9.79091 16.0001 12C16.0001 12.2377 15.9794 12.4706 15.9396 12.6969Z" fill="white"/><path d="M18.3767 15.1339C19.5046 14.0071 20.2958 12.7964 20.7495 12C20.2262 11.0814 19.2538 9.61157 17.8334 8.35498C16.3304 7.0252 14.4072 6.00005 12.0001 6.00005C11.1401 6.00005 10.3419 6.1309 9.60251 6.35975L8.04522 4.80245C9.21217 4.30774 10.5292 4.00004 12.0001 4.00004C18.0534 4.00004 21.501 9.21146 22.6058 11.2219C22.8745 11.7108 22.8745 12.2893 22.6058 12.7782C22.1228 13.6573 21.1918 15.1483 19.7909 16.5481L18.3767 15.1339Z" fill="white"/></svg>';
        } else {
            document.body.appendChild(toggleBtn);
            toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.0001 12C16.0001 14.2091 14.2092 16 12.0001 16C9.79097 16 8.0001 14.2091 8.0001 12C8.0001 9.79086 9.79097 8 12.0001 8C14.2092 8 16.0001 9.79086 16.0001 12ZM14.0001 12C14.0001 13.1046 13.1047 14 12.0001 14C10.8955 14 10.0001 13.1046 10.0001 12C10.0001 10.8954 10.8955 10 12.0001 10C13.1047 10 14.0001 10.8954 14.0001 12Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.6059 12.7781C22.8745 12.2893 22.8745 11.7107 22.6059 11.2219C21.5011 9.21142 18.0534 4 12.0001 4C5.94677 4 2.49915 9.21141 1.39435 11.2219C1.12571 11.7107 1.12571 12.2893 1.39435 12.7781C2.49915 14.7886 5.94677 20 12.0001 20C18.0534 20 21.5011 14.7886 22.6059 12.7781ZM20.7495 12C20.2262 11.0814 19.2538 9.61152 17.8334 8.35493C16.3304 7.02516 14.4072 6 12.0001 6C9.59298 6 7.66981 7.02516 6.16677 8.35493C4.74644 9.61152 3.77399 11.0814 3.25071 12C3.77399 12.9186 4.74644 14.3885 6.16677 15.6451C7.66981 16.9748 9.59298 18 12.0001 18C14.4072 18 16.3304 16.9748 17.8334 15.6451C19.2538 14.3885 20.2262 12.9186 20.7495 12Z" fill="white"/></svg>';
        }
    });
    
    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (tracker.classList.contains('expanded') && 
            !tracker.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
            tracker.classList.remove('expanded');
            toggleBtn.classList.remove('active');
            document.body.appendChild(toggleBtn);
            toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.0001 12C16.0001 14.2091 14.2092 16 12.0001 16C9.79097 16 8.0001 14.2091 8.0001 12C8.0001 9.79086 9.79097 8 12.0001 8C14.2092 8 16.0001 9.79086 16.0001 12ZM14.0001 12C14.0001 13.1046 13.1047 14 12.0001 14C10.8955 14 10.0001 13.1046 10.0001 12C10.0001 10.8954 10.8955 10 12.0001 10C13.1047 10 14.0001 10.8954 14.0001 12Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.6059 12.7781C22.8745 12.2893 22.8745 11.7107 22.6059 11.2219C21.5011 9.21142 18.0534 4 12.0001 4C5.94677 4 2.49915 9.21141 1.39435 11.2219C1.12571 11.7107 1.12571 12.2893 1.39435 12.7781C2.49915 14.7886 5.94677 20 12.0001 20C18.0534 20 21.5011 14.7886 22.6059 12.7781ZM20.7495 12C20.2262 11.0814 19.2538 9.61152 17.8334 8.35493C16.3304 7.02516 14.4072 6 12.0001 6C9.59298 6 7.66981 7.02516 6.16677 8.35493C4.74644 9.61152 3.77399 11.0814 3.25071 12C3.77399 12.9186 4.74644 14.3885 6.16677 15.6451C7.66981 16.9748 9.59298 18 12.0001 18C14.4072 18 16.3304 16.9748 17.8334 15.6451C19.2538 14.3885 20.2262 12.9186 20.7495 12Z" fill="white"/></svg>';
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Switch to desktop toggle
                if (!document.querySelector('.desktop-xp-toggle')) {
                    setupDesktopXPToggle();
                }
                if (toggleBtn && toggleBtn.parentNode) {
                    toggleBtn.remove();
                }
            } else if (!document.querySelector('.mobile-xp-toggle')) {
                // Remove desktop toggle and switch to mobile
                const desktopToggle = document.querySelector('.desktop-xp-toggle');
                if (desktopToggle && desktopToggle.parentNode) {
                    desktopToggle.remove();
                }
                setupMobileXPToggle();
            }
        }, 250);
    });
}

// Desktop XP Tracker Toggle Function
function setupDesktopXPToggle() {
    // Don't setup toggle if leveling is disabled
    if (!isLevelingEnabled()) {
        return;
    }
    
    // Check if already initialized
    if (document.querySelector('.desktop-xp-toggle')) {
        return;
    }
    
    const tracker = document.querySelector('.character-tracker') || document.getElementById('character-tracker');
    if (!tracker) {
        console.log('No character tracker found');
        return;
    }
    
    // Create toggle button
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'desktop-xp-toggle';
    toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.0001 12C16.0001 14.2091 14.2092 16 12.0001 16C9.79097 16 8.0001 14.2091 8.0001 12C8.0001 9.79086 9.79097 8 12.0001 8C14.2092 8 16.0001 9.79086 16.0001 12ZM14.0001 12C14.0001 13.1046 13.1047 14 12.0001 14C10.8955 14 10.0001 13.1046 10.0001 12C10.0001 10.8954 10.8955 10 12.0001 10C13.1047 10 14.0001 10.8954 14.0001 12Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.6059 12.7781C22.8745 12.2893 22.8745 11.7107 22.6059 11.2219C21.5011 9.21142 18.0534 4 12.0001 4C5.94677 4 2.49915 9.21141 1.39435 11.2219C1.12571 11.7107 1.12571 12.2893 1.39435 12.7781C2.49915 14.7886 5.94677 20 12.0001 20C18.0534 20 21.5011 14.7886 22.6059 12.7781ZM20.7495 12C20.2262 11.0814 19.2538 9.61152 17.8334 8.35493C16.3304 7.02516 14.4072 6 12.0001 6C9.59298 6 7.66981 7.02516 6.16677 8.35493C4.74644 9.61152 3.77399 11.0814 3.25071 12C3.77399 12.9186 4.74644 14.3885 6.16677 15.6451C7.66981 16.9748 9.59298 18 12.0001 18C14.4072 18 16.3304 16.9748 17.8334 15.6451C19.2538 14.3885 20.2262 12.9186 20.7495 12Z" fill="white"/></svg>';
    toggleBtn.setAttribute('aria-label', 'Toggle XP Tracker');
    toggleBtn.title = 'Show/Hide XP Progress';
    
    document.body.appendChild(toggleBtn);
    
    // Toggle functionality
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tracker.classList.toggle('expanded');
        toggleBtn.classList.toggle('active');
        
        // Change icon based on state
        if (tracker.classList.contains('expanded')) {
            // Show closed eye icon when tracker is visible
            toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.41431 3.00005C3.02379 2.60952 2.39062 2.60952 2.0001 3.00005C1.60958 3.39057 1.60958 4.02374 2.0001 4.41426L4.63205 7.04621C2.99403 8.55552 1.92448 10.2572 1.39435 11.2219C1.12571 11.7108 1.12571 12.2893 1.39435 12.7782C2.49915 14.7886 5.94677 20.0001 12.0001 20.0001C13.7147 20.0001 15.2202 19.5819 16.5227 18.9369L19.5859 22.0001C19.9764 22.3906 20.6096 22.3906 21.0001 22.0001C21.3906 21.6095 21.3906 20.9764 21.0001 20.5858L3.41431 3.00005ZM15.0097 17.4239C14.104 17.7849 13.1028 18.0001 12.0001 18.0001C9.59297 18.0001 7.66981 16.9749 6.16676 15.6451C4.74644 14.3885 3.77399 12.9187 3.25071 12C3.75923 11.1073 4.69194 9.69405 6.04764 8.4618L8.23423 10.6484C8.08267 11.0706 8.0001 11.5257 8.0001 12C8.0001 14.2092 9.79096 16.0001 12.0001 16.0001C12.4745 16.0001 12.9295 15.9175 13.3518 15.7659L15.0097 17.4239Z" fill="white"/><path d="M15.9396 12.6969L11.3033 8.06053C11.5296 8.02078 11.7624 8.00005 12.0001 8.00005C14.2092 8.00005 16.0001 9.79091 16.0001 12C16.0001 12.2377 15.9794 12.4706 15.9396 12.6969Z" fill="white"/><path d="M18.3767 15.1339L19.7909 16.5481C21.1918 15.1483 22.1228 13.6573 22.6058 12.7782C22.8745 12.2893 22.8745 11.7108 22.6058 11.2219C21.501 9.21146 18.0534 4.00004 12.0001 4.00004C10.5292 4.00004 9.21217 4.30774 8.04522 4.80245L9.60251 6.35975C10.3419 6.1309 11.1401 6.00005 12.0001 6.00005C14.4072 6.00005 16.3304 7.0252 17.8334 8.35498C19.2538 9.61157 20.2262 11.0814 20.7495 12C20.2958 12.7964 19.5046 14.0071 18.3767 15.1339Z" fill="white"/></svg>';
        } else {
            // Show open eye icon when tracker is hidden
            toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.0001 12C16.0001 14.2091 14.2092 16 12.0001 16C9.79097 16 8.0001 14.2091 8.0001 12C8.0001 9.79086 9.79097 8 12.0001 8C14.2092 8 16.0001 9.79086 16.0001 12ZM14.0001 12C14.0001 13.1046 13.1047 14 12.0001 14C10.8955 14 10.0001 13.1046 10.0001 12C10.0001 10.8954 10.8955 10 12.0001 10C13.1047 10 14.0001 10.8954 14.0001 12Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.6059 12.7781C22.8745 12.2893 22.8745 11.7107 22.6059 11.2219C21.5011 9.21142 18.0534 4 12.0001 4C5.94677 4 2.49915 9.21141 1.39435 11.2219C1.12571 11.7107 1.12571 12.2893 1.39435 12.7781C2.49915 14.7886 5.94677 20 12.0001 20C18.0534 20 21.5011 14.7886 22.6059 12.7781ZM20.7495 12C20.2262 11.0814 19.2538 9.61152 17.8334 8.35493C16.3304 7.02516 14.4072 6 12.0001 6C9.59298 6 7.66981 7.02516 6.16677 8.35493C4.74644 9.61152 3.77399 11.0814 3.25071 12C3.77399 12.9186 4.74644 14.3885 6.16677 15.6451C7.66981 16.9748 9.59298 18 12.0001 18C14.4072 18 16.3304 16.9748 17.8334 15.6451C19.2538 14.3885 20.2262 12.9186 20.7495 12Z" fill="white"/></svg>';
        }
    });
    
    // Close when clicking outside on desktop
    document.addEventListener('click', (e) => {
        if (tracker.classList.contains('expanded') && 
            !tracker.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
            tracker.classList.remove('expanded');
            toggleBtn.classList.remove('active');
            // Reset to open eye icon
            toggleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.0001 12C16.0001 14.2091 14.2092 16 12.0001 16C9.79097 16 8.0001 14.2091 8.0001 12C8.0001 9.79086 9.79097 8 12.0001 8C14.2092 8 16.0001 9.79086 16.0001 12ZM14.0001 12C14.0001 13.1046 13.1047 14 12.0001 14C10.8955 14 10.0001 13.1046 10.0001 12C10.0001 10.8954 10.8955 10 12.0001 10C13.1047 10 14.0001 10.8954 14.0001 12Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.6059 12.7781C22.8745 12.2893 22.8745 11.7107 22.6059 11.2219C21.5011 9.21142 18.0534 4 12.0001 4C5.94677 4 2.49915 9.21141 1.39435 11.2219C1.12571 11.7107 1.12571 12.2893 1.39435 12.7781C2.49915 14.7886 5.94677 20 12.0001 20C18.0534 20 21.5011 14.7886 22.6059 12.7781ZM20.7495 12C20.2262 11.0814 19.2538 9.61152 17.8334 8.35493C16.3304 7.02516 14.4072 6 12.0001 6C9.59298 6 7.66981 7.02516 6.16677 8.35493C4.74644 9.61152 3.77399 11.0814 3.25071 12C3.77399 12.9186 4.74644 14.3885 6.16677 15.6451C7.66981 16.9748 9.59298 18 12.0001 18C14.4072 18 16.3304 16.9748 17.8334 15.6451C19.2538 14.3885 20.2262 12.9186 20.7495 12Z" fill="white"/></svg>';
        }
    });
}

// Initialize leveling system based on user choice
function initializeLevelingSystem() {
    const tracker = document.getElementById('character-tracker');
    const desktopToggle = document.querySelector('.desktop-xp-toggle');
    
    if (!isLevelingEnabled()) {
        // Modify XP tracker to show "no games for you :(" message
        if (tracker) {
            tracker.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px; text-align: center; width: 100%;">
                    <p style="color: #ff2a6d; font-family: 'Orbitron', sans-serif; font-size: 0.95rem; margin: 0; font-weight: 600; letter-spacing: 0.5px;">enable leveling to enjoy the full experience</p>
                </div>
            `;
            tracker.style.background = 'rgba(26, 26, 46, 0.95)';
            tracker.style.border = '2px solid #ff2a6d';
            tracker.style.display = 'flex';
        }
        // Hide toggle button if it exists
        if (desktopToggle) {
            desktopToggle.style.display = 'none';
        }
        
        // Hide all XP indicators
        const xpIndicators = document.querySelectorAll('.xp-indicator');
        xpIndicators.forEach(indicator => {
            indicator.style.display = 'none';
        });
        
        // Unlock all pages in navigation
        unlockAllPages();
    } else {
        // Show tracker if enabled - restore original structure if it was modified
        if (tracker) {
            // Check if tracker has been modified (doesn't have the normal structure)
            if (!tracker.querySelector('.character-avatar-display')) {
                // Restore original tracker structure
                tracker.innerHTML = `
                    <div class="character-avatar-display">
                        <div class="character-sprite" id="character-sprite"><img src="linkedin.jpg" alt="Markuss Šube" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></div>
                    </div>
                    <div class="character-info-display">
                        <h4 id="character-title">Intern</h4>
                        <div class="xp-progress">
                            <div class="xp-bar-fill" id="xp-bar-fill" style="width: 0%"></div>
                        </div>
                        <p class="xp-text"><span id="current-xp">0</span> / <span id="needed-xp">100</span> XP</p>
                    </div>
                `;
                tracker.style.background = '';
                tracker.style.border = '';
                // Update the display with current progress
                updateCharacterDisplay();
            }
            tracker.style.display = '';
        }
        if (desktopToggle) {
            desktopToggle.style.display = '';
        }
    }
}

// Check on page load if we need to hide/show elements
// Only auto-initialize if user hasn't been shown the modal yet (first visit scenario after reload)
if (typeof window !== 'undefined') {
    const hasChosenLeveling = localStorage.getItem('levelingSystemChoice');
    // Only auto-initialize if a choice has been made, otherwise let the modal handle it
    if (hasChosenLeveling) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initializeLevelingSystem();
                // Update character display if leveling is enabled
                if (isLevelingEnabled()) {
                    updateCharacterDisplay();
                }
            });
        } else {
            initializeLevelingSystem();
            // Update character display if leveling is enabled
            if (isLevelingEnabled()) {
                updateCharacterDisplay();
            }
        }
    }
}