
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PanelsTopLeft,
  Plus,
  X,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { DatasetContext } from "../context/DatasetContext";
import PageHeading from "../components/layout/PageHeading";
import EmptyState from "../components/layout/EmptyState";
import ChartPreview from "../components/charts/ChartPreview";
import { getNumericColumns } from "../utils/chartHelpers";

function Builder() {
  const { datasets, dashboards, setDashboards } = useContext(DatasetContext);
  const { dashboardId } = useParams();
  const navigate = useNavigate();

  const existingDashboard = dashboardId
    ? dashboards.find(item => item.id === dashboardId)
    : null;

  const [title, setTitle] = useState(existingDashboard?.name || "Untitled dashboard");
  const [widgets, setWidgets] = useState(existingDashboard?.widgets || []);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (dashboardId) {
      const saved = dashboards.find(item => item.id === dashboardId);
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
    const firstTextColumn = firstDataset?.headers?.find(
      header => !numericColumns.includes(header)
    );

    setWidgets(previous => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        name,
        datasetId: firstDataset?.id || "",
        xColumn: firstTextColumn || firstDataset?.headers?.[0] || "",
        yColumn: numericColumns[0] || ""
      }
    ]);

    setSaveMessage("");
  }

  function updateWidget(id, changes) {
    setWidgets(previous =>
      previous.map(widget =>
        widget.id === id ? { ...widget, ...changes } : widget
      )
    );
    setSaveMessage("");
  }

  function removeWidget(id) {
    setWidgets(previous => previous.filter(item => item.id !== id));
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
      updatedAt: now
    };

    setDashboards(previous => [
      record,
      ...previous.filter(item => item.id !== record.id)
    ]);

    setSaveError("");
    setSaveMessage("Dashboard saved successfully.");

    if (!dashboardId) {
      navigate(`/builder/${record.id}`, { replace: true });
    }
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
            onChange={event => {
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
              {widgets.map(widget => {
                const Component =
                  components.find(item => item.name === widget.name)?.icon || Table2;

                const dataset = datasets.find(
                  item => item.id === widget.datasetId
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
                          onChange={event => {
                            const nextDataset = datasets.find(
                              item => item.id === event.target.value
                            );

                            const nextNumeric = getNumericColumns(nextDataset);
                            const nextText = nextDataset?.headers?.find(
                              header => !nextNumeric.includes(header)
                            );

                            updateWidget(widget.id, {
                              datasetId: event.target.value,
                              xColumn: nextText || nextDataset?.headers?.[0] || "",
                              yColumn: nextNumeric[0] || ""
                            });
                          }}
                        >
                          <option value="">Select dataset</option>
                          {datasets.map(item => (
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
                              onChange={event =>
                                updateWidget(widget.id, {
                                  xColumn: event.target.value
                                })
                              }
                            >
                              <option value="">Select column</option>
                              {dataset.headers.map((header, index) => (
                                <option key={`${header}-${index}`} value={header}>
                                  {header}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            {isPie ? "Values (optional)" : "Y-axis"}
                            <select
                              value={widget.yColumn}
                              onChange={event =>
                                updateWidget(widget.id, {
                                  yColumn: event.target.value
                                })
                              }
                            >
                              <option value="">
                                {isPie ? "Count categories" : "Select numeric column"}
                              </option>
                              {numericColumns.map(header => (
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

export default Builder;
