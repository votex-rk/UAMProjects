/* --- CONFIGURATION --- */
const CONFIG = {
    decayRate: {
        hunger: 2,   // Drops by 2 every tick
        happy: 2,
        energy: 1
    },
    tickRate: 2000,  // Game updates every 2 seconds
    evolutionThreshold: 100, // Age needed to evolve
    poopChance: 0.1  // 10% chance to poop every tick
};

/* --- STATE MANAGEMENT --- */
let gameState = {
    stats: {
        hunger: 100,
        happy: 100,
        energy: 100
    },
    age: 0,
    stage: 'egg', // egg, baby, adult
    isSleeping: false,
    isDead: false,
    poops: 0,
    lastLogin: Date.now()
};

/* --- DOM ELEMENTS --- */
const ui = {
    bars: {
        hunger: document.getElementById('bar-hunger'),
        happy: document.getElementById('bar-happy'),
        energy: document.getElementById('bar-energy')
    },
    pet: document.getElementById('pet'),
    emote: document.getElementById('emote'),
    screen: document.querySelector('.game-screen'),
    poopContainer: document.getElementById('poop-container'),
    overlay: document.getElementById('overlay'),
    overlayTitle: document.getElementById('overlay-title'),
    overlayMsg: document.getElementById('overlay-msg'),
    restartBtn: document.getElementById('restart-btn'),
    btns: {
        feed: document.getElementById('btn-feed'),
        play: document.getElementById('btn-play'),
        sleep: document.getElementById('btn-sleep'),
        clean: document.getElementById('btn-clean')
    }
};

/* --- INITIALIZATION --- */
function init() {
    loadGame();
    // Start Game Loop
    setInterval(gameTick, CONFIG.tickRate);
    updateUI();
}

function loadGame() {
    const saved = localStorage.getItem('neoGotchiSave');
    if (saved) {
        gameState = JSON.parse(saved);
        // Calculate offline decay (optional hardness)
        const now = Date.now();
        const diffHours = (now - gameState.lastLogin) / (1000 * 60 * 60);
        if (diffHours > 1 && !gameState.isDead) {
            gameState.stats.hunger = Math.max(0, gameState.stats.hunger - (diffHours * 10));
            gameState.stats.energy = Math.min(100, gameState.stats.energy + (diffHours * 5));
            alert(`Your pet missed you! You were gone for ${Math.floor(diffHours)} hours.`);
        }
    }
    renderPetStage();
    renderPoops();
}

function saveGame() {
    gameState.lastLogin = Date.now();
    localStorage.setItem('neoGotchiSave', JSON.stringify(gameState));
}

/* --- GAME LOOP --- */
function gameTick() {
    if (gameState.isDead) return;

    if (gameState.stage === 'egg') {
        gameState.age++;
        if (gameState.age > 5) evolve('baby');
        updateUI();
        return;
    }

    // Decay Stats
    if (!gameState.isSleeping) {
        changeStat('hunger', -CONFIG.decayRate.hunger);
        changeStat('happy', -CONFIG.decayRate.happy);
        changeStat('energy', -CONFIG.decayRate.energy);
        
        // Random Poop
        if (Math.random() < CONFIG.poopChance) addPoop();
    } else {
        // Recover energy while sleeping
        changeStat('energy', 5);
        changeStat('hunger', -1); // Still gets hungry slowly
    }

    // Check Death
    if (gameState.stats.hunger <= 0 || gameState.stats.happy <= 0) {
        die();
    }

    // Check Evolution
    gameState.age++;
    if (gameState.stage === 'baby' && gameState.age > CONFIG.evolutionThreshold) {
        evolve('adult');
    }

    // Pollution Effect (Too much poop makes pet sad)
    if (gameState.poops > 2) {
        changeStat('happy', -5);
        showEmote('🤢');
    }

    updateUI();
    saveGame();
}

/* --- ACTIONS --- */
ui.btns.feed.addEventListener('click', () => {
    if (actionBlocked()) return;
    showAnimation('bounce');
    changeStat('hunger', 20);
    changeStat('energy', -5); // Eating takes effort
    showEmote('😋');
    addPoopChance(0.3); // High chance to poop after eating
});

ui.btns.play.addEventListener('click', () => {
    if (actionBlocked()) return;
    if (gameState.stats.energy < 20) {
        showEmote('😫'); // Too tired
        return;
    }
    showAnimation('rotate');
    changeStat('happy', 15);
    changeStat('hunger', -10);
    changeStat('energy', -15);
    showEmote('🎵');
});

ui.btns.sleep.addEventListener('click', () => {
    if (gameState.isDead || gameState.stage === 'egg') return;
    toggleSleep();
});

ui.btns.clean.addEventListener('click', () => {
    if (gameState.isDead) return;
    gameState.poops = 0;
    renderPoops();
    showEmote('✨');
    changeStat('happy', 5);
});

ui.restartBtn.addEventListener('click', resetGame);

/* --- LOGIC HELPERS --- */
function changeStat(stat, value) {
    gameState.stats[stat] = Math.min(100, Math.max(0, gameState.stats[stat] + value));
}

function actionBlocked() {
    return gameState.isDead || gameState.isSleeping || gameState.stage === 'egg';
}

function toggleSleep() {
    gameState.isSleeping = !gameState.isSleeping;
    if (gameState.isSleeping) {
        ui.pet.classList.add('sleeping');
        ui.screen.classList.add('night');
        showEmote('💤');
    } else {
        ui.pet.classList.remove('sleeping');
        ui.screen.classList.remove('night');
        showEmote('☀');
    }
}

function addPoop() {
    gameState.poops++;
    renderPoops();
}

function addPoopChance(percent) {
    if (Math.random() < percent) addPoop();
}

function evolve(newStage) {
    gameState.stage = newStage;
    showEmote('⭐');
    renderPetStage();
    // Play sound or effect could go here
}

function die() {
    gameState.isDead = true;
    ui.pet.classList.add('dead');
    ui.pet.classList.remove('sleeping');
    showEmote('💀');
    
    setTimeout(() => {
        ui.overlay.classList.remove('hidden');
        ui.overlayTitle.innerText = "R.I.P.";
        ui.overlayMsg.innerText = `Lived for ${gameState.age} ticks.`;
    }, 1000);
    saveGame();
}

function resetGame() {
    localStorage.removeItem('neoGotchiSave');
    location.reload();
}

/* --- RENDERERS --- */
function updateUI() {
    // Update Bars
    updateBar(ui.bars.hunger, gameState.stats.hunger);
    updateBar(ui.bars.happy, gameState.stats.happy);
    updateBar(ui.bars.energy, gameState.stats.energy);
}

function updateBar(element, value) {
    element.style.width = `${value}%`;
    element.style.backgroundColor = 
        value > 50 ? 'var(--bar-good)' : 
        value > 20 ? 'var(--bar-warn)' : 'var(--bar-bad)';
}

function renderPetStage() {
    ui.pet.className = `pet-sprite ${gameState.stage}`;
    if(gameState.isSleeping) ui.pet.classList.add('sleeping');
    if(gameState.isDead) ui.pet.classList.add('dead');
}

function renderPoops() {
    ui.poopContainer.innerHTML = '';
    for(let i=0; i<gameState.poops; i++) {
        const poop = document.createElement('div');
        poop.classList.add('poop');
        poop.innerText = '💩';
        // Randomize position slightly
        poop.style.left = (i * 20 + 10) + 'px'; 
        ui.poopContainer.appendChild(poop);
    }
}

function showEmote(emoji) {
    ui.emote.innerText = emoji;
    ui.emote.style.opacity = 1;
    setTimeout(() => {
        ui.emote.style.opacity = 0;
    }, 2000);
}

function showAnimation(animClass) {
    ui.pet.style.animation = 'none';
    ui.pet.offsetHeight; /* trigger reflow */
    if (animClass === 'bounce') {
        ui.pet.style.animation = 'breathe 0.5s ease-in-out 3';
    } else if (animClass === 'rotate') {
        ui.pet.style.animation = 'wobble 0.5s ease-in-out 3';
    }
    // Return to idle after animation
    setTimeout(() => {
        ui.pet.style.animation = ''; // Reverts to CSS default idle
    }, 1500);
}

// Start
init();