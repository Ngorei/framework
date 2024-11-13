export function fullscreen(attr) {
 // Fungsi helper untuk request fullscreen
 const requestFullscreen = (element) => {
  const methods = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen'];
  for (const method of methods) {
   if (element[method]) {
    element[method]();
    break;
   }
  }
 };

 // Fungsi helper untuk exit fullscreen
 const exitFullscreen = () => {
  const methods = ['exitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen', 'msExitFullscreen'];
  for (const method of methods) {
   if (document[method]) {
    document[method]();
    break;
   }
  }
 };

 // Tambahkan event listener untuk perubahan status fullscreen
 document.addEventListener('fullscreenchange', handleFullscreenChange);
 document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
 document.addEventListener('mozfullscreenchange', handleFullscreenChange);
 document.addEventListener('MSFullscreenChange', handleFullscreenChange);

 let currentZoom = 1;
 const zoomStep = 0.1;
 const minZoom = 0.1;
 const maxZoom = 3;

 function handleFullscreenChange() {
  const fullscreenElement = document.getElementById(attr.content);
  const exitButton = document.getElementById(attr.exit);
  const zoomInButton = document.getElementById(attr.zoomIn);
  const zoomOutButton = document.getElementById(attr.zoomOut);
  const fitScreenButton = document.getElementById(attr.fitScreen);

  if (document.fullscreenElement) {
  // console.log('Masuk mode fullscreen');
   if (fullscreenElement) {
    fullscreenElement.style.backgroundColor = 'white';
    fullscreenElement.style.overflow = 'auto';
    fullscreenElement.style.width = '100vw';
    fullscreenElement.style.height = '100vh';
   }
   if (exitButton) exitButton.style.display = 'block';
   // Sembunyikan tombol zoom dan fit-to-screen
   if (zoomInButton) zoomInButton.style.display = 'none';
   if (zoomOutButton) zoomOutButton.style.display = 'none';
   if (fitScreenButton) fitScreenButton.style.display = 'none';

   // Reset zoom saat masuk fullscreen
   const tableContainer = document.getElementById(attr.fit);
   if (tableContainer) {
    tableContainer.style.transform = '';
   }
   currentZoom = 1;
  } else {
  // console.log('Keluar dari mode fullscreen');
   if (fullscreenElement) {
    fullscreenElement.style.backgroundColor = '';
    fullscreenElement.style.overflow = '';
    fullscreenElement.style.width = '';
    fullscreenElement.style.height = '';
   }
   if (exitButton) exitButton.style.display = 'none';
   // Tampilkan kembali tombol zoom dan fit-to-screen
   if (zoomInButton) zoomInButton.style.display = 'block';
   if (zoomOutButton) zoomOutButton.style.display = 'block';
   if (fitScreenButton) fitScreenButton.style.display = 'block';

   // Terapkan kembali zoom terakhir saat keluar dari fullscreen
   applyZoom();
  }
 }

 function zoomIn() {
  if (!document.fullscreenElement && currentZoom < maxZoom) {
   currentZoom += zoomStep;
   applyZoom();
  }
 }

 function zoomOut() {
  if (!document.fullscreenElement && currentZoom > minZoom) {
   currentZoom -= zoomStep;
   applyZoom();
  }
 }

 function applyZoom() {
  const tableContainer = document.getElementById(attr.fit);
  if (tableContainer) {
   tableContainer.style.transform = `scale(${currentZoom})`;
   tableContainer.style.transformOrigin = 'top left';
  }
 }

 function fitToScreen() {
  if (!document.fullscreenElement) {
   const contentElement = document.getElementById(attr.content);
   const tableContainer = document.getElementById(attr.fit);
   
   if (contentElement && tableContainer) {
    const containerWidth = contentElement.clientWidth;
    const containerHeight = contentElement.clientHeight;
    const contentWidth = tableContainer.scrollWidth;
    const contentHeight = tableContainer.scrollHeight;

    const scaleX = containerWidth / contentWidth;
    const scaleY = containerHeight / contentHeight;
    currentZoom = Math.min(scaleX, scaleY, 1); // Tidak memperbesar melebihi ukuran asli

    applyZoom();
   }
  }
 }

 // Tambahkan event listener untuk perubahan status fullscreen
 document.addEventListener('fullscreenchange', handleFullscreenChange);
 document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
 document.addEventListener('mozfullscreenchange', handleFullscreenChange);
 document.addEventListener('MSFullscreenChange', handleFullscreenChange);

 // Tambahkan event listener untuk tombol-tombol
 const zoomInID = document.getElementById(attr.zoomIn);
 if (zoomInID) {
  zoomInID.addEventListener("click", zoomIn);
 } else {
  console.error(`Elemen dengan ID ${attr.zoomIn} tidak ditemukan`);
 }

 const zoomOutID = document.getElementById(attr.zoomOut);
 if (zoomOutID) {
  zoomOutID.addEventListener("click", zoomOut);
 } else {
  console.error(`Elemen dengan ID ${attr.zoomOut} tidak ditemukan`);
 }

 const fitScreenID = document.getElementById(attr.fitScreen);
 if (fitScreenID) {
  fitScreenID.addEventListener("click", fitToScreen);
 } else {
  console.error(`Elemen dengan ID ${attr.fitScreen} tidak ditemukan`);
 }

 const toggelID = document.getElementById(attr.elementById);
 if (toggelID) {
  toggelID.addEventListener("click", function (e) {
   const element = document.getElementById(attr.content);
   if (!document.fullscreenElement) {
    requestFullscreen(element);
   }     
  });
 } else {
  console.error(`Elemen dengan ID ${attr.elementById} tidak ditemukan`);
 }

 const exitID = document.getElementById(attr.exit);
 if (exitID) {
  exitID.addEventListener("click", exitFullscreen);
 } else {
  console.error(`Elemen dengan ID ${attr.exit} tidak ditemukan`);
 }

}

