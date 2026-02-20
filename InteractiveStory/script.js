// --- DOM ELEMENTS ---
const textElement = document.getElementById('story-text');
const choicesElement = document.getElementById('choices-container');
const invElement = document.getElementById('inventory-display');

// --- GAME STATE ---
let state = {};

// --- TYPEWRITER EFFECT CONFIG ---
const typeSpeed = 20; // ms per character

// --- STORY DATA ---
const storyNodes = [
    {
        id: 1,
        text: "SYSTEM REBOOT...\nVisual sensors online.\n\nYou wake up in a cold, dimly lit cryo-chamber. The air smells of ozone. A red emergency light pulses above a sealed blast door.",
        options: [
            { text: "Examine the cryo-pod", nextText: 2 },
            { text: "Try to force the blast door open", nextText: 3 }
        ]
    },
    {
        id: 2,
        text: "You examine the pod. It's labeled 'Subject 7'. Hidden beneath the cushioning, you find a jagged piece of metal and a Security Keycard.",
        options: [
            { 
                text: "Take items and return to door", 
                nextText: 4,
                // FIX: 'setState' must be INSIDE the option object so the button click triggers it
                setState: { hasKeycard: true, hasMetal: true } 
            }
        ]
    },
    {
        id: 3,
        text: "You slam your shoulder against the blast door. It doesn't budge. You bruise your shoulder and set off a localized alarm.\n\nWARNING: UNAUTHORIZED FORCE DETECTED.",
        options: [
            // Logic: If you don't have the key, go search (2). If you do, go to door (4).
            { text: "Search the room for a key", nextText: 2, requiredState: (s) => !s.hasKeycard },
            { text: "Return to door controls", nextText: 4, requiredState: (s) => s.hasKeycard } 
        ]
    },
    {
        id: 4,
        text: "You stand before the heavy blast door. The control panel awaits input.",
        options: [
            // These buttons only appear if you have the items in your State
            { text: "Swipe Security Keycard", requiredState: (s) => s.hasKeycard, nextText: 5 },
            { text: "Pry panel with Metal Shard", requiredState: (s) => s.hasMetal, nextText: 6 },
            
            // This button disappears if you have the keycard (Prevents Looping)
            { text: "Kick the door again", requiredState: (s) => !s.hasKeycard, nextText: 3 }
        ]
    },
    {
        id: 5,
        text: "ACCESS GRANTED.\n\nThe door slides open with a hydraulic hiss. You step into the corridor. The bridge is to your left, engine room to your right.",
        options: [
            { text: "Go to the Bridge", nextText: 10 },
            { text: "Go to the Engine Room", nextText: 11 }
        ]
    },
    {
        id: 6,
        text: "You jam the metal shard into the panel. Sparks fly. The door short-circuits and opens halfway. You squeeze through.",
        options: [
            { text: "Continue into corridor", nextText: 5 }
        ]
    },
    {
        id: 10,
        // ENDING 1
        text: "You reach the bridge. The viewports show a massive black hole consuming a star. You engage the warp drive just in time.\n\nMISSION STATUS: SURVIVAL ACHIEVED.",
        options: [
            { text: "Reboot Simulation", nextText: 1 }
        ]
    },
    {
        id: 11,
        // ENDING 2
        text: "You enter the engine room. The core is unstable. Before you can stabilize it, the radiation levels spike critical.\n\nMISSION STATUS: FAILED.",
        options: [
            { text: "Reboot Simulation", nextText: 1 }
        ]
    }
];

// --- CORE FUNCTIONS ---

function startGame() {
    state = {}; // Reset inventory
    updateInventoryDisplay();
    showTextNode(1);
}

function showTextNode(textNodeIndex) {
    const textNode = storyNodes.find(node => node.id === textNodeIndex);
    
    // Clear previous choices
    choicesElement.innerHTML = '';
    
    // Typewriter Effect
    textElement.innerText = '';
    textElement.classList.add('cursor');
    
    let i = 0;
    function typeWriter() {
        if (i < textNode.text.length) {
            textElement.innerText += textNode.text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            textElement.classList.remove('cursor');
            renderButtons(textNode);
        }
    }
    typeWriter();
}

function renderButtons(textNode) {
    textNode.options.forEach(option => {
        if (showOption(option)) {
            const button = document.createElement('button');
            button.innerText = option.text;
            button.classList.add('choice-btn');
            button.addEventListener('click', () => selectOption(option));
            choicesElement.appendChild(button);
        }
    });
}

function showOption(option) {
    return option.requiredState == null || option.requiredState(state);
}

function selectOption(option) {
    const nextTextNodeId = option.nextText;
    
    if (nextTextNodeId <= 0) {
        return startGame();
    }
    
    // FIX: This now works because 'setState' is correctly placed inside the 'option' object in storyNodes
    if(option.setState) {
        state = Object.assign(state, option.setState);
        updateInventoryDisplay();
    }
    
    showTextNode(nextTextNodeId);
}

function updateInventoryDisplay() {
    const items = Object.keys(state).filter(key => state[key]);
    if (items.length > 0) {
        // Clean up the names (remove 'has' prefix)
        const formattedItems = items.map(i => i.replace('has', '')); 
        invElement.innerText = `INV: [ ${formattedItems.join(', ')} ]`;
        invElement.style.color = '#00ff41'; // Bright Green
    } else {
        invElement.innerText = 'INV: EMPTY';
        invElement.style.color = '#008f11'; // Dim Green
    }
}

// Start Game
startGame();