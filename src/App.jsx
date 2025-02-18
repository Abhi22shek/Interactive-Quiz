import { useState, useCallback } from 'react';
import Quiz from './components/Quiz';
import QuizHistory from './components/QuizHistory';
import StartPage from './components/StartPage';
import { quizQuestions } from './data/quizData';
import './App.css';

// App state constants for better readability
const APP_STATES = {
  START: 'start',
  QUIZ: 'quiz',
  HISTORY: 'history'
};

function App() {
  const [appState, setAppState] = useState(APP_STATES.START);
  const [key, setKey] = useState(0);

  // Memoize handlers to prevent unnecessary re-renders
  const handleQuizComplete = useCallback(() => {
    setAppState(APP_STATES.HISTORY);
  }, []);

  const handleViewHistory = useCallback(() => {
    setAppState(APP_STATES.HISTORY);
  }, []);

  const handleStartQuiz = useCallback(() => {
    setAppState(APP_STATES.QUIZ);
  }, []);

  const startNewQuiz = useCallback(() => {
    setKey(prevKey => prevKey + 1);
    setAppState(APP_STATES.START);
  }, []);

  // Determine which component to render based on app state
  const renderContent = () => {
    switch (appState) {
      case APP_STATES.QUIZ:
        return <Quiz key={key} questions={quizQuestions} onComplete={handleQuizComplete} />;
      case APP_STATES.HISTORY:
        return (
          <>
            <QuizHistory />
            <div className="text-center mt-6">
              <button
                onClick={startNewQuiz}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start New Quiz
              </button>
            </div>
          </>
        );
      case APP_STATES.START:
      default:
        return <StartPage onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Quiz Platform</h1>
          <div className="space-x-4">
            <button
              onClick={handleViewHistory}
              className={`px-4 py-2 rounded transition-colors ${
                appState === APP_STATES.HISTORY 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label="View quiz history"
            >
              View History
            </button>
          </div>
        </header>

        {renderContent()}
      </div>
    </div>
  );
}

export default App;