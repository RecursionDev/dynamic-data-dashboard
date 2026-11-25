import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import EmptyState from "./components/layout/EmptyState";
import Overview from "./pages/Overview";
import Dashboards from "./pages/Dashboards";
import Datasets from "./pages/Datasets";
import Workspaces from "./pages/Workspaces";
import SettingsPage from "./pages/SettingsPage";
import Builder from "./pages/Builder";
import LegalPage from "./pages/LegalPage";
import "./pages/Datasets.css";
import "./pages/Workspaces.css";
import "./pages/Settings.css";
import AuthPage from "./pages/Auth";
import React, { useState, useEffect } from "react";
import { DatasetContext } from "./context/DatasetContext";
import Metrics from "./pages/Metrics";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { PanelsTopLeft } from "lucide-react";



function NotFound() {
  return (
    <EmptyState
      icon={PanelsTopLeft}
      title="Page not found"
      description="The requested page does not exist."
    />
  );
}

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [datasets, setDatasets] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("databoard_saved_datasets") || "[]"
    );
  } catch (error) {
    console.error("Unable to load saved datasets", error);
    return [];
  }
});
  const [dashboards, setDashboards] = useState(() => {
    try { return JSON.parse(localStorage.getItem("databoard_saved_dashboards") || "[]"); }
    catch { return []; }
  });
  useEffect(() => {
  try {
    localStorage.setItem(
      "databoard_saved_dashboards",
      JSON.stringify(dashboards)
    );
  } catch (error) {
    console.error("Unable to persist dashboards", error);
  }
}, [dashboards]);
  const [metrics, setMetrics] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("databoard_saved_metrics") || "[]");
  } catch {
    return [];
  }
});
const [workspaces, setWorkspaces] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("databoard_saved_workspaces") || "[]");
  } catch {
    return [];
  }
});
 useEffect(() => {
  try {
    localStorage.setItem("databoard_saved_metrics", JSON.stringify(metrics));
  } catch (error) {
    console.error("Unable to persist metrics in this browser", error);
  }
}, [metrics]);
useEffect(() => {
  try {
    localStorage.setItem(
      "databoard_saved_datasets",
      JSON.stringify(datasets)
    );
  } catch (error) {
    console.error("Unable to persist datasets", error);
  }
}, [datasets]);
useEffect(() => {
  try {
    localStorage.setItem(
      "databoard_saved_workspaces",
      JSON.stringify(workspaces)
    );
  } catch (error) {
    console.error("Unable to persist workspaces", error);
  }
}, [workspaces]);
  if (
  location.pathname === "/login" ||
  location.pathname === "/register" ||
  location.pathname === "/forgot-password"
) {
  return <AuthPage />;
}

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div className={`sidebar-wrap ${menuOpen ? "sidebar-open" : ""}`}>
        <Sidebar close={() => setMenuOpen(false)} />
      </div>

      <div className="main-area">
        <Header onMenu={() => setMenuOpen(true)} />

        <DatasetContext.Provider value={{
  datasets,
  setDatasets,
  dashboards,
  setDashboards,
  metrics,
  setMetrics,
  workspaces,
  setWorkspaces
}}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/builder/:dashboardId" element={<Builder />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/privacy" element={<LegalPage privacy />} />
            <Route path="/terms" element={<LegalPage privacy={false} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DatasetContext.Provider>

        <footer className="footer">
          <span>Dynamic Data Dashboard Builder</span>
          <div>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}