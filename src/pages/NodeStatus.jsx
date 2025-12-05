import React, { useEffect, useState } from "react";
import { fetchWithFailover } from "../api";

export default function CrashSimulator() {
  // --- State ---
  const [nodeStatus, setNodeStatus] = useState({
    node1: true,
    node2: true,
    node3: true,
  });

  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState({ msg: "Loading node status...", type: "loading" });

  // --- API Functions ---

  const loadNodeStatus = async () => {
    try {
      const data = await fetchWithFailover("/api/crashRecovery/node-status");
      setNodeStatus(data);
      setStatus({ msg: "Cluster status synchronized.", type: "success" });
    } catch (err) {
      console.error("Failed to fetch node status:", err.message);
      setLogs((prev) => [
        { error: "Failed to fetch initial node status: " + err.message, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
      setStatus({ msg: "Failed to load initial node status.", type: "error" });
    }
  };

  useEffect(() => {
    loadNodeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleNode = async (node) => {
    const goingOnline = !nodeStatus[node];
    const action = goingOnline ? "Recovering" : "Crashing";
    const endpoint = goingOnline
      ? "/api/crashRecovery/recover"
      : "/api/crashRecovery/crash";

    setStatus({ msg: `${action} ${node}...`, type: "loading" });

    try {
      const data = await fetchWithFailover(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node }),
      });
      
      // Update UI state only if the command was successful
      setNodeStatus((prev) => ({ ...prev, [node]: goingOnline }));
      
      setLogs((prev) => [data, ...prev]);
      
      setStatus({ 
        msg: data.message, 
        type: "success" 
      });

    } catch (err) {
      const errorMsg = err.message || "An unknown error occurred.";
      setLogs((prev) => [
        { error: errorMsg, action: action, node: node, timestamp: new Date().toLocaleTimeString() }, 
        ...prev 
      ]);
      setStatus({ msg: `${action} of ${node} failed: ${errorMsg}`, type: "error" });
    }
  };

  // --- Styles ---
  const ACCENT_COLOR = "#4F46E5"; 
  const DARK_BG = "#111827"; 
  const LOG_TEXT_COLOR = "#10B981"; 

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "32px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      fontFamily: "'Inter', sans-serif",
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
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#374151",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: "16px",
      borderBottom: "1px solid #E5E7EB",
      paddingBottom: "4px",
    },
    nodeGrid: {
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        marginBottom: "32px",
        flexWrap: 'wrap',
    },
    nodeCard: {
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "180px",
        transition: "transform 0.2s ease-in-out",
        border: "1px solid #E5E7EB",
    },
    nodeName: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "12px",
        color: ACCENT_COLOR,
    },
    statusIndicator: (isUp) => ({
        fontSize: "14px",
        fontWeight: "600",
        padding: "4px 12px",
        borderRadius: "9999px",
        marginBottom: "16px",
        color: isUp ? '#065F46' : '#991B1B', 
        backgroundColor: isUp ? '#D1FAE5' : '#FEE2E2', 
        border: `1px solid ${isUp ? '#6EE7B7' : '#FCA5A5'}`,
    }),
    button: (isUp) => ({
      padding: "10px 18px",
      backgroundColor: isUp ? "#DC2626" : "#10B981", 
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      width: "100%",
    }),
    statusBox: {
      marginTop: "24px",
      padding: "12px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      textAlign: "center",
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
      backgroundColor: DARK_BG,
      color: LOG_TEXT_COLOR, 
      padding: "16px",
      borderRadius: "8px",
      fontSize: "13px",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      whiteSpace: "pre-wrap",
      maxHeight: "350px",
      overflowY: "auto",
    }
  };
  
  const getStatusStyle = () => {
    switch (status.type) {
      case 'error':
        return { backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FCA5A5' };
      case 'success':
        return { backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' };
      case 'loading':
      default:
        return { backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD' }; 
    }
  };

  return (
    <>
      <style>{`
        .node-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.15); }
        .node-btn:active { transform: translateY(0); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .node-card-up { border-color: #10B981; box-shadow: 0 0 0 4px #ECFDF5; }
        .node-card-down { border-color: #DC2626; box-shadow: 0 0 0 4px #FEF2F2; opacity: 0.8; }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.header}>Crash Simulator</div>

        {/* Node Status Controls */}
        <div style={{ marginBottom: "32px" }}>
          <div style={styles.sectionTitle}>
              Cluster Status Control
          </div>
          <div style={styles.nodeGrid}>
            {Object.keys(nodeStatus).map((node) => {
                const isUp = nodeStatus[node];
                return (
                    <div 
                        key={node} 
                        style={styles.nodeCard}
                        className={isUp ? 'node-card-up' : 'node-card-down'}
                    >
                        <div style={styles.nodeName}>{node.toUpperCase()}</div>
                        <div style={styles.statusIndicator(isUp)}>
                            {isUp ? "ONLINE" : "OFFLINE"}
                        </div>
                        <button
                            onClick={() => toggleNode(node)}
                            style={styles.button(isUp)}
                            className="node-btn"
                            title={isUp ? `Click to force ${node} to crash` : `Click to initiate recovery for ${node}`}
                        >
                            {isUp ? "Crash Node" : "Recover Node"}
                        </button>
                    </div>
                );
            })}
          </div>
        </div>

        {/* Operation Status */}
        {status.msg && (
          <div style={{...styles.statusBox, ...getStatusStyle()}}>
            {status.msg}
          </div>
        )}

        {/* Logs Console */}
        <div style={styles.logsContainer}>
          <div style={styles.logTitle}>
              Operation Logs
          </div>
          <pre style={styles.pre}>
            {logs.length > 0
              ? logs.map((l, i) => {
                  const logString = typeof l === 'object' 
                      ? JSON.stringify(l, null, 2) 
                      : l;
                  
                  const isError = logString.includes('Error') || logString.includes('Failed');

                  return (
                    <React.Fragment key={i}>
                        {isError 
                            ? <span style={{color: '#F87171'}}>{logString}</span>
                            : <span>{logString}</span>
                        }
                        {i < logs.length - 1 && '\n\n// --- Log Divider ---'}
                    </React.Fragment>
                  );
                })
              : "// Cluster logs will appear here after a crash or recovery command is sent."}
          </pre>
        </div>
      </div>
    </>
  );
}