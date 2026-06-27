// ===============================
// SAVED GAME DATA
// ===============================

console.log("script.js is connected");

let savedWater = localStorage.getItem("waterUnlocked");
let savedLevel = localStorage.getItem("playerLevel");

let waterUnlocked = savedWater ? Number(savedWater) : 0;
let playerLevel = savedLevel ? Number(savedLevel) : 0;

// Check if this is the gameplay page
const isGameplayPage = document.querySelector(".gameplay-page") !== null;

// Start the gameplay mission fresh each time the player enters game.html
if (isGameplayPage) {
  waterUnlocked = 0;
}

// ===============================
// HOME PAGE ELEMENTS
// ===============================

const waterFill = document.getElementById("waterFill");
const waterText = document.getElementById("waterText");
const levelNumber = document.getElementById("levelNumber");
const waterBarrel = document.getElementById("waterBarrel");

// ===============================
// GAMEPLAY PAGE ELEMENTS
// ===============================

const gameWaterFill = document.getElementById("gameWaterFill");
const gameWaterText = document.getElementById("gameWaterText");
const questionPanel = document.getElementById("questionPanel");
const questionCount = document.getElementById("questionCount");
const questionText = document.getElementById("questionText");
const feedbackText = document.getElementById("feedbackText");
const answerButtons = document.querySelectorAll(".answer-button");
const pondArea = document.getElementById("pondArea");
const villagers = document.getElementById("villagers");
const fireworks = document.getElementById("fireworks");

// ===============================
// QUESTIONS
// ===============================

const questions = [
  {
    question: "The water has visible dirt and mud. What should the team use first?",
    answers: ["Boiling Pot", "Sand Filter", "Open Bucket"],
    correctAnswer: "Sand Filter",
    feedback: "Correct. A sand filter helps remove dirt and mud from the water.",
    gallonsEarned: 35
  },
  {
    question: "The water looks clearer, but germs may still be inside. What should the team use next?",
    answers: ["Chlorine Tablets", "More Dirt", "Broken Pipe"],
    correctAnswer: "Chlorine Tablets",
    feedback: "Correct. Chlorine tablets help kill harmful germs in the water.",
    gallonsEarned: 35
  },
  {
    question: "The water is clean now. What helps keep it safe for families?",
    answers: ["Open Bowl", "Covered Container", "Dirty Hands"],
    correctAnswer: "Covered Container",
    feedback: "Correct. A covered container keeps clean water protected.",
    gallonsEarned: 30
  }
];

let currentQuestionIndex = 0;
let waitingForNextQuestion = false;

// ===============================
// SAVE PROGRESS
// ===============================

function saveProgress() {
  localStorage.setItem("waterUnlocked", waterUnlocked);
  localStorage.setItem("playerLevel", playerLevel);
}

// ===============================
// HOME PAGE DISPLAY
// ===============================

function updateHomePage() {
  if (!waterFill || !waterText || !levelNumber) {
    return;
  }

  if (waterUnlocked < 0) {
    waterUnlocked = 0;
  }

  if (waterUnlocked > 100) {
    waterUnlocked = 100;
  }

  let visibleWaterAmount = waterUnlocked === 0 ? 12 : waterUnlocked;

  waterFill.style.width = visibleWaterAmount + "%";
  waterText.textContent = waterUnlocked + " Gallons";
  levelNumber.textContent = playerLevel;
}

// ===============================
// GAMEPLAY DISPLAY
// ===============================

function updateGameplayMeter() {
  if (!gameWaterFill || !gameWaterText) {
    return;
  }

  let visibleWaterAmount = waterUnlocked === 0 ? 12 : waterUnlocked;

  gameWaterFill.style.width = visibleWaterAmount + "%";
  gameWaterText.textContent = waterUnlocked + " Gallons";
}

function loadQuestion() {
  if (!isGameplayPage || !questionText || !questionCount || answerButtons.length === 0) {
    return;
  }

  waitingForNextQuestion = false;

  const currentQuestion = questions[currentQuestionIndex];

  questionCount.textContent = "Question " + (currentQuestionIndex + 1) + " of " + questions.length;
  questionText.textContent = currentQuestion.question;
  feedbackText.textContent = "Choose the best solution.";

  answerButtons.forEach(function(button, index) {
    button.textContent = currentQuestion.answers[index];

    button.disabled = false;
    button.style.display = "block";
    button.classList.remove("correct-choice");
    button.classList.remove("wrong-choice");
  });
}

function updateSceneProgress() {
  if (!pondArea || !villagers) {
    return;
  }

  pondArea.classList.remove("cleaning-one", "cleaning-two", "cleaning-three");
  villagers.classList.remove("hopeful", "happy", "celebrating");

  if (waterUnlocked >= 35 && waterUnlocked < 70) {
    pondArea.classList.add("cleaning-one");
    villagers.classList.add("hopeful");
  }

  if (waterUnlocked >= 70 && waterUnlocked < 100) {
    pondArea.classList.add("cleaning-two");
    villagers.classList.add("happy");
  }

  if (waterUnlocked >= 100) {
    pondArea.classList.add("cleaning-three");
    villagers.classList.add("celebrating");

    playerLevel = 1;
    saveProgress();
    showFireworks();
  }
}

function shakeQuestionPanel() {
  if (!questionPanel) {
    return;
  }

  questionPanel.classList.remove("wrong-shake");

  setTimeout(function() {
    questionPanel.classList.add("wrong-shake");
  }, 10);
}

function showFireworks() {
  if (!fireworks) {
    return;
  }

  fireworks.classList.add("show-fireworks");
}

function goToNextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    finishGame();
  }
}

// ===============================
// ANSWER CHECKING
// ===============================

function selectAnswer(answerIndex) {
  if (waitingForNextQuestion) {
    return;
  }

  if (!isGameplayPage) {
    return;
  }

  waitingForNextQuestion = true;

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = currentQuestion.answers[answerIndex];
  const selectedButton = answerButtons[answerIndex];

  answerButtons.forEach(function(button) {
    button.disabled = true;
  });

  if (selectedAnswer === currentQuestion.correctAnswer) {
    selectedButton.classList.add("correct-choice");

    waterUnlocked += currentQuestion.gallonsEarned;

    if (waterUnlocked > 100) {
      waterUnlocked = 100;
    }

    feedbackText.textContent = currentQuestion.feedback;

    saveProgress();
    updateGameplayMeter();
    updateSceneProgress();

    setTimeout(function() {
      goToNextQuestion();
    }, 1300);

  } else {
    selectedButton.classList.add("wrong-choice");

    feedbackText.textContent = "Wrong choice. The mission continues to the next problem.";

    shakeQuestionPanel();

    setTimeout(function() {
      goToNextQuestion();
    }, 1100);
  }
}

function finishGame() {
  if (!questionCount || !questionText || !feedbackText) {
    return;
  }

  if (waterUnlocked >= 100) {
    questionCount.textContent = "Mission Complete";
    questionText.textContent = "The water is clean and the community is celebrating!";
    feedbackText.textContent = "You unlocked 100 gallons of clean water.";
    showFireworks();
  } else {
    questionCount.textContent = "Mission Finished";
    questionText.textContent = "You helped the team, but the water is not fully clean yet.";
    feedbackText.textContent = "Try again and choose the strongest water solutions.";
  }

  answerButtons.forEach(function(button) {
    button.style.display = "none";
  });
}

// This makes selectAnswer available to the HTML onclick buttons
window.selectAnswer = selectAnswer;

// ===============================
// HOME PAGE HOVER
// ===============================

if (waterBarrel) {
  waterBarrel.addEventListener("mouseenter", function() {
    waterBarrel.classList.add("barrel-active");
  });

  waterBarrel.addEventListener("mouseleave", function() {
    waterBarrel.classList.remove("barrel-active");
  });
}

// ===============================
// START PAGE
// ===============================

updateHomePage();
updateGameplayMeter();
loadQuestion();
updateSceneProgress();