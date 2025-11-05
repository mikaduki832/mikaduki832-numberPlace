// 効果音

function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

const secretButton = document.getElementById("secret");

let secretCount = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    secretCount++;
    if (secretCount === 20) {
      secretButton.style.display = "block";
      secretButton.classList.add("glow");
      playSound('se/dodon.mp3');
    }
  }
});
