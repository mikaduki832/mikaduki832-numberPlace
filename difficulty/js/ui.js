// 時間の表示

const timeElement = document.getElementById('timer');
const startTime = new Date();

const pad = (num) => String(num).padStart(2, '0');

let lastDisplay = '00:00';

const interVailId = setInterval(() => {
  const now = new Date();
  const elapsedTime = now - startTime;
  const totalSconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(totalSconds / 60);
  const seconds = totalSconds % 60;

  lastDisplay = `${pad(minutes)}:${pad(seconds)}`;
  timeElement.textContent = lastDisplay;
}, 1000);

// 答え合わせ //
const endMessage = document.querySelector('.end-mesage');

let answerCount = 0;

function checkAnswer() {
  const table = document.getElementById("sudoku");
  let allCorrect = true;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = table.rows[row].cells[col];

      // プレイヤー入力マスだけ判定（固定ヒントは無視）
      if (cell.classList.contains("answer-cell")) {
        const userValue = cell.textContent.trim();
        const correctValue = solutionGrid[row][col].toString();

        if (userValue !== correctValue) {
          allCorrect = false;
        }
      }
    }
  }

  if (allCorrect) {
    clearInterval(interVailId);
    const gameText = document.createElement('div');
    gameText.className = 'text';
    gameText.textContent = `ヒント使用回数：${count} 回`;
    timeElement.textContent = `完成!! 経過時間：${lastDisplay}`;
    timeElement.appendChild(gameText);
    returnButton.style = "display:block";
    checkButton.style = "display:none";
    hintButton.style = "display:none";
    deleteButton.style = "display:none";
  } else {
    answerCount++;
    if (answerCount < 10) {
      alert('もう少し考えてみよう。');
    } else if (answerCount === 10){
      alert('新たにヒントを使える回数を捧げましょう。');
      hint = hint + 3;
      hintCount.textContent = hint;
      answerCount = 0;
    }
  }
}

