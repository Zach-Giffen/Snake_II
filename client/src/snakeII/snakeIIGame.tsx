import { useState } from "react";
import SnakeBoard from "./snakeBoard";
import GameOverModal from "./gameOverModal"
import PausedModal from "./pausedModal"

import "./styles.css";

export default function SnakeGameII() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [justStarted, setJustStarted] = useState(true);

  const handleStartClick = () => {
    if (justStarted) {
      setIsPlaying(true);
      setJustStarted(false);
      setScore(0);

      return;
    }

    !isGameOver && setIsPlaying(!isPlaying)
  };

  return (
    <div id="snakes-game-container">
      <h1 id="game-title">SnakeII</h1>

      {justStarted ? (
        <p className="new-game-hint" onClick={handleStartClick}>Start Game</p>
      ) : (
        <>
          <p className="score">
            <span>Score</span>
            <span>{score}</span>
          </p>
          <p className="pause-hint">
            <strong>PAUSE:</strong> Click Anywhere or Press <kbd>esc</kbd>
          </p>
        </>
      )}
      {!isGameOver && !justStarted && (
        <SnakeBoard
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          externalScore={score}
          setScore={setScore}
          setIsGameOver={setIsGameOver}
        />
      )}

      {isGameOver && (
        <GameOverModal
          setIsGameOver={setIsGameOver}
          setIsPlaying={setIsPlaying}
          finalScore={score}
          setJustStarted={setJustStarted}
          setScore={setScore}
        />
      )}
      {justStarted
        ? ""
        : !isGameOver &&
        !isPlaying && <PausedModal setIsPlaying={setIsPlaying} />}
        <p className="skinSelect">Skin</p>
        <p className="leaderBoard">Leader Board</p>
        <p className="signOut">Sign Out</p>
    </div>
  );
}
