import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Plus,
  X,
  Database,
  ChartNoAxesCombined,
  CheckCircle2,
  AlertCircle,
  PanelsTopLeft,
} from "lucide-react";
import { DatasetContext } from "../context/DatasetContext";
import { PageHeading, EmptyState } from "../components/Navigation";

function getNumericColumns(dataset) {
  if (!dataset) return [];
  return dataset.headers.filter((header, columnIndex) => {
    const values = dataset.rows
      .map((row) => rowValue(dataset, row, columnIndex))
      .filter(
        (raw) => String(raw ?? "").trim() !== "" && Number.isFinite(Number(raw))
      );
    return (
      values.length > 0 &&
      values.length >= Math.ceil(dataset.rows.length * 0.5)
    );
  });
}

function rowValue(dataset, row, columnIndex) {
  return Array.isArray(row)
    ? row[columnIndex]
    : row?.[dataset.headers[columnIndex]];
}

function chartPoints(dataset, xColumn, yColumn, type) {
  if (!dataset || !xColumn) return [];
  const xIndex = dataset.headers.indexOf(xColumn);
  const yIndex = dataset.headers.indexOf(yColumn);

  if (type === "Pie chart" && yIndex < 0) {
    const counts = new Map();
    dataset.rows.forEach((row) => {
      const label = String(rowValue(dataset, row, xIndex) ?? "(blank)");
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return [...counts.entries()].map(([label, value]) => ({ label, value }));
  }

  if (xIndex < 0 || yIndex < 0) return [];

  if (type === "Pie chart") {
    const totals = new Map();
    dataset.rows.forEach((row) => {
      const label = String(rowValue(dataset, row, xIndex) ?? "(blank)");
      const value = Number(rowValue(dataset, row, yIndex));
      if (Number.isFinite(value))
        totals.set(label, (totals.get(label) || 0) + value);
    });
    return [...totals.entries()]
      .map(([label, value]) => ({ label, value }))
      .filter((item) => item.value >= 0);
  }

  return dataset.rows
    .map((row, index) => ({
      label: String(rowValue(dataset, row, xIndex) ?? `Row ${index + 1}`),
      value: Number(rowValue(dataset, row, yIndex)),
    }))
    .filter((item) => Number.isFinite(item.value))
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
            <tr>
              {dataset.headers.map((header, index) => (
                <th key={`${header}-${index}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.rows.slice(0, 8).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {dataset.headers.map((header, columnIndex) => (
                  <td key={`${header}-${columnIndex}`}>
                    {String(rowValue(dataset, row, columnIndex) ?? "") || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="chart-footnote">
          Showing {Math.min(8, dataset.rows.length)} of{" "}
          {dataset.rows.length.toLocaleString()} rows.
        </p>
      </div>
    );
  }

  const points = chartPoints(
    dataset,
    widget.xColumn,
    widget.yColumn,
    widget.name
  );
  if (
    !widget.xColumn ||
    (widget.name !== "Pie chart" && !widget.yColumn) ||
    points.length === 0
  ) {
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
      return (
        <div className="widget-placeholder">
          <strong>No positive values to chart</strong>
          <p>
            Choose a column with positive numeric values or use category counts.
          </p>
        </div>
      );
    }
    const colors = [
      "#2563eb",
      "#0f766e",
      "#d97706",
      "#64748b",
      "#0891b2",
      "#4f46e5",
      "#65a30d",
      "#c2410c",
    ];
    let offset = 0;
    const segments = points.slice(0, 8).map((point, index) => {
      const fraction = point.value / total;
      const segment = {
        ...point,
        fraction,
        offset,
        color: colors[index % colors.length],
      };
      offset += fraction;
      return segment;
    });
    return (
      <div className="pie-preview-layout">
        <svg
          viewBox="0 0 220 220"
          role="img"
          aria-label="Pie chart of selected dataset"
        >
          {segments.map((segment, index) => (
            <circle
              key={`${segment.label}-${index}`}
              cx="110"
              cy="110"
              r="78"
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
  const values = points.map((point) => point.value);
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  const range = maxValue - minValue || 1;
  const xAt = (index) =>
    padding.left +
    (points.length === 1
      ? (width - padding.left - padding.right) / 2
      : (index * (width - padding.left - padding.right)) / (points.length - 1));
  const yAt = (value) =>
    padding.top +
    ((maxValue - value) * (height - padding.top - padding.bottom)) / range;
  const barWidth = Math.max(
    5,
    Math.min(
      28,
      ((width - padding.left - padding.right) / points.length) * 0.58
    )
  );
  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${xAt(index)} ${yAt(point.value)}`
    )
    .join(" ");

  return (
    <div className="chart-svg-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${widget.name} preview`}
      >
        {[0, 1, 2, 3].map((index) => {
          const y =
            padding.top + (index * (height - padding.top - padding.bottom)) / 3;
          const value = maxValue - (index * range) / 3;
          return (
            <g key={index}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#e7edf5"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#7b8798"
              >
                {value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </text>
            </g>
          );
        })}
        {widget.name === "Bar chart" ? (
          points.map((point, index) => {
            const valueY = yAt(point.value);
            const zeroY = yAt(0);
            const y = Math.min(valueY, zeroY);
            return (
              <rect
                key={index}
                x={xAt(index) - barWidth / 2}
                y={y}
                width={barWidth}
                height={Math.max(1, Math.abs(zeroY - valueY))}
                rx="2"
                fill="#2563eb"
              >
                <title>
                  {point.label}: {point.value}
                </title>
              </rect>
            );
          })
        ) : (
          <>
            <path
              d={linePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point, index) => (
              <circle
                key={index}
                cx={xAt(index)}
                cy={yAt(point.value)}
                r="3.5"
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth="2"
              >
                <title>
                  {point.label}: {point.value}
                </title>
              </circle>
            ))}
          </>
        )}
        {points
          .filter(
            (_, index) =>
              points.length <= 10 ||
              index % Math.ceil(points.length / 10) === 0
          )
          .map((point) => {
            const index = points.indexOf(point);
            return (
              <text
                key={index}
                x={xAt(index)}
                y={height - 13}
                textAnchor="middle"
                fontSize="10"
                fill="#718096"
              >
                {point.label.length > 11
                  ? `${point.label.slice(0, 10)}…`
                  : point.label}
              </text>
            );
          })}
      </svg>
      <p className="chart-footnote">
        Based on {points.length} rows with numeric values.
      </p>
    </div>
  );
}

export default function Builder() {
  const { datasets, dashboards, setDashboards } = useContext(DatasetContext);
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const existingDashboard = dashboardId
    ? dashboards.find((item) => item.id === dashboardId)
    : null;
  const [title, setTitle] = useState(
    existingDashboard?.name || "Untitled dashboard"
  );
  const [widgets, setWidgets] = useState(existingDashboard?.widgets || []);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (dashboardId) {
      const saved = dashboards.find((item) => item.id === dashboardId);
      if (saved) {
        setTitle(saved.name);
        setWidgets(saved.widgets || []);
      }
    } else {
      setTitle("Untitled dashboard");
      setWidgets([]);
    }
    setSaveMessage("");
    setSaveError("");
  }, [dashboardId, dashboards]);

  const components = [
    { name: "Bar chart", icon: BarChart3 },
    { name: "Line chart", icon: LineChart },
    { name: "Pie chart", icon: PieChart },
    { name: "Data table", icon: Table2 },
  ];

  function addWidget(name) {
    const firstDataset = datasets[0];
    const numericColumns = getNumericColumns(firstDataset);
    const firstTextColumn = firstDataset?.headers?.find(
      (header) => !numericColumns.includes(header)
    );
    setWidgets((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        name,
        datasetId: firstDataset?.id || "",
        xColumn: firstTextColumn || firstDataset?.headers?.[0] || "",
        yColumn: numericColumns[0] || "",
      },
    ]);
    setSaveMessage("");
  }

  function updateWidget(id, changes) {
    setWidgets((previous) =>
      previous.map((widget) =>
        widget.id === id ? { ...widget, ...changes } : widget
      )
    );
    setSaveMessage("");
  }

  function removeWidget(id) {
    setWidgets((previous) => previous.filter((item) => item.id !== id));
    setSaveMessage("");
  }

  function saveDashboard() {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setSaveError("Enter a dashboard name before saving.");
      setSaveMessage("");
      return;
    }
    if (widgets.length === 0) {
      setSaveError("Add at least one component before saving.");
      setSaveMessage("");
      return;
    }
    const now = new Date().toISOString();
    const record = {
      id: dashboardId || `${Date.now()}`,
      name: cleanTitle,
      widgets,
      createdAt: existingDashboard?.createdAt || now,
      updatedAt: now,
    };
    setDashboards((previous) =>
      dashboardId
        ? previous.map((item) => (item.id === dashboardId ? record : item))
        : [record, ...previous]
    );
    setSaveError("");
    setSaveMessage("Dashboard saved successfully.");
    if (!dashboardId) navigate(`/builder/${record.id}`, { replace: true });
  }

  return (
    <>
      <PageHeading
        title="Dashboard Builder"
        description="Design charts and tables using your uploaded CSV datasets."
        action={
          <button className="primary-button" onClick={saveDashboard}>
            <span>Save dashboard</span>
          </button>
        }
      />
      {saveError && (
        <div className="ds-error" role="alert">
          <AlertCircle size={17} />
          {saveError}
        </div>
      )}
      {saveMessage && (
        <div className="save-success" role="status">
          <CheckCircle2 size={17} />
          {saveMessage}
        </div>
      )}
      <div className="builder">
        <aside className="builder-sidebar">
          <h3>Components</h3>
          <p>Click a component to add it to your dashboard.</p>
          {components.map(({ name, icon: Icon }) => (
            <button
              className="builder-component"
              key={name}
              onClick={() => addWidget(name)}
            >
              <Icon size={18} />
              {name}
              <Plus size={15} />
            </button>
          ))}
          {datasets.length === 0 && (
            <p className="builder-help">
              Upload a CSV file on the Datasets page before adding charts.
            </p>
          )}
        </aside>
        <section className="builder-canvas">
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setSaveMessage("");
            }}
            aria-label="Dashboard title"
          />
          {widgets.length === 0 ? (
            <EmptyState
              icon={PanelsTopLeft}
              title="Your dashboard is empty"
              description="Choose a component from the left panel to start building."
            />
          ) : (
            <div className="widget-grid">
              {widgets.map((widget) => {
                const Component =
                  components.find((item) => item.name === widget.name)?.icon ||
                  Table2;
                const dataset = datasets.find(
                  (item) => item.id === widget.datasetId
                );
                const numericColumns = getNumericColumns(dataset);
                const isTable = widget.name === "Data table";
                const isPie = widget.name === "Pie chart";
                return (
                  <div className="dashboard-widget" key={widget.id}>
                    <div className="widget-header">
                      <div>
                        <Component size={18} />
                        <strong>{widget.name}</strong>
                      </div>
                      <button
                        onClick={() => removeWidget(widget.id)}
                        aria-label={`Remove ${widget.name}`}
                        className="remove-widget"
                      >
                        <X size={17} />
                      </button>
                    </div>
                    <div className="widget-config">
                      <label>
                        Dataset
                        <select
                          value={widget.datasetId}
                          onChange={(event) => {
                            const nextDataset = datasets.find(
                              (item) => item.id === event.target.value
                            );
                            const nextNumeric = getNumericColumns(nextDataset);
                            const nextText = nextDataset?.headers?.find(
                              (header) => !nextNumeric.includes(header)
                            );
                            updateWidget(widget.id, {
                              datasetId: event.target.value,
                              xColumn:
                                nextText || nextDataset?.headers?.[0] || "",
                              yColumn: nextNumeric[0] || "",
                            });
                          }}
                        >
                          <option value="">Select dataset</option>
                          {datasets.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      {dataset && !isTable && (
                        <div className="widget-axis-controls">
                          <label>
                            {isPie ? "Category" : "X-axis"}
                            <select
                              value={widget.xColumn}
                              onChange={(event) =>
                                updateWidget(widget.id, {
                                  xColumn: event.target.value,
                                })
                              }
                            >
                              <option value="">Select column</option>
                              {dataset.headers.map((header, index) => (
                                <option
                                  key={`${header}-${index}`}
                                  value={header}
                                >
                                  {header}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            {isPie ? "Values (optional)" : "Y-axis"}
                            <select
                              value={widget.yColumn}
                              onChange={(event) =>
                                updateWidget(widget.id, {
                                  yColumn: event.target.value,
                                })
                              }
                            >
                              <option value="">
                                {isPie
                                  ? "Count categories"
                                  : "Select numeric column"}
                              </option>
                              {numericColumns.map((header) => (
                                <option key={header} value={header}>
                                  {header}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      )}
                    </div>
                    <ChartPreview widget={widget} dataset={dataset} />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
