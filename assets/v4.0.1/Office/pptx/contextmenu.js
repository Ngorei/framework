import { menuStructure, createElementFromStructure } from "./structure.js";
import {setCookie,user_id,officeTabelQuery } from "../../ngorei.js";


export function contextmenu(attr) {

  const ctr = new Shortcut({ enabled: true });
  const STG=new Dom.Storage()
  const Tds=new Dom.Components()
  const contentEditable = document.getElementById(attr.contenteditable);
  const writingArea = document.getElementById(attr.contenteditable);
  const pageSortable=localStorage.getItem('sortable');
  const toPptx = STG.localData('office').get(attr.attr.fileName)
  let contextMenu;
  let currentPresentationElement = null;
  let copiedText = ""; // Tambahkan ini di sini
  let clickedElement = null;
  let lastClickPosition = null;
  let contextMenuPosition = null;
   let elementText = ""; // Tambahkan ini di sini
  contentEditable.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    elementText=e.target;


    // Simpan posisi klik kanan
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      contextMenuPosition = selection.getRangeAt(0).cloneRange();
    }
    // Simpan teks yang diseleksi (jika ada)
    copiedText = selection.toString();
    // Temukan semua elemen presentasi
    const allPresentations = contentEditable.querySelectorAll('[presentation]');
    console.log("Jumlah elemen presentasi ditemukan:", allPresentations.length);

    // Cari elemen presentasi yang paling dekat dengan titik klik
    currentPresentationElement = null;
    for (const presentation of allPresentations) {
      if (presentation.contains(e.target)) {
        currentPresentationElement = presentation;
        console.log("Elemen presentasi dipilih:", currentPresentationElement.attributes.presentation.value);
        break;
      }
    }

    if (!currentPresentationElement) {
      console.log("Tidak ada elemen presentasi yang dipilih");
    }
  

    showContextMenu(e);
  });

  // Fungsi untuk menampilkan menu konteks
 function showContextMenu(e) {
  if (contextMenu) {
    document.body.removeChild(contextMenu);
  }
  contextMenu = createElementFromStructure(menuStructure(attr));
  contextMenu.id = "custom-context-menu";
  contextMenu.style.position = "fixed"; // Gunakan 'fixed' alih-alih 'absolute'
  // Tambahkan menu ke body terlebih dahulu
  document.body.appendChild(contextMenu);
  // Hitung dimensi dan posisi
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;
  // Hitung posisi awal
  let left = e.clientX; // Gunakan clientX alih-alih pageX
  let top = e.clientY; // Gunakan clientY alih-alih pageY
  
  // Sesuaikan posisi horizontal jika perlu
  if (left + menuWidth > viewportWidth) {
    left = viewportWidth - menuWidth;
  }
  // Sesuaikan posisi vertikal jika perlu
  if (top + menuHeight > viewportHeight) {
    top = viewportHeight - menuHeight;
  }
  // Pastikan posisi tidak negatif
  left = Math.max(0, left);
  top = Math.max(0, top);
  // Terapkan posisi yang sudah disesuaikan
  contextMenu.style.left = left + "px";
  contextMenu.style.top = top + "px";
  contextMenu.style.zIndex = "1000";
  const pageSortable = localStorage.getItem('sortable');
  $("#menuTab").html(pageSortable);
  $("#custom-context-menu").draggable({
    handle: "#draggable",
    scroll: false,
    containment: "window" // Batasi pergerakan dalam window
  });
   $("#draggable").text(e.target.nodeName);
   if (toPptx) {
      officeTabelQuery(toPptx.cradensial,attr.attr.fileName);
   }  
 
// console.log(e)
// console.log(e.target.nodeName)
// console.log(e.target.className)
// console.log(e.target.id)
  //  Tambahkan event listener untuk aksi menu
  contextMenu.addEventListener("click", handleMenuClick);
}
  // Tambahkan event listener untuk menyembunyikan menu saat klik di luar
  document.addEventListener("click", function (e) {
    if (contextMenu && !contextMenu.contains(e.target)) {
      // console.log(e.target)
      hideContextMenu();
    }
  });

  // Fungsi untuk menyembunyikan menu konteks
  function hideContextMenu() {
    if (contextMenu && contextMenu.parentNode) {
      contextMenu.parentNode.removeChild(contextMenu);
      contextMenu = null;
    }
  }
  function saveItem() {
    // if (toPptx) {
      const from = STG.BriefSnd({
        "endpoint": "523C9-03C77-95312-B117C",
        "data": attr.attr.fileName,  
        "template": writingArea.innerHTML,  
      });
    // }
    localStorage.setItem(attr.attr.fileName, writingArea.innerHTML);
  }

  ctr.ctrl({
    key: ['ctrl+s'],
    component: 'contextmenu',
    sendCallback: (key) => {
      saveItem()
      // Lakukan aksi yang diinginkan
    }
  });
  function handleMenuClick(e) {
    console.log("Menu item diklik");
    let target = e.target;
    while (target != null && !target.dataset.action) {
      target = target.parentElement;
    }

    if (!target) {
      console.log("Tidak ada action yang ditemukan pada item menu");
      return;
    }

    const action = target.dataset.action;
    const actionType = target.dataset.type;
    console.log("Action yang dipilih:", action);
    console.log("Type yang dipilih:", actionType);

    switch (action) {
      case "addPageIndex":
         addTheme('page');
      break;
    case "animation":
      console.log(attr)
           onRoute(["Modal", 'Animation', "#setting/animation",attr]);
           // onRoute(["Modal","#explorer/xlsx",renderData])
          break;
    case "addgrid":
      if (contextMenuPosition && currentPresentationElement) {
        const range = contextMenuPosition.cloneRange();
        let currentNode = range.commonAncestorContainer;
        
        // Jika currentNode adalah text node, ambil parentNode-nya
        if (currentNode.nodeType === Node.TEXT_NODE) {
          currentNode = currentNode.parentNode;
        }

        // Cari elemen .row terdekat
        let rowElement = null;
        while (currentNode && currentNode !== currentPresentationElement) {
          if (currentNode.classList && currentNode.classList.contains('row')) {
            rowElement = currentNode;
            break;
          }
          currentNode = currentNode.parentNode;
        }

        if (!rowElement) {
          // Jika tidak ada .row, buat baru di dalam currentPresentationElement
          rowElement = document.createElement('div');
          rowElement.className = 'row row-xs';
          currentPresentationElement.appendChild(rowElement);
       }

    // Buat elemen col baru
    const colElement = document.createElement('div');
    colElement.className = 'col-md-12';
    colElement.innerHTML = '<div class="stbdr">Konten baru</div>';

    // Sisipkan elemen col baru
    rowElement.appendChild(colElement);

    // Perbarui selection
    range.setStartAfter(colElement);
    range.setEndAfter(colElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Perbarui contextMenuPosition
    contextMenuPosition = range.cloneRange();

    // Simpan perubahan
    saveItem();
  } else {
    console.error("Tidak dapat menentukan posisi untuk menambahkan grid");
  }
break;
      case "grid":
        var grid = actionType; // 12, 8, 6, 4, 3
        if (contextMenuPosition && currentPresentationElement) {
          const range = contextMenuPosition.cloneRange();
          let currentNode = range.commonAncestorContainer;
          
          // Jika currentNode adalah text node, ambil parentNode-nya
          if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode = currentNode.parentNode;
          }

          // Cari elemen col-md-* terdekat
          let colElement = null;
          while (currentNode && currentNode !== currentPresentationElement) {
            if (currentNode.classList && currentNode.className.match(/col-md-\d+/)) {
              colElement = currentNode;
              break;
            }
            currentNode = currentNode.parentNode;
          }

          if (colElement) {
            // Jika kursor berada di dalam col-md-*, ubah ukurannya
            colElement.className = colElement.className.replace(/col-md-\d+/, `col-md-${grid}`);
          } else {
            // Jika tidak ada col-md-*, cari atau buat .row dan tambahkan col-md-* baru
            let rowElement = null;
            currentNode = range.commonAncestorContainer;
            while (currentNode && currentNode !== currentPresentationElement) {
              if (currentNode.classList && currentNode.classList.contains('row')) {
                rowElement = currentNode;
                break;
              }
              currentNode = currentNode.parentNode;
            }

            if (!rowElement) {
              // Jika tidak ada .row, buat baru di dalam currentPresentationElement
              rowElement = document.createElement('div');
              rowElement.className = 'row row-xs';
              currentPresentationElement.appendChild(rowElement);
            }
            // Buat elemen col baru
            colElement = document.createElement('div');
            colElement.className = `col-md-${grid}`;
            colElement.innerHTML = '<div class="stbdr">Konten baru</div>'; // Anda bisa mengganti ini dengan konten yang diinginkan

            // Sisipkan elemen col baru
            rowElement.appendChild(colElement);
          }

          // Perbarui selection
          range.setStartAfter(colElement);
          range.setEndAfter(colElement);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);

          // Perbarui contextMenuPosition
          contextMenuPosition = range.cloneRange();

          // Simpan perubahan
          saveItem();
        } else {
          console.error("Tidak dapat menentukan posisi untuk menyisipkan atau mengubah grid");
        }
      break;

      case "addChart":
          const toCharts = STG.localStorage('textToCharts').get();
          if (contextMenuPosition && currentPresentationElement) {
            const range = contextMenuPosition.cloneRange();
            let currentNode = range.commonAncestorContainer;
         
            // Jika currentNode adalah text node, ambil parentNode-nya
            if (currentNode.nodeType === Node.TEXT_NODE) {
              currentNode = currentNode.parentNode;
            }

            // Cari elemen col-md-* terdekat
            let colElement = null;
            while (currentNode && currentNode !== currentPresentationElement) {
              if (currentNode.classList && currentNode.className.match(/col-md-\d+/)) {
                colElement = currentNode;
                break;
              }
              currentNode = currentNode.parentNode;
            }

            if (!colElement) {
              // Jika tidak ada col-md-*, cari atau buat .row
              let rowElement = null;
              currentNode = range.commonAncestorContainer;
              while (currentNode && currentNode !== currentPresentationElement) {
                if (currentNode.classList && currentNode.classList.contains('row')) {
                  rowElement = currentNode;
                  break;
                }
                currentNode = currentNode.parentNode;
              }

              if (!rowElement) {
                // Jika tidak ada .row, buat baru
                rowElement = document.createElement('div');
                rowElement.className = 'row';
                currentPresentationElement.appendChild(rowElement);
              }

              // Buat col-md-12 baru
              colElement = document.createElement('div');
              colElement.className = 'col-md-12';
              rowElement.appendChild(colElement);
            }

            // Masukkan tabel ke dalam col-md-*
            colElement.innerHTML = `<img src="${toCharts.big.base64Image}" style="width:100%; height:100%">`;
                        // Perbarui selection
            range.selectNodeContents(colElement);
            range.collapse(false);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Perbarui contextMenuPosition
            contextMenuPosition = range.cloneRange();

            // Simpan perubahan
            saveItem();
          } else {
            console.error("Tidak dapat menentukan posisi untuk menambahkan tabel");
          }

          localStorage.setItem('textToCharts', '');  
      break;
      case "public":
         const toPptx = STG.localData('office').get(attr.attr.fileName)
        // const toPptx = STG.localStorage('ToPptx'+attr.attr.fileName).get();
        // console.log(toPptx)
         setCookie("explorer",attr.attr.fileName); 
         onModal([toPptx.check])
          //onRoute(["Office","Publikasikan","#setting/pptx",attr.attr])
      break;
      case "addSlideshow":
        const toslideshow = STG.localStorage('slideshow').get();
        if (contextMenuPosition && currentPresentationElement) {
          const range = contextMenuPosition.cloneRange();
          let currentNode = range.commonAncestorContainer;
          
          // Jika currentNode adalah text node, ambil parentNode-nya
          if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode = currentNode.parentNode;
          }

          // Cari elemen col-md-* terdekat
          let colElement = null;
          while (currentNode && currentNode !== currentPresentationElement) {
            if (currentNode.classList && currentNode.className.match(/col-md-\d+/)) {
              colElement = currentNode;
              break;
            }
            currentNode = currentNode.parentNode;
          }

          if (!colElement) {
            // Jika tidak ada col-md-*, cari atau buat .row
            let rowElement = null;
            currentNode = range.commonAncestorContainer;
            while (currentNode && currentNode !== currentPresentationElement) {
              if (currentNode.classList && currentNode.classList.contains('row')) {
                rowElement = currentNode;
                break;
              }
              currentNode = currentNode.parentNode;
            }

            if (!rowElement) {
              // Jika tidak ada .row, buat baru
              rowElement = document.createElement('div');
              rowElement.className = 'row';
              currentPresentationElement.appendChild(rowElement);
            }

            // Buat col-md-12 baru
            colElement = document.createElement('div');
            colElement.className = 'col-md-12';
            rowElement.appendChild(colElement);
          }

          // Masukkan tabel ke dalam col-md-*
          colElement.innerHTML =`    
           <slide key="${toslideshow.folder}">
             <img src="${toslideshow.data[0].src}" class="img-responsive" alt="Image">
           </slide>`;
          // Perbarui selection
          range.selectNodeContents(colElement);
          range.collapse(false);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);

          // Perbarui contextMenuPosition
          contextMenuPosition = range.cloneRange();
          // Simpan perubahan
          saveItem();
        } else {
          console.error("Tidak dapat menentukan posisi untuk menambahkan tabel");
        }
         // Tds.slider(toslideshow)
        localStorage.setItem('slideshow', '');
      break;
      case "addTabel":
        const toTabel = STG.localStorage('textToTabel').get();
        const textToTabel =toTabel.tabel;
        if (contextMenuPosition && currentPresentationElement) {
          const range = contextMenuPosition.cloneRange();
          let currentNode = range.commonAncestorContainer;
          
          // Jika currentNode adalah text node, ambil parentNode-nya
          if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode = currentNode.parentNode;
          }

          // Cari elemen col-md-* terdekat
          let colElement = null;
          while (currentNode && currentNode !== currentPresentationElement) {
            if (currentNode.classList && currentNode.className.match(/col-md-\d+/)) {
              colElement = currentNode;
              break;
            }
            currentNode = currentNode.parentNode;
          }

          if (!colElement) {
            // Jika tidak ada col-md-*, cari atau buat .row
            let rowElement = null;
            currentNode = range.commonAncestorContainer;
            while (currentNode && currentNode !== currentPresentationElement) {
              if (currentNode.classList && currentNode.classList.contains('row')) {
                rowElement = currentNode;
                break;
              }
              currentNode = currentNode.parentNode;
            }

            if (!rowElement) {
              // Jika tidak ada .row, buat baru
              rowElement = document.createElement('div');
              rowElement.className = 'row';
              currentPresentationElement.appendChild(rowElement);
            }

            // Buat col-md-12 baru
            colElement = document.createElement('div');
            colElement.className = 'col-md-12';
            rowElement.appendChild(colElement);
          }

          // Masukkan tabel ke dalam col-md-*
          colElement.innerHTML = textToTabel;

          // Perbarui selection
          range.selectNodeContents(colElement);
          range.collapse(false);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);

          // Perbarui contextMenuPosition
          contextMenuPosition = range.cloneRange();
          // Simpan perubahan
          saveItem();
        } else {
          console.error("Tidak dapat menentukan posisi untuk menambahkan tabel");
        }
        localStorage.setItem('textToTabel', '');
      break;
      case "deletegrid":
        if (contextMenuPosition && currentPresentationElement) {
          const range = contextMenuPosition.cloneRange();
          let currentNode = range.commonAncestorContainer;
          
          // Jika currentNode adalah text node, ambil parentNode-nya
          if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode = currentNode.parentNode;
          }
          // Cari elemen col-md-* terdekat
          let colElement = null;
          while (currentNode && currentNode !== currentPresentationElement) {
            if (currentNode.classList && currentNode.className.match(/col-md-\d+/)) {
              colElement = currentNode;
              break;
            }
            currentNode = currentNode.parentNode;
          }
          if (colElement) {
            // Jika kursor berada di dalam col-md-*, hapus elemen
            const parentRow = colElement.parentNode;
            parentRow.removeChild(colElement);
            // Jika row menjadi kosong, hapus juga row-nya
            if (parentRow.children.length === 0) {
              parentRow.parentNode.removeChild(parentRow);
            }
            // Perbarui selection ke elemen terdekat
            const newRange = document.createRange();
            if (parentRow.children.length > 0) {
              newRange.selectNodeContents(parentRow.lastElementChild);
            } else {
              newRange.selectNodeContents(currentPresentationElement);
            }
            newRange.collapse(false);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(newRange);
            // Perbarui contextMenuPosition
            contextMenuPosition = newRange.cloneRange();
            // Simpan perubahan
            saveItem();
          } else {
            console.log("Tidak ada elemen col-md-* yang ditemukan untuk dihapus");
            elementText.remove();
          }
        } else {
          console.error("Tidak dapat menentukan posisi untuk menghapus grid");
        }
      break;
      case "element":
           const presentationId = currentPresentationElement.id;
           var el="#element/"+actionType;
           const data=STG.Load([el]);
           if (contextMenuPosition && currentPresentationElement) {
            const range = contextMenuPosition.cloneRange();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            // Cari elemen .row terdekat dalam presentasi
            let rowElement = null;
            let currentNode = range.commonAncestorContainer;
            
            // Jika currentNode adalah text node, ambil parentNode-nya
            if (currentNode.nodeType === Node.TEXT_NODE) {
              currentNode = currentNode.parentNode;
            }
            // Cari elemen .row terdekat
            while (currentNode && currentNode !== currentPresentationElement) {
              if (currentNode.classList && currentNode.classList.contains('row')) {
                rowElement = currentNode;
                break;
              }
              currentNode = currentNode.parentNode;
            }
            
            if (!rowElement) {
              // Jika tidak ada .row, cari di dalam currentPresentationElement
              rowElement = currentPresentationElement.querySelector('.row');
            }
            
            if (rowElement) {
              // Sisipkan elemen baru pada posisi kursor
              range.insertNode(tempDiv.firstElementChild);
              range.collapse(false);
              
              // Perbarui selection
              const selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);
              
              // Perbarui contextMenuPosition
              contextMenuPosition = range.cloneRange();
            } else {
              // Fallback: tambahkan ke akhir presentasi jika .row tidak ditemukan
              currentPresentationElement.appendChild(tempDiv.firstElementChild);
            }
          } else {
            // Fallback: tambahkan ke akhir presentasi jika posisi tidak diketahui
            $(`#${presentationId} > .row`).append(data);
          }
          // Simpan perubahan
          saveItem();
      break;
      case "menuTataletak":
          $("#seteditor .row").sortable({
            stop: function(event, ui) {
              saveItem();
            }
           }).sortable("enable");
          localStorage.setItem("sortable","Enable");
       break;
      case "sortable":
          $("#seteditor .row").sortable({stop: function(event, ui) {}}).sortable("disable");
          localStorage.setItem("sortable","Disable");
       break;
      case "save":
        saveItem();
        break;
      case "copy":
        if (copiedText) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
              .writeText(copiedText)
              .then(() => console.log("Teks yang diblok berhasil disalin"))
              .catch((err) => {
                console.error("Gagal menyalin teks yang diblok:", err);
                fallbackCopyTextToClipboard(copiedText);
              });
          } else {
            //localStorage.setItem("clipboard",copiedText);
            fallbackCopyTextToClipboard(copiedText);
          }
        } else {
          console.log("Tidak ada teks yang diblok untuk disalin");
        }
        break;
      case "cut":
        if (copiedText) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(copiedText)
              .then(() => {
                console.log("Teks yang diblok berhasil dipotong");
                removeSelectedText();
              })
              .catch((err) => {
                console.error("Gagal memotong teks yang diblok:", err);
                fallbackCutTextToClipboard(copiedText);
              });
          } else {
            //localStorage.setItem("clipboard", copiedText);
            fallbackCutTextToClipboard(copiedText);
          }
        } else {
          console.log("Tidak ada teks yang diblok untuk dipotong");
        }
        break;
      case "paste":
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText()
            .then(text => {
              if (text && text.trim() !== '') {
                insertTextAtCursor(text);
              } else {
                console.log("Tidak ada teks yang valid di clipboard");
              }
            })
            .catch(err => {
              fallbackPasteText();
            });
        } else {
          fallbackPasteText();
        }
        break;
      case "capture":
        if (currentPresentationElement) {
          const presentationId = currentPresentationElement.id;
          if (presentationId) {
            captureElement(`#${presentationId}`);

          } else {
            console.error("Elemen presentasi tidak memiliki ID");
          
          }
        } else {
          console.error("Tidak ada elemen presentasi yang dipilih"); 
        }
        break;
      case "removePage":
        if (currentPresentationElement) {
          const presentationValue =
            currentPresentationElement.getAttribute("presentation");
          currentPresentationElement.remove();
          saveItem();
        } else {
          console.error("Tidak ada elemen presentasi yang dipilih");
        }
        break;
      // ... tambahkan case lain untuk aksi menu lainnya ...
    }

    hideContextMenu();
  }

function convertSvgToCanvas(svgElement) {
  return new Promise((resolve, reject) => {
    const svgURL = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgURL);
  });
}

async function captureElement(selector) {
  $(".stbdr").css({'border':'1px dashed #fff'});
  
  const element = document.querySelector(selector);
  const svgImages = element.querySelectorAll('img[src$=".svg"]');
  
  for (const svgImg of svgImages) {
    const response = await fetch(svgImg.src);
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    const canvas = await convertSvgToCanvas(svgElement);
    svgImg.parentNode.replaceChild(canvas, svgImg);
  }

  html2canvas(element, {
    useCORS: true,
    allowTaint: true
  }).then((canvas) => {
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = "capture.png";
    link.href = image;
    link.click();
    $(".stbdr").css({'border':'1px dashed #ccc'});
  });
}

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      console.log("Teks yang diblok berhasil disalin (fallback)");
    } catch (err) {
      console.error("Gagal menyalin teks yang diblok (fallback):", err);
    }
    document.body.removeChild(textArea);
  }

  function fallbackPasteText() {
    const paste = localStorage.getItem('clipboard');
    if (paste && paste.trim() !== '') {
      insertTextAtCursor(paste);
    } else {
      console.log("Tidak ada teks yang valid untuk disisipkan");
    }
  }

  function insertTextAtCursor(text) {
    if (!contextMenuPosition) {
      console.error("Posisi klik kanan tidak ditemukan");
      // Fallback: sisipkan di akhir konten
      contextMenuPosition = document.createRange();
      contextMenuPosition.selectNodeContents(writingArea);
      contextMenuPosition.collapse(false);
    }

    // Fokuskan area penulisan
    writingArea.focus();

    // Gunakan posisi klik kanan untuk menyisipkan teks
    const range = contextMenuPosition.cloneRange();
    range.deleteContents();
    
    // Buat node teks baru
    const textNode = document.createTextNode(text);

    // Sisipkan node teks baru
    range.insertNode(textNode);

    // Pindahkan kursor ke akhir teks yang baru disisipkan
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Perbarui contextMenuPosition
    contextMenuPosition = range.cloneRange();

    // Simpan perubahan
    saveItem();
  }

  function fallbackCutTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      console.log("Teks yang diblok berhasil dipotong (fallback)");
      removeSelectedText();
    } catch (err) {
      console.error("Gagal memotong teks yang diblok (fallback):", err);
    }
    document.body.removeChild(textArea);
  }

  function removeSelectedText() {
    if (contextMenuPosition) {
      const range = contextMenuPosition.cloneRange();
      range.deleteContents();
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      contextMenuPosition = range.cloneRange();
      saveItem();
    } else {
      console.error("Posisi klik kanan tidak ditemukan");
    }
  }

  function fallbackPasteText() {
    const paste = localStorage.getItem('clipboard');
    if (paste && paste.trim() !== '') {
      insertTextAtCursor(paste);
    } else {
      console.log("Tidak ada teks yang valid untuk disisipkan");
    }
  }
  function insertTextAtCursor(text) {
    if (!contextMenuPosition) {
      console.error("Posisi klik kanan tidak ditemukan");
      // Fallback: sisipkan di akhir konten
      contextMenuPosition = document.createRange();
      contextMenuPosition.selectNodeContents(writingArea);
      contextMenuPosition.collapse(false);
    }
    // Fokuskan area penulisan
    writingArea.focus();
    // Gunakan posisi klik kanan untuk menyisipkan teks
    const range = contextMenuPosition.cloneRange();
    range.deleteContents();
    // Buat node teks baru
    const textNode = document.createTextNode(text);
    // Sisipkan node teks baru
    range.insertNode(textNode);
    // Pindahkan kursor ke akhir teks yang baru disisipkan
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    // Perbarui contextMenuPosition
    contextMenuPosition = range.cloneRange();
    // Simpan perubahan
    saveItem();
  }
}

// ... kode lainnya  ...
