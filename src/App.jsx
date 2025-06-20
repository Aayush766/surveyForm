import React, { useEffect, useState } from 'react';
import './index.css';
import { v4 as uuidv4 } from 'uuid'; // For generating sessionId

const questions = [
  { id: 'q1', text: 'How satisfied are you with our products?', type: 'rating', scale: 5 },
  { id: 'q2', text: 'How fair are the prices compared to similar retailers?', type: 'rating', scale: 5 },
  { id: 'q3', text: 'How satisfied are you with the value for money of your purchase?', type: 'rating', scale: 5 },
  { id: 'q4', text: 'On a scale of 1-10 how would you recommend us?', type: 'rating', scale: 10 },
  { id: 'q5', text: 'What could we do to improve our service?', type: 'text' },
];

function App() {
  const [step, setStep] = useState(-1); // -1 means welcome screen
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (step === questions.length + 1) {
      const timer = setTimeout(() => setStep(-1), 5000);
      return () => clearTimeout(timer); // Clear timeout if component unmounts or step changes
    }
  }, [step]);

  const startSurvey = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem(`surveyStatus_${newSessionId}`, 'IN_PROGRESS');
    setAnswers({});
    setStep(0);
  };

  const saveAnswersToLocalStorage = (updatedAnswers) => {
    if (sessionId) {
      localStorage.setItem(`surveyAnswers_${sessionId}`, JSON.stringify(updatedAnswers));
    }
  };

  const submitSurvey = () => {
    saveAnswersToLocalStorage(answers);
    localStorage.setItem(`surveyStatus_${sessionId}`, 'COMPLETED');
    setStep(questions.length + 1);
  };

  const handleAnswer = (value) => {
    const updated = { ...answers, [questions[step].id]: value };
    setAnswers(updated);
    saveAnswersToLocalStorage(updated);
  };

  const currentQuestion = questions[step];

  if (step === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Welcome to Our Survey!</h1>
          <p className="text-lg text-gray-600 mb-8">Your feedback helps us improve.</p>
          <button
            onClick={startSurvey}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Start Survey
          </button>
        </div>
      </div>
    );
  }

  if (step === questions.length + 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
          <svg className="w-24 h-24 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600">Your feedback is invaluable to us.</p>
        </div>
      </div>
    );
  }

  if (step === questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 to-orange-400 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-3xl font-bold text-gray-800 mb-6">Ready to submit?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={submitSurvey}
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-green-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Confirm & Submit
            </button>
            <button
              onClick={() => setStep(step - 1)}
              className="bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-full shadow-md hover:bg-gray-400 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full transform transition-transform duration-300 ease-in-out hover:scale-[1.02]">
        <div className="text-lg text-gray-500 mb-4 text-center">Question {step + 1} of {questions.length}</div>
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">{currentQuestion.text}</h2>

        {currentQuestion.type === 'rating' ? (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Array.from({ length: currentQuestion.scale }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => handleAnswer(n)}
                className={`flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold border-2 transition-all duration-200 ease-in-out
                  ${answers[currentQuestion.id] === n
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-110'
                    : 'bg-white text-blue-600 border-blue-400 hover:bg-blue-50 hover:border-blue-500'
                  }
                `}
              >
                {n}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            className="w-full h-32 border-2 border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-y mb-8"
            placeholder="Your feedback here..."
            onChange={(e) => handleAnswer(e.target.value)}
            value={answers[currentQuestion.id] || ''}
          />
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200
              ${step === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}
            `}
          >
            Previous
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setStep(step + 1)}
              className="text-blue-600 hover:text-blue-800 text-lg font-semibold underline py-3 px-4 transition-colors duration-200"
            >
              Skip
            </button>
            <button
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;