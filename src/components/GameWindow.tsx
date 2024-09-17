import React, { useState } from "react";
import "./GameWindow.css";

const GameWindow = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameSelection = (game: string) => {
    setSelectedGame(game);
  };

  if (selectedGame) {
    return <div>Game {selectedGame} is selected</div>;
  }

  return (
    <div className="game-window">
      <div className="game-options" >
        <div className="game-option" onClick={() => handleGameSelection("Game 1")}>
          <img className="game-image" src="/src/assets/floatingCloudGame.jpg" alt="Game 1" />
          <p>Game 1</p>
        </div>
        <div className="game-option" onClick={() => handleGameSelection("Game 2")}>
          <img className="game-image" src="/src/assets/floatingBalloonGame.jpg" alt="Game 2" />
          <p>Game 2</p>
        </div>
      </div>
    </div>
  );
};

export default GameWindow;

