
export function rowValue(dataset, row, columnIndex) {
  return Array.isArray(row)
    ? row[columnIndex]
    : row?.[dataset.headers[columnIndex]];
}

export function getNumericColumns(dataset) {
  if (!dataset) return [];

  return dataset.headers.filter((header, columnIndex) => {
    const values = dataset.rows
      .map(row => rowValue(dataset, row, columnIndex))
      .filter(raw =>
        String(raw ?? "").trim() !== "" &&
        Number.isFinite(Number(raw))
      );

    return (
      values.length > 0 &&
      values.length >= Math.ceil(dataset.rows.length * 0.5)
    );
  });
}

export function chartPoints(dataset, xColumn, yColumn, type) {
  if (!dataset || !xColumn) return [];

  const xIndex = dataset.headers.indexOf(xColumn);
  const yIndex = dataset.headers.indexOf(yColumn);

  if (type === "Pie chart" && yIndex < 0) {
    const counts = new Map();

    dataset.rows.forEach(row => {
      const label = String(rowValue(dataset, row, xIndex) ?? "(blank)");
      counts.set(label, (counts.get(label) || 0) + 1);
    });

    return [...counts.entries()].map(([label, value]) => ({
      label,
      value
    }));
  }

  if (xIndex < 0 || yIndex < 0) return [];

  if (type === "Pie chart") {
    const totals = new Map();

    dataset.rows.forEach(row => {
      const label = String(rowValue(dataset, row, xIndex) ?? "(blank)");
      const value = Number(rowValue(dataset, row, yIndex));

      if (Number.isFinite(value)) {
        totals.set(label, (totals.get(label) || 0) + value);
      }
    });

    return [...totals.entries()]
      .map(([label, value]) => ({ label, value }))
      .filter(item => item.value >= 0);
  }

  return dataset.rows
    .map((row, index) => ({
      label: String(rowValue(dataset, row, xIndex) ?? `Row ${index + 1}`),
      value: Number(rowValue(dataset, row, yIndex))
    }))
    .filter(item => Number.isFinite(item.value))
    .slice(0, 40);
}
