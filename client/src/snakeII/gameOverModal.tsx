import { addScore } from './data';
import { HIGH_SCORE_KEY } from './snakeIIGame';

const userName: string = 'snakeGod';
const userId: number = 1;

interface GameOverModal {
  finalScore: number;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setJustStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}
export default function GameOverModal({
  finalScore,
  setIsGameOver,
  setIsPlaying,
  setJustStarted,
  setScore,
}: GameOverModal) {
  const handleGameReset = () => {
    setIsGameOver(false);
    setIsPlaying(true);
    setJustStarted(true);
    setScore(0);
  };
  const handleScoreSubmit = () => {
    const newScore = { userId, userName, score: finalScore };
    addScore(newScore);
    setIsGameOver(false);
    setIsPlaying(true);
    setJustStarted(true);
    setScore(0);
  };

  const currentHighScore = Number(localStorage.getItem(HIGH_SCORE_KEY));
  const highScoreBeaten = finalScore > currentHighScore;
  if (highScoreBeaten) {
    localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString());
  }

  return (
    <div id="game-over-modal-container">
      <div id="game-over-modal">
        <h2>Game Over</h2>
        <p className="final-score">
          Your Final Score: <span>{finalScore}</span>
        </p>
        {finalScore > currentHighScore && (
          <div>
            <p>Submit score?</p>
            <p onClick={handleScoreSubmit}>yes?</p>
            <p onClick={handleGameReset}>no?</p>
          </div>
        )}
        {finalScore <= currentHighScore && (
          <p className="click-dir" onClick={handleGameReset}>
            (Click here to continue)
          </p>
        )}
      </div>
    </div>
  );
}
