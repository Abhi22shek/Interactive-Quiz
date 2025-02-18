import { useState, useEffect } from 'react';
import { getQuizAttempts } from '../utils/db';

export default function QuizHistory() {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const loadAttempts = async () => {
      const quizAttempts = await getQuizAttempts();
      setAttempts(quizAttempts.reverse());
    };
    loadAttempts();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
      {attempts.length === 0 ? (
        <p>No attempts yet</p>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Attempt #{attempts.length - index}</span>
                <span className="text-sm text-gray-600">{attempt.date}</span>
              </div>
              <p>Score: {attempt.score} / {attempt.totalQuestions}</p>
              <p className="text-sm text-gray-600">Time taken: {formatTime(attempt.totalTime)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}