import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ArrowRight,
  BarChart3,
  LineChart,
  PieChart,
  Database,
  PanelsTopLeft,
  ChartNoAxesCombined,
} from "lucide-react";
import { DatasetContext } from "../context/DatasetContext";
import { PageHeading, EmptyState } from "../components/Navigation";

export default function Overview() {
  const { dashboards } = useContext(DatasetContext);
  const recentDashboards = dashboards.slice(0, 3);

  return (
    <>
      <PageHeading
        title="Overview"
        description="Manage your data, dashboards and visual reports."
        action={
          <Link to="/builder" className="primary-button">
            <Plus size={17} /> Create dashboard
          </Link>
        }
      />

      <section className="welcome-panel">
        <div>
          <span className="welcome-label">YOUR DATA WORKSPACE</span>
          <h2>Turn your data into clear insights.</h2>
          <p>
            Connect datasets, build visual reports and organize your information
            in one workspace.
          </p>
          <Link to="/builder" className="light-button">
            Open dashboard builder <ArrowRight size={16} />
          </Link>
        </div>
        <div className="welcome-art">
          <BarChart3 size={75} />
          <LineChart size={58} />
          <PieChart size={48} />
        </div>
      </section>

      <div className="section-heading">
        <h2>Get started</h2>
        <p>Set up your dashboard workspace.</p>
      </div>

      <div className="setup-grid">
        <Link to="/datasets" className="setup-card">
          <Database />
          <h3>Add a dataset</h3>
          <p>Upload and manage your data sources.</p>
          <span>
            Manage datasets <ArrowRight size={15} />
          </span>
        </Link>

        <Link to="/builder" className="setup-card">
          <PanelsTopLeft />
          <h3>Create a dashboard</h3>
          <p>Arrange charts and tables in a custom layout.</p>
          <span>
            Open builder <ArrowRight size={15} />
          </span>
        </Link>

        <Link to="/metrics" className="setup-card">
          <ChartNoAxesCombined />
          <h3>Explore metrics</h3>
          <p>Organize the measurements in your reports.</p>
          <span>
            View metrics <ArrowRight size={15} />
          </span>
        </Link>
      </div>

      <div className="section-heading">
        <h2>Recent dashboards</h2>
        <Link to="/dashboards">View all</Link>
      </div>

      {recentDashboards.length === 0 ? (
        <EmptyState
          icon={PanelsTopLeft}
          title="No dashboards yet"
          description="Your saved dashboards will appear here."
        />
      ) : (
        <div className="data-list">
          {recentDashboards.map((item) => (
            <div className="data-row" key={item.id}>
              <PanelsTopLeft />
              <strong>{item.name}</strong>
              <span className="dashboard-meta">
                {item.widgets?.length || 0} components
              </span>
              <Link to={`/builder/${item.id}`}>Open</Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
