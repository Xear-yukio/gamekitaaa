const choices = document.querySelectorAll(".choice");
const resultEl = document.getElementById("result");
const playerScoreEl = document.getElementById("player-score");
const aiScoreEl = document.getElementById("ai-score");
const playerChar = document.getElementById("player-char");
const aiChar = document.getElementById("ai-char");
const aiChoiceText = document.getElementById("ai-choice-text");
const difficultySelect = document.getElementById("difficulty");
const highscoreEl = document.getElementById("highscore");

let playerScore = 0;
let aiScore = 0;
let winStreak = 0;

const soundClick = document.getElementById("sfx-click");
const soundWin = document.getElementById("sfx-win");
const soundLose = document.getElementById("sfx-lose");
const soundDraw = document.getElementById("sfx-draw");

const pilihan = ["batu", "gunting", "kertas"];
let history = [];

const getAIChoice = () => {
  const difficulty = difficultySelect.value;

  if (difficulty === "mudah") {
    return pilihan[Math.floor(Math.random() * 3)];
  }

  if (difficulty === "sedang") {
    if (history.length > 0) {
      let last = history[history.length - 1];
      return counterChoice(last);
    }
    return pilihan[Math.floor(Math.random() * 3)];
  }

  if (difficulty === "sulit") {
    if (history.length > 1) {
      let freq = {};
      history.forEach(c => freq[c] = (freq[c] || 0) + 1);
      let mostUsed = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
      return counterChoice(mostUsed);
    }
    return pilihan[Math.floor(Math.random() * 3)];
  }
};

const counterChoice = (player) => {
  if (player === "batu") return "kertas";
  if (player === "gunting") return "batu";
  return "gunting";
};

const determineResult = (player, ai) => {
  if (player === ai) return "seri";
  if (
    (player === "batu" && ai === "gunting") ||
    (player === "gunting" && ai === "kertas") ||
    (player === "kertas" && ai === "batu")
  ) return "menang";
  return "kalah";
};

const updateUI = (playerChoice, aiChoice, outcome) => {
  choices.forEach(btn => btn.classList.remove("selected"));
  document.querySelector(`.choice[data-choice="${playerChoice}"]`).classList.add("selected");

  playerChar.style.animation = "none";
  aiChar.style.animation = "none";
  void playerChar.offsetWidth;
  void aiChar.offsetWidth;
  playerChar.style.animation = "attack 0.4s ease";
  aiChar.style.animation = "attack 0.4s ease";

  aiChoiceText.textContent = aiChoice;

  if (outcome === "menang") {
    playerScore++;
    soundWin.play();
    resultEl.textContent = `✅ Hasya Menang! ${playerChoice} vs ${aiChoice}`;
  } else if (outcome === "kalah") {
    aiScore++;
    soundLose.play();
    resultEl.textContent = `❌ Hasya Kalah Nup! ${playerChoice} vs ${aiChoice}`;
  } else {
    soundDraw.play();
    resultEl.textContent = `🤝 Kita Seri! ${playerChoice} vs ${aiChoice}`;
  }

  playerScoreEl.textContent = playerScore;
  aiScoreEl.textContent = aiScore;

  if (playerScore >= 5 || aiScore >= 5) {
  const message = playerScore > aiScore ? "🏆 Hasya Menang Game yeay!" : "💀 Hasya Kalah Wuuu!";
  showPopup(message, `${playerScore} : ${aiScore}`);
  updateHighScore(playerScore);
  choices.forEach(btn => btn.disabled = true);
}
};

function resetGame() {
  playerScore = 0;
  aiScore = 0;
  playerScoreEl.textContent = "0";
  aiScoreEl.textContent = "0";
  resultEl.textContent = "Pilih salah satu untuk memulai!";
  aiChoiceText.textContent = "-";
  choices.forEach(btn => {
    btn.classList.remove("selected");
    btn.disabled = false;
  });
  history = [];
}

choices.forEach(choice => {
  choice.addEventListener("click", () => {
    const playerChoice = choice.dataset.choice;
    const aiChoice = getAIChoice();
    const outcome = determineResult(playerChoice, aiChoice);
    soundClick.play();
    history.push(playerChoice);
    updateUI(playerChoice, aiChoice, outcome);
  });
});
function showPopup(message, score) {
  const popup = document.getElementById("popup-result");
  const messageEl = document.getElementById("popup-message");
  const scoreEl = document.getElementById("popup-score");

  messageEl.textContent = message;
  scoreEl.textContent = score;
  popup.classList.remove("hidden");
}

function resetPopup() {
  document.getElementById("popup-result").classList.add("hidden");
  resetGame();
}
function showPopup(message, score) {
  const popup = document.getElementById("popup-result");
  const messageEl = document.getElementById("popup-message");
  const scoreEl = document.getElementById("popup-score");

  messageEl.textContent = message;
  scoreEl.textContent = score;
  popup.classList.remove("hidden");

  if (message.includes("Menang")) startConfetti();
}

function resetPopup() {
  document.getElementById("popup-result").classList.add("hidden");
  stopConfetti();
  resetGame();
}
