import React, { useState } from 'react';

export default function Quiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [numericAnswer, setNumericAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const checkAnswer = (answer, questionType) => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;
    
    if (questionType === 'multiple-choice') {
      isCorrect = answer === currentQ.correctAnswer;
    } else if (questionType === 'numeric-input') {
      const numValue = Number(answer);
      const tolerance = currentQ.tolerance || 0;
      isCorrect = Math.abs(numValue - currentQ.correctAnswer) <= tolerance;
    }
    
    setIsAnswerCorrect(isCorrect);
    setHasAnswered(true);
    return isCorrect;
  };

  const handleAnswerSelect = (answer) => {
    if (hasAnswered) return; // Prevent selecting after answer is chosen
    setSelectedAnswer(answer);
    checkAnswer(answer, 'multiple-choice');
  };

  const handleNumericInput = (e) => {
    if (hasAnswered) return; // Prevent input after answer is submitted
    const answer = e.target.value;
    setNumericAnswer(answer);
  };

  const handleNumericSubmit = () => {
    if (hasAnswered || numericAnswer === '') return;
    checkAnswer(numericAnswer, 'numeric-input');
  };

  const handleNext = () => {
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
      setIsAnswerCorrect(null);
      setHasAnswered(false);
    } else {
      setShowResult(true);
      if (onComplete) {
        onComplete({
          score: score + (isCorrect ? 1 : 0),
          totalQuestions: questions.length,
          answers: [...answers, {
            question: currentQ.question,
            selectedAnswer: userAnswer,
            correctAnswer: currentQ.correctAnswer.toString(),
            isCorrect
          }]
        });
      }
    }
  };

  const getAnswerButtonStyle = (option) => {
    if (!hasAnswered) {
      return selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200';
    }
    
    const currentQ = questions[currentQuestion];
    if (option === currentQ.correctAnswer) {
      return 'bg-green-500 text-white';
    }
    if (selectedAnswer === option) {
      return 'bg-red-500 text-white';
    }
    return 'bg-gray-100 opacity-50'; // Disabled appearance for unselected options
  };

  const getNumericInputStyle = () => {
    if (!hasAnswered) {
      return 'border-gray-300';
    }
    return isAnswerCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
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
              disabled={hasAnswered}
              className={`w-full p-3 text-left rounded-lg ${getAnswerButtonStyle(option)}`}
            >
              {option}
              {hasAnswered && option === currentQ.correctAnswer && !isAnswerCorrect && 
                <span className="ml-2 text-green-600 font-bold">(Correct Answer)</span>
              }
            </button>
          ))}
        </div>
      );
    } else if (currentQ.type === 'numeric-input') {
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={numericAnswer}
              onChange={handleNumericInput}
              disabled={hasAnswered}
              className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${getNumericInputStyle()}`}
              placeholder="Enter your answer"
            />
            <button
              onClick={handleNumericSubmit}
              disabled={hasAnswered || numericAnswer === ''}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Submit
            </button>
          </div>
          {hasAnswered && !isAnswerCorrect && (
            <p className="text-green-600 font-medium">
              Correct answer: {currentQ.correctAnswer}
            </p>
          )}
        </div>
      );
    }
  };
  
  const isAnswerSelected = () => {
    return hasAnswered;
  };

  if (showResult) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-2">Your score: {score} out of {questions.length}</p>
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
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
        {renderQuestion()}
      </div>
      <button
        onClick={handleNext}
        disabled={!isAnswerSelected()}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50 mt-4"
      >
        {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}