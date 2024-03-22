import { useEffect, useState } from 'react';
import { addScore, getUserScore, updateScore } from './data';

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
  const [currentHighScore, setCurrentHighScore] = useState<
    number | undefined
  >();

  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
        const existingUserScore = await getUserScore(userId);
        setCurrentHighScore(Number(existingUserScore));
      } catch (error) {
        console.error('Error fetching high score:', error);
      }
    };

    fetchHighScore();
  }, []);

  const handleGameReset = () => {
    setIsGameOver(false);
    setIsPlaying(true);
    setJustStarted(true);
    setScore(0);
  };

  const handleScoreSubmit = async () => {
    const userId = parseInt(sessionStorage.getItem('userId') || '0');
    const userName = sessionStorage.getItem('username') || '';
    const newScore = {
      userId: userId,
      userName: userName,
      score: finalScore,
    };

    try {
      if (currentHighScore !== undefined && !isNaN(currentHighScore)) {
        await updateScore(newScore);
      } else {
        await addScore(newScore);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }

    handleGameReset();
  };

  const guest = String(localStorage.getItem('guest'));

  return (
    <div id="game-over-modal-container">
      <div id="game-over-modal">
        <h2>Game Over</h2>
        <p className="final-score">
          Your Final Score: <span>{finalScore}</span>
        </p>
        {guest === 'no' && finalScore > (currentHighScore || 0) && (
          <div>
            <p>Submit score?</p>
            <p onClick={handleScoreSubmit}>yes?</p>
            <p onClick={handleGameReset}>no?</p>
          </div>
        )}
        {guest === 'yes' ||
          (finalScore <= (currentHighScore || 0) && (
            <p className="click-dir" onClick={handleGameReset}>
              (Click here to continue)
            </p>
          ))}
      </div>
    </div>
  );
}
