// セルの選択解除 //

function clearSelectedCell() {
  if (!selectedCell || selectedCell.classList.contains("hinted")) return;

  selectedCell.textContent = "";
  selectedCell.dataset.memo = "";
}

// 数字の入力

// --- 共通処理 ---
function handleNumberInput(key) {
  if (!selectedCell || selectedCell.classList.contains("hinted")) return;
  if (selectedCell.dataset.fixed === "true") return;

  if (memoUsed) {
    let existing = selectedCell.dataset.memo || "";

    if (existing.includes(key)) {
      existing = existing.replace(key, "");
    } else {
      existing += key;
    }

    selectedCell.dataset.memo = existing;

    if (existing.length > 0) {
      selectedCell.innerHTML = formatMemoHTML(existing);
    } else {
      selectedCell.innerHTML = "";
    }
  } else {
    selectedCell.textContent = key;
    selectedCell.dataset.memo = "";

    const row = selectedCell.parentNode.rowIndex;
    const col = selectedCell.cellIndex;
    removeMemoAround(row, col, key);
  }
}

// --- キーボード入力 ---
document.addEventListener("keydown", (e) => {
  if (!selectedCell || e.isComposing) return;

  const key = e.key;

  if (/^[1-9]$/.test(key)) {
    handleNumberInput(key);
  }

  if (key === "Backspace" || key === "Delete") {
    if (selectedCell.dataset.fixed === "true") return;
    clearSelectedCell();
  }

  if (selectedCell && key === "Shift") {
    toggleLocked(selectedCell);
  }
});

// --- クリック入力 ---
const keyboard = document.querySelector(".keyboard");
keyboard.addEventListener("click", (e) => {
  const td = e.target.closest("td");
  if (!td) return;
  const keyValue = td.textContent.trim();
  if (/^[1-9]$/.test(keyValue)) {
    handleNumberInput(keyValue);
  }
});

// 数字を入れるセルの選択

let selectedCell = null; // 今選択されているセルを記憶

document.getElementById("sudoku").addEventListener("click", (e) => {
  if (
    e.target.classList.contains("answer-cell") &&
    !e.target.classList.contains("hinted") // ← ← ← ヒントマスは禁止
  ) {
    if (selectedCell) selectedCell.classList.remove("selected");
    selectedCell = e.target;
    selectedCell.classList.add("selected");
  }
});

// メモ入力機能をOnにする

const memoButton = document.getElementById('memoSwitch');

memoButton.addEventListener('click', () => {
  memoOn();
})

document.addEventListener("keydown", (e) => {
  if(e.isComposing) return;
  if (e.key === " ") {
    memoOn();
  }
});

// 答え合わせ開始ボタン //

const checkButton = document.getElementById("check");

checkButton.addEventListener("click", () => {
  checkAnswer();
});

// 盤面リセット機能

const returnButton = document.getElementById("return");
returnButton.style = "display:none";

returnButton.addEventListener("click", () => {
  returnPuzzle();
  returnButton.style = "display:none";
  checkButton.style = "display:block";
  hintButton.style = "display:block";
  deleteButton.style = "display:block";
  timeElement.textContent = '';
  gameText.remove();
});
