import React from "react";

class GameSate extends React.Component {
  render() {
    return <h1 className="game-state">{this.props.state || "STACKS"}</h1>;
  }
}

export default GameSate;
