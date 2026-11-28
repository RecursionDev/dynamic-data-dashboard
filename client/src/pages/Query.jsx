
import React, { useContext, useMemo, useState } from "react";
import { DatasetContext } from "../context/DatasetContext";
import {
  Code,
  Play,
  Database,
  Table2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import "./Query.css";

export default function Query() {
  const { datasets = [] } = useContext(DatasetContext);

  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("*");
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const dataset = datasets.find(
    (item) => String(item.id) === selectedDataset
  );

  const columns = useMemo(() => {
    return dataset?.headers || [];
  }, [dataset]);

  const filteredResults = useMemo(() => {
    if (!dataset) return [];

    const rows = Array.isArray(dataset.rows) ? dataset.rows : [];

    return rows.filter((row) => {
      if (!searchText.trim()) return true;

      return Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    });
  }, [dataset, searchText]);


const runQuery = () => {
  if (!dataset) {
    setMessage("Please select a dataset first.");
    setResults([]);
    setHasRun(false);
    return;
  }

  const columnIndex = dataset.headers.indexOf(selectedColumn);

  const output =
    selectedColumn === "*"
      ? filteredResults
      : filteredResults.map((row) => [row[columnIndex]]);

  setResults(output);
  setHasRun(true);
  setMessage(
    `Preview completed successfully. ${output.length} row(s) found.`
  );
};


  return (
    <div className="query-page">
      <div className="query-header">
        <div>
          <h1>Query</h1>
          <p>Explore and filter your uploaded datasets.</p>
        </div>
        <div className="query-icon">
          <Code size={24} />
        </div>
      </div>

      <div className="query-notice">
        <AlertCircle size={18} />
        <span>
          Local preview mode: queries run on uploaded browser data.
          Backend query execution is not connected yet.
        </span>
      </div>

      <div className="query-panel">
        <div className="query-panel-title">
          <Code size={19} />
          <h2>Build a Query</h2>
        </div>

        <div className="query-controls">
          <div className="query-field">
            <label htmlFor="query-dataset">Select Dataset</label>
            <select
              id="query-dataset"
              value={selectedDataset}
              onChange={(event) => {
                setSelectedDataset(event.target.value);
                setSelectedColumn("*");
                setResults([]);
                setHasRun(false);
                setMessage("");
              }}
            >
              <option value="">Choose a dataset</option>
              {datasets.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="query-field">
            <label htmlFor="query-column">Select Column</label>
            <select
              id="query-column"
              value={selectedColumn}
              onChange={(event) => setSelectedColumn(event.target.value)}
              disabled={!dataset}
            >
              <option value="*">All Columns</option>
              {columns.map((column, index) => (
                <option key={`${column}-${index}`} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

          <div className="query-field">
            <label htmlFor="query-search">Search in Dataset</label>
            <input
              id="query-search"
              type="text"
              placeholder="Enter a value to filter rows..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              disabled={!dataset}
            />
          </div>
        </div>

        <button className="run-query-btn" onClick={runQuery}>
          <Play size={17} />
          Run Preview
        </button>
      </div>

      <div className="query-results">
        <div className="query-results-header">
          <div>
            <h2>
              <Table2 size={19} />
              Query Results
            </h2>
            <p>Preview of matching dataset records</p>
          </div>

          {hasRun && (
            <span className="query-result-count">
              {results.length} rows
            </span>
          )}
        </div>

        {message && (
          <div className="query-message">
            {hasRun ? (
              <CheckCircle2 size={17} />
            ) : (
              <AlertCircle size={17} />
            )}
            {message}
          </div>
        )}

        {!datasets.length ? (
          <div className="query-empty">
            <Database size={34} />
            <h3>No datasets available</h3>
            <p>Upload a dataset from the Datasets page to get started.</p>
          </div>
        ) : !hasRun ? (
          <div className="query-empty">
            <Table2 size={34} />
            <h3>No query executed</h3>
            <p>Select a dataset and click Run Preview to see results.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="query-empty">
            <AlertCircle size={34} />
            <h3>No matching records</h3>
            <p>Try changing your search value.</p>
          </div>
        ) : (
          <div className="query-table-wrap">

<table className="query-table">
  <thead>
    <tr>
      {(selectedColumn === "*" ? dataset.headers : [selectedColumn]).map(
        (column, index) => (
          <th key={index}>{column}</th>
        )
      )}
    </tr>
  </thead>

  <tbody>
    {results.map((row, index) => (
      <tr key={index}>
        {row.map((value, cellIndex) => (
          <td key={cellIndex}>
            {String(value ?? "")}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>

          </div>
        )}
      </div>
    </div>
  );
}
