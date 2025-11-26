// RPG Portfolio Game Engine
// Core game mechanics for the portfolio RPG experience

class PortfolioRPG {
  constructor() {
    this.player = this.loadPlayer();
    this.quests = this.initializeQuests();
    this.achievements = this.loadAchievements();
    this.gameState = 'menu'; // menu, playing, character-creation
    this.currentQuest = null;
    this.soundEnabled = true;
    
    // Game constants
    this.maxLevel = 10;
    this.xpPerLevel = 100;
    
    this.initializeGame();
  }

  // Initialize default player data
  loadPlayer() {
    const savedPlayer = localStorage.getItem('portfolioRPG_player');
    if (savedPlayer) {
      return JSON.parse(savedPlayer);
    }
    
    return {
      name: 'Adventurer',
      class: 'Explorer',
      level: 1,
      xp: 0,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      unlockedSections: ['about'],
      completedQuests: [],
      achievements: [],
      stats: {
        curiosity: 5,
        technical: 3,
        communication: 3,
        creativity: 4
      }
    };
  }

  // Save player data to localStorage
  savePlayer() {
    localStorage.setItem('portfolioRPG_player', JSON.stringify(this.player));
  }

  // Initialize quest system
  initializeQuests() {
    return {
      'discover-about': {
        id: 'discover-about',
        title: 'Learn About the Developer',
        description: 'Read through the About section to understand who Markuss is',
        type: 'reading',
        xpReward: 50,
        unlocks: ['experience'],
        completed: false,
        steps: [
          { id: 'read-bio-1', text: 'Read first paragraph', completed: false },
          { id: 'read-bio-2', text: 'Read second paragraph', completed: false },
          { id: 'read-bio-3', text: 'Read third paragraph', completed: false }
        ]
      },
      'unlock-experience': {
        id: 'unlock-experience',
        title: 'Discover Professional Background',
        description: 'Complete a mini-game to unlock experience details',
        type: 'minigame',
        xpReward: 75,
        unlocks: ['projects'],
        completed: false,
        minigame: 'skill-matcher'
      },
      'explore-projects': {
        id: 'explore-projects',
        title: 'Examine the Artifacts',
        description: 'Discover each project through interactive exploration',
        type: 'collection',
        xpReward: 100,
        unlocks: ['contact'],
        completed: false,
        items: [
          { id: 'nordpool', name: 'NordPool Solution', discovered: false },
          { id: 'research', name: 'Scientific Research', discovered: false },
          { id: 'jmeter', name: 'JMeter Testing', discovered: false },
          { id: 'portfolio', name: 'Web Development', discovered: false }
        ]
      },
      'establish-contact': {
        id: 'establish-contact',
        title: 'Join the Guild',
        description: 'Complete the contact ritual to establish communication',
        type: 'interaction',
        xpReward: 50,
        unlocks: ['mastery'],
        completed: false,
        interactions: ['view-profile', 'send-message']
      }
    };
  }

  // Load achievements from localStorage
  loadAchievements() {
    const saved = localStorage.getItem('portfolioRPG_achievements');
    return saved ? JSON.parse(saved) : [];
  }

  // Save achievements
  saveAchievements() {
    localStorage.setItem('portfolioRPG_achievements', JSON.stringify(this.achievements));
  }

  // Initialize game systems
  initializeGame() {
    this.attachEventListeners();
    this.updatePlayerLevel();
  }

  // Update player level display
  updatePlayerLevel() {
    const levelElements = document.querySelectorAll('[data-player-level]');
    levelElements.forEach(el => {
      el.textContent = this.player.level;
    });
  }

  // Attach event listeners
  attachEventListeners() {
    // Game interaction controls
    document.addEventListener('click', (e) => {
      if (e.target.id === 'start-skill-matcher') {
        if (window.portfolioMiniGames) {
          window.portfolioMiniGames.startSkillMatcher();
        }
      } else if (e.target.id === 'start-project-discovery') {
        if (window.portfolioMiniGames) {
          window.portfolioMiniGames.startProjectDiscovery();
        }
      } else if (e.target.id === 'goto-inventory') {
        window.location.href = 'Projects.html';
      } else if (e.target.id === 'goto-guild-hall') {
        window.location.href = 'Contact.html';
      } else if (e.target.id === 'restart-journey') {
        this.resetGame();
      }
    });

    // Reading progress tracking
    this.trackReadingProgress();
    
    // Initialize inventory filtering if on projects page
    this.initializeInventoryFiltering();
  }

  // Initialize inventory filtering
  initializeInventoryFiltering() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const artifactItems = document.querySelectorAll('.artifact-item');
    
    if (!categoryTabs.length || !artifactItems.length) return;
    
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        categoryTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        const category = tab.dataset.category;
        
        // Show/hide artifacts based on category
        artifactItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease-out';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Track reading progress for quest completion
  trackReadingProgress() {
    let completedSteps = 0;
    const totalSteps = 3;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const element = entry.target;
          if (element.dataset.questStep && !element.dataset.completed) {
            this.completeQuestStep('discover-about', element.dataset.questStep);
            element.dataset.completed = 'true';
            this.showFloatingXP(element, '+10 XP');
            
            // Update progress bar
            completedSteps++;
            const progressFill = document.getElementById('reading-progress');
            const progressCount = document.getElementById('progress-count');
            
            if (progressFill) {
              progressFill.style.width = (completedSteps / totalSteps * 100) + '%';
            }
            if (progressCount) {
              progressCount.textContent = completedSteps;
            }
            
            // Add visual feedback to the story segment
            element.style.background = 'rgba(78, 205, 196, 0.1)';
            element.style.borderColor = '#4ecdc4';
            
            // Show completion indicator
            const reward = element.querySelector('.story-reward');
            if (reward) {
              reward.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
              reward.textContent = '✅ +10 XP - Chapter Complete!';
            }
          }
        }
      });
    }, { threshold: 0.5 });

    // Observe about section paragraphs
    document.querySelectorAll('[data-quest-step]').forEach((element) => {
      observer.observe(element);
    });
  }

  // Complete a quest step
  completeQuestStep(questId, stepId) {
    const quest = this.quests[questId];
    if (!quest || quest.completed) return;

    const step = quest.steps?.find(s => s.id === stepId);
    if (step && !step.completed) {
      step.completed = true;
      this.giveXP(10);
      
      // Check if all steps are completed
      if (quest.steps.every(s => s.completed)) {
        this.completeQuest(questId);
      }
    }
  }

  // Complete a quest
  completeQuest(questId) {
    const quest = this.quests[questId];
    if (!quest || quest.completed) return;

    quest.completed = true;
    this.player.completedQuests.push(questId);
    this.giveXP(quest.xpReward);

    // Unlock new sections
    if (quest.unlocks) {
      quest.unlocks.forEach(section => {
        if (!this.player.unlockedSections.includes(section)) {
          this.player.unlockedSections.push(section);
          this.unlockNavigation(section);
        }
      });
    }

    // Show quest completion on page
    if (questId === 'discover-about') {
      this.showAboutQuestCompletion();
    } else if (questId === 'unlock-experience') {
      this.showExperienceUnlocked();
    } else if (questId === 'explore-projects') {
      this.showProjectsUnlocked();
    }

    this.savePlayer();
    this.showQuestComplete(quest);
    this.updateUI();
  }

  // Show About quest completion
  showAboutQuestCompletion() {
    const questStatus = document.getElementById('quest-about-status');
    const completionDiv = document.getElementById('quest-about-completion');
    
    if (questStatus) {
      questStatus.textContent = '✅ Complete';
      questStatus.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    }
    
    if (completionDiv) {
      completionDiv.style.display = 'block';
      completionDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Unlock achievement
    this.unlockAchievement('Quest Master', 'first-quest', 'Completed your first quest!', '🏆');
  }

  // Show Experience unlocked
  showExperienceUnlocked() {
    this.unlockAchievement('Skill Master', 'skill-matcher', 'Completed the Skill Matcher challenge!', '🎯');
    
    // Show project discovery button
    const projectButton = document.getElementById('start-project-discovery');
    if (projectButton) {
      projectButton.style.display = 'inline-block';
      
      // Add shine effect
      projectButton.style.animation = 'questPulse 2s infinite';
    }
  }

  // Show Projects unlocked
  showProjectsUnlocked() {
    this.unlockAchievement('Artifact Hunter', 'project-discovery', 'Discovered all mysterious artifacts!', '🔍');
  }

  // Give XP to player
  giveXP(amount) {
    this.player.xp += amount;
    
    // Check for level up
    const requiredXP = this.player.level * this.xpPerLevel;
    if (this.player.xp >= requiredXP && this.player.level < this.maxLevel) {
      this.levelUp();
    }
    
    this.savePlayer();
    this.updateUI();
  }

  // Level up the player
  levelUp() {
    this.player.level++;
    this.player.maxHealth += 10;
    this.player.health = this.player.maxHealth; // Full heal on level up
    this.player.maxMana += 5;
    this.player.mana = this.player.maxMana;
    
    // Show level up effect
    this.showLevelUpEffect();
    
    // Unlock achievement
    this.unlockAchievement(`Reached Level ${this.player.level}`, `level-${this.player.level}`);
  }

  // Show floating XP text
  showFloatingXP(element, text) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-xp';
    floatingText.textContent = text;
    
    const rect = element.getBoundingClientRect();
    floatingText.style.left = rect.left + rect.width / 2 + 'px';
    floatingText.style.top = rect.top + 'px';
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
      floatingText.remove();
    }, 2000);
  }

  // Show level up effect
  showLevelUpEffect() {
    const effect = document.createElement('div');
    effect.className = 'level-up-effect';
    effect.innerHTML = `
      <div class="level-up-text">
        <h2>LEVEL UP!</h2>
        <p>You are now Level ${this.player.level}</p>
        <p>+10 Health, +5 Mana</p>
      </div>
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
      effect.remove();
    }, 3000);
  }

  // Show simple quest complete notification
  showQuestComplete(quest) {
    const notification = document.createElement('div');
    notification.className = 'quest-complete-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h3>🎉 Quest Complete!</h3>
        <p>${quest.description}</p>
        <div class="xp-reward">+${quest.xpReward} XP</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 4000);
  }

  // Unlock navigation elements
  unlockNavigation(section) {
    const navLinks = document.querySelectorAll(`nav a[href*="${section}"]`);
    navLinks.forEach(link => {
      link.classList.remove('locked');
      link.classList.add('unlocked');
      link.style.pointerEvents = 'auto';
      
      // Add unlock effect
      const unlockEffect = document.createElement('div');
      unlockEffect.className = 'unlock-effect';
      unlockEffect.textContent = '✨ UNLOCKED! ✨';
      link.appendChild(unlockEffect);
      
      setTimeout(() => {
        unlockEffect.remove();
      }, 2000);
    });
  }

  // Show inventory modal
  showInventory() {
    // This functionality is now handled by the Projects page itself
    window.location.href = 'Projects.html';
  }

  // Show achievements modal  
  showAchievements() {
    // This functionality is now integrated into the pages
    this.showSimpleAchievementNotification();
  }

  // Show simple achievement notification
  showSimpleAchievementNotification() {
    const notification = document.createElement('div');
    notification.className = 'achievement-summary-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h3>🏆 Your Achievements</h3>
        <p>You have unlocked ${this.achievements.length} achievements!</p>
        <p>Visit the Character Stats page to see them all.</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Unlock an achievement
  unlockAchievement(title, id, description = '', icon = '🏆') {
    if (this.achievements.find(a => a.id === id)) return; // Already unlocked
    
    const achievement = { id, title, description, icon };
    this.achievements.push(achievement);
    this.saveAchievements();
    
    // Show achievement notification
    this.showAchievementNotification(achievement);
  }

  // Show achievement notification
  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-popup">
        <div class="achievement-header">
          <span class="achievement-icon">${achievement.icon}</span>
          <span class="achievement-title">Achievement Unlocked!</span>
        </div>
        <p class="achievement-name">${achievement.title}</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 4000);
  }

  // Reset game progress
  resetGame() {
    if (confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('portfolioRPG_player');
      localStorage.removeItem('portfolioRPG_achievements');
      location.reload();
    }
  }

  // Update UI elements
  updateUI() {
    this.updatePlayerLevel();
  }

  // Start a specific quest
  startQuest(questId) {
    const quest = this.quests[questId];
    if (!quest || quest.completed) return;
    
    this.currentQuest = quest;
    // Quest tracking is now handled within the page content itself
  }
}

// Initialize the game when DOM is loaded
let portfolioGame;
document.addEventListener('DOMContentLoaded', () => {
  portfolioGame = new PortfolioRPG();
  portfolioGame.startQuest('discover-about');
});