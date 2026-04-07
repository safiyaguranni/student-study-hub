export default function LoadingSpinner({ text = 'Thinking...' }) {
  return (
    <div className="loading-spinner" id="loading-spinner">
      <div className="spinner"></div>
      <span>{text}</span>
    </div>
  );
}
