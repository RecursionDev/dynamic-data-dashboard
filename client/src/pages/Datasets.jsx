
import React, { useContext, useRef, useState } from "react";
import {
  Upload,
  UploadCloud,
  Search,
  Database,
  FileSpreadsheet,
  FileText,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Download
} from "lucide-react";
import ExcelJS from "exceljs";

import { DatasetContext } from "../context/DatasetContext";
import PageHeading from "../components/layout/PageHeading";
import EmptyState from "../components/layout/EmptyState";
import parseCSV from "../utils/csvParser";
import "./Datasets.css";

export default function Datasets() {
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

    function downloadFile(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function getExportName(extension) {
    const baseName = selectedDataset.name.replace(/\.[^/.]+$/, "");
    return `${baseName}.${extension}`;
  }

  function exportCSV() {
    const allRows = [
      selectedDataset.headers,
      ...selectedDataset.rows
    ];

    const csvContent = allRows
      .map(row =>
        row.map(cell =>
          `"${String(cell ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    downloadFile(blob, getExportName("csv"));
  }

  async function exportExcel() {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Dataset");

      worksheet.columns = selectedDataset.headers.map((header, index) => ({
        key: `column${index + 1}`,
        width: Math.min(Math.max(String(header).length + 4, 12), 30)
      }));

      worksheet.addRow(selectedDataset.headers);

      selectedDataset.rows.forEach(row => {
        worksheet.addRow(row);
      });

      worksheet.getRow(1).font = { bold: true };
      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      downloadFile(blob, getExportName("xlsx"));
    } catch (err) {
      setError("Unable to export Excel file. Please try again.");
      console.error("Excel export error:", err);
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

            <div className="ds-export-actions">
              <button onClick={exportCSV} title="Export as CSV">
                <Download size={15} />
                CSV
              </button>

              <button onClick={exportExcel} title="Export as Excel">
                <FileSpreadsheet size={15} />
                Excel
              </button>

              <button
                className="ds-close-preview"
                onClick={() => setSelectedDataset(null)}
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </div>
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
