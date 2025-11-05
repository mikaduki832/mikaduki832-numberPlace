// 問題の生成

function generateSudoku() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isSafe(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    const boxRow = row - (row % 3);
    const boxCol = col - (col % 3);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[boxRow + r][boxCol + c] === num) return false;
      }
    }
    return true;
  }

  function fillGrid(row = 0, col = 0) {
    if (row === 9) return true;
    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = (col + 1) % 9;
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

    for (const num of numbers) {
      if (isSafe(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillGrid(nextRow, nextCol)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  fillGrid();
  return grid;
}

function solveSudoku(grid, count = 0) {
  if (count > 1) return count; // 2個以上見つけたらやめる

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            count = solveSudoku(grid, count);
            grid[row][col] = 0;
          }
        }
        return count; // 解が見つからないのでバックトラック
      }
    }
  }

  return count + 1; // 解を1つ見つけた
}

function isSafe(grid, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }
  const boxRow = row - (row % 3);
  const boxCol = col - (col % 3);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[boxRow + r][boxCol + c] === num) return false;
    }
  }
  return true;
}

// メモ機能 //

function formatMemoHTML(memoString) {
  const sorted = [...memoString].sort();
  let html = "<div class='memo'>";
  for (let i = 1; i <= 9; i++) {
    const digit = i.toString();
    html += `<div class="memo-cell">${sorted.includes(digit) ? digit : ""
      }</div>`;
  }
  html += "</div>";
  return html;
}

// メモと同じ数字が縦・横・3×3のブロックに入ったとき、メモを削除

function removeFromMemo(cell, num) {
  if (!cell.dataset.memo) return;
  let memo = cell.dataset.memo.split("");
  const index = memo.indexOf(num.toString());
  if (index !== -1) {
    memo.splice(index, 1);
    cell.dataset.memo = memo.join("");
    cell.innerHTML = formatMemoHTML(cell.dataset.memo); // ← メモ表示を再生成
  }
}

function removeMemoAround(row, col, num) {
  const table = document.getElementById("sudoku");

  // 同じ行
  for (let c = 0; c < 9; c++) {
    if (c !== col) removeFromMemo(table.rows[row].cells[c], num);
  }

  // 同じ列
  for (let r = 0; r < 9; r++) {
    if (r !== row) removeFromMemo(table.rows[r].cells[col], num);
  }

  // 同じ3x3ブロック
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (r !== row || c !== col) {
        removeFromMemo(table.rows[r].cells[c], num);
      }
    }
  }
}

// ヒント機能 ... イベントはHTMLに//

const hintButton = document.getElementById("hint");
let hint = 3; // ヒント使用回数
let count = 0; // ヒントを使った回数
const hintCount = document.getElementById('hint-count');
hintCount.textContent = hint;

function giveHint() {
  if (hint === 0) {
    alert("ヒントはもう使い切りました！");
    return;
  }

  // 空白セル（answer-cell）の中で、まだ埋まってないものを集める
  const emptyCells = [];
  const table = document.getElementById("sudoku");

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = table.rows[row].cells[col];
      if (
        cell.classList.contains("answer-cell") &&
        cell.textContent.trim() === ""
      ) {
        emptyCells.push({ cell, row, col });
      }
    }
  }

  if (emptyCells.length === 0) {
    alert("空白マスがもうありません！");
    return;
  } else {
    hint--;
    count++;
    hintCount.textContent = hint;
  }

  // ランダムな1マスを選んで、正解を埋める
  const random = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const correct = solutionGrid[random.row][random.col];

  random.cell.textContent = correct;
  random.cell.classList.add("hinted"); // 任意：ヒントで埋めた印

  removeMemoAround(random.row, random.col, correct);
}

// 数字固定機能

const toggleLocked = (cell) => {
  if (!cell) return;

  // すでに固定なら解除

  if (cell.dataset.fixed === "true") {
    cell.dataset.fixed = "false";
    cell.classList.remove("lock");
  } else {
    cell.dataset.fixed = "true";
    cell.classList.add('lock');
  }
}

// 全消去 ... イベントはHTMLに//

const deleteButton = document.getElementById('allDelete');

function allDelete() {
  const table = document.getElementById("sudoku");

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = table.rows[row].cells[col];

      // 空白マス（プレイヤーが入力できるセル）かつヒントじゃない場合だけ消す
      if (
        cell.classList.contains("answer-cell") &&
        !cell.classList.contains("hinted") &&
        cell.dataset.fixed !== "true"
      ) {
        cell.textContent = "";
        cell.style.backgroundColor = ""; // 色リセット（チェック後の場合）
        cell.dataset.memo = "";
      }
    }
  }

  // 選択状態も解除（あれば）
  if (selectedCell) {
    selectedCell.classList.remove("selected");
    selectedCell = null;
  }

}

// メモ機能のオン

const memoOn = () => {
  memoUsed = !memoUsed;

  // ON/OFFの視覚的表示（任意）
  const memoBtn = document.getElementById("memoSwitch");
  memoBtn.textContent = memoUsed ? "ON" : "OFF";
  memoBtn.style.backgroundColor = memoUsed ? "#ccf" : ""; // 青っぽく
};
