import React, { useState } from "react";
import { fetchWithFailover } from "../api";

export default function SearchRecords() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [minRuntime, setMinRuntime] = useState("");
  const [maxRuntime, setMaxRuntime] = useState("");
  const [startYear, setStartYear] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState({ msg: "", type: "" });

  const handleSearch = async (e) => {
    e.preventDefault();
    setStatus({ msg: "Searching...", type: "loading" });

    try {
      // Only include params that are filled
      const paramsObj = {};
      if (title.trim()) paramsObj.title = title.trim();
      if (genre.trim()) paramsObj.genre = genre.trim();
      if (minRuntime.trim()) paramsObj.minRuntime = minRuntime.trim();
      if (maxRuntime.trim()) paramsObj.maxRuntime = maxRuntime.trim();
      if (startYear.trim()) paramsObj.startYear = startYear.trim();

      const params = new URLSearchParams(paramsObj).toString();
      const data = await fetchWithFailover(`/api/webApp/search?${params}`);

      setResults(data.rows || []);
      setStatus({ 
        msg: `Found ${data.rows?.length || 0} record(s)`, 
        type: data.rows?.length > 0 ? "success" : "neutral" 
      });
    } catch (err) {
      setStatus({ msg: "Error fetching records: " + err.message, type: "error" });
    }
  };

  // --- Styles ---
  const styles = {
    container: {
      maxWidth: "800px", // Wider for table
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
      marginBottom: "32px",
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: "8px",
      borderBottom: "1px solid #E5E7EB",
      paddingBottom: "4px",
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
        .styled-tr:hover {
          background-color: #F3F4F6;
        }
        .styled-tr:last-child td {
          border-bottom: none;
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.header}>Search Records</div>
        <div style={styles.subHeader}>Query distributed data across Read Replicas (Node 2 & 3)</div>

        <form onSubmit={handleSearch} style={styles.form}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Title</label>
              <input
                className="styled-input"
                style={styles.input}
                placeholder="Movie Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Genre</label>
              <input
                className="styled-input"
                style={styles.input}
                placeholder="e.g. Comedy"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Start Year</label>
              <input
                className="styled-input"
                style={styles.input}
                placeholder="e.g. 2000"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Min Runtime</label>
              <input
                className="styled-input"
                style={styles.input}
                placeholder="Mins"
                value={minRuntime}
                onChange={(e) => setMinRuntime(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Max Runtime</label>
              <input
                className="styled-input"
                style={styles.input}
                placeholder="Mins"
                value={maxRuntime}
                onChange={(e) => setMaxRuntime(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="styled-btn" style={styles.button}>
            Search Database
          </button>
        </form>

        {status.msg && (
          <div style={styles.status}>
            {status.msg}
          </div>
        )}

        {results.length > 0 && (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Year</th>
                  <th style={styles.th}>Runtime</th>
                  <th style={styles.th}>Genres</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="styled-tr" style={styles.tr}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 600 }}>{r.tconst}</td>
                    <td style={styles.td}>{r.primaryTitle}</td>
                    <td style={styles.td}>{r.startYear}</td>
                    <td style={styles.td}>{r.runtimeMinutes ? `${r.runtimeMinutes} m` : '-'}</td>
                    <td style={styles.td}>
                      {r.genres ? (
                        <span style={{ 
                          backgroundColor: "#E0E7FF", 
                          color: "#4338CA", 
                          padding: "2px 8px", 
                          borderRadius: "12px", 
                          fontSize: "12px",
                          fontWeight: 500
                        }}>
                          {r.genres.split(',')[0]}
                        </span>
                      ) : '-'}
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