import { useState } from 'react';
import Quiz from './components/Quiz';
import QuizHistory from './components/QuizHistory';
import StartPage from './components/StartPage';
import { quizQuestions } from './data/quizData';
import './App.css';

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const [key, setKey] = useState(0);

  const handleQuizComplete = () => {
    setShowHistory(true);
    setShowStartPage(true);
  };

  const startNewQuiz = () => {
    setKey(key + 1);
    setShowHistory(false);
    setShowStartPage(true);
  };

  const handleStartQuiz = () => {
    setShowStartPage(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Quiz Platform</h1>
          <div className="space-x-4">
            <button
              onClick={() => {
                setShowHistory(false);
                setShowStartPage(true);
              }}
              className={`px-4 py-2 rounded ${!showHistory ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Take Quiz
            </button>
            <button
              onClick={() => {
                setShowHistory(true);
                setShowStartPage(true);
              }}
              className={`px-4 py-2 rounded ${showHistory ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              View History
            </button>
          </div>
        </header>

        {showHistory ? (
          <>
            <QuizHistory />
            <div className="text-center mt-6">
              <button
                onClick={startNewQuiz}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Start New Quiz
              </button>
            </div>
          </>
        ) : showStartPage ? (
          <StartPage onStartQuiz={handleStartQuiz} />
        ) : (
          <Quiz key={key} questions={quizQuestions} onComplete={handleQuizComplete} />
        )}
      </div>
    </div>
  );
}

export default App;