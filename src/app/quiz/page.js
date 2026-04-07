"use client";

import { useState } from "react";
import QuizCard from "@/components/QuizCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setShowResults(false);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), difficulty, count }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.questions) {
        setQuestions(data.questions);
      } else {
        setError("Unexpected response format. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
    setError("");
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quiz Generator</h1>
        <p className="page-subtitle">
          Generate custom quizzes on any topic and test your knowledge
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="quiz-config">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="quiz-topic">
              Topic
            </label>
            <input
              className="form-input"
              id="quiz-topic"
              type="text"
              placeholder="e.g. Photosynthesis, World War II, Python loops..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="quiz-difficulty">
              Difficulty
            </label>
            <select
              className="form-select"
              id="quiz-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="quiz-count">
              Questions
            </label>
            <select
              className="form-select"
              id="quiz-count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <button
            className="btn btn-primary"
            onClick={generateQuiz}
            disabled={loading || !topic.trim()}
            id="generate-quiz-btn"
          >
            {loading ? "Generating..." : "🎯 Generate Quiz"}
          </button>
          {questions.length > 0 && (
            <button className="btn btn-secondary" onClick={resetQuiz} id="reset-quiz-btn">
              🔄 New Quiz
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)", marginBottom: 16 }}>
          <p style={{ color: "#f87171" }}>⚠️ {error}</p>
        </div>
      )}

      {loading && <LoadingSpinner text="Generating your quiz..." />}

      {questions.length > 0 && (
        <>
          {questions.map((q, i) => (
            <QuizCard
              key={i}
              question={q}
              questionIndex={i}
              onAnswer={handleAnswer}
              showResult={showResults}
            />
          ))}

          {!showResults && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                className="btn btn-primary"
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < questions.length}
                id="submit-quiz-btn"
                style={{ padding: "14px 40px", fontSize: 16 }}
              >
                ✅ Submit Answers
              </button>
              {Object.keys(answers).length < questions.length && (
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
                  Answer all {questions.length} questions to submit
                </p>
              )}
            </div>
          )}

          {showResults && (
            <div className="quiz-results" id="quiz-results">
              <p className="quiz-score">
                {getScore()}/{questions.length}
              </p>
              <p className="quiz-score-label">
                {getScore() === questions.length
                  ? "🏆 Perfect Score! Amazing!"
                  : getScore() >= questions.length * 0.7
                  ? "🎉 Great job! Keep it up!"
                  : getScore() >= questions.length * 0.5
                  ? "👍 Good effort! Review the explanations."
                  : "📚 Keep studying! Review the explanations below."}
              </p>
              <button
                className="btn btn-primary"
                onClick={resetQuiz}
                style={{ marginTop: 20 }}
                id="try-again-btn"
              >
                🔄 Try Another Quiz
              </button>
            </div>
          )}
        </>
      )}

      {!loading && questions.length === 0 && !error && (
        <div className="empty-state">
          <span className="empty-state-icon">🧠</span>
          <p className="empty-state-text">Enter a topic to generate a quiz</p>
          <p className="empty-state-subtext">
            Try topics like &quot;Newton&apos;s Laws&quot;, &quot;Cell Biology&quot;,
            or &quot;JavaScript Arrays&quot;
          </p>
        </div>
      )}
    </>
  );
}
