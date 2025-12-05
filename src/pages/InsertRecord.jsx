import React, { useState } from "react";
import { fetchWithFailover } from "../api";

export default function InsertRecord() {
  // We don't need tconst in state because the backend generates it now
  const [formData, setFormData] = useState({
    title: "",
    startYear: "",
    genres: "",
    runtimeMinutes: "",
  });

  const [status, setStatus] = useState({ msg: "", type: "" });
  const [logs, setLogs] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ msg: "Adding movie...", type: "loading" });
    setLogs([]);

    // Basic validation
    if (!formData.title || !formData.startYear) {
      setStatus({ msg: "Error: Title and Start Year are required.", type: "error" });
      return;
    }

    try {
      // Call the "Smart Insert" route
      const data = await fetchWithFailover("/api/webApp/addMovie", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          isolation: "REPEATABLE READ" 
        }),
        headers: { "Content-Type": "application/json" },
      });

      setStatus({ msg: "Movie added successfully!", type: "success" });
      setLogs(data.logs || []);
      
      // Clear form on success
      setFormData({ title: "", startYear: "", genres: "", runtimeMinutes: "" });

    } catch (err) {
      console.error("Insert failed:", err);
      setStatus({ msg: "Failed to add movie: " + err.message, type: "error" });
    }
  };

  // --- Styles ---
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "40px auto",
      padding: "32px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#1F2937",
    },
    header: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "8px",
      textAlign: "center",
    },
    subHeader: {
      fontSize: "14px",
      color: "#6B7280",
      textAlign: "center",
      marginBottom: "32px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
    },
    input: {
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #D1D5DB",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.2s ease-in-out",
      width: "100%",
      boxSizing: "border-box",
    },
    button: {
      marginTop: "12px",
      padding: "12px",
      backgroundColor: "#4F46E5",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s",
      boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
    },
    status: {
      marginTop: "24px",
      padding: "12px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
      backgroundColor: status.type === 'error' ? '#FEF2F2' : status.type === 'success' ? '#ECFDF5' : '#F3F4F6',
      color: status.type === 'error' ? '#B91C1C' : status.type === 'success' ? '#047857' : '#374151',
      border: `1px solid ${status.type === 'error' ? '#FECACA' : status.type === 'success' ? '#A7F3D0' : '#E5E7EB'}`,
    },
    logsContainer: {
      marginTop: "32px",
      borderTop: "1px solid #E5E7EB",
      paddingTop: "20px",
    },
    logTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1F2937",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    pre: {
      backgroundColor: "#111827",
      color: "#10B981",
      padding: "16px",
      borderRadius: "8px",
      fontSize: "13px",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      overflowX: "auto",
      whiteSpace: "pre-wrap",
      lineHeight: "1.6",
      maxHeight: "300px",
      overflowY: "auto",
      boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    }
  };

  return (
    <>
      <style>{`
        .styled-input:focus {
          border-color: #4F46E5 !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
        }
        .styled-btn:hover {
          background-color: #4338CA !important;
          transform: translateY(-1px);
        }
        .styled-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.header}>Insert New Movie</div>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Primary Title</label>
            <input
              className="styled-input"
              style={styles.input}
              placeholder="e.g. The Matrix"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Start Year</label>
              <input
                className="styled-input"
                style={styles.input}
                placeholder="e.g. 1999"
                name="startYear"
                type="number"
                value={formData.startYear}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Runtime</label>
              <input
                className="styled-input"
                style={styles.input}
                placeholder="Minutes"
                name="runtimeMinutes"
                type="number"
                value={formData.runtimeMinutes}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Genres</label>
            <input
              className="styled-input"
              style={styles.input}
              placeholder="Comma separated (e.g. Action,Sci-Fi)"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="styled-btn" style={styles.button}>
            Add Record
          </button>
        </form>

        {status.msg && (
          <div style={styles.status}>
            {status.msg}
          </div>
        )}

        {logs.length > 0 && (
          <div style={styles.logsContainer}>
            <div style={styles.logTitle}>
              <span>📋</span> Transaction Logs
            </div>
            <pre style={styles.pre}>
              {logs.map((l, i) => (typeof l === 'object' ? JSON.stringify(l, null, 2) : l)).join("\n")}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}