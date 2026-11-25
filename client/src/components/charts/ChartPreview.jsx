
import React from "react";
import { Database, ChartNoAxesCombined } from "lucide-react";

import { rowValue, chartPoints } from "../../utils/chartHelpers";

export default function ChartPreview({ widget, dataset }) {
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
      "#c2410c"
    ];

    let offset = 0;

    const segments = points.slice(0, 8).map((point, index) => {
      const fraction = point.value / total;
      const segment = {
        ...point,
        fraction,
        offset,
        color: colors[index % colors.length]
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
              strokeDasharray={`${segment.fraction * 490.09} 490.09`}
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
              <strong>
                {((segment.value / total) * 100).toFixed(1)}%
              </strong>
            </div>
          ))}

          {points.length > 8 && (
            <small>Showing the first 8 categories.</small>
          )}
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

  const xAt = index =>
    padding.left +
    (points.length === 1
      ? (width - padding.left - padding.right) / 2
      : (index * (width - padding.left - padding.right)) /
        (points.length - 1));

  const yAt = value =>
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
        {[0, 1, 2, 3].map(index => {
          const y =
            padding.top +
            (index * (height - padding.top - padding.bottom)) / 3;

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
                {value.toLocaleString(undefined, {
                  maximumFractionDigits: 1
                })}
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
          .map(point => {
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
