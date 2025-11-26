// Mini-games for Portfolio RPG
// Skill matching game for unlocking experience section

class PortfolioMiniGames {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.currentMiniGame = null;
  }

  // Skill Matcher Mini-Game
  startSkillMatcher() {
    this.currentMiniGame = 'skill-matcher';
    this.createSkillMatcherUI();
  }

  createSkillMatcherUI() {
    // Check if minigame already exists
    if (document.getElementById('skill-matcher-game')) return;

    const gameContainer = document.createElement('div');
    gameContainer.id = 'skill-matcher-game';
    gameContainer.className = 'minigame-container';
    
    const skills = [
      { name: 'C++', category: 'Programming' },
      { name: 'Python', category: 'Programming' },
      { name: 'PLC Programming', category: 'Engineering' },
      { name: '3D CAD Design', category: 'Engineering' },
      { name: 'HTML', category: 'Web Tech' },
      { name: 'JavaScript', category: 'Web Tech' }
    ];

    const categories = ['Programming', 'Engineering', 'Web Tech'];
    
    // Shuffle skills
    const shuffledSkills = [...skills].sort(() => Math.random() - 0.5);
    
    gameContainer.innerHTML = `
      <div class="minigame-content">
        <div class="minigame-header">
          <h3>🎯 Skill Matcher Challenge</h3>
          <p>Match each skill to its correct category to unlock the Character Stats!</p>
          <div class="minigame-progress">
            <span id="matches-count">0</span>/${skills.length} matches
          </div>
        </div>
        
        <div class="skill-matcher-game">
          <div class="skills-container">
            <h4>Skills</h4>
            <div class="skills-list">
              ${shuffledSkills.map((skill, index) => `
                <div class="skill-item" data-skill="${skill.name}" data-category="${skill.category}" draggable="true">
                  ${skill.name}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="categories-container">
            <h4>Categories</h4>
            <div class="categories-list">
              ${categories.map(category => `
                <div class="category-box" data-category="${category}">
                  <h5>${category}</h5>
                  <div class="category-drop-zone"></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="minigame-controls">
          <button id="close-minigame" class="rpg-btn">Close Game</button>
          <button id="reset-minigame" class="rpg-btn">Reset</button>
        </div>
        
        <div id="minigame-result" class="minigame-result" style="display: none;">
          <h3>🎉 Challenge Complete!</h3>
          <p>You've successfully matched all skills to their categories!</p>
          <p><strong>Reward:</strong> Character Stats page unlocked + 75 XP</p>
        </div>
      </div>
    `;

    document.body.appendChild(gameContainer);
    this.initializeSkillMatcher();
  }

  initializeSkillMatcher() {
    let matches = 0;
    const totalSkills = 6;
    const matchesCount = document.getElementById('matches-count');

    // Drag and Drop functionality
    const skillItems = document.querySelectorAll('.skill-item');
    const categoryBoxes = document.querySelectorAll('.category-drop-zone');

    skillItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
          skill: item.dataset.skill,
          category: item.dataset.category
        }));
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });
    });

    categoryBoxes.forEach(box => {
      box.addEventListener('dragover', (e) => {
        e.preventDefault();
        box.classList.add('drag-over');
      });

      box.addEventListener('dragleave', () => {
        box.classList.remove('drag-over');
      });

      box.addEventListener('drop', (e) => {
        e.preventDefault();
        box.classList.remove('drag-over');
        
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const categoryBox = box.closest('.category-box');
        const expectedCategory = categoryBox.dataset.category;
        
        if (data.category === expectedCategory) {
          // Correct match
          const skillElement = document.querySelector(`[data-skill="${data.skill}"]`);
          if (skillElement && !skillElement.classList.contains('matched')) {
            skillElement.classList.add('matched');
            skillElement.draggable = false;
            
            // Move to category box
            const skillCopy = skillElement.cloneNode(true);
            skillCopy.classList.add('matched-skill');
            box.appendChild(skillCopy);
            skillElement.style.opacity = '0.5';
            
            matches++;
            matchesCount.textContent = matches;
            
            // Visual feedback
            this.showMatchFeedback(skillCopy, true);
            
            if (matches === totalSkills) {
              this.completeSkillMatcher();
            }
          }
        } else {
          // Wrong match
          this.showMatchFeedback(box, false);
        }
      });
    });

    // Event listeners for controls
    document.getElementById('close-minigame').addEventListener('click', () => {
      this.closeMiniGame();
    });

    document.getElementById('reset-minigame').addEventListener('click', () => {
      this.resetSkillMatcher();
    });
  }

  showMatchFeedback(element, isCorrect) {
    const feedback = document.createElement('div');
    feedback.className = 'match-feedback';
    feedback.textContent = isCorrect ? '✅ Correct!' : '❌ Try again!';
    feedback.style.color = isCorrect ? '#27ae60' : '#e74c3c';
    
    element.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 1500);
  }

  completeSkillMatcher() {
    const result = document.getElementById('minigame-result');
    result.style.display = 'block';
    
    // Complete the unlock-experience quest
    this.game.completeQuest('unlock-experience');
    
    // Auto-close after delay
    setTimeout(() => {
      this.closeMiniGame();
    }, 3000);
  }

  resetSkillMatcher() {
    const container = document.getElementById('skill-matcher-game');
    if (container) {
      container.remove();
      this.createSkillMatcherUI();
    }
  }

  closeMiniGame() {
    const container = document.getElementById('skill-matcher-game');
    if (container) {
      container.remove();
    }
    this.currentMiniGame = null;
  }

  // Project Discovery Mini-Game (for unlocking projects)
  startProjectDiscovery() {
    this.currentMiniGame = 'project-discovery';
    this.createProjectDiscoveryUI();
  }

  createProjectDiscoveryUI() {
    if (document.getElementById('project-discovery-game')) return;

    const gameContainer = document.createElement('div');
    gameContainer.id = 'project-discovery-game';
    gameContainer.className = 'minigame-container';
    
    const artifacts = [
      {
        id: 'nordpool',
        name: 'Electrical Energy Orb',
        description: 'A mystical orb that controls electrical market forces',
        clues: ['⚡ Powers electrical systems', '📊 Contains market data', '🔄 Updates in real-time'],
        unlocked: false
      },
      {
        id: 'research',
        name: 'Scroll of Entrepreneurship',
        description: 'An ancient manuscript containing business wisdom',
        clues: ['📜 Contains scholarly knowledge', '🍽️ Related to food industry', '🏆 Award-winning research'],
        unlocked: false
      },
      {
        id: 'jmeter',
        name: 'Hammer of Testing',
        description: 'A powerful tool for forging robust applications',
        clues: ['🔨 Tests application strength', '⚡ Measures performance', '🛡️ Ensures reliability'],
        unlocked: false
      }
    ];

    gameContainer.innerHTML = `
      <div class="minigame-content">
        <div class="minigame-header">
          <h3>🔍 Artifact Discovery Quest</h3>
          <p>Study the clues to identify each mysterious artifact!</p>
          <div class="discovery-progress">
            <span id="discoveries-count">0</span>/${artifacts.length} artifacts discovered
          </div>
        </div>
        
        <div class="artifact-discovery-game">
          ${artifacts.map(artifact => `
            <div class="artifact-card" data-artifact-id="${artifact.id}">
              <div class="artifact-mystery">
                <div class="mystery-icon">❓</div>
                <h4>Unknown Artifact</h4>
                <div class="clues">
                  ${artifact.clues.map(clue => `<div class="clue">${clue}</div>`).join('')}
                </div>
                <input type="text" class="artifact-guess" placeholder="What is this artifact?" maxlength="50">
                <button class="guess-btn rpg-btn">Submit Guess</button>
              </div>
              
              <div class="artifact-revealed" style="display: none;">
                <div class="artifact-icon">${this.getArtifactIcon(artifact.id)}</div>
                <h4>${artifact.name}</h4>
                <p>${artifact.description}</p>
                <div class="discovery-reward">✨ Artifact Discovered! ✨</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="minigame-controls">
          <button id="close-discovery-game" class="rpg-btn">Close Game</button>
          <button id="discovery-hint" class="rpg-btn">💡 Hint</button>
        </div>
        
        <div id="discovery-result" class="minigame-result" style="display: none;">
          <h3>🎉 All Artifacts Discovered!</h3>
          <p>You've uncovered all the mysterious artifacts in the vault!</p>
          <p><strong>Reward:</strong> Guild Hall unlocked + 100 XP</p>
        </div>
      </div>
    `;

    document.body.appendChild(gameContainer);
    this.initializeProjectDiscovery(artifacts);
  }

  getArtifactIcon(artifactId) {
    const icons = {
      'nordpool': '⚡',
      'research': '📜',
      'jmeter': '🔨'
    };
    return icons[artifactId] || '❓';
  }

  initializeProjectDiscovery(artifacts) {
    let discoveries = 0;
    const correctAnswers = {
      'nordpool': ['nordpool', 'electricity', 'electrical', 'energy', 'power', 'orb'],
      'research': ['research', 'scroll', 'entrepreneurship', 'business', 'study', 'paper'],
      'jmeter': ['jmeter', 'testing', 'hammer', 'tool', 'performance', 'test']
    };

    const discoveryCount = document.getElementById('discoveries-count');

    // Add guess functionality
    document.querySelectorAll('.guess-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.artifact-card');
        const artifactId = card.dataset.artifactId;
        const guess = card.querySelector('.artifact-guess').value.toLowerCase().trim();
        
        const validAnswers = correctAnswers[artifactId];
        const isCorrect = validAnswers.some(answer => guess.includes(answer));
        
        if (isCorrect && !card.classList.contains('discovered')) {
          // Correct guess
          card.classList.add('discovered');
          card.querySelector('.artifact-mystery').style.display = 'none';
          card.querySelector('.artifact-revealed').style.display = 'block';
          
          discoveries++;
          discoveryCount.textContent = discoveries;
          
          this.game.giveXP(25);
          this.game.showFloatingXP(card, '+25 XP');
          
          if (discoveries === artifacts.length) {
            this.completeProjectDiscovery();
          }
        } else {
          // Wrong guess
          this.showDiscoveryFeedback(btn, false);
        }
      });
    });

    // Close and hint buttons
    document.getElementById('close-discovery-game').addEventListener('click', () => {
      this.closeMiniGame();
    });

    document.getElementById('discovery-hint').addEventListener('click', () => {
      this.showDiscoveryHint();
    });
  }

  showDiscoveryFeedback(element, isCorrect) {
    const feedback = document.createElement('div');
    feedback.className = 'discovery-feedback';
    feedback.textContent = isCorrect ? '✅ Discovered!' : '❌ Not quite right...';
    feedback.style.color = isCorrect ? '#27ae60' : '#e74c3c';
    
    element.parentNode.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  showDiscoveryHint() {
    const hints = [
      'Think about the technologies mentioned in the portfolio...',
      'Consider the types of work an automation engineer might do...',
      'Look for keywords related to programming and testing...'
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    const hintElement = document.createElement('div');
    hintElement.className = 'discovery-hint';
    hintElement.textContent = `💡 ${randomHint}`;
    
    const gameHeader = document.querySelector('.minigame-header');
    gameHeader.appendChild(hintElement);
    
    setTimeout(() => {
      hintElement.remove();
    }, 4000);
  }

  completeProjectDiscovery() {
    const result = document.getElementById('discovery-result');
    result.style.display = 'block';
    
    this.game.completeQuest('explore-projects');
    
    setTimeout(() => {
      this.closeMiniGame();
    }, 4000);
  }
}

// Initialize mini-games when portfolio game is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for portfolio game to initialize
  setTimeout(() => {
    if (window.portfolioGame) {
      window.portfolioMiniGames = new PortfolioMiniGames(window.portfolioGame);
      
      // Add mini-game trigger buttons where needed
      window.addMiniGameTriggers = function() {
        // This function can be called to add mini-game triggers to unlock content
      };
    }
  }, 1000);
});