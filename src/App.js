import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// Import components from the components folder where we created them
import InsertRecord from "./pages/InsertRecord";
import UpdateRecord from "./pages/UpdateRecord";
import SearchRecords from "./pages/SearchRecords";
import DeleteRecord from "./pages/DeleteRecord";
import Reports from "./pages/Reports";

// Navigation Link Component for consistent styling
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const style = {
    color: isActive ? "#ffffff" : "#9CA3AF",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: isActive ? "#1F2937" : "transparent",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  };

  return (
    <Link to={to} style={style}>
      {children}
    </Link>
  );
}

function App() {
  // --- Global Styles ---
  const styles = {
    mainContainer: {
      minHeight: "100vh",
      backgroundColor: "#f9f9f9", // Black background as requested
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
    },
    navBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 40px",
      backgroundColor: "#111827", // Slightly lighter for navbar
      borderBottom: "1px solid #1F2937",
    },
    logo: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: "-0.025em",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    logoIcon: {
      backgroundColor: "#4F46E5",
      width: "24px",
      height: "24px",
      borderRadius: "6px",
      display: "inline-block",
    },
    navLinks: {
      display: "flex",
      gap: "8px",
    },
    contentArea: {
      flex: 1,
      padding: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start", // Aligns cards to top
    },
    placeholder: {
      textAlign: "center",
      marginTop: "80px",
      color: "#6B7280",
    }
  };

  return (
    <Router>
      <div style={styles.mainContainer}>
        {/* Navigation Bar */}
        <nav style={styles.navBar}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}></span>
            Distributed DB Manager
          </div>
          
          <div style={styles.navLinks}>
            <NavLink to="/insert">Insert</NavLink>
            <NavLink to="/update">Update</NavLink>
            <NavLink to="/search">Search</NavLink>
            <NavLink to="/delete">Delete</NavLink>
            <NavLink to="/reports">Reports</NavLink>
          </div>
        </nav>

        {/* Main Content */}
        <div style={styles.contentArea}>
          <Routes>
            <Route path="/insert" element={<InsertRecord />} />
            <Route path="/update" element={<UpdateRecord />} />
            <Route path="/search" element={<SearchRecords />} />
            <Route path="/delete" element={<DeleteRecord />} />
            <Route path="/reports" element={<Reports />} />
            
            <Route path="*" element={
              <div style={styles.placeholder}>
                <h2>Welcome to the Dashboard</h2>
                <p>Select an operation from the navigation bar to begin.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;