import React, { useState, useContext } from "react";
import { BriefcaseBusiness, PanelsTopLeft } from "lucide-react";
import { DatasetContext } from "../context/DatasetContext";
import { PageHeading } from "../components/Navigation";
import "./Workspaces.css";

export default function Workspaces() {
  const { dashboards, workspaces, setWorkspaces } = useContext(DatasetContext);
  const [workspaceName, setWorkspaceName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");

  const selectedWorkspace = workspaces.find((item) => item.id === selectedId);

  function saveWorkspace(event) {
    event.preventDefault();
    const cleanName = workspaceName.trim();

    if (!cleanName) {
      setError("Enter a workspace name.");
      return;
    }

    const duplicate = workspaces.some(
      (item) =>
        item.id !== editingId &&
        item.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      setError("A workspace with this name already exists.");
      return;
    }

    if (editingId) {
      setWorkspaces((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, name: cleanName, updatedAt: new Date().toISOString() }
            : item
        )
      );
    } else {
      const newWorkspace = {
        id: `workspace-${Date.now()}`,
        name: cleanName,
        dashboardIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setWorkspaces((previous) => [...previous, newWorkspace]);
      setSelectedId(newWorkspace.id);
    }

    setWorkspaceName("");
    setEditingId(null);
    setError("");
  }

  function startEdit(workspace) {
    setEditingId(workspace.id);
    setWorkspaceName(workspace.name);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setWorkspaceName("");
    setError("");
  }

  function deleteWorkspace(id) {
    if (
      !window.confirm(
        "Delete this workspace? Its dashboards will not be deleted."
      )
    ) {
      return;
    }

    setWorkspaces((previous) => previous.filter((item) => item.id !== id));

    if (selectedId === id) {
      setSelectedId(null);
    }

    if (editingId === id) {
      cancelEdit();
    }
  }

  function toggleDashboard(dashboardId) {
    setWorkspaces((previous) =>
      previous.map((workspace) => {
        if (workspace.id !== selectedId) return workspace;

        const assigned = workspace.dashboardIds || [];
        const alreadyAssigned = assigned.includes(dashboardId);

        return {
          ...workspace,
          dashboardIds: alreadyAssigned
            ? assigned.filter((id) => id !== dashboardId)
            : [...assigned, dashboardId],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }

  return (
    <>
      <PageHeading
        title="Workspaces"
        description="Organize your dashboards into separate workspaces."
      />

      <section className="workspace-create-card">
        <h3>{editingId ? "Rename workspace" : "Create a workspace"}</h3>

        <form className="workspace-create-form" onSubmit={saveWorkspace}>
          <input
            type="text"
            value={workspaceName}
            onChange={(event) => {
              setWorkspaceName(event.target.value);
              setError("");
            }}
            placeholder="Enter workspace name"
            maxLength={60}
          />

          <button type="submit" className="primary-button">
            {editingId ? "Save changes" : "Create workspace"}
          </button>

          {editingId && (
            <button
              type="button"
              className="workspace-cancel-button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </form>

        {error && <p className="workspace-error">{error}</p>}
      </section>

      <div className="workspace-layout">
        <section className="workspace-list-section">
          <div className="workspace-section-heading">
            <h3>Your workspaces</h3>
            <span>{workspaces.length} total</span>
          </div>

          {workspaces.length === 0 ? (
            <div className="workspace-empty">
              <BriefcaseBusiness size={28} />
              <strong>No workspaces yet</strong>
              <p>Create a workspace to start organizing your dashboards.</p>
            </div>
          ) : (
            <div className="workspace-list">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={`workspace-item ${
                    selectedId === workspace.id ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="workspace-select"
                    onClick={() => setSelectedId(workspace.id)}
                  >
                    <BriefcaseBusiness size={19} />
                    <span>
                      <strong>{workspace.name}</strong>
                      <small>
                        {(workspace.dashboardIds || []).length} dashboard(s)
                      </small>
                    </span>
                  </button>

                  <div className="workspace-item-actions">
                    <button
                      type="button"
                      onClick={() => startEdit(workspace)}
                      title="Rename workspace"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="workspace-delete"
                      onClick={() => deleteWorkspace(workspace.id)}
                      title="Delete workspace"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="workspace-details-section">
          {!selectedWorkspace ? (
            <div className="workspace-empty workspace-details-empty">
              <BriefcaseBusiness size={28} />
              <strong>Select a workspace</strong>
              <p>Select a workspace to view and organize its dashboards.</p>
            </div>
          ) : (
            <>
              <div className="workspace-section-heading">
                <div>
                  <h3>{selectedWorkspace.name}</h3>
                  <span>
                    {(selectedWorkspace.dashboardIds || []).length} assigned
                    dashboard(s)
                  </span>
                </div>
              </div>

              {dashboards.length === 0 ? (
                <div className="workspace-empty">
                  <PanelsTopLeft size={28} />
                  <strong>No dashboards available</strong>
                  <p>
                    Create a dashboard first. It will appear here for assignment.
                  </p>
                </div>
              ) : (
                <div className="workspace-dashboard-list">
                  {dashboards.map((dashboard) => {
                    const assigned = (
                      selectedWorkspace.dashboardIds || []
                    ).includes(dashboard.id);

                    return (
                      <label
                        key={dashboard.id}
                        className="workspace-dashboard-item"
                      >
                        <input
                          type="checkbox"
                          checked={assigned}
                          onChange={() => toggleDashboard(dashboard.id)}
                        />

                        <span className="workspace-dashboard-icon">
                          <PanelsTopLeft size={18} />
                        </span>

                        <span className="workspace-dashboard-info">
                          <strong>{dashboard.name}</strong>
                          <small>
                            {dashboard.widgets?.length || 0} components
                          </small>
                        </span>

                        <span className="workspace-assignment-status">
                          {assigned ? "Assigned" : "Not assigned"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
