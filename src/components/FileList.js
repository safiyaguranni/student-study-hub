'use client';

export default function FileList({ files, onDelete, onDownload }) {
  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return '📕';
    if (['doc', 'docx'].includes(ext)) return '📘';
    if (['txt'].includes(ext)) return '📝';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return '🖼️';
    if (['pptx', 'ppt'].includes(ext)) return '📙';
    if (['xlsx', 'xls', 'csv'].includes(ext)) return '📗';
    return '📄';
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (!files || files.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">📂</span>
        <p className="empty-state-text">No files uploaded yet</p>
        <p className="empty-state-subtext">Upload your notes, PDFs, and documents above</p>
      </div>
    );
  }

  return (
    <div className="file-grid">
      {files.map((file) => (
        <div key={file.name} className="file-card" id={`file-${file.name}`}>
          <div className="file-card-icon">{getFileIcon(file.name)}</div>
          <p className="file-card-name">{file.name}</p>
          <p className="file-card-size">
            {formatSize(file.metadata?.size)}
            {file.created_at && (
              <> · {new Date(file.created_at).toLocaleDateString()}</>
            )}
          </p>
          <div className="file-card-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onDownload(file.name)}
              id={`download-${file.name}`}
            >
              ⬇️ Download
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(file.name)}
              id={`delete-${file.name}`}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
