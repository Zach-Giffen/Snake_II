import { addScore } from './data';
import { HIGH_SCORE_KEY } from './snakeIIGame';

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
  const handleScoreSubmit = async () => {
    const newScore = {
      userId: parseInt(sessionStorage.getItem('userId') || '0'),
      userName: sessionStorage.getItem('username') || '',
      score: finalScore,
    };

    try {
      await addScore(newScore);
    } catch (error) {
      console.error('Error submitting score:', error);
    }

    // Reset game state
    handleGameReset();
  };

  const currentHighScore = Number(localStorage.getItem(HIGH_SCORE_KEY));
  const highScoreBeaten = finalScore > currentHighScore;
  if (highScoreBeaten) {
    localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString());
  }
  const guest = String(localStorage.getItem('guest'));

  return (
    <div id="game-over-modal-container">
      <div id="game-over-modal">
        <h2>Game Over</h2>
        <p className="final-score">
          Your Final Score: <span>{finalScore}</span>
        </p>
        {guest === 'no' && finalScore > currentHighScore && (
          <div>
            <p>Submit score?</p>
            <p onClick={handleScoreSubmit}>yes?</p>
            <p onClick={handleGameReset}>no?</p>
          </div>
        )}
        {(guest === 'yes' || finalScore <= currentHighScore) && (
          <p className="click-dir" onClick={handleGameReset}>
            (Click here to continue)
          </p>
        )}
      </div>
    </div>
  );
}
