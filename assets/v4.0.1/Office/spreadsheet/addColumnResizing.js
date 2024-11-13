
export function addColumnResizing(attr='') {
 const headers = document.querySelectorAll('.col-letters');
  headers.forEach((header, index) => {
    const resizer = document.createElement('div');
    resizer.classList.add('column-resizer');
    header.appendChild(resizer);

    let startX, startWidth;

    const startResize = (e) => {
      startX = e.clientX;
      startWidth = parseInt(window.getComputedStyle(header).width, 10);
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    };

    const resize = (e) => {
      const width = startWidth + e.clientX - startX;
      header.style.width = `${width}px`;
      const cells = document.querySelectorAll(`.cell[data-col="${index}"]`);
      cells.forEach(cell => cell.style.width = `${width}px`);
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };

    resizer.addEventListener('mousedown', startResize);
  });

}
