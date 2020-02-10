const gameStatus = document.querySelector(".condition");
const stackyboi = document.querySelector(".stackyboi");

const initGameState = {
  direction: "right",
  speed: "60",
  running: false,
  difficulty: 4
};
const initCurrPos = {
  row: -1,
  col: 0,
  len: 7
};
const stackSize = {
  rows: 10,
  columns: 15
};

let oscillator = null;

let gameState = { ...initGameState };
let currPos = { ...initCurrPos };
let prevPos = { ...currPos };

let stack = createStack(stackSize);

createTable(stack);

/*
 * Click handler
 * Decisions based on current state
 */
const clickHandler = () => {
  if (!gameState.running) {
    reset();
    gameStatus.innerHTML = "STACKS";
  }

  if (prevPos.row == -1) {
    // initial step
    nextStep();
  } else if (currPos.col === prevPos.col) {
    // perfect placement
    nextStep();
  } else {
    // imperfect placement
    paintCurrRow(0);
    currPos = calculateImperfection(currPos, prevPos);
    if (currPos.len === 0) {
      gameOver();
      return 0;
    }
    paintCurrRow(1);
    nextStep();
  }
};

/*
 * Event Handlers
 */
document.addEventListener("click", () => clickHandler());

document.addEventListener("keydown", e => {
  if (e.code === "Space" || e.code === "Enter") {
    e.preventDefault();
    clickHandler();
  }
});
