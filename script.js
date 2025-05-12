const boardSize = 20;
const board = document.getElementById("game-board");
const scoreText = document.getElementById("score");
const gameOverText = document.getElementById("game-over");
const missionText = document.getElementById("mission");
const targetDisplay = document.getElementById("target");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const levelCleared = document.getElementById("level-cleared");

let snake = [];
let direction = { x: 1, y: 0 };
let apple = {};
let walls = [];
let score = 0;
let gameInterval;
let speed = 200;
let level = 1;
let target = 5;
let isLevelTransitioning = false;

function drawBoard() {
  board.innerHTML = "";
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (snake.some(s => s.x === x && s.y === y)) {
        cell.classList.add("snake");
      } else if (apple.x === x && apple.y === y) {
        cell.classList.add("apple");
      } else if (walls.some(w => w.x === x && w.y === y)) {
        cell.classList.add("wall");
      }

      board.appendChild(cell);
    }
  }
}

function getRandomPosition(exclude = []) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (exclude.some(e => e.x === pos.x && e.y === pos.y));
  return pos;
}

function moveSnake() {
  if (isLevelTransitioning) return;

  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;

  if (
    head.x < 0 || head.x >= boardSize ||
    head.y < 0 || head.y >= boardSize ||
    snake.some(s => s.x === head.x && s.y === head.y) ||
    walls.some(w => w.x === head.x && w.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    scoreText.textContent = `分數：${score}`;
    if (score >= target) {
      isLevelTransitioning = true;
      levelCleared.textContent = "🎉 關卡完成！";
      levelCleared.classList.add("show");
      setTimeout(() => {
        levelCleared.classList.remove("show");
        nextLevel();
      }, 1500);
      return;
    }
    apple = getRandomPosition([...snake, ...walls]);
    speed = Math.max(50, speed - 10);
    restartInterval();
  } else {
    snake.pop();
  }

  drawBoard();
}

function nextLevel() {
  clearInterval(gameInterval);
  level++;
  target += 5;
  speed = 200 - (level * 10);
  score = 0;
  walls = Array.from({ length: level * 2 }, () => getRandomPosition([...snake]));
  targetDisplay.textContent = target;
  startLevel();
}

function restartInterval() {
  clearInterval(gameInterval);
  gameInterval = setInterval(moveSnake, speed);
}

function startLevel() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  apple = getRandomPosition([...snake, ...walls]);
  scoreText.textContent = `分數：${score}`;
  drawBoard();
  isLevelTransitioning = false;
  gameInterval = setInterval(moveSnake, speed);
}

function startGame() {
  level = 1;
  target = 5;
  score = 0;
  speed = 200;
  walls = Array.from({ length: 3 }, () => getRandomPosition());

  board.style.display = "grid";
  scoreText.style.display = "block";
  missionText.style.display = "block";
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  gameOverText.textContent = "";
  targetDisplay.textContent = target;
  levelCleared.classList.remove("show");

  startLevel();
}

function endGame() {
  clearInterval(gameInterval);
  gameOverText.textContent = "💀 遊戲結束！";
  restartBtn.style.display = "inline-block";
}

function changeDirection(e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  switch (e.key) {
    case "ArrowUp": if (direction.y !== 1) direction = { x: 0, y: -1 }; break;
    case "ArrowDown": if (direction.y !== -1) direction = { x: 0, y: 1 }; break;
    case "ArrowLeft": if (direction.x !== 1) direction = { x: -1, y: 0 }; break;
    case "ArrowRight": if (direction.x !== -1) direction = { x: 1, y: 0 }; break;
  }
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);
