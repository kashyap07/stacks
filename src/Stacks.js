import React from "react";
import { createTable, createStack, paintCurrRow } from "./utils";

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

let oscillator = null;

class Stacks extends React.Component {
  constructor(props) {
    super(props);
    this.stackSize = {
      rows: this.props.rows,
      columns: this.props.columns
    };

    this.state = {
      gameState: { ...initGameState },
      currPos: { ...initCurrPos },
      prevPos: { ...initCurrPos }
    };

    this.stack = createStack(this.stackSize);

    /*
     * Click handler
     * Decisions based on current state
     */
    const clickHandler = () => {
      if (!this.state.gameState.running) {
        reset();
        this.gameStatusElem.innerHTML = "STACKS";
      }

      if (this.state.prevPos.row === -1) {
        // initial step
        nextStep();
      } else if (this.state.currPos.col === this.state.prevPos.col) {
        // perfect placement
        nextStep();
      } else {
        // imperfect placement
        paintCurrRow(this.stack, this.state.currPos, 0);
        this.state.currPos = calculateImperfection(
          this.state.currPos,
          this.state.prevPos
        );
        if (this.state.currPos.len === 0) {
          gameOver();
          return 0;
        }
        paintCurrRow(this.stack, this.state.currPos, 1);
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

    /*
     * Functions
     */

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
      if (this.state.currPos.row === this.stack.length - 1) {
        winCondition();
      } else {
        this.state.prevPos = { ...this.state.currPos };
        this.state.currPos.row += 1;
        this.state.gameState.speed -= this.state.gameState.difficulty;

        paintCurrRow(this.stack, this.state.currPos, 1);

        if (oscillator) clearInterval(oscillator);
        oscillatorinator(this.state.currPos, this.state.gameState);
      }
    };

    // lose condition. Stop game, show message
    const gameOver = () => {
      this.setState({ gameState: false });
      this.forceUpdate();
      this.gameStatusElem.innerHTML = "GAME OVER!";
    };

    // win condition. Trim top, stop game, show message
    const winCondition = () => {
      paintCurrRow(this.stack, this.state.currPos, 0);
      this.state.currPos = calculateImperfection(
        this.state.currPos,
        this.state.prevPos
      );
      this.setState({ gameState: false });
      this.forceUpdate();

      this.gameStatusElem.innerHTML = "YOU WIN!";
    };

    // reset all values to inital, clean this.stack, start game
    const reset = () => {
      this.state.gameState = { ...initGameState };
      this.state.currPos = { ...initCurrPos };
      this.state.prevPos = { ...this.state.currPos };
      this.state.gameState.running = true;

      this.stack = createStack(this.stackSize);
    };

    const oscillatorinator = (currPos, gameState) => {
      oscillator = setInterval(() => {
        if (this.state.gameState.running) {
          if (this.state.gameState.direction === "right") {
            if (
              this.state.currPos.col + this.state.currPos.len <
              this.stack[0].length
            ) {
              // console.log("-->>", this.state.currPos);
              this.stack[this.state.currPos.row][this.state.currPos.col] = 0;
              this.stack[this.state.currPos.row][
                this.state.currPos.col + this.state.currPos.len
              ] = 1;

              this.state.currPos.col++;
              this.forceUpdate();
            } else {
              this.state.gameState.direction = "left";
            }
          } else if (this.state.gameState.direction === "left") {
            if (this.state.currPos.col > 0) {
              // console.log("<<--", this.state.currPos);
              this.stack[this.state.currPos.row][
                this.state.currPos.col - 1
              ] = 1;
              this.stack[this.state.currPos.row][
                this.state.currPos.col + this.state.currPos.len - 1
              ] = 0;

              this.state.currPos.col--;
              this.forceUpdate();
            } else {
              this.state.gameState.direction = "right";
            }
          }
        }
      }, this.state.gameState.speed);
    };
  }
  render() {
    return <div className="stackyboi"></div>;
  }
  componentDidMount() {
    this.gameStatusElem = document.querySelector(".game-state");
    createTable(this.state.currPos, this.state.prevPos, this.stack);
  }
  componentDidUpdate() {
    createTable(this.state.currPos, this.state.prevPos, this.stack);
    paintCurrRow(this.stack, this.state.currPos, 1);
  }
}

export default Stacks;
