// CHANGE THIS WHEN DEPLOYING BACKEND
const API_BASE = "https://web-production-39f80.up.railway.app";

let gameId = null;
let size = 3;

function createGame() {
  size = document.getElementById("sizeInput").value;

  fetch(`${API_BASE}/game/create?n=${size}`, { method: "POST" })
    .then(res => res.json())
    .then(game => {
      gameId = game.gameId;
      renderBoard(size);
      updateStatus("Game started. Player X's turn.");
    })
    .catch(() => updateStatus("Backend not reachable", true));
}

function renderBoard(n) {
  const board = document.getElementById("board");
  board.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
  board.innerHTML = "";

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-dark cell";
      btn.onclick = () => makeMove(r, c, btn);
      board.appendChild(btn);
    }
  }
}

function makeMove(row, col, cell) {
  fetch(`${API_BASE}/game/${gameId}/move?row=${row}&col=${col}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(game => {
      cell.innerText = game.board[row][col];
      cell.disabled = true;

      if (game.status === "WON") {
        updateStatus(`Player ${game.winner} wins! 🎉`);
        disableBoard();
      } else if (game.status === "DRAW") {
        updateStatus("It's a draw!");
      } else {
        updateStatus(`Player ${game.currentPlayer}'s turn`);
      }
    });
}

function disableBoard() {
  document.querySelectorAll(".cell").forEach(b => b.disabled = true);
}

function updateStatus(msg, error = false) {
  const status = document.getElementById("status");
  status.innerText = msg;
  status.className = error ? "text-danger fw-semibold" : "text-secondary fw-semibold";
}
