import "./Metrics.css";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChartNoAxesCombined,
  Plus,
  X,
  Pencil,
  Trash2,
  Database,
  AlertCircle
} from "lucide-react";
import { DatasetContext } from "../context/DatasetContext";
import "./Metrics.css";

const OPERATIONS = ["SUM", "COUNT", "AVERAGE", "MIN", "MAX"];

function getMetricResult(dataset, column, operation) {
  if (!dataset || !column) return null;

  const columnIndex = dataset.headers.indexOf(column);
  if (columnIndex === -1) return null;

  const values = dataset.rows
    .map(row => Array.isArray(row) ? row[columnIndex] : row?.[column])
    .map(value => String(value ?? "").trim())
    .filter(value => value !== "");

  if (operation === "COUNT") {
    return values.length;
  }

  const numbers = values
    .map(Number)
    .filter(value => Number.isFinite(value));

  if (numbers.length === 0) return null;

  switch (operation) {
    case "SUM":
      return numbers.reduce((total, value) => total + value, 0);
    case "AVERAGE":
      return numbers.reduce((total, value) => total + value, 0) / numbers.length;
    case "MIN":
      return Math.min(...numbers);
    case "MAX":
      return Math.max(...numbers);
    default:
      return null;
  }
}

function formatMetricResult(value) {
  if (value === null || value === undefined) return "No numeric values";
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2
  });
}

export default function Metrics() {
  const { datasets, metrics, setMetrics } = useContext(DatasetContext);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [column, setColumn] = useState("");
  const [operation, setOperation] = useState("SUM");
  const [error, setError] = useState("");

  const selectedDataset = datasets.find(item => item.id === datasetId);
  const numericColumns = selectedDataset
    ? selectedDataset.headers.filter((header, index) => {
        const values = selectedDataset.rows
          .map(row => Array.isArray(row) ? row[index] : row?.[header])
          .map(value => String(value ?? "").trim())
          .filter(value => value !== "");

        return values.length > 0 &&
          values.every(value => Number.isFinite(Number(value)));
      })
    : [];

  function resetForm() {
    setFormOpen(false);
    setEditingId(null);
    setName("");
    setDatasetId("");
    setColumn("");
    setOperation("SUM");
    setError("");
  }

  function openCreateForm() {
    setEditingId(null);
    setName("");
    setDatasetId(datasets[0]?.id || "");
    setColumn(datasets[0]?.headers?.[0] || "");
    setOperation("SUM");
    setError("");
    setFormOpen(true);
  }

  function openEditForm(metric) {
    setEditingId(metric.id);
    setName(metric.name);
    setDatasetId(metric.datasetId);
    setColumn(metric.column);
    setOperation(metric.operation);
    setError("");
    setFormOpen(true);
  }

  function handleDatasetChange(nextDatasetId) {
    const nextDataset = datasets.find(item => item.id === nextDatasetId);
    setDatasetId(nextDatasetId);
    setColumn(nextDataset?.headers?.[0] || "");
  }

  function saveMetric(event) {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const dataset = datasets.find(item => item.id === datasetId);

    if (!cleanName) {
      setError("Enter a name for this metric.");
      return;
    }

    if (!dataset) {
      setError("Select a valid dataset.");
      return;
    }

    if (!column || !dataset.headers.includes(column)) {
      setError("Select a valid column.");
      return;
    }

    if (operation !== "COUNT" && !numericColumns.includes(column)) {
      setError(`${operation} requires a numeric column. Select a numeric column or choose COUNT.`);
      return;
    }

    const duplicate = metrics.some(metric =>
      metric.id !== editingId &&
      metric.name.trim().toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      setError("A metric with this name already exists.");
      return;
    }

    const now = new Date().toISOString();

    const record = {
      id: editingId || `${Date.now()}-${Math.random()}`,
      name: cleanName,
      datasetId,
      column,
      operation,
      createdAt: editingId
        ? metrics.find(metric => metric.id === editingId)?.createdAt || now
        : now,
      updatedAt: now
    };

    setMetrics(previous =>
      editingId
        ? previous.map(metric => metric.id === editingId ? record : metric)
        : [record, ...previous]
    );

    resetForm();
  }

  function deleteMetric(id) {
    if (window.confirm("Delete this metric? This cannot be undone.")) {
      setMetrics(previous => previous.filter(metric => metric.id !== id));
    }
  }

  return (
    <div className="metrics-page">
      <div className="page-heading">
  <div>
    <h1>Metrics</h1>
    <p>Define calculations using your uploaded datasets.</p>
  </div>
  <button className="metrics-add-button" onClick={openCreateForm}>
    <Plus size={17} />
    Create metric
  </button>
</div>

      <div className="metrics-notice">
        <AlertCircle size={18} />
        <span>
          Metrics are currently calculated in your browser using uploaded CSV
          data. They are not yet connected to the backend.
        </span>
      </div>

      {formOpen && (
        <section className="metrics-form-card">
          <div className="metrics-form-heading">
            <h3>{editingId ? "Edit metric" : "Create a metric"}</h3>
            <button
              type="button"
              className="metrics-form-close"
              onClick={resetForm}
              aria-label="Close metric form"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={saveMetric}>
            <div className="metrics-form-grid">
              <label className="metrics-field metrics-field-full">
                Metric name
                <input
                  type="text"
                  placeholder="Example: Total Revenue"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  maxLength={60}
                  required
                />
              </label>

              <label className="metrics-field">
                Dataset
                <select
                  value={datasetId}
                  onChange={event => handleDatasetChange(event.target.value)}
                  required
                >
                  <option value="">Select dataset</option>
                  {datasets.map(dataset => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="metrics-field">
                Calculation
                <select
                  value={operation}
                  onChange={event => setOperation(event.target.value)}
                >
                  {OPERATIONS.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <small>
                  COUNT counts non-empty cells. Other calculations require numeric values.
                </small>
              </label>

              <label className="metrics-field metrics-field-full">
                Column
                <select
                  value={column}
                  onChange={event => setColumn(event.target.value)}
                  required
                  disabled={!selectedDataset}
                >
                  <option value="">Select column</option>
                  {selectedDataset?.headers.map((header, index) => (
                    <option key={`${header}-${index}`} value={header}>
                      {header}
                      {numericColumns.includes(header) ? " (numeric)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error && (
              <div className="metrics-form-error" role="alert">
                {error}
              </div>
            )}

            <div className="metrics-form-actions">
              <button
                type="button"
                className="metrics-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button type="submit" className="metrics-save-button">
                {editingId ? "Save changes" : "Save metric"}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="metrics-toolbar">
        <div>
          <h2>Your metrics</h2>
          <p>{metrics.length} saved metric(s)</p>
        </div>
        <span className="metrics-count">Calculated from current dataset rows</span>
      </div>

      {datasets.length === 0 ? (
        <div className="metrics-empty">
          <Database size={32} />
          <h3>Upload a dataset first</h3>
          <p>
            Upload a CSV dataset before creating metrics. Your calculations
            will use the columns in that dataset.
          </p>
          <Link to="/datasets">Go to datasets</Link>
        </div>
      ) : metrics.length === 0 ? (
        <div className="metrics-empty">
          <ChartNoAxesCombined size={32} />
          <h3>No metrics created</h3>
          <p>Create your first metric to calculate values from an uploaded dataset.</p>
          <a href="#create-metric" onClick={event => {
            event.preventDefault();
            openCreateForm();
          }}>
            Create your first metric
          </a>
        </div>
      ) : (
        <div className="metrics-table-wrap">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Dataset</th>
                <th>Column</th>
                <th>Calculation</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(metric => {
                const dataset = datasets.find(item => item.id === metric.datasetId);
                const result = getMetricResult(dataset, metric.column, metric.operation);

                return (
                  <tr key={metric.id}>
                    <td className="metrics-name-cell">
                      <strong>{metric.name}</strong>
                      <small>
                        Updated {new Date(metric.updatedAt || metric.createdAt).toLocaleDateString()}
                      </small>
                    </td>
                    <td>{dataset?.name || "Dataset unavailable"}</td>
                    <td>{metric.column}</td>
                    <td><span className="metrics-operation">{metric.operation}</span></td>
                    <td className="metrics-result">{formatMetricResult(result)}</td>
                    <td>
                      <div className="metrics-row-actions">
                        <button
                          type="button"
                          title="Edit metric"
                          aria-label={`Edit ${metric.name}`}
                          onClick={() => openEditForm(metric)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="metrics-delete"
                          title="Delete metric"
                          aria-label={`Delete ${metric.name}`}
                          onClick={() => deleteMetric(metric.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
