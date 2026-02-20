// --- CONFIGURATION ---
const TIME_PER_QUESTION = 15; // Seconds

// --- QUESTION BANK ---
const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Preprocessor",
            "Hyper Text Markup Language",
            "Hyper Text Multiple Language",
            "Hyper Tool Multi Language"
        ],
        answer: 1 // Index of the correct answer
    },
    {
        question: "Which CSS property is used to change the text color of an element?",
        options: [
            "text-color",
            "fg-color",
            "color",
            "font-color"
        ],
        answer: 2
    },
    {
        question: "In JavaScript, which symbol is used for comments?",
        options: [
            "//",
            "",
            "/* */",
            "#"
        ],
        answer: 0
    },
    {
        question: "What is the correct way to write a JavaScript array?",
        options: [
            "var colors = (1:'red', 2:'green')",
            "var colors = ['red', 'green']",
            "var colors = 'red', 'green'",
            "var colors = 1 = ('red'), 2 = ('green')"
        ],
        answer: 1
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        options: [
            "class",
            "font",
            "styles",
            "style"
        ],
        answer: 3
    }
];

// --- STATE MANAGEMENT ---
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = TIME_PER_QUESTION;

// --- DOM ELEMENTS ---
const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen')
};

const ui = {
    startBtn: document.getElementById('start-btn'),
    nextBtn: document.getElementById('next-btn'),
    restartBtn: document.getElementById('restart-btn'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressBar: document.getElementById('progress-bar'),
    questionCount: document.getElementById('question-count'),
    timer: document.getElementById('timer'),
    finalScore: document.getElementById('final-score'),
    resultMessage: document.getElementById('result-message'),
    circleBar: document.getElementById('score-circle-bar')
};

// --- EVENT LISTENERS ---
ui.startBtn.addEventListener('click', startQuiz);
ui.nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
});
ui.restartBtn.addEventListener('click', () => {
    switchScreen('start');
});

// --- CORE FUNCTIONS ---

function switchScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(s => s.classList.remove('active'));
    // Show target screen
    screens[screenName].classList.add('active');
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    switchScreen('quiz');
    loadQuestion();
}

function loadQuestion() {
    // Reset State for new question
    clearInterval(timerInterval);
    timeLeft = TIME_PER_QUESTION;
    ui.timer.innerText = `${timeLeft}s`;
    ui.timer.classList.remove('warning');
    ui.nextBtn.disabled = true;
    ui.nextBtn.innerText = "Next Question";
    
    // Update Progress UI
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    ui.progressBar.style.width = `${progress}%`;
    ui.questionCount.innerText = `${currentQuestionIndex + 1}/${questions.length}`;

    // Load Question Text
    const currentQ = questions[currentQuestionIndex];
    ui.questionText.innerText = currentQ.question;

    // Generate Options
    ui.optionsContainer.innerHTML = ''; // Clear old options
    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement('div');
        btn.classList.add('option');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, btn);
        ui.optionsContainer.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        ui.timer.innerText = `${timeLeft}s`;

        if (timeLeft <= 5) {
            ui.timer.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoFail(); // Time ran out
        }
    }, 1000);
}

function checkAnswer(selectedIndex, selectedBtn) {
    clearInterval(timerInterval); // Stop timer
    
    const correctIndex = questions[currentQuestionIndex].answer;
    const options = ui.optionsContainer.children;

    // Visual Feedback
    if (selectedIndex === correctIndex) {
        selectedBtn.classList.add('correct');
        score += 100; // 100 points per question
    } else {
        selectedBtn.classList.add('wrong');
        // Highlight the correct one so user knows
        options[correctIndex].classList.add('correct');
    }

    // Disable all options so user can't click again
    Array.from(options).forEach(opt => opt.classList.add('disabled'));
    
    // Enable Next Button
    ui.nextBtn.disabled = false;
    
    // Check if it's the last question to change button text
    if (currentQuestionIndex === questions.length - 1) {
        ui.nextBtn.innerText = "Finish Quiz";
    }
}

function autoFail() {
    const correctIndex = questions[currentQuestionIndex].answer;
    const options = ui.optionsContainer.children;
    
    // Highlight correct answer
    options[correctIndex].classList.add('correct');
    
    // Disable all
    Array.from(options).forEach(opt => opt.classList.add('disabled'));
    
    ui.nextBtn.disabled = false;
    if (currentQuestionIndex === questions.length - 1) {
        ui.nextBtn.innerText = "Finish Quiz";
    }
}

function endQuiz() {
    switchScreen('result');
    ui.finalScore.innerText = score;
    
    // Calculate SVG Stroke Offset for Circle Animation
    // Total Length is ~440. 
    // Percentage = score / (total questions * 100)
    const maxScore = questions.length * 100;
    const percentage = score / maxScore;
    const offset = 440 - (440 * percentage);
    
    // Small delay to let the screen appear before animating the bar
    setTimeout(() => {
        ui.circleBar.style.strokeDashoffset = offset;
    }, 100);

    // Custom Message
    if (percentage >= 0.8) {
        ui.resultMessage.innerText = "Excellent Work! 🎉";
    } else if (percentage >= 0.5) {
        ui.resultMessage.innerText = "Good Job! 👍";
    } else {
        ui.resultMessage.innerText = "Keep Practicing! 📚";
    }
}