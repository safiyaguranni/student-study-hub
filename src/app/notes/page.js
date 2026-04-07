"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import LoadingSpinner from "@/components/LoadingSpinner";

const BUCKET_NAME = "notes";

export default function NotesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFiles = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error fetching files:", error);
        showToast("Failed to load files. Check Supabase config.", "error");
      } else {
        setFiles((data || []).filter((f) => f.name !== ".emptyFolderPlaceholder"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Failed to connect to storage.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (file) => {
    if (!supabase) {
      showToast("Supabase is not configured. Add your keys to .env.local", "error");
      return;
    }
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${timestamp}_${safeName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      showToast(`Failed to upload ${file.name}: ${error.message}`, "error");
      throw error;
    } else {
      showToast(`✅ ${file.name} uploaded successfully!`);
      await fetchFiles();
    }
  };

  const handleDownload = async (fileName) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(fileName);

      if (error) {
        showToast("Failed to download file.", "error");
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(/^\d+_/, "");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast("Download failed.", "error");
    }
  };

  const handleDelete = async (fileName) => {
    if (!supabase) return;
    if (!confirm(`Delete "${fileName.replace(/^\d+_/, "")}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        showToast("Failed to delete file.", "error");
      } else {
        showToast("🗑️ File deleted.");
        await fetchFiles();
      }
    } catch (err) {
      showToast("Delete failed.", "error");
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">My Notes</h1>
        <p className="page-subtitle">
          Upload and manage your study materials — stored securely in the cloud
        </p>
      </div>

      {!supabase && (
        <div className="card" style={{ marginBottom: 20, borderColor: "rgba(250,112,154,0.3)" }}>
          <p style={{ color: "#fa709a", fontSize: 14 }}>
            ⚠️ <strong>Supabase not configured.</strong> Add your{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code>.env.local</code> and create a storage bucket named{" "}
            <strong>notes</strong> in your Supabase dashboard.
          </p>
        </div>
      )}

      <FileUploader onUpload={handleUpload} />

      <div style={{ marginTop: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            📂 Uploaded Files
            {files.length > 0 && (
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontWeight: 400,
                  marginLeft: 8,
                }}
              >
                ({files.length} file{files.length !== 1 ? "s" : ""})
              </span>
            )}
          </h2>
          {files.length > 0 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={fetchFiles}
              id="refresh-files-btn"
            >
              🔄 Refresh
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your files..." />
        ) : (
          <FileList
            files={files}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        )}
      </div>

      {toast && (
        <div className={`toast ${toast.type}`} id="toast">
          {toast.message}
        </div>
      )}
    </>
  );
}
