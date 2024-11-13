export function updateSelectionID(currentCell='') {
  let startRow = parseInt(selectionStart.dataset.row);
  let startCol = parseInt(selectionStart.dataset.col);
  let endRow = parseInt(currentCell.dataset.row);
  let endCol = parseInt(currentCell.dataset.col);

  let minRow = Math.min(startRow, endRow);
  let maxRow = Math.max(startRow, endRow);
  let minCol = Math.min(startCol, endCol);
  let maxCol = Math.max(startCol, endCol);

  for (let i = minRow; i <= maxRow; i++) {
    for (let j = minCol; j <= maxCol; j++) {
      let cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
      if (cell) {
        if (cell.style.display !== "none") {
          cell.classList.add("selected");
          selectedCells.add(cell);
        }
        // Jika sel adalah bagian dari sel yang digabung, pilih sel utama
        let mergedAttr = cell.getAttribute("data-merged");
        if (mergedAttr) {
          let [mMinRow, mMinCol, mMaxRow, mMaxCol] = mergedAttr.split(",").map(Number);
          let mainCell = document.querySelector(`.cell[data-row="${mMinRow}"][data-col="${mMinCol}"]`);
          mainCell.classList.add("selected");
          selectedCells.add(mainCell);
        }
      }
    }
  }
}
