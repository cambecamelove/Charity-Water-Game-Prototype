// ===============================
// FREE WATER HOME PAGE SCRIPT
// ===============================

console.log("script.js is connected");

// Saved data
let savedWater = localStorage.getItem("waterUnlocked");
let savedLevel = localStorage.getItem("playerLevel");

let waterUnlocked = savedWater ? Number(savedWater) : 0;
let playerLevel = savedLevel ? Number(savedLevel) : 0;

// Home page elements
const waterFill = document.getElementById("waterFill");
const waterText = document.getElementById("waterText");
const levelNumber = document.getElementById("levelNumber");
const waterBarrel = document.getElementById("waterBarrel");

// Update home page if those elements exist
function updateHomePage() {
  if (levelNumber) {
    levelNumber.textContent = playerLevel;
  }

  if (!waterFill || !waterText) {
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
}

// Home page hover effect
if (waterBarrel) {
  waterBarrel.addEventListener("mouseenter", function() {
    waterBarrel.classList.add("barrel-active");
  });

  waterBarrel.addEventListener("mouseleave", function() {
    waterBarrel.classList.remove("barrel-active");
  });
}

updateHomePage();