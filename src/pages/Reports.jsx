import React, { useState } from "react";
import { fetchWithFailover } from "../api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState({ msg: "", type: "" });

  const handleFetchReports = async () => {
    setStatus({ msg: "Fetching reports...", type: "loading" });
    try {
      const data = await fetchWithFailover(`/api/webApp/reports`);

      const reportData = data.decadeStats || [];
      setReports(reportData);
      setStatus({ 
        msg: `Reports fetched successfully (${reportData.length} decades found)`, 
        type: "success" 
      });
    } catch (err) {
      console.error(err);
      setStatus({ msg: "Error fetching reports: " + err.message, type: "error" });
    }
  };

  // --- Styles ---
  const styles = {
    container: {
      maxWidth: "800px",
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
    actionContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "24px",
    },
    button: {
      padding: "12px 24px",
      backgroundColor: "#4F46E5",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s, transform 0.1s",
      boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    status: {
      marginBottom: "24px",
      padding: "12px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
      backgroundColor: status.type === 'error' ? '#FEF2F2' : status.type === 'success' ? '#ECFDF5' : '#F3F4F6',
      color: status.type === 'error' ? '#B91C1C' : status.type === 'success' ? '#047857' : '#374151',
      border: `1px solid ${status.type === 'error' ? '#FECACA' : status.type === 'success' ? '#A7F3D0' : '#E5E7EB'}`,
    },
    tableContainer: {
      overflowX: "auto",
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    th: {
      backgroundColor: "#F9FAFB",
      color: "#374151",
      fontWeight: "600",
      padding: "12px 16px",
      textAlign: "left",
      borderBottom: "1px solid #E5E7EB",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "12px 16px",
      borderBottom: "1px solid #E5E7EB",
      color: "#4B5563",
    },
    tr: {
      transition: "background-color 0.15s",
    }
  };

  return (
    <>
      <style>{`
        .styled-btn:hover {
          background-color: #4338CA !important;
          transform: translateY(-1px);
        }
        .styled-btn:active {
          transform: translateY(0);
        }
        .styled-tr:hover {
          background-color: #F3F4F6;
        }
        .styled-tr:last-child td {
          border-bottom: none;
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.header}>Reports by Decade</div>

        <div style={styles.actionContainer}>
          <button onClick={handleFetchReports} className="styled-btn" style={styles.button}>
            Fetch Reports
          </button>
        </div>

        {status.msg && (
          <div style={styles.status}>
            {status.msg}
          </div>
        )}

        {reports.length > 0 && (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Decade</th>
                  <th style={styles.th}>Total Titles</th>
                  <th style={styles.th}>Average Runtime</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={i} className="styled-tr" style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: "600", color: "#4F46E5" }}>
                      {r.decade}s
                    </td>
                    <td style={styles.td}>
                      {r.count.toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      {r.avgRuntime ? `${parseFloat(r.avgRuntime).toFixed(1)} min` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}