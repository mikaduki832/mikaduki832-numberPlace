// 解答の穴を55個空ける //

function removeCellsWithUniquenessCheck(fullGrid, maxRemove = 55) {
  const puzzle = fullGrid.map((row) => row.slice());
  let removed = 0;

  while (removed < maxRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;

      const copy = puzzle.map((r) => r.slice());
      const solutions = solveSudoku(copy, 0);

      if (solutions === 1) {
        removed++;
      } else {
        puzzle[row][col] = backup;
      }
    }
  }

  return puzzle;
}

let solutionGrid = generateSudoku(); // 完成盤
let puzzleGrid = removeCellsWithUniquenessCheck(solutionGrid, 55);

const table = document.getElementById("sudoku");

for (let i = 0; i < 9; i++) {
  const row = document.createElement("tr");
  for (let j = 0; j < 9; j++) {
    const cell = document.createElement("td");

    const val = puzzleGrid[i][j];
    if (val !== 0) {
      cell.textContent = val;
      cell.classList.add("fixed");
    } else {
      cell.textContent = "";
      cell.classList.add("answer-cell");
    }

    row.appendChild(cell);
  }
  table.appendChild(row);
}

function returnPuzzle() {
  // 盤面を再生成
  solutionGrid = generateSudoku();
  puzzleGrid = removeCellsWithUniquenessCheck(solutionGrid, 55);

  // <table> をクリア
  const table = document.getElementById("sudoku");
  table.innerHTML = "";

  // 再描画
  for (let i = 0; i < 9; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("td");
      const val = puzzleGrid[i][j];

      if (val !== 0) {
        cell.textContent = val;
        cell.classList.add("fixed");
      } else {
        cell.textContent = "";
        cell.classList.add("answer-cell");
      }

      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // セルクリック処理の再登録（必要であれば）
  selectedCell = null;
}
