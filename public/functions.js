/*
 * Functions
 */

// create and retrurn 2D array stack
const createStack = ({ rows, columns: cols }) => {
  return new Array(rows).fill(0).map(i => Array(cols).fill(0));
};

// paint with required value
const paintCurrRow = value => {
  for (let i = currPos.col; i < currPos.col + currPos.len; ++i) {
    stack[currPos.row][i] = value;
  }
};

// calculate what the new values of currPos should be
const calculateImperfection = (
  { row, col: currCol, len: currLen },
  { _, col: prevCol, len: prevLen }
) => {
  if (currCol < prevCol) {
    currLen -= prevCol - currCol;
    currCol = prevCol;
  } else if (currCol > prevCol) {
    currLen -= currCol + currLen - (prevCol + prevLen);
  }
  if (currLen < 0) currLen = 0;

  return { row, col: currCol, len: currLen };
};

// next step if game hasn't ended yet
const nextStep = () => {
  if (currPos.row === stack.length - 1) {
    winCondition();
  } else {
    prevPos = { ...currPos };
    currPos.row += 1;
    gameState.speed -= gameState.difficulty;

    paintCurrRow(1);

    if (oscillator) clearInterval(oscillator);
    oscillatorinator(currPos, gameState);
  }
};

// lose condition. Stop game, show message
const gameOver = () => {
  gameState.running = false;
  gameStatus.innerHTML = "GAME OVER!";
};

// win condition. Trim top, stop game, show message
const winCondition = () => {
  paintCurrRow(0);
  currPos = calculateImperfection(currPos, prevPos);
  paintCurrRow(1);

  createTable(stack);
  gameState.running = false;
  gameStatus.innerHTML = "YOU WIN!";
};

// reset all values to inital, clean stack, start game
const reset = () => {
  gameState = { ...initGameState };
  currPos = { ...initCurrPos };
  prevPos = { ...currPos };
  gameState.running = true;

  stack = createStack(stackSize);
};

// create fresh table, replace current table creating the illusion of animation
const createTable = tableData => {
  let table = document.createElement("table");
  let tableBody = document.createElement("tbody");
  let cp = document.createElement("div");
  let pp = document.createElement("div");

  // print in reverse order
  tableData
    .slice()
    .reverse()
    .forEach(rowData => {
      let row = document.createElement("tr");
      rowData.forEach(cellData => {
        let cell = document.createElement("td");
        if (cellData === 0) {
          cell.appendChild(document.createTextNode(cellData));
        } else if (cellData === 1) {
          cell.style.background = "white";
        }
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });

  table.appendChild(tableBody);
  pp.innerHTML = "prev: " + JSON.stringify(prevPos);
  cp.innerHTML = "curr: " + JSON.stringify(currPos);
  stackyboi.innerHTML = "";
  stackyboi.appendChild(pp);
  stackyboi.appendChild(cp);
  stackyboi.appendChild(table);
};

const oscillatorinator = (currPos, gameState) => {
  oscillator = setInterval(() => {
    if (gameState.running) {
      if (gameState.direction === "right") {
        if (currPos.col + currPos.len < stack[0].length) {
          // console.log("-->>", currPos);
          stack[currPos.row][currPos.col] = 0;
          stack[currPos.row][currPos.col + currPos.len] = 1;

          currPos.col++;
        } else {
          gameState.direction = "left";
        }
      } else if (gameState.direction === "left") {
        if (currPos.col > 0) {
          // console.log("<<--", currPos);
          stack[currPos.row][currPos.col - 1] = 1;
          stack[currPos.row][currPos.col + currPos.len - 1] = 0;

          currPos.col--;
        } else {
          gameState.direction = "right";
        }
      }

      // fake animation
      createTable(stack);
    }
  }, gameState.speed);
};
