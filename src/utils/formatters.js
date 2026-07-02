export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "data invalida";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

export function padText(value, size) {
  const text = String(value);

  if (text.length >= size) {
    return text.slice(0, size);
  }

  return text + " ".repeat(size - text.length);
}

export function printTitle(title) {
  const line = "=".repeat(title.length + 4);
  console.log(`\n${line}`);
  console.log(`= ${title} =`);
  console.log(line);
}

export function printTable(headers, rows) {
  const widths = headers.map((header, index) => {
    let max = header.length;

    for (const row of rows) {
      const cell = String(row[index] ?? "");

      if (cell.length > max) {
        max = cell.length;
      }
    }

    return Math.min(Math.max(max, 8), 24);
  });

  const headerLine = headers.map((header, index) => padText(header, widths[index])).join(" | ");
  const separator = widths.map((width) => "-".repeat(width)).join("-+-");

  console.log(headerLine);
  console.log(separator);

  for (const row of rows) {
    const line = row.map((cell, index) => padText(cell ?? "", widths[index])).join(" | ");
    console.log(line);
  }
}

export function toSlug(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
