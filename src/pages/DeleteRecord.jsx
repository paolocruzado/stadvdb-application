import React, { useState } from "react";
import { fetchWithFailover } from "../api";

export default function DeleteRecord() {
  const [tconst, setTconst] = useState("");
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [logs, setLogs] = useState([]);

  const handleDelete = async (e) => {
    e.preventDefault();
    setStatus({ msg: "Deleting...", type: "loading" });
    setLogs([]);

    if (!tconst.trim()) {
      setStatus({ msg: "Error: tconst is required.", type: "error" });
      return;
    }

    // Confirm deletion
    if (!window.confirm(`Are you sure you want to permanently delete record ${tconst}?`)) {
      setStatus({ msg: "Deletion cancelled.", type: "neutral" });
      return;
    }

    try {
      const data = await fetchWithFailover("/api/webApp/delete", {
        method: "POST",
        body: JSON.stringify({
          tconst: tconst.trim(),
          isolation: "READ COMMITTED"
        }),
        headers: { "Content-Type": "application/json" },
      });

      setStatus({ msg: `✅ Record ${tconst} deleted successfully.`, type: "success" });
      setLogs(data.logs || []);
      setTconst(""); // Clear input

    } catch (err) {
      console.error("Delete failed:", err);
      setStatus({ msg: "❌ Failed to delete record: " + err.message, type: "error" });
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
      gap: "12px",
      alignItems: "stretch",
    },
    input: {
      flex: "1",
      padding: "12px 16px",
      borderRadius: "6px",
      border: "1px solid #D1D5DB",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.2s ease-in-out",
    },
    button: {
      padding: "12px 24px",
      backgroundColor: "#DC2626", // Red for danger action
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s",
      boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.2)",
      whiteSpace: "nowrap",
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
          border-color: #DC2626 !important; /* Red border on focus for delete input */
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }
        .delete-btn:hover {
          background-color: #B91C1C !important;
          transform: translateY(-1px);
        }
        .delete-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.header}>Delete Record</div>
        <div style={styles.subHeader}>
          Permanently remove data from Master and all Replicas
        </div>

        <form onSubmit={handleDelete} style={styles.form}>
          <input
            className="styled-input"
            style={styles.input}
            placeholder="Target ID (e.g. tt0000001)"
            value={tconst}
            onChange={(e) => setTconst(e.target.value)}
          />
          <button 
            type="submit" 
            className="delete-btn"
            style={styles.button}
          >
            Delete Record
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