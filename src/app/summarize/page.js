"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SummarizePage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarize = async () => {
    if (text.trim().length < 50) {
      setError("Please enter at least 50 characters of text to summarize.");
      return;
    }
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText("");
    setSummary("");
    setError("");
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Notes Summarizer</h1>
        <p className="page-subtitle">
          Paste your notes or text and get a concise AI-powered summary
        </p>
      </div>

      <div className="summarize-layout">
        <div className="summarize-input-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span className="summarize-section-label">📝 Your Text</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {wordCount} words · {text.length} chars
            </span>
          </div>
          <textarea
            className="form-textarea summarize-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your notes, article, or any text here to get a concise summary..."
            id="summarize-input"
          />
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button
              className="btn btn-primary"
              onClick={summarize}
              disabled={loading || text.trim().length < 50}
              id="summarize-btn"
            >
              {loading ? "Summarizing..." : "✨ Summarize"}
            </button>
            {(text || summary) && (
              <button
                className="btn btn-secondary"
                onClick={clearAll}
                id="clear-btn"
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </div>

        <div className="summarize-output-section">
          <span className="summarize-section-label">📋 Summary</span>
          <div className="summarize-output" id="summarize-output">
            {loading ? (
              <LoadingSpinner text="Summarizing your text..." />
            ) : error ? (
              <p style={{ color: "#f87171" }}>⚠️ {error}</p>
            ) : summary ? (
              summary
            ) : (
              <span style={{ color: "var(--text-muted)" }}>
                Your summary will appear here after processing...
              </span>
            )}
          </div>
          {summary && (
            <div style={{ marginTop: 12 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigator.clipboard.writeText(summary)}
                id="copy-summary-btn"
              >
                📋 Copy Summary
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
