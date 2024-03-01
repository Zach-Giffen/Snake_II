import { useState } from 'react';
import SnakeBoard from './snakeBoard';
import GameOverModal from './gameOverModal';
import PausedModal from './pausedModal';
import { Entry, readLeaderBoard } from './data';

import './styles.css';

export const HIGH_SCORE_KEY = 'high-score';

export default function SnakeGameII() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [justStarted, setJustStarted] = useState(true);
  const [checkLeaderBoard, setCheckLeaderBoard] = useState(false);
  const [entries, setEntries] = useState<Entry[]>();

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

  const handleLeaderBoard = async () => {
    try {
      setCheckLeaderBoard(true);
      const entries = await readLeaderBoard();
      setEntries(entries);
    } catch (err) {
      console.error(err);
    }
  };

  const leaderBoardOff = () => {
    setCheckLeaderBoard(false);
  };

  return (
    <div id="snakes-game-container">
      <h1 id="game-title">SnakeII</h1>

      {!checkLeaderBoard ? (
        <p className="high-score">High Score: {highScore}</p>
      ) : (
        <button className="backButton" onClick={leaderBoardOff}>
          back
        </button>
      )}

      {justStarted && !checkLeaderBoard ? (
        <p className="new-game-hint" onClick={handleStartClick}>
          Start Game
        </p>
      ) : !checkLeaderBoard ? (
        <>
          <p className="score">
            <span>Score</span>
            <span>{score}</span>
          </p>
        </>
      ) : (
        <></>
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
      {justStarted && !checkLeaderBoard ? (
        <p className="skinSelect">Skin</p>
      ) : (
        <></>
      )}
      {justStarted && !checkLeaderBoard ? (
        <p className="leaderBoard" onClick={handleLeaderBoard}>
          Leader Board
        </p>
      ) : (
        <></>
      )}
      {justStarted && !checkLeaderBoard ? (
        <p className="signOut">Sign Out</p>
      ) : (
        <></>
      )}

      {checkLeaderBoard ? (
        <div className="row">
          <div className="column-full">
            <table className="entry-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {entries &&
                  entries.map((entry, index) => (
                    <EntryMap
                      key={entry.entryId}
                      entry={entry}
                      rank={index + 1}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
type EntryProps = {
  entry: Entry;
  rank: number;
};

function EntryMap({ entry, rank }: EntryProps) {
  return (
    <tr>
      <td>{rank}</td>
      <td>{entry.userName}</td>
      <td>{entry.score}</td>
    </tr>
  );
}
