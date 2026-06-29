// ===============================
// FREE WATER GAME SCRIPT
// ===============================

console.log("script.js is connected");

// ===============================
// SAVED GAME DATA
// ===============================

let savedWater = localStorage.getItem("waterUnlocked");
let savedLevel = localStorage.getItem("playerLevel");

let waterUnlocked = savedWater ? Number(savedWater) : 0;
let playerLevel = savedLevel ? Number(savedLevel) : 0;

// Check what page we are on
const isGameplayPage = document.querySelector(".gameplay-page") !== null;

// Start gameplay fresh every time game.html opens
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
    feedback: "Correct! A sand filter removes dirt and mud from the water.",
    gallonsEarned: 35
  },
  {
    question: "The water looks clearer, but germs may still be inside. What should the team use next?",
    answers: ["Chlorine Tablets", "More Dirt", "Broken Pipe"],
    correctAnswer: "Chlorine Tablets",
    feedback: "Correct! Chlorine tablets help kill harmful germs in the water.",
    gallonsEarned: 35
  },
  {
    question: "The water is clean now. What keeps it safe for families to drink later?",
    answers: ["Open Bowl", "Covered Container", "Dirty Hands"],
    correctAnswer: "Covered Container",
    feedback: "Correct! A covered container keeps clean water safe.",
    gallonsEarned: 30
  }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
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

  if (waterUnlocked < 0) {
    waterUnlocked = 0;
  }

  if (waterUnlocked > 100) {
    waterUnlocked = 100;
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

    // Store the answer number on the button
    button.dataset.answerIndex = index;
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
  }
}

function makePeopleCheerQuickly() {
  if (!villagers) {
    return;
  }

  villagers.classList.add("celebrating");

  setTimeout(function() {
    if (waterUnlocked < 100) {
      villagers.classList.remove("celebrating");
      updateSceneProgress();
    }
  }, 900);
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
  if (!isGameplayPage) {
    return;
  }

  if (waitingForNextQuestion) {
    return;
  }

  waitingForNextQuestion = true;

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = currentQuestion.answers[answerIndex];
  const selectedButton = answerButtons[answerIndex];

  answerButtons.forEach(function(button) {
    button.disabled = true;
  });

  // CORRECT ANSWER
  if (selectedAnswer === currentQuestion.correctAnswer) {
    selectedButton.classList.add("correct-choice");

    correctAnswers++;

    waterUnlocked += currentQuestion.gallonsEarned;

    if (waterUnlocked > 100) {
      waterUnlocked = 100;
    }

    feedbackText.textContent = currentQuestion.feedback;

    saveProgress();
    updateGameplayMeter();
    updateSceneProgress();
    makePeopleCheerQuickly();

    setTimeout(function() {
      goToNextQuestion();
    }, 1400);

    return;
  }

  // WRONG ANSWER
  selectedButton.classList.add("wrong-choice");
  feedbackText.textContent = "Wrong choice. The water stays the same. Moving to the next problem.";

  // Water does NOT change here
  updateGameplayMeter();
  updateSceneProgress();
  shakeQuestionPanel();

  setTimeout(function() {
    goToNextQuestion();
  }, 1200);
}

function finishGame() {
  if (!questionCount || !questionText || !feedbackText) {
    return;
  }

  answerButtons.forEach(function(button) {
    button.style.display = "none";
  });

  // Player got all 3 correct
  if (correctAnswers === 3) {
    waterUnlocked = 100;
    playerLevel = 1;

    saveProgress();
    updateGameplayMeter();
    updateSceneProgress();
    showFireworks();

    questionCount.textContent = "Mission Complete";
    questionText.textContent = "You cleaned the water and saved the community!";
    feedbackText.textContent = "Perfect score! You unlocked 100 gallons of clean water.";

    return;
  }

  // Player missed at least one
  questionCount.textContent = "Mission Finished";
  questionText.textContent = "You helped the team, but the water is not fully clean yet.";
  feedbackText.textContent = "You got " + correctAnswers + " out of 3 correct. Try again to fully clean the water.";
}

// Make selectAnswer available to the buttons in game.html
window.selectAnswer = selectAnswer;

// Also add direct click listeners as a backup
answerButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const answerIndex = Number(button.dataset.answerIndex);
    selectAnswer(answerIndex);
  });
});

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