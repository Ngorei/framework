// Fungsi untuk membuat form
export function downloadRaw(turvarID_) {
  function convertToCSV(header, data) {
    const headerRow = header.length > 0 ? header.join(",") : "";
    const dataRows = data.map((row) => {
      if (Array.isArray(row)) {
        return row.join(",");
      } else if (typeof row === "object") {
        return Object.values(row).join(",");
      } else {
        return row.toString();
      }
    });
    return headerRow
      ? [headerRow, ...dataRows].join("\n")
      : dataRows.join("\n");
  }

  function convertToJSON(header, data) {
    if (header.length === 0) {
      return JSON.stringify(data, null, 2);
    }
    return JSON.stringify(
      data.map((row) => {
        const obj = {};
        header.forEach((key, index) => {
          obj[key] = Array.isArray(row) ? row[index] : row[key];
        });
        return obj;
      }),
      null,
      2
    );
  }

  function convertToXLSX(header, data) {
    const wb = XLSX.utils.book_new();
    
    // Pastikan data adalah array of arrays
    const formattedData = data.map(row => {
      if (Array.isArray(row)) {
        return row;
      } else if (typeof row === 'object') {
        return Object.values(row);
      } else {
        return [row]; // Jika bukan array atau objek, bungkus dalam array
      }
    });

    const ws = XLSX.utils.aoa_to_sheet(
      header.length > 0 ? [header, ...formattedData] : formattedData
    );
    
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    return XLSX.write(wb, { bookType: "xlsx", type: "array" });
  }

  function convertToPDF(title, header, data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    doc.autoTable({
      startY: 20,
      head: header.length > 0 ? [header] : null,
      body: data,
    });
    doc.save(`${title}.pdf`);
  }

  function createDownloadLink(data = turvarID_, format, filename) {
    let content, blob, mimeType;
    const title = data.title || "Data";
    const header = data.header || [];
    const dataRows = Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

    switch (format) {
      case "csv":
        content = convertToCSV(header, dataRows);
        mimeType = "text/csv;charset=utf-8;";
        break;
      case "json":
        content = convertToJSON(header, dataRows);
        mimeType = "application/json";
        break;
      case "xlsx":
        content = convertToXLSX(header, dataRows);
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      case "pdf":
        convertToPDF(title, header, dataRows);
        return; // PDF sudah ditangani, keluar dari fungsi
      default:
        console.error("Format tidak didukung");
        return;
    }

    blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename || title}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  // Event listener
  ["XLSX", "PDF", "CSV", "JSON"].forEach((format) => {
    const element = document.getElementById(format);
    if (element) {
      element.addEventListener("click", () => createDownloadLink(turvarID_, format.toLowerCase()));
    } else {
      console.warn(`Elemen dengan id '${format}' tidak ditemukan.`);
    }
  });
}
