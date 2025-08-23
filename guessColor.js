const colorCode = document.getElementById("color-code");
const optionsContainer = document.getElementById("optn-Container");
const scores = document.getElementById("score");

let score = 0;
let randomColor = null;

function generateRandomNumber(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function generateRandomColorRGB() {
  const red = generateRandomNumber(0, 255);
  const green = generateRandomNumber(0, 255);
  const blue = generateRandomNumber(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
}

function incrementScore() {
  score += 1;
  scores.innerText = score;
  window.localStorage.setItem("score", score); 
}

function validateResult(el) {
  const selectedColor = el.target.style.backgroundColor;

  if (selectedColor === randomColor) {
    incrementScore();
  } else {
    if (score > 0) {
      score -= 1;  
    }
    window.localStorage.setItem("score", score); 
    scores.innerText = score;
  }

  startGame();
}


 

function startGame() {
  
  score = Number(window.localStorage.getItem("score")) ?? 0;
  scores.innerText = score;

  optionsContainer.innerHTML = ""; 

  randomColor = generateRandomColorRGB();
  colorCode.innerText = randomColor;

  const ansIndex = generateRandomNumber(0, 5);

  for (let i = 0; i < 6; i++) {
    const div = document.createElement("div");
    div.classList.add("color-option");
    div.addEventListener("click", validateResult);
    div.style.backgroundColor =
      i === ansIndex ? randomColor : generateRandomColorRGB();
    optionsContainer.append(div);
  }
}

window.addEventListener("load", startGame);
