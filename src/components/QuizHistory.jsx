import { useState, useEffect } from 'react';
import { getQuizAttempts, clearQuizAttempts } from '../utils/db';

export default function QuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    const quizAttempts = await getQuizAttempts();
    setAttempts(quizAttempts.reverse());
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDeleteHistory = async () => {
    await clearQuizAttempts();
    setAttempts([]);
    setShowConfirmation(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quiz History</h2>
        {attempts.length > 0 && (
          <button
            onClick={() => setShowConfirmation(true)}
            className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>
      
      {showConfirmation && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-lg">
          <p className="mb-2">Are you sure you want to delete all quiz history? This action cannot be undone.</p>
          <div className="flex space-x-2">
            <button
              onClick={handleDeleteHistory}
              className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Yes, Delete All
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="py-1 px-3 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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