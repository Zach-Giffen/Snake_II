import { useState } from 'react';
import SnakeBoard from './snakeBoard';
import GameOverModal from './gameOverModal';
import PausedModal from './pausedModal';

import './styles.css';

export const HIGH_SCORE_KEY = 'high-score';

export default function SnakeGameII() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [justStarted, setJustStarted] = useState(true);

  if (localStorage.getItem(HIGH_SCORE_KEY) === null) {
    localStorage.setItem(HIGH_SCORE_KEY, '0');
  }
  const highScore = Number(localStorage.getItem(HIGH_SCORE_KEY));

  const handleStartClick = () => {
    if (justStarted) {
      setIsPlaying(true);
      setJustStarted(false);
      setScore(0);

      return;
    }

    !isGameOver && setIsPlaying(!isPlaying);
  };

  return (
    <div id="snakes-game-container">
      <h1 id="game-title">SnakeII</h1>
      <p className="high-score">High Score: {highScore}</p>

      {justStarted ? (
        <p className="new-game-hint" onClick={handleStartClick}>
          Start Game
        </p>
      ) : (
        <>
          <p className="score">
            <span>Score</span>
            <span>{score}</span>
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
        ? ''
        : !isGameOver &&
          !isPlaying && <PausedModal setIsPlaying={setIsPlaying} />}
      {justStarted ? <p className="skinSelect">Skin</p> : <></>}
      {justStarted ? <p className="leaderBoard">Leader Board</p> : <></>}
      {justStarted ? <p className="signOut">Sign Out</p> : <></>}
    </div>
  );
}
