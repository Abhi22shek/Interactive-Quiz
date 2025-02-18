import { useState, useEffect } from 'react';
import { saveQuizAttempt } from '../utils/db';
import { format } from 'date-fns';

const SECONDS_PER_QUESTION = 30;

export default function Quiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [totalTime, setTotalTime] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const totalTimer = setInterval(() => {
      if (!showResult) {
        setTotalTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(totalTimer);
  }, [showResult]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft, showResult]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNext = async () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    setAnswers([...answers, {
      question: questions[currentQuestion].question,
      selectedAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer,
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setTimeLeft(SECONDS_PER_QUESTION);
    } else {
      const attempt = {
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        score: score + (isCorrect ? 1 : 0),
        totalQuestions: questions.length,
        totalTime,
        answers: [...answers, {
          question: questions[currentQuestion].question,
          selectedAnswer,
          correctAnswer: questions[currentQuestion].correctAnswer,
          isCorrect
        }]
      };
      
      await saveQuizAttempt(attempt);
      setShowResult(true);
      onComplete();
    }
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
        <div className="text-sm font-medium space-x-4">
          <span>Total time: {formatTime(totalTime)}</span>
          <span>Time left: {timeLeft}s</span>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option) => (
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
      </div>
      <button
        onClick={handleNext}
        disabled={!selectedAnswer}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}