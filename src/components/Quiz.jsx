import { useState, useEffect } from 'react';
import { saveQuizAttempt } from '../utils/db';
import { format } from 'date-fns';
import Timer from './Timer';

const SECONDS_PER_QUESTION = 30;

export default function Quiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [numericAnswer, setNumericAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNumericInput = (e) => {
    setNumericAnswer(e.target.value);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUp = () => {
    handleNext();
  };

  useEffect(() => {
    if (!showResult) {
      const totalTimer = setInterval(() => {
        setTotalTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(totalTimer);
    }
  }, [showResult]);

  const handleNext = async () => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;
    let userAnswer;
    
    if (currentQ.type === 'multiple-choice') {
      isCorrect = selectedAnswer === currentQ.correctAnswer;
      userAnswer = selectedAnswer;
    } else if (currentQ.type === 'numeric-input') {
      const numValue = Number(numericAnswer);
      const tolerance = currentQ.tolerance || 0;
      isCorrect = Math.abs(numValue - currentQ.correctAnswer) <= tolerance;
      userAnswer = numericAnswer;
    }
    
    setAnswers([...answers, {
      question: currentQ.question,
      selectedAnswer: userAnswer,
      correctAnswer: currentQ.correctAnswer.toString(),
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setNumericAnswer('');
    } else {
      const attempt = {
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        score: score + (isCorrect ? 1 : 0),
        totalQuestions: questions.length,
        totalTime,
        answers: [...answers, {
          question: currentQ.question,
          selectedAnswer: userAnswer,
          correctAnswer: currentQ.correctAnswer.toString(),
          isCorrect
        }]
      };
      
      await saveQuizAttempt(attempt);
      setShowResult(true);
      onComplete();
    }
  };

  const renderQuestion = () => {
    const currentQ = questions[currentQuestion];
    
    if (currentQ.type === 'multiple-choice') {
      return (
        <div className="space-y-2">
          {currentQ.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-3 text-left rounded-lg ${
                selectedAnswer === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    } else if (currentQ.type === 'numeric-input') {
      return (
        <div className="space-y-4">
          <input
            type="number"
            value={numericAnswer}
            onChange={handleNumericInput}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer"
          />
        </div>
      );
    }
  };
  
  const isAnswerSelected = () => {
    const currentQ = questions[currentQuestion];
    if (currentQ.type === 'multiple-choice') {
      return selectedAnswer !== '';
    } else if (currentQ.type === 'numeric-input') {
      return numericAnswer !== '';
    }
    return false;
  };

  if (showResult) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-2">Your score: {score} out of {questions.length}</p>
        <p className="text-lg mb-4">Total time: {formatTime(totalTime)}</p>
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className={`p-4 rounded-lg ${answer.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-medium">{answer.question}</p>
              <p>Your answer: {answer.selectedAnswer}</p>
              <p>Correct answer: {answer.correctAnswer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm">Question {currentQuestion + 1} of {questions.length}</span>
        <Timer 
          totalTime={totalTime}
          isRunning={!showResult}
          onTimerComplete={handleTimeUp}
          timeLimit={SECONDS_PER_QUESTION}
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
        {renderQuestion()}
      </div>
      <button
        onClick={handleNext}
        disabled={!isAnswerSelected()}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}