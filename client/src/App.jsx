import "./pages/Datasets.css";
import "./pages/Workspaces.css";
import "./pages/Settings.css";
import AuthPage from "./pages/Auth";
import React, { useState, useRef, useContext, useEffect } from "react";
import { DatasetContext } from "./context/DatasetContext";
import Metrics from "./pages/Metrics";
import { Routes, Route, NavLink, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PanelsTopLeft,
  Database,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  Settings,
  Plus,
  Search,
  Bell,
  Menu,
  X,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Upload,
  FileSpreadsheet,
  UploadCloud,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";

function Sidebar({ close }) {
  const links = [
    { name: "Overview", path: "/", icon: LayoutDashboard },
    { name: "Dashboards", path: "/dashboards", icon: PanelsTopLeft },
    { name: "Datasets", path: "/datasets", icon: Database },
    { name: "Metrics", path: "/metrics", icon: ChartNoAxesCombined },
    { name: "Workspaces", path: "/workspaces", icon: BriefcaseBusiness },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">D</div>
        <span>DataBoard</span>
        <button className="mobile-close" onClick={close}><X /></button>
      </div>

      <div className="workspace">
        <div className="workspace-avatar">W</div>
        <div>
          <strong>My Workspace</strong>
          <small>Personal workspace</small>
        </div>
      </div>

      <p className="nav-heading">WORKSPACE</p>

      <nav>
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={close}
          >
            <Icon size={18} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-avatar">U</div>
        <div>
          <strong>Your Account</strong>
          <small>Workspace member</small>
        </div>
      </div>
    </aside>
  );
}

function Header({ onMenu }) {
  return (
    <header className="header">
      <button className="mobile-menu" onClick={onMenu}><Menu /></button>

      <div className="breadcrumb">
        Workspace <span>/</span> Dashboard
      </div>

      <div className="header-actions">
        <label className="search-box">
          <Search size={17} />
          <input placeholder="Search..." />
        </label>
        <button className="notification-button" aria-label="Notifications">
          <Bell size={19} />
        </button>
        <div className="profile-avatar">U</div>
      </div>
    </header>
  );
}

function PageHeading({ title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={27} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Overview() {
  const { dashboards } = useContext(DatasetContext);
  const recentDashboards = dashboards.slice(0, 3);
  return (
    <>
      <PageHeading
        title="Overview"
        description="Manage your data, dashboards and visual reports."
        action={<Link to="/builder" className="primary-button"><Plus size={17} /> Create dashboard</Link>}
      />
      <section className="welcome-panel">
        <div>
          <span className="welcome-label">YOUR DATA WORKSPACE</span>
          <h2>Turn your data into clear insights.</h2>
          <p>Connect datasets, build visual reports and organize your information in one workspace.</p>
          <Link to="/builder" className="light-button">Open dashboard builder <ArrowRight size={16} /></Link>
        </div>
        <div className="welcome-art"><BarChart3 size={75} /><LineChart size={58} /><PieChart size={48} /></div>
      </section>
      <div className="section-heading"><h2>Get started</h2><p>Set up your dashboard workspace.</p></div>
      <div className="setup-grid">
        <Link to="/datasets" className="setup-card"><Database /><h3>Add a dataset</h3><p>Upload and manage your data sources.</p><span>Manage datasets <ArrowRight size={15} /></span></Link>
        <Link to="/builder" className="setup-card"><PanelsTopLeft /><h3>Create a dashboard</h3><p>Arrange charts and tables in a custom layout.</p><span>Open builder <ArrowRight size={15} /></span></Link>
        <Link to="/metrics" className="setup-card"><ChartNoAxesCombined /><h3>Explore metrics</h3><p>Organize the measurements in your reports.</p><span>View metrics <ArrowRight size={15} /></span></Link>
      </div>
      <div className="section-heading"><h2>Recent dashboards</h2><Link to="/dashboards">View all</Link></div>
      {recentDashboards.length === 0 ? <EmptyState icon={PanelsTopLeft} title="No dashboards yet" description="Your saved dashboards will appear here." /> : (
        <div className="data-list">{recentDashboards.map(item => <div className="data-row" key={item.id}><PanelsTopLeft /><strong>{item.name}</strong><span className="dashboard-meta">{item.widgets.length} components</span><Link to={`/builder/${item.id}`}>Open</Link></div>)}</div>
      )}
    </>
  );
}

function Dashboards() {
  const { dashboards, setDashboards } = useContext(DatasetContext);
  const navigate = useNavigate();
  function createDashboard() { navigate('/builder'); }
  function deleteDashboard(id) {
    if (window.confirm('Delete this dashboard? This cannot be undone.')) {
      setDashboards(previous => previous.filter(item => item.id !== id));
    }
  }
  return (
    <>
      <PageHeading title="Dashboards" description="Create, open and manage your saved dashboards." action={<button className="primary-button" onClick={createDashboard}><Plus size={17} /> New dashboard</button>} />
      {dashboards.length === 0 ? <EmptyState icon={PanelsTopLeft} title="No dashboards created" description="Create your first dashboard and save it to see it here." /> : (
        <div className="data-list">{dashboards.map(item => (
          <div className="data-row" key={item.id}>
            <PanelsTopLeft />
            <div className="dashboard-row-info"><strong>{item.name}</strong><small>{item.widgets.length} components · Updated {new Date(item.updatedAt).toLocaleString()}</small></div>
            <Link to={`/builder/${item.id}`}>Open dashboard</Link>
            <button className="dashboard-delete" onClick={() => deleteDashboard(item.id)} aria-label={`Delete ${item.name}`} title="Delete dashboard"><Trash2 size={16} /></button>
          </div>
        ))}</div>
      )}
    </>
  );
}


function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") i++;

      row.push(value);

      if (row.some(cell => cell.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value);

  if (row.some(cell => cell.trim() !== "")) {
    rows.push(row);
  }

  if (rows.length === 0) {
    throw new Error("The CSV file is empty.");
  }

  const headers = rows[0].map((header, index) =>
    header.trim() || `Column ${index + 1}`
  );

  const data = rows.slice(1).map(currentRow =>
    headers.map((_, index) => currentRow[index] ?? "")
  );

  return { headers, data };
}

function Datasets() {
  const { datasets, setDatasets } = useContext(DatasetContext);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  async function handleFile(file) {
    setError("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    try {
      const text = await file.text();
      const { headers, data } = parseCSV(text);

      const newDataset = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        headers,
        rows: data,
        uploadedAt: new Date().toLocaleString()
      };

      setDatasets(previous => [newDataset, ...previous]);
      setSelectedDataset(newDataset);
    } catch (err) {
      setError(err.message || "Unable to read this CSV file.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function deleteDataset(id) {
    setDatasets(previous => previous.filter(item => item.id !== id));

    if (selectedDataset?.id === id) {
      setSelectedDataset(null);
    }
  }

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="datasets-page">
      <PageHeading
        title="Datasets"
        description="Upload, preview and manage your CSV data sources."
        action={
          <button
            className="ds-upload-button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={17} />
            Upload dataset
          </button>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={handleFileChange}
      />

      {error && (
        <div className="ds-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      <div
        className={`ds-dropzone ${isDragging ? "ds-dropzone-active" : ""}`}
        onDragOver={event => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="ds-upload-icon">
          <UploadCloud size={27} />
        </div>

        <h2>Upload your CSV dataset</h2>

        <p>
          Drag and drop your CSV file here, or browse files from your computer.
        </p>

        <button
          className="ds-browse-button"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse files
        </button>

        <span className="ds-file-hint">
          CSV files only · Maximum file size: 10 MB
        </span>
      </div>

      <div className="ds-list-heading">
        <div>
          <h2>Your datasets</h2>
          <p>{datasets.length} dataset(s) uploaded in this session</p>
        </div>

        <label className="ds-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </label>
      </div>

      {filteredDatasets.length === 0 ? (
        <div className="ds-empty">
          <Database size={32} />

          <h3>
            {datasets.length === 0
              ? "No datasets uploaded"
              : "No matching datasets"}
          </h3>

          <p>
            {datasets.length === 0
              ? "Upload a CSV file to see your data here."
              : "Try searching with a different file name."}
          </p>
        </div>
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-list-table">
            <thead>
              <tr>
                <th>Dataset</th>
                <th>Rows</th>
                <th>Columns</th>
                <th>File size</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDatasets.map(dataset => (
                <tr key={dataset.id}>
                  <td>
                    <div className="ds-file-cell">
                      <div className="ds-file-icon">
                        <FileSpreadsheet size={19} />
                      </div>

                      <div>
                        <strong>{dataset.name}</strong>
                        <small>{dataset.uploadedAt}</small>
                      </div>
                    </div>
                  </td>

                  <td>{dataset.rows.length}</td>
                  <td>{dataset.headers.length}</td>
                  <td>{formatSize(dataset.size)}</td>

                  <td>
                    <div className="ds-actions">
                      <button
                        title="Preview dataset"
                        aria-label={`Preview ${dataset.name}`}
                        onClick={() => setSelectedDataset(dataset)}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        className="ds-delete"
                        title="Delete dataset"
                        aria-label={`Delete ${dataset.name}`}
                        onClick={() => deleteDataset(dataset.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedDataset && (
        <section className="ds-preview">
          <div className="ds-preview-heading">
            <div>
              <div className="ds-preview-title">
                <FileSpreadsheet size={19} />
                <h2>{selectedDataset.name}</h2>
                <span className="ds-loaded">
                  <CheckCircle2 size={13} />
                  Loaded
                </span>
              </div>

              <p>
                Previewing the first{" "}
                {Math.min(8, selectedDataset.rows.length)} of{" "}
                {selectedDataset.rows.length} data rows
              </p>
            </div>

            <button
              className="ds-close-preview"
              onClick={() => setSelectedDataset(null)}
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>

          {selectedDataset.rows.length === 0 ? (
            <div className="ds-empty">
              <FileText size={30} />
              <h3>No data rows found</h3>
              <p>This CSV contains column headers but no data rows.</p>
            </div>
          ) : (
            <div className="ds-preview-table-wrap">
              <table className="ds-preview-table">
                <thead>
                  <tr>
                    <th>#</th>
                    {selectedDataset.headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {selectedDataset.rows.slice(0, 8).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{rowIndex + 1}</td>

                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell || "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="ds-preview-footer">
            <span>{selectedDataset.headers.length} columns</span>
            <span>{selectedDataset.rows.length} rows</span>
            <span>{formatSize(selectedDataset.size)}</span>
          </div>
        </section>
      )}
    </div>
  );
}



function Workspaces() {
  const { dashboards, workspaces, setWorkspaces } = useContext(DatasetContext);
  const [workspaceName, setWorkspaceName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");

  const selectedWorkspace = workspaces.find(item => item.id === selectedId);

  function saveWorkspace(event) {
    event.preventDefault();
    const cleanName = workspaceName.trim();

    if (!cleanName) {
      setError("Enter a workspace name.");
      return;
    }

    const duplicate = workspaces.some(item =>
      item.id !== editingId &&
      item.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      setError("A workspace with this name already exists.");
      return;
    }

    if (editingId) {
      setWorkspaces(previous =>
        previous.map(item =>
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
        updatedAt: new Date().toISOString()
      };

      setWorkspaces(previous => [...previous, newWorkspace]);
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
    if (!window.confirm("Delete this workspace? Its dashboards will not be deleted.")) {
      return;
    }

    setWorkspaces(previous => previous.filter(item => item.id !== id));

    if (selectedId === id) {
      setSelectedId(null);
    }

    if (editingId === id) {
      cancelEdit();
    }
  }

  function toggleDashboard(dashboardId) {
    setWorkspaces(previous =>
      previous.map(workspace => {
        if (workspace.id !== selectedId) return workspace;

        const assigned = workspace.dashboardIds || [];
        const alreadyAssigned = assigned.includes(dashboardId);

        return {
          ...workspace,
          dashboardIds: alreadyAssigned
            ? assigned.filter(id => id !== dashboardId)
            : [...assigned, dashboardId],
          updatedAt: new Date().toISOString()
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
            onChange={event => {
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
              {workspaces.map(workspace => (
                <div
                  key={workspace.id}
                  className={`workspace-item ${selectedId === workspace.id ? "active" : ""}`}
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
                    {(selectedWorkspace.dashboardIds || []).length} assigned dashboard(s)
                  </span>
                </div>
              </div>

              {dashboards.length === 0 ? (
                <div className="workspace-empty">
                  <PanelsTopLeft size={28} />
                  <strong>No dashboards available</strong>
                  <p>Create a dashboard first. It will appear here for assignment.</p>
                </div>
              ) : (
                <div className="workspace-dashboard-list">
                  {dashboards.map(dashboard => {
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


function getNumericColumns(dataset) {
  if (!dataset) return [];
  return dataset.headers.filter((header, columnIndex) => {
    const values = dataset.rows
      .map(row => rowValue(dataset, row, columnIndex))
      .filter(raw => String(raw ?? "").trim() !== "" && Number.isFinite(Number(raw)));
    return values.length > 0 && values.length >= Math.ceil(dataset.rows.length * 0.5);
  });
}

function rowValue(dataset, row, columnIndex) {
  return Array.isArray(row) ? row[columnIndex] : row?.[dataset.headers[columnIndex]];
}

function chartPoints(dataset, xColumn, yColumn, type) {
  if (!dataset || !xColumn) return [];
  const xIndex = dataset.headers.indexOf(xColumn);
  const yIndex = dataset.headers.indexOf(yColumn);

  if (type === "Pie chart" && yIndex < 0) {
    const counts = new Map();
    dataset.rows.forEach(row => {
      const label = String(rowValue(dataset, row, xIndex) ?? "(blank)");
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return [...counts.entries()].map(([label, value]) => ({ label, value }));
  }

  if (xIndex < 0 || yIndex < 0) return [];

  if (type === "Pie chart") {
    const totals = new Map();
    dataset.rows.forEach(row => {
      const label = String(rowValue(dataset, row, xIndex) ?? "(blank)");
      const value = Number(rowValue(dataset, row, yIndex));
      if (Number.isFinite(value)) totals.set(label, (totals.get(label) || 0) + value);
    });
    return [...totals.entries()].map(([label, value]) => ({ label, value })).filter(item => item.value >= 0);
  }

  return dataset.rows
    .map((row, index) => ({
      label: String(rowValue(dataset, row, xIndex) ?? `Row ${index + 1}`),
      value: Number(rowValue(dataset, row, yIndex))
    }))
    .filter(item => Number.isFinite(item.value))
    .slice(0, 40);
}

function ChartPreview({ widget, dataset }) {
  if (!dataset) {
    return (
      <div className="widget-placeholder">
        <Database size={32} />
        <strong>Select a dataset</strong>
        <p>Choose an uploaded CSV dataset to preview real data.</p>
      </div>
    );
  }

  if (widget.name === "Data table") {
    return (
      <div className="real-table-wrap">
        <table className="real-data-table">
          <thead>
            <tr>{dataset.headers.map((header, index) => <th key={`${header}-${index}`}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {dataset.rows.slice(0, 8).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {dataset.headers.map((header, columnIndex) => (
                  <td key={`${header}-${columnIndex}`}>{String(rowValue(dataset, row, columnIndex) ?? "") || "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="chart-footnote">Showing {Math.min(8, dataset.rows.length)} of {dataset.rows.length.toLocaleString()} rows.</p>
      </div>
    );
  }

  const points = chartPoints(dataset, widget.xColumn, widget.yColumn, widget.name);
  if (!widget.xColumn || (widget.name !== "Pie chart" && !widget.yColumn) || points.length === 0) {
    return (
      <div className="widget-placeholder">
        <ChartNoAxesCombined size={32} />
        <strong>Choose chart columns</strong>
        <p>Select the required X and Y columns above to display your data.</p>
      </div>
    );
  }

  if (widget.name === "Pie chart") {
    const total = points.reduce((sum, point) => sum + point.value, 0);
    if (total <= 0) {
      return <div className="widget-placeholder"><strong>No positive values to chart</strong><p>Choose a column with positive numeric values or use category counts.</p></div>;
    }
    const colors = ["#2563eb", "#0f766e", "#d97706", "#64748b", "#0891b2", "#4f46e5", "#65a30d", "#c2410c"];
    let offset = 0;
    const segments = points.slice(0, 8).map((point, index) => {
      const fraction = point.value / total;
      const segment = { ...point, fraction, offset, color: colors[index % colors.length] };
      offset += fraction;
      return segment;
    });
    return (
      <div className="pie-preview-layout">
        <svg viewBox="0 0 220 220" role="img" aria-label="Pie chart of selected dataset">
          {segments.map((segment, index) => (
            <circle
              key={`${segment.label}-${index}`}
              cx="110" cy="110" r="78"
              fill="none"
              stroke={segment.color}
              strokeWidth="34"
              strokeDasharray={`${segment.fraction * 490.09} ${490.09}`}
              strokeDashoffset={-segment.offset * 490.09}
              transform="rotate(-90 110 110)"
            />
          ))}
        </svg>
        <div className="pie-legend">
          {segments.map((segment, index) => (
            <div key={`${segment.label}-${index}`}>
              <span style={{ background: segment.color }} />
              <span title={segment.label}>{segment.label}</span>
              <strong>{((segment.value / total) * 100).toFixed(1)}%</strong>
            </div>
          ))}
          {points.length > 8 && <small>Showing the first 8 categories.</small>}
        </div>
      </div>
    );
  }

  const width = 620;
  const height = 210;
  const padding = { top: 12, right: 14, bottom: 42, left: 42 };
  const values = points.map(point => point.value);
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  const range = maxValue - minValue || 1;
  const xAt = index => padding.left + (points.length === 1 ? (width - padding.left - padding.right) / 2 : index * (width - padding.left - padding.right) / (points.length - 1));
  const yAt = value => padding.top + (maxValue - value) * (height - padding.top - padding.bottom) / range;
  const barWidth = Math.max(5, Math.min(28, (width - padding.left - padding.right) / points.length * 0.58));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${xAt(index)} ${yAt(point.value)}`).join(" ");
  return (
    <div className="chart-svg-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${widget.name} preview`}>
        {[0, 1, 2, 3].map(index => {
          const y = padding.top + index * (height - padding.top - padding.bottom) / 3;
          const value = maxValue - index * range / 3;
          return <g key={index}><line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e7edf5" strokeDasharray="4 4" /><text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#7b8798">{value.toLocaleString(undefined, { maximumFractionDigits: 1 })}</text></g>;
        })}
        {widget.name === "Bar chart" ? points.map((point, index) => {
          const valueY = yAt(point.value);
          const zeroY = yAt(0);
          const y = Math.min(valueY, zeroY);
          return <rect key={index} x={xAt(index) - barWidth / 2} y={y} width={barWidth} height={Math.max(1, Math.abs(zeroY - valueY))} rx="2" fill="#2563eb"><title>{point.label}: {point.value}</title></rect>;
        }) : (
          <>
            <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((point, index) => <circle key={index} cx={xAt(index)} cy={yAt(point.value)} r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2"><title>{point.label}: {point.value}</title></circle>)}
          </>
        )}
        {points.filter((_, index) => points.length <= 10 || index % Math.ceil(points.length / 10) === 0).map(point => {
          const index = points.indexOf(point);
          return <text key={index} x={xAt(index)} y={height - 13} textAnchor="middle" fontSize="10" fill="#718096">{point.label.length > 11 ? `${point.label.slice(0, 10)}…` : point.label}</text>;
        })}
      </svg>
      <p className="chart-footnote">Based on {points.length} rows with numeric values.</p>
    </div>
  );
}

function Builder() {
  const { datasets, dashboards, setDashboards } = useContext(DatasetContext);
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const existingDashboard = dashboardId ? dashboards.find(item => item.id === dashboardId) : null;
  const [title, setTitle] = useState(existingDashboard?.name || "Untitled dashboard");
  const [widgets, setWidgets] = useState(existingDashboard?.widgets || []);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (dashboardId) {
      const saved = dashboards.find(item => item.id === dashboardId);
      if (saved) { setTitle(saved.name); setWidgets(saved.widgets || []); }
    } else { setTitle("Untitled dashboard"); setWidgets([]); }
    setSaveMessage(""); setSaveError("");
  }, [dashboardId]);

  const components = [
    { name: "Bar chart", icon: BarChart3 },
    { name: "Line chart", icon: LineChart },
    { name: "Pie chart", icon: PieChart },
    { name: "Data table", icon: Table2 }
  ];

  function addWidget(name) {
    const firstDataset = datasets[0];
    const numericColumns = getNumericColumns(firstDataset);
    const firstTextColumn = firstDataset?.headers?.find(header => !numericColumns.includes(header));
    setWidgets(previous => [...previous, {
      id: `${Date.now()}-${Math.random()}`,
      name,
      datasetId: firstDataset?.id || "",
      xColumn: firstTextColumn || firstDataset?.headers?.[0] || "",
      yColumn: numericColumns[0] || ""
    }]);
    setSaveMessage("");
  }

  function updateWidget(id, changes) {
    setWidgets(previous => previous.map(widget => widget.id === id ? { ...widget, ...changes } : widget));
    setSaveMessage("");
  }
  function removeWidget(id) {
    setWidgets(previous => previous.filter(item => item.id !== id));
    setSaveMessage("");
  }
  function saveDashboard() {
    const cleanTitle = title.trim();
    if (!cleanTitle) { setSaveError("Enter a dashboard name before saving."); setSaveMessage(""); return; }
    if (widgets.length === 0) { setSaveError("Add at least one component before saving."); setSaveMessage(""); return; }
    const now = new Date().toISOString();
    const record = { id: dashboardId || `${Date.now()}`, name: cleanTitle, widgets, createdAt: existingDashboard?.createdAt || now, updatedAt: now };
    setDashboards(previous => dashboardId
      ? previous.map(item => item.id === dashboardId ? record : item)
      : [record, ...previous]);
    setSaveError("");
    setSaveMessage("Dashboard saved successfully.");
    if (!dashboardId) navigate(`/builder/${record.id}`, { replace: true });
  }

  return (
    <>
      <PageHeading title="Dashboard Builder" description="Design charts and tables using your uploaded CSV datasets." action={<button className="primary-button" onClick={saveDashboard}><span>Save dashboard</span></button>} />
      {saveError && <div className="ds-error" role="alert"><AlertCircle size={17} />{saveError}</div>}
      {saveMessage && <div className="save-success" role="status"><CheckCircle2 size={17} />{saveMessage}</div>}
      <div className="builder">
        <aside className="builder-sidebar">
          <h3>Components</h3><p>Click a component to add it to your dashboard.</p>
          {components.map(({ name, icon: Icon }) => <button className="builder-component" key={name} onClick={() => addWidget(name)}><Icon size={18} />{name}<Plus size={15} /></button>)}
          {datasets.length === 0 && <p className="builder-help">Upload a CSV file on the Datasets page before adding charts.</p>}
        </aside>
        <section className="builder-canvas">
          <input value={title} onChange={event => { setTitle(event.target.value); setSaveMessage(""); }} aria-label="Dashboard title" />
          {widgets.length === 0 ? <EmptyState icon={PanelsTopLeft} title="Your dashboard is empty" description="Choose a component from the left panel to start building." /> : (
            <div className="widget-grid">{widgets.map(widget => {
              const Component = components.find(item => item.name === widget.name)?.icon || Table2;
              const dataset = datasets.find(item => item.id === widget.datasetId);
              const numericColumns = getNumericColumns(dataset);
              const isTable = widget.name === "Data table";
              const isPie = widget.name === "Pie chart";
              return <div className="dashboard-widget" key={widget.id}>
                <div className="widget-header"><div><Component size={18} /><strong>{widget.name}</strong></div><button onClick={() => removeWidget(widget.id)} aria-label={`Remove ${widget.name}`} className="remove-widget"><X size={17} /></button></div>
                <div className="widget-config">
                  <label>Dataset<select value={widget.datasetId} onChange={event => {
                    const nextDataset = datasets.find(item => item.id === event.target.value);
                    const nextNumeric = getNumericColumns(nextDataset);
                    const nextText = nextDataset?.headers?.find(header => !nextNumeric.includes(header));
                    updateWidget(widget.id, { datasetId: event.target.value, xColumn: nextText || nextDataset?.headers?.[0] || "", yColumn: nextNumeric[0] || "" });
                  }}><option value="">Select dataset</option>{datasets.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                  {dataset && !isTable && <div className="widget-axis-controls">
                    <label>{isPie ? "Category" : "X-axis"}<select value={widget.xColumn} onChange={event => updateWidget(widget.id, { xColumn: event.target.value })}><option value="">Select column</option>{dataset.headers.map((header, index) => <option key={`${header}-${index}`} value={header}>{header}</option>)}</select></label>
                    <label>{isPie ? "Values (optional)" : "Y-axis"}<select value={widget.yColumn} onChange={event => updateWidget(widget.id, { yColumn: event.target.value })}><option value="">{isPie ? "Count categories" : "Select numeric column"}</option>{numericColumns.map(header => <option key={header} value={header}>{header}</option>)}</select></label>
                  </div>}
                </div>
                <ChartPreview widget={widget} dataset={dataset} />
              </div>;
            })}</div>
          )}
        </section>
      </div>
    </>
  );
}



function SettingsPage() {
  const defaultSettings = {
    displayName: "",
    email: "",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    rowsPerPage: "10",
    compactTables: false
  };

  const [settings, setSettings] = useState(() => {
    try {
      return {
        ...defaultSettings,
        ...JSON.parse(localStorage.getItem("databoard_app_settings") || "{}")
      };
    } catch {
      return defaultSettings;
    }
  });

  const [saveMessage, setSaveMessage] = useState("");

  function updateSetting(field, value) {
    setSettings(previous => ({
      ...previous,
      [field]: value
    }));
    setSaveMessage("");
  }

  function saveSettings(event) {
    event.preventDefault();

    try {
      localStorage.setItem(
        "databoard_app_settings",
        JSON.stringify(settings)
      );
      setSaveMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Unable to save settings", error);
      setSaveMessage("Unable to save settings in this browser.");
    }
  }

  function resetSettings() {
    if (!window.confirm("Reset all application settings to their defaults?")) {
      return;
    }

    setSettings(defaultSettings);

    try {
      localStorage.removeItem("databoard_app_settings");
      setSaveMessage("Settings have been reset.");
    } catch (error) {
      console.error("Unable to reset settings", error);
      setSaveMessage("Unable to reset settings.");
    }
  }

  return (
    <div className="app-settings-page">
      <PageHeading
        title="Settings"
        description="Manage your profile information and application preferences."
      />

      <form onSubmit={saveSettings}>
        <section className="app-settings-card">
          <div className="app-settings-heading">
            <h3>Profile information</h3>
            <p>Manage the profile details displayed in this application.</p>
          </div>

          <div className="app-settings-grid">
            <label className="app-settings-field">
              Display name
              <input
                type="text"
                value={settings.displayName}
                onChange={event =>
                  updateSetting("displayName", event.target.value)
                }
                placeholder="Enter your display name"
                maxLength={60}
              />
            </label>

            <label className="app-settings-field">
              Email address
              <input
                type="email"
                value={settings.email}
                onChange={event =>
                  updateSetting("email", event.target.value)
                }
                placeholder="Enter your email address"
              />
            </label>
          </div>

          <p className="app-settings-note">
            These details are stored only in this browser. They do not update
            your account or backend profile.
          </p>
        </section>

        <section className="app-settings-card">
          <div className="app-settings-heading">
            <h3>Application preferences</h3>
            <p>Choose your preferred language and date format.</p>
          </div>

          <div className="app-settings-grid">
            <label className="app-settings-field">
              Language
              <select
                value={settings.language}
                onChange={event =>
                  updateSetting("language", event.target.value)
                }
              >
                <option value="English">English</option>
              </select>
            </label>

            <label className="app-settings-field">
              Date format
              <select
                value={settings.dateFormat}
                onChange={event =>
                  updateSetting("dateFormat", event.target.value)
                }
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </label>
          </div>
        </section>

        <section className="app-settings-card">
          <div className="app-settings-heading">
            <h3>Display preferences</h3>
            <p>Set your preferred table display options.</p>
          </div>

          <div className="app-settings-grid">
            <label className="app-settings-field">
              Rows per page
              <select
                value={settings.rowsPerPage}
                onChange={event =>
                  updateSetting("rowsPerPage", event.target.value)
                }
              >
                <option value="10">10 rows</option>
                <option value="25">25 rows</option>
                <option value="50">50 rows</option>
                <option value="100">100 rows</option>
              </select>
            </label>

            <label className="app-settings-checkbox">
              <input
                type="checkbox"
                checked={settings.compactTables}
                onChange={event =>
                  updateSetting("compactTables", event.target.checked)
                }
              />
              <span>
                <strong>Compact table preference</strong>
                <small>Save a preference for more compact data tables.</small>
              </span>
            </label>
          </div>
        </section>

        <section className="app-settings-card">
          <div className="app-settings-heading">
            <h3>Legal information</h3>
            <p>Review the application's policies and terms.</p>
          </div>

          <div className="app-settings-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>
        </section>

        <div className="app-settings-footer">
          <div>
            {saveMessage && (
              <span className="app-settings-message" role="status">
                {saveMessage}
              </span>
            )}
          </div>

          <div className="app-settings-actions">
            <button
              type="button"
              className="app-settings-reset"
              onClick={resetSettings}
            >
              Reset settings
            </button>

            <button type="submit" className="primary-button">
              Save settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


function LegalPage({ privacy }) {
  return (
    <>
      <PageHeading
        title={privacy ? "Privacy Policy" : "Terms & Conditions"}
        description="Draft project policy information."
      />
      <div className="settings-card legal-card">
        <h2>{privacy ? "Privacy Policy" : "Terms of Use"}</h2>
        <p>
          {privacy
            ? "The deployed application should explain what user information and uploaded data it collects, how that data is used, stored, protected and deleted."
            : "Users should only upload data they are authorized to use. The final terms should explain account responsibilities, acceptable use and service limitations."}
        </p>
        <div className="notice">
          Draft text only. Review and finalize this policy before public release.
        </div>
      </div>
    </>
  );
}

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
  const [datasets, setDatasets] = useState([]);
  const [dashboards, setDashboards] = useState(() => {
    try { return JSON.parse(localStorage.getItem("databoard_saved_dashboards") || "[]"); }
    catch { return []; }
  });
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
