let currentPlayer = "X";
let arr = Array(9).fill(null);
let gameActive = true;

const statusEl = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

function checkWinner() {
  for (let [a,b,c] of winPatterns) {
    if (arr[a] && arr[a] === arr[b] && arr[b] === arr[c]) {
      statusEl.innerText = `🎉 Winner is ${currentPlayer}!`;
      gameActive = false;

      // Highlight winning cells
      document.getElementById(a).classList.add("winner");
      document.getElementById(b).classList.add("winner");
      document.getElementById(c).classList.add("winner");
      return;
    }
  }

  if (!arr.includes(null)) {
    statusEl.innerText = "It's a Draw!";
    gameActive = false;
  }
}

function handleClick(e) {
  const id = Number(e.target.id);
  if (!gameActive || arr[id] !== null) return;

  arr[id] = currentPlayer;
  e.target.innerText = currentPlayer;

  checkWinner();

  if (gameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusEl.innerText = `Player ${currentPlayer}'s turn`;
  }
}

function resetGame() {
  arr.fill(null);
  gameActive = true;
  currentPlayer = "X";
  statusEl.innerText = "Player X's turn";

  cells.forEach(cell => {
    cell.innerText = "";
    cell.classList.remove("winner");
  });
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
document.getElementById("resetBtn").addEventListener("click", resetGame);
