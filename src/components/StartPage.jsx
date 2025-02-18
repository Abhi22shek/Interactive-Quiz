import React from 'react';

export default function StartPage({ onStartQuiz }) {
  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Quiz!</h1>
      <p className="text-gray-600 mb-8">
        Test your knowledge with our interactive quiz. You'll have 30 seconds to answer each question.
      </p>
      <button
        onClick={onStartQuiz}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Start Quiz
      </button>
    </div>
  );
}