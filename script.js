// Select all the screens so we can switch between them
const screens = document.querySelectorAll('.screen');

// Select all the insect choice buttons
const chooseInsectBtns = document.querySelectorAll('.choose-insect-btn');

// Select main elements from the page
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');

// Variables to track game time, score, and chosen insect
let seconds = 0;
let score = 0;
let selectedInsect = {};

// When the start button is clicked, move to the next screen
startBtn.addEventListener('click', () => {
  screens[0].classList.add('up');
});

// Function to play the squish sound when insect is clicked
function playSquishSound() { 
    const sound = document.getElementById('squish-sound');
    sound.currentTime = 0;  // rewind sound so it plays immediately
    sound.play();
}

// When a user selects an insect
chooseInsectBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    const src = img.getAttribute('src');   // image link
    const alt = img.getAttribute('alt');   // insect name text

    // Save selected insect info
    selectedInsect = { src, alt };

    // Move to the game screen
    screens[1].classList.add('up');

    // Create the first insect after 1 second
    setTimeout(createInsect, 1000);

    // Start the timer
    startGame();
  });
});

// Start the countdown timer (runs every second)
function startGame() {
  setInterval(increaseTime, 1000);
}

// Update game timer every second
function increaseTime() {
  let m = Math.floor(seconds / 60); // minutes
  let s = seconds % 60;             // seconds

  // Add leading zeros like 00:05
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;

  timeEl.innerHTML = `Time: ${m}:${s}`;
  seconds++;
}

// Create a new insect at a random location
function createInsect() {
  const insect = document.createElement('div');
  insect.classList.add('insect');

  const { x, y } = getRandomLocation();
  insect.style.top = `${y}px`;
  insect.style.left = `${x}px`;

  // Rotate insect randomly for fun
  insect.innerHTML = `
    <img src="${selectedInsect.src}" 
         alt="${selectedInsect.alt}" 
         style="transform: rotate(${Math.random() * 360}deg)" />
  `;

  // When clicked, the insect is "caught"
  insect.addEventListener('click', catchInsect);

  // Add the insect to the game area
  gameContainer.appendChild(insect);
}

// Get a random safe location on the screen (not too close to edges)
function getRandomLocation() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Keep insects at least 100px from edges
  const x = Math.random() * (width - 200) + 100;
  const y = Math.random() * (height - 200) + 100;

  return { x, y };
}

// Called when user clicks an insect
function catchInsect() {
    playSquishSound();      // play sound effect
    increaseScore();        // increase score

    this.classList.add('caught'); // animation class

    // Remove insect after animation
    setTimeout(() => this.remove(), 2000);

    // Add 2 more insects to make the game harder
    addInsects();
}

// Add more insects after catching one
function addInsects() {
  setTimeout(createInsect, 1000);
  setTimeout(createInsect, 1500);
}

// Update score display and show message after a high score
function increaseScore() {
  score++;
  
  // After score reaches 20, show annoying message
  if (score > 19) {
    message.classList.add('visible');
  }

  scoreEl.innerHTML = `Score: ${score}`;
}
