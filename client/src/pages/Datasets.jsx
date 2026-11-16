
import { useRef, useState } from "react";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  Search,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
  Eye,
} from "lucide-react";
import "./Datasets.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const PREVIEW_ROWS = 8;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Datasets() {
  const inputRef = useRef(null);
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  function processFile(file) {
    setError("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. The maximum allowed size is 10 MB.");
      return;
    }

    if (file.size === 0) {
      setError("This file is empty. Please choose another CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data || [];

        if (results.errors.length > 0) {
          setError(
            `Could not read the CSV completely: ${results.errors[0].message}`
          );
          return;
        }

        if (headers.length === 0 || headers.every((header) => !header)) {
          setError("The CSV file must contain column headers in its first row.");
          return;
        }

        if (rows.length === 0) {
          setError("No data rows were found in this CSV file.");
          return;
        }

        const dataset = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.csv$/i, ""),
          fileName: file.name,
          size: file.size,
          headers,
          rows,
          uploadedAt: new Date().toLocaleString(),
        };

        setDatasets((previous) => [dataset, ...previous]);
        setSelectedDataset(dataset);
      },
      error: () => {
        setError("Unable to read this file. Please try another CSV file.");
      },
    });
  }

  function handleInputChange(event) {
    const file = event.target.files?.[0];
    processFile(file);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  }

  function deleteDataset(id) {
    setDatasets((previous) => previous.filter((item) => item.id !== id));

    if (selectedDataset?.id === id) {
      setSelectedDataset(null);
    }
  }

  const filteredDatasets = datasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeDataset = datasets.find(
    (dataset) => dataset.id === selectedDataset?.id
  );

  return (
    <div className="datasets-page">
      <div className="datasets-heading">
        <div>
          <h1>Datasets</h1>
          <p>Upload, preview and manage your CSV data sources.</p>
        </div>

        <button
          className="ds-upload-button"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={16} />
          Upload CSV
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={handleInputChange}
      />

      {error && (
        <div className="ds-error" role="alert">
          <AlertCircle size={17} />
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      <section
        className={`ds-dropzone ${dragging ? "ds-dropzone-active" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setDragging(false);
          }
        }}
        onDrop={handleDrop}
      >
        <div className="ds-upload-icon">
          <Upload size={25} />
        </div>

        <h2>Upload your dataset</h2>
        <p>Drag and drop a CSV file here, or select a file from your computer.</p>

        <button
          className="ds-browse-button"
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </button>

        <span className="ds-file-hint">CSV files only · Maximum size 10 MB</span>
      </section>

      <div className="ds-list-heading">
        <div>
          <h2>Your datasets</h2>
          <p>{datasets.length} uploaded dataset{datasets.length === 1 ? "" : "s"}</p>
        </div>

        <div className="ds-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search datasets..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {filteredDatasets.length === 0 ? (
        <div className="ds-empty">
          <Database size={28} />
          <h3>{datasets.length === 0 ? "No datasets uploaded" : "No matching datasets"}</h3>
          <p>
            {datasets.length === 0
              ? "Upload a CSV file to see its columns and data preview here."
              : "Try another search term."}
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
              {filteredDatasets.map((dataset) => (
                <tr key={dataset.id}>
                  <td>
                    <div className="ds-file-cell">
                      <div className="ds-file-icon">
                        <FileSpreadsheet size={19} />
                      </div>
                      <div>
                        <strong>{dataset.name}</strong>
                        <small>{dataset.fileName}</small>
                      </div>
                    </div>
                  </td>
                  <td>{dataset.rows.length.toLocaleString()}</td>
                  <td>{dataset.headers.length}</td>
                  <td>{formatSize(dataset.size)}</td>
                  <td>
                    <div className="ds-actions">
                      <button
                        onClick={() => setSelectedDataset(dataset)}
                        aria-label={`Preview ${dataset.name}`}
                        title="Preview dataset"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        className="ds-delete"
                        onClick={() => deleteDataset(dataset.id)}
                        aria-label={`Delete ${dataset.name}`}
                        title="Delete dataset"
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

      {activeDataset && (
        <section className="ds-preview">
          <div className="ds-preview-heading">
            <div>
              <div className="ds-preview-title">
                <FileSpreadsheet size={19} />
                <h2>{activeDataset.name}</h2>
                <span className="ds-loaded">
                  <CheckCircle2 size={13} />
                  Loaded
                </span>
              </div>
              <p>
                Showing up to {Math.min(PREVIEW_ROWS, activeDataset.rows.length)} of{" "}
                {activeDataset.rows.length.toLocaleString()} rows
              </p>
            </div>

            <button
              className="ds-close-preview"
              onClick={() => setSelectedDataset(null)}
              aria-label="Close preview"
            >
              <X size={19} />
            </button>
          </div>

          <div className="ds-preview-table-wrap">
            <table className="ds-preview-table">
              <thead>
                <tr>
                  <th>#</th>
                  {activeDataset.headers.map((header, index) => (
                    <th key={`${header}-${index}`}>{header || `Column ${index + 1}`}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {activeDataset.rows.slice(0, PREVIEW_ROWS).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{rowIndex + 1}</td>
                    {activeDataset.headers.map((header, columnIndex) => (
                      <td key={`${header}-${columnIndex}`}>
                        {String(row[header] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ds-preview-footer">
            <span>{activeDataset.headers.length} columns</span>
            <span>{activeDataset.rows.length.toLocaleString()} rows</span>
            <span>{formatSize(activeDataset.size)}</span>
          </div>
        </section>
      )}
    </div>
  );
}
