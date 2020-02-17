import React from "react";
import "./App.css";
import GameSate from "./GameState";
import Stacks from "./Stacks";

function App() {
  return (
    <div className="App">
      <GameSate state="" />
      <Stacks rows={3} columns={20} />
    </div>
  );
}

export default App;
