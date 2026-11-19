import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, PanelsTopLeft, Trash2 } from "lucide-react";
import { DatasetContext } from "../context/DatasetContext";
import { PageHeading, EmptyState } from "../components/Navigation";

export default function Dashboards() {
  const { dashboards, setDashboards } = useContext(DatasetContext);
  const navigate = useNavigate();

  function createDashboard() {
    navigate("/builder");
  }

  function deleteDashboard(id) {
    if (window.confirm("Delete this dashboard? This cannot be undone.")) {
      setDashboards((previous) => previous.filter((item) => item.id !== id));
    }
  }

  return (
    <>
      <PageHeading
        title="Dashboards"
        description="Create, open and manage your saved dashboards."
        action={
          <button className="primary-button" onClick={createDashboard}>
            <Plus size={17} /> New dashboard
          </button>
        }
      />

      {dashboards.length === 0 ? (
        <EmptyState
          icon={PanelsTopLeft}
          title="No dashboards created"
          description="Create your first dashboard and save it to see it here."
        />
      ) : (
        <div className="data-list">
          {dashboards.map((item) => (
            <div className="data-row" key={item.id}>
              <PanelsTopLeft />
              <div className="dashboard-row-info">
                <strong>{item.name}</strong>
                <small>
                  {item.widgets?.length || 0} components · Updated{" "}
                  {new Date(item.updatedAt || Date.now()).toLocaleString()}
                </small>
              </div>
              <Link to={`/builder/${item.id}`}>Open dashboard</Link>
              <button
                className="dashboard-delete"
                onClick={() => deleteDashboard(item.id)}
                aria-label={`Delete ${item.name}`}
                title="Delete dashboard"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
