'use client';

import { useState } from 'react';

export default function QuizCard({ question, questionIndex, onAnswer, showResult }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (optionIndex) => {
    if (showResult) return;
    setSelected(optionIndex);
    onAnswer(questionIndex, optionIndex);
  };

  const getOptionClass = (optionIndex) => {
    let cls = 'quiz-option';
    if (selected === optionIndex) cls += ' selected';
    if (showResult) {
      if (optionIndex === question.correctAnswer) cls += ' correct';
      else if (selected === optionIndex) cls += ' wrong';
    }
    return cls;
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <span className="quiz-question-num">Question {questionIndex + 1}</span>
        {question.difficulty && (
          <span className={`quiz-difficulty-badge ${question.difficulty.toLowerCase()}`}>
            {question.difficulty}
          </span>
        )}
      </div>
      <p className="quiz-question-text">{question.question}</p>
      <div className="quiz-options">
        {question.options.map((option, i) => (
          <div
            key={i}
            className={getOptionClass(i)}
            onClick={() => handleSelect(i)}
            id={`quiz-q${questionIndex}-opt${i}`}
          >
            <span className="quiz-option-letter">{letters[i]}</span>
            <span>{option}</span>
          </div>
        ))}
      </div>
      {showResult && question.explanation && (
        <div className="quiz-explanation">
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}
