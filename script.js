// script.js
const characters = [
  { name: "Michael Scott", img: "assets/characters/michael_scott.jpg" },
  { name: "Dwight Schrute", img: "assets/characters/dwight_schrute.jpg" },
  { name: "Jim Halpert", img: "assets/characters/jim_halpert.jpg" },
  { name: "Pam Beesly", img: "assets/characters/pam_beesly.jpg" },
  { name: "Stanley Hudson", img: "assets/characters/stanley_hudson.jpg" },
  { name: "Kevin Malone", img: "assets/characters/kevin_malone.jpg" },
  { name: "Angela Martin", img: "assets/characters/angela_martin.jpg" },
  { name: "Oscar Martinez", img: "assets/characters/oscar_martinez.jpg" },
  { name: "Phyllis Vance", img: "assets/characters/phyllis_vance.jpg" },
  { name: "Creed Bratton", img: "assets/characters/creed_bratton.jpg" },
  { name: "Toby Flenderson", img: "assets/characters/toby_flenderson.jpg" },
  { name: "Kelly Kapoor", img: "assets/characters/kelly_kapoor.jpg" },
  { name: "Andy Bernard", img: "assets/characters/andy_bernard.jpg" },
  { name: "Ryan Howard", img: "assets/characters/ryan_howard.jpg" },
  { name: "Jan Levinson", img: "assets/characters/jan_levinson.jpg" },
  { name: "Meredith Palmer", img: "assets/characters/meredith_palmer.jpg" },
  { name: "Darryl Philbin", img: "assets/characters/darryl_philbin.jpg" },
  { name: "Erin Hannon", img: "assets/characters/erin_hannon.jpg" },
  { name: "Gabe Lewis", img: "assets/characters/gabe_lewis.jpg" },
  { name: "Robert California", img: "assets/characters/robert_california.jpg" }
];

let playerName = "";
let shuffled = [];
let currentIndex = 0;
let streak = 0;

const elements = {
  landing: document.getElementById('landing'),
  game: document.getElementById('game'),
  winModal: document.getElementById('win-modal'),
  loseModal: document.getElementById('lose-modal'),
  nameInput: document.getElementById('player-name'),
  nameDisplay: document.getElementById('name-display'),
  img: document.getElementById('character-img'),
  options: document.getElementById('options'),
  winMessage: document.getElementById('win-message'),
  progressDots: document.querySelectorAll('#progress-bar .dot')
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function updateProgress() {
  elements.progressDots.forEach((dot, i) => {
    if (i < streak) dot.classList.add('filled');
    else dot.classList.remove('filled');
  });
}

function startGame() {
  playerName = elements.nameInput.value.trim();
  if (!playerName) {
    document.getElementById('name-error').textContent = "Name is required!";
    return;
  }
  document.getElementById('name-error').textContent = "";

  elements.nameDisplay.textContent = playerName;
  elements.winMessage.textContent = `You did it, ${playerName}, you won!`;

  elements.landing.classList.remove('active');
  elements.game.classList.add('active');

  shuffled = shuffle([...characters]);
  currentIndex = 0;
  streak = 0;
  updateProgress();
  loadQuestion();
}

function loadQuestion() {
  if (currentIndex >= shuffled.length) {
    shuffled = shuffle([...characters]);
    currentIndex = 0;
  }

  const char = shuffled[currentIndex];

  // Instant blur for new question
  elements.img.classList.remove('clear');
  elements.img.style.transition = 'none';
  elements.img.src = char.img;
  void elements.img.offsetWidth; // trigger reflow
  elements.img.style.transition = ''; // re-enable transition for reveal

  // Generate options
  let options = [char.name];
  const others = characters
    .filter(c => c.name !== char.name)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  options.push(...others.map(o => o.name));
  options = shuffle(options);

  elements.options.innerHTML = "";
  options.forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.addEventListener('click', () => selectOption(name === char.name, btn, char));
    elements.options.appendChild(btn);
  });
}

function selectOption(correct, clickedBtn, char) {
  const buttons = elements.options.querySelectorAll('button');
  buttons.forEach(b => b.disabled = true);

  if (correct) {
    clickedBtn.classList.add('correct');
    elements.img.classList.add('clear');
    streak++;
    updateProgress();

    if (streak === 5) {
      setTimeout(() => {
        elements.game.classList.remove('active');
        elements.winModal.classList.add('active');
      }, 1200);
    } else {
      setTimeout(() => {
        currentIndex++;
        loadQuestion();
      }, 1200);
    }
  } else {
    clickedBtn.classList.add('wrong');
    buttons.forEach(b => {
      if (b.textContent === char.name) b.classList.add('correct');
    });
    elements.img.classList.add('clear');
    setTimeout(() => {
      elements.game.classList.remove('active');
      elements.loseModal.classList.add('active');
    }, 1800);
  }
}

function restart() {
  elements.winModal.classList.remove('active');
  elements.loseModal.classList.remove('active');
  elements.landing.classList.add('active');
  elements.nameInput.value = "";
  elements.nameInput.focus();
}

// Event Listeners
document.getElementById('start-game').addEventListener('click', startGame);
document.querySelectorAll('.restart-btn').forEach(btn => {
  btn.addEventListener('click', restart);

});
