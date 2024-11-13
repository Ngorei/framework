
export function addRowResizing(attr='') {
const rowNumberCont = document.querySelector('.row-number-cont');
  if (rowNumberCont) {
    const rows = rowNumberCont.querySelectorAll('.row-numbers');
    rows.forEach((row, index) => {
      const resizer = document.createElement('div');
      resizer.classList.add('row-resizer');
      resizer.style.position = 'absolute';
      resizer.style.left = '0';
      resizer.style.right = '0';
      resizer.style.bottom = '0';
      resizer.style.height = '5px';
      resizer.style.cursor = 'row-resize';
      row.style.position = 'relative';
      row.appendChild(resizer);

      let startY, startHeight;

      const startResize = (e) => {
        e.preventDefault();
        startY = e.clientY;
        startHeight = parseInt(window.getComputedStyle(row).height, 10);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
      };

      const resize = (e) => {
        const height = Math.max(20, startHeight + e.clientY - startY); // Minimal 20px
        row.style.height = `${height}px`;
        // Sesuaikan tinggi sel di baris yang sama
        const cells = document.querySelectorAll(`.cell[data-row="${index}"]`);
        cells.forEach(cell => cell.style.height = `${height}px`);
      };

      const stopResize = () => {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
      };

      resizer.addEventListener('mousedown', startResize);
    });
  }
}
