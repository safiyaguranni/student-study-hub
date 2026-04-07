'use client';

import { useState, useRef } from 'react';

export default function FileUploader({ onUpload }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    try {
      for (const file of files) {
        await onUpload(file);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={`upload-zone ${isDragOver ? 'dragover' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      id="file-upload-zone"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.pptx,.xlsx"
        id="file-input"
      />
      <span className="upload-zone-icon">{uploading ? '⏳' : '📤'}</span>
      <p className="upload-zone-text">
        {uploading ? 'Uploading...' : 'Drag & drop files here'}
      </p>
      <p className="upload-zone-subtext">
        {uploading
          ? 'Please wait while your files are being uploaded'
          : 'or click to browse — PDF, DOC, TXT, images supported'}
      </p>
    </div>
  );
}
