import { toolbar } from "./menubar.js";
import { contextmenu } from "./contextmenu.js";
import { addColumnResizing } from "./addColumnResizing.js";
import { addRowResizing } from "./addRowResizing.js";
import { updateSelectionID } from "./updateSelection.js";


const cellValueCache = new Map();
const cellElements = new Map();
const dependencyGraph = new Map();

let selectedCells = new Set();
let selectionStart = null;
let selectionEnd = null;

export function spreadsheet(attr) {
  let rows = 20;
  let columns =15;
  console.log(attr);
  toolbar(attr);
  contextmenu({
    attr: attr,
    data: false,
    contenteditable: attr.contenteditable,
  });
  // Perbaikan: Tambahkan pengecekan apakah elemen ada
  let rowNumberCont = document.querySelector(".row-number-cont");
  if (rowNumberCont) {
    for (let i = 0; i < rows; i++) {
      let rowNum = document.createElement("div");
      rowNum.innerText = i + 1;
      rowNum.classList.add("row-numbers");
      rowNumberCont.appendChild(rowNum);
    }
  }

  let colLetterCont = document.querySelector(".column-letter-cont");
  if (colLetterCont) {
    for (let i = 0; i < columns; i++) {
      let colLetter = document.createElement("div");
      colLetter.setAttribute("contenteditable", "true");
      colLetter.innerText = String.fromCharCode(i + 65);
      colLetter.classList.add("col-letters");
      colLetterCont.appendChild(colLetter);
    }
  }

  let cellsCont = document.querySelector(".cells-cont");
  if (cellsCont) {
    for (let i = 0; i < rows; i++) {
      let rowCellCont = document.createElement("div");
      rowCellCont.classList.add("row-cell-cont");
      for (let j = 0; j < columns; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("data-row", i);
        cell.setAttribute("data-col", j);
        cell.addEventListener("blur", handleCellChange);
        cell.addEventListener("input", handleCellChange);
        cell.addEventListener("keydown", handleKeyDown);
        // Tambahkan event listener untuk seleksi sel
        cell.addEventListener("mousedown", handleSelectionStart);
        cell.addEventListener("mouseover", handleSelectionMove);
        cell.addEventListener("mouseup", handleSelectionEnd);
        //console.log(`Event listener ditambahkan ke sel ${getCellRef(cell)}`);
        // Tambahkan atribut ARIA untuk aksesibilitas
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-rowindex", i + 1);
        cell.setAttribute("aria-colindex", j + 1);
        rowCellCont.appendChild(cell);
      }
      cellsCont.appendChild(rowCellCont);
    }
  }

  // Tambahkan event listener untuk membersihkan seleksi saat klik di luar sel
  document.addEventListener("mousedown", clearSelection);
   buildDependencyGraph();
   addColumnResizing();
   addRowResizing()
   addMergeCellsButton()

}




function handleCellChange(event) {
  let cell = event.target;
  let oldValue = cell.getAttribute("data-value");
  let newValue = cell.textContent.trim();
  let cellRef = getCellRef(cell);

  console.log(`Perubahan pada sel ${cellRef}: ${oldValue} -> ${newValue}`);

  if (newValue !== oldValue) {
    if (newValue.startsWith("=")) {
      cell.setAttribute("data-value", newValue);
      cell.setAttribute("data-formula", newValue.substring(1));
    } else {
      cell.setAttribute("data-value", newValue);
      cell.removeAttribute("data-formula");
      // Evaluasi ulang sel-sel yang bergantung pada sel ini
      updateDependentCells(cellRef);
    }
  }
}

function handleKeyDown(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Mencegah baris baru ditambahkan
    evaluateFormula({ target: event.target });
    event.target.blur(); // Menghilangkan fokus dari sel
  }
}
function evaluateFormula(event) {
  let cell = event.target;
  let value = cell.textContent.trim();
  let cellRef = getCellRef(cell);
  console.log(`Evaluasi formula untuk sel ${cellRef}:`, value);

  if (value.startsWith("=")) {
    try {
      let formula = value.substring(1).trim();
      console.log("Formula yang akan dievaluasi:", formula);
      if (formula.length === 0) {
        // Formula kosong, biarkan sebagai teks biasa
        cell.setAttribute("data-value", value);
        return;
      }
      if (!validateFormula(formula)) {
        // Formula tidak valid, tampilkan sebagai teks
        cell.setAttribute("data-value", value);
        return;
      }
      cell.setAttribute("data-formula", formula);
      let result = evaluateExpression(formula);
      console.log(`Hasil evaluasi ${cellRef}:`, result);
      cell.textContent = result;
      cell.setAttribute("data-value", result);

      updateDependencies(cell);
      updateDependentCells(cellRef);
    } catch (error) {
      console.error("Error mengevaluasi formula:", error);
      // Biarkan formula yang error tetap ditampilkan
      cell.setAttribute("data-value", value);
    }
  } else {
    console.log(`Memperbarui nilai ${cellRef} menjadi:`, value);
    cell.setAttribute("data-value", value);
    cell.removeAttribute("data-formula");
  }

  clearCellValueCache();
  clearCache();
}

function evaluateExpression(expression) {
  console.log("Ekspresi awal:", expression);

  let cellRegex = /[A-Z]\d+/g;
  let cellReferences = expression.match(cellRegex);

  if (cellReferences) {
    cellReferences.forEach((ref) => {
      let value = getCellValue(ref);
      console.log(`Mengganti ${ref} dengan nilai: ${value}`);
      expression = expression.replace(new RegExp(ref, "g"), value);
    });
  }

  // Tambahkan dukungan untuk fungsi spreadsheet
  expression = expression.replace(
    /SUM\((.*?)\)/g,
    (match, p1) => `sumValues(${p1})`
  );
  expression = expression.replace(
    /AVERAGE\((.*?)\)/g,
    (match, p1) => `averageValues(${p1})`
  );
  expression = expression.replace(
    /MAX\((.*?)\)/g,
    (match, p1) => `maxValues(${p1})`
  );
  expression = expression.replace(
    /MIN\((.*?)\)/g,
    (match, p1) => `minValues(${p1})`
  );

  console.log("Ekspresi setelah substitusi:", expression);
  try {
    let result = eval(expression);
    console.log("Hasil evaluasi:", result);
    return isNaN(result) ? "#ERROR" : result;
  } catch (error) {
    console.error("Error dalam evaluasi:", error);
    return "#ERROR";
  }
}

// Fungsi helper untuk SUM
function sumValues(...args) {
  const values = args
    .flat()
    .map(parseFloat)
    .filter((v) => !isNaN(v));
  return values.reduce((sum, value) => sum + value, 0);
}

// Fungsi helper untuk AVERAGE
function averageValues(...args) {
  const values = args
    .flat()
    .map(parseFloat)
    .filter((v) => !isNaN(v));
  if (values.length === 0) return 0;
  return sumValues(values) / values.length;
}

// Fungsi helper untuk MAX
function maxValues(...args) {
  const values = args
    .flat()
    .map(parseFloat)
    .filter((v) => !isNaN(v));
  return Math.max(...values);
}

// Fungsi helper untuk MIN
function minValues(...args) {
  const values = args
    .flat()
    .map(parseFloat)
    .filter((v) => !isNaN(v));
  return Math.min(...values);
}

function validateFormula(formula) {
  // Izinkan semua karakter kecuali yang jelas-jelas berbahaya
  const invalidChars = /[<>{}]/;
  return !invalidChars.test(formula);
}

function getCellValue(cellRef) {
  let cell = getCellElement(cellRef);
  let value = cell ? cell.getAttribute("data-value") : "0";
  console.log(`Nilai dari ${cellRef}:`, value);
  // Jika nilai adalah formula, evaluasi formulanya
  if (value && value.startsWith("=")) {
    let formula = value.substring(1);
    return evaluateExpression(formula);
  }
  return isNaN(parseFloat(value)) ? value : parseFloat(value);
}

function clearCellValueCache() {
  cellValueCache.clear();
}

function updateDependentCells(changedCellRef) {
  const dependents = dependencyGraph.get(changedCellRef) || new Set();
  console.log(
    `Sel-sel yang bergantung pada ${changedCellRef}:`,
    Array.from(dependents)
  );
  dependents.forEach((cellRef) => {
    const cell = getCellElement(cellRef);
    if (cell) {
      console.log(`Mengevaluasi ulang sel dependen: ${cellRef}`);
      let formula = cell.getAttribute("data-formula");
      if (formula) {
        let result = evaluateExpression(formula);
        cell.textContent = result;
        cell.setAttribute("data-value", result);
        // Rekursif update sel-sel yang bergantung pada sel ini
        updateDependentCells(cellRef);
      }
    } else {
      console.warn(`Sel dependen ${cellRef} tidak ditemukan`);
    }
  });
}

function getCellElement(cellRef) {
  if (!cellElements.has(cellRef)) {
    const [col, row] = parseCellRef(cellRef);
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );
    if (cell) {
      cellElements.set(cellRef, cell);
    } else {
      console.warn(`Sel ${cellRef} tidak ditemukan`);
      return null;
    }
  }
  return cellElements.get(cellRef);
}

// Fungsi untuk menyimpan hasil ke localStorage
function saveToCache(key, value) {
  try {
    localStorage.setItem(`spreadsheet_cache_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error("Error menyimpan ke cache:", error);
  }
}

// Fungsi untuk mengambil hasil dari localStorage
function getFromCache(key) {
  try {
    const value = localStorage.getItem(`spreadsheet_cache_${key}`);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error mengambil dari cache:", error);
    return null;
  }
}

// Fungsi untuk membersihkan cache
function clearCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("spreadsheet_cache_")) {
      localStorage.removeItem(key);
    }
  });
}

function updateDependencies(cell) {
  let cellRef = getCellRef(cell);
  let formula = cell.getAttribute("data-formula");
  if (formula) {
    let cellRegex = /[A-Z]\d+/g;
    let cellReferences = formula.match(cellRegex);
    if (cellReferences) {
      cellReferences.forEach((ref) => {
        if (!dependencyGraph.has(ref)) {
          dependencyGraph.set(ref, new Set());
        }
        dependencyGraph.get(ref).add(cellRef);
      });
    }
  }
}

function parseCellRef(cellRef) {
  const col = cellRef.charAt(0).charCodeAt(0) - 65;
  const row = parseInt(cellRef.substring(1)) - 1;
  return [col, row];
}

function getCellRef(cell) {
  let col = cell.dataset.col;
  let row = parseInt(cell.dataset.row);
  return String.fromCharCode(65 + parseInt(col)) + (row + 1);
}

// Pastikan fungsi ini dipanggil saat spreadsheet diinisialisasi
function buildDependencyGraph() {
  document.querySelectorAll(".cell").forEach((cell) => {
    let formula = cell.getAttribute("data-formula");
    if (formula) {
      let cellRef = getCellRef(cell);
      let cellRegex = /[A-Z]\d+/g;
      let cellReferences = formula.match(cellRegex);
      if (cellReferences) {
        cellReferences.forEach((ref) => {
          if (!dependencyGraph.has(ref)) {
            dependencyGraph.set(ref, new Set());
          }
          dependencyGraph.get(ref).add(cellRef);
        });
      }
    }
  });
}

function handleSelectionStart(event) {
  console.log("handleSelectionStart dipanggil untuk sel:", getCellRef(event.target));
  clearSelection();
  selectionStart = event.target;
  selectedCells = new Set([event.target]); // Inisialisasi ulang selectedCells
  event.target.classList.add("selected");
}

function handleSelectionMove(event) {
  if (selectionStart) {
    console.log("handleSelectionMove dipanggil untuk sel:", getCellRef(event.target));
    selectionEnd = event.target;
    updateSelection();
  }
}

function handleSelectionEnd(event) {
  console.log("handleSelectionEnd dipanggil. Jumlah sel terpilih:", selectedCells.size);
  // Simpan seleksi saat ini
  window.lastSelection = new Set(selectedCells);
  selectionStart = null;
  selectionEnd = null;
}

// Perbarui fungsi updateSelection untuk mendukung sel yang digabung
function updateSelection() {
  clearSelection();
  let startRow = parseInt(selectionStart.dataset.row);
  let startCol = parseInt(selectionStart.dataset.col);
  let endRow = parseInt(selectionEnd.dataset.row);
  let endCol = parseInt(selectionEnd.dataset.col);

  let minRow = Math.min(startRow, endRow);
  let maxRow = Math.max(startRow, endRow);
  let minCol = Math.min(startCol, endCol);
  let maxCol = Math.max(startCol, endCol);

  for (let i = minRow; i <= maxRow; i++) {
    for (let j = minCol; j <= maxCol; j++) {
      let cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
      if (cell) {
        cell.classList.add("selected");
        selectedCells.add(cell);
      }
    }
  }
  console.log("Jumlah sel terpilih setelah update:", selectedCells.size);
}

function mergeCells() {
  console.log("mergeCells dipanggil");
  let cellsToMerge = window.lastSelection || selectedCells;
  console.log("Jumlah sel terpilih:", cellsToMerge.size);
  console.log("Sel yang terpilih:", Array.from(cellsToMerge).map(cell => getCellRef(cell)));

  if (cellsToMerge.size < 2) {
    console.log("Tidak cukup sel dipilih:", cellsToMerge.size);
    alert("Pilih setidaknya dua sel untuk digabungkan.");
    return;
  }

  let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity;
  let content = [];

  cellsToMerge.forEach(cell => {
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);
    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (cell.textContent.trim() !== '') {
      content.push(cell.textContent.trim());
    }
  });

  console.log(`Batas sel: minRow=${minRow}, maxRow=${maxRow}, minCol=${minCol}, maxCol=${maxCol}`);

  let mainCell = document.querySelector(`.cell[data-row="${minRow}"][data-col="${minCol}"]`);
  if (!mainCell) {
    console.error("Sel utama tidak ditemukan");
    return;
  }

  console.log("Sel utama ditemukan:", getCellRef(mainCell));
  console.log("Konten gabungan:", content.join(' '));

  mainCell.textContent = content.join(' ');
  mainCell.setAttribute("data-merged", `${minRow},${minCol},${maxRow},${maxCol}`);
  
  // Gunakan posisi absolut untuk sel yang digabung
  mainCell.style.position = "absolute";
  mainCell.style.top = `${minRow * 100}%`;
  mainCell.style.left = `${minCol * 100}%`;
  mainCell.style.width = `${(maxCol - minCol + 1) * 100}%`;
  mainCell.style.height = `${(maxRow - minRow + 1) * 100}%`;
  mainCell.style.zIndex = "1";
  mainCell.style.backgroundColor = "#fff"; // Pastikan sel yang digabung menutupi sel di bawahnya
  console.log("Style yang diterapkan pada sel utama:", mainCell.style.cssText);

  for (let i = minRow; i <= maxRow; i++) {
    for (let j = minCol; j <= maxCol; j++) {
      let cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
      if (cell && cell !== mainCell) {
        cell.style.visibility = "hidden";
        cell.textContent = '';
        console.log(`Sel ${getCellRef(cell)} disembunyikan`);
      }
    }
  }

  clearSelection();
  updateDependencyGraph();
  checkGridLayout();
  console.log("Sel berhasil digabungkan");
}

function checkGridLayout() {
  let cellsCont = document.querySelector('.cells-cont');
  console.log("Grid template columns:", getComputedStyle(cellsCont).gridTemplateColumns);
  console.log("Grid template rows:", getComputedStyle(cellsCont).gridTemplateRows);
  
  document.querySelectorAll('.cell').forEach(cell => {
    if (cell.style.position === "absolute") {
      console.log(`Sel ${getCellRef(cell)} posisi absolut:`, cell.style.cssText);
    }
  });
}
function unmergeCells() {
  document.querySelectorAll('.cell[data-merged]').forEach(cell => {
    let [minRow, minCol, maxRow, maxCol] = cell.getAttribute("data-merged").split(",").map(Number);
    let content = cell.textContent;
    cell.removeAttribute("data-merged");
    cell.style.gridArea = "";

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        let hiddenCell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
        if (hiddenCell) {
          hiddenCell.style.display = "";
          hiddenCell.textContent = "";
        }
      }
    }

    cell.textContent = content;
  });

  updateDependencyGraph();
}

function updateDependencyGraph() {
  // Bersihkan grafik dependensi yang ada
  dependencyGraph.clear();

  // Bangun ulang grafik dependensi
  document.querySelectorAll('.cell').forEach(cell => {
    let formula = cell.getAttribute("data-formula");
    if (formula) {
      let cellRef = getCellRef(cell);
      let cellRegex = /[A-Z]\d+/g;
      let cellReferences = formula.match(cellRegex);
      if (cellReferences) {
        cellReferences.forEach(ref => {
          if (!dependencyGraph.has(ref)) {
            dependencyGraph.set(ref, new Set());
          }
          dependencyGraph.get(ref).add(cellRef);
        });
      }
    }
  });
}


// Tambahkan fungsi ini ke dalam fungsi spreadsheet
function addMergeCellsButton() {
  let toolbar = document.querySelector('.toolbar');
  if (toolbar) {
    let mergeButton = document.createElement('button');
    mergeButton.textContent = 'Gabung Sel';
    mergeButton.addEventListener('click', mergeCells);
    toolbar.appendChild(mergeButton);

    let unmergeButton = document.createElement('button');
    unmergeButton.textContent = 'Pisahkan Sel';
    unmergeButton.addEventListener('click', unmergeCells);
    toolbar.appendChild(unmergeButton);
  }
}

function clearSelection(event) {
  if (event && event.target.classList.contains("cell")) {
    return;
  }
  selectedCells.forEach((cell) => cell.classList.remove("selected"));
  selectedCells.clear();
}




