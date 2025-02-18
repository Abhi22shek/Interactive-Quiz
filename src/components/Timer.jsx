import { useState, useEffect } from 'react';

export default function Timer({ totalTime, isRunning, onTimerComplete, timeLimit }) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    let totalTimer;
    let questionTimer;

    if (isRunning) {
      // Total time counter
      totalTimer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      // Question time counter
      questionTimer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(questionTimer);
            onTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(totalTimer);
      clearInterval(questionTimer);
    };
  }, [isRunning, onTimerComplete, timeLimit]);

  useEffect(() => {
    // Reset the time left when time limit changes
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-sm font-medium space-x-4">
      <span>Total time: {formatTime(timeElapsed)}</span>
      <span>Time left: {timeLeft}s</span>
    </div>
  );
}