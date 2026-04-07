"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StudyPlanPage() {
  const [subjects, setSubjects] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [examDate, setExamDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    if (!subjects.trim() || !examDate) return;
    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects: subjects.trim(),
          hoursPerDay: Number(hoursPerDay),
          examDate,
          additionalNotes: additionalNotes.trim(),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setPlan(data);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Study Plan Creator</h1>
        <p className="page-subtitle">
          Get a personalized study schedule tailored to your subjects and timeline
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="study-plan-form">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="plan-subjects">
              Subjects / Topics
            </label>
            <input
              className="form-input"
              id="plan-subjects"
              type="text"
              placeholder="e.g. Mathematics, Physics, Chemistry, English"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="plan-hours">
              Hours Available Per Day
            </label>
            <select
              className="form-select"
              id="plan-hours"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
            >
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
              <option value="5">5 hours</option>
              <option value="6">6 hours</option>
              <option value="8">8 hours</option>
              <option value="10">10 hours</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="plan-exam-date">
              Exam Date
            </label>
            <input
              className="form-input"
              id="plan-exam-date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="plan-notes">
              Additional Notes (optional)
            </label>
            <input
              className="form-input"
              id="plan-notes"
              type="text"
              placeholder="e.g. Weak in calculus, need more time for physics"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <button
            className="btn btn-primary"
            onClick={generatePlan}
            disabled={loading || !subjects.trim() || !examDate}
            id="generate-plan-btn"
          >
            {loading ? "Creating Plan..." : "📅 Generate Study Plan"}
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)", marginBottom: 16 }}>
          <p style={{ color: "#f87171" }}>⚠️ {error}</p>
        </div>
      )}

      {loading && <LoadingSpinner text="Creating your personalized study plan..." />}

      {plan && (
        <div className="study-plan-output" id="study-plan-output">
          <div className="card" style={{ marginBottom: 20, textAlign: "center" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              {plan.title || "Your Study Plan"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {plan.overview || `${plan.totalDays || plan.schedule?.length || 0} days of focused study`}
            </p>
          </div>

          {plan.schedule &&
            plan.schedule.map((day, i) => (
              <div className="plan-day" key={i}>
                <div className="plan-day-header">
                  <div className="plan-day-num">{day.day || i + 1}</div>
                  <div>
                    <p className="plan-day-title">{day.title || `Day ${i + 1}`}</p>
                    {day.date && (
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {day.date}
                      </p>
                    )}
                  </div>
                </div>
                <div className="plan-day-content">
                  {day.tasks && day.tasks.length > 0 ? (
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {day.tasks.map((task, j) => (
                        <li key={j} style={{ marginBottom: 6 }}>
                          {task}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{day.content || ""}</p>
                  )}
                  {day.tips && (
                    <p
                      style={{
                        marginTop: 12,
                        fontSize: 13,
                        color: "var(--accent-primary)",
                        fontStyle: "italic",
                      }}
                    >
                      💡 {day.tips}
                    </p>
                  )}
                </div>
              </div>
            ))}

          {plan.generalTips && plan.generalTips.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                📌 General Study Tips
              </h3>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {plan.generalTips.map((tip, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      marginBottom: 8,
                      lineHeight: 1.6,
                    }}
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!loading && !plan && !error && (
        <div className="empty-state">
          <span className="empty-state-icon">📅</span>
          <p className="empty-state-text">Fill in your details to create a study plan</p>
          <p className="empty-state-subtext">
            Enter your subjects, available hours, and exam date above
          </p>
        </div>
      )}
    </>
  );
}
