export function page(attr) {
    
// Definisikan fungsi truncateText di sini
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  }

  let slideCanvases = []; // Array untuk menyimpan canvas yang sudah dibuat

  function showSpinner() {
    const listPage = document.getElementById('listPage');
    listPage.innerHTML = `
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    `;

    // Tambahkan style untuk mengatur posisi spinner
    const style = document.createElement('style');
    style.textContent = `
      .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    `;
    document.head.appendChild(style);
  }

  async function createInitialCanvases() {
    const contents = document.querySelectorAll(`#${attr.elementById} > div[${attr.page}]`);
    for (let content of contents) {
      const canvas = await html2canvas(content, {
        width: content.offsetWidth,
        height: content.offsetHeight,
        scale: 2,
      });
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      slideCanvases.push(canvas);
    }

    // Setelah semua canvas dibuat, panggil displayPageList
    displayPageList();
  }

  function displayPageList() {
    var listPage = document.getElementById('listPage');
    const contents = document.querySelectorAll(`#${attr.elementById} > div[${attr.page}]`);

    // Bersihkan spinner
    listPage.innerHTML = '';

    contents.forEach(function(content, index) {
      var li = document.createElement('li');
      
      var preview = document.createElement('div');
      preview.className = 'slide-preview';

      var previewContent = document.createElement('div');
      previewContent.className = 'slide-preview-content';
      previewContent.innerHTML = content.innerHTML;

      preview.appendChild(previewContent);

      var info = document.createElement('div');
      info.className = 'slide-info';
      
      var title = document.createElement('div');
      title.className = 'slide-title';
      var titleText = content.querySelector('h1') ? content.querySelector('h1').textContent : 'Slide ' + (index + 1);
      title.textContent = truncateText(titleText,20); // Batasi judul menjadi 30 karakter

      var number = document.createElement('div');
      number.className = 'slide-number';
      number.textContent = 'Page ' + (index + 1);

      info.appendChild(title);
      info.appendChild(number);

      li.appendChild(preview);
      li.appendChild(info);

      li.onclick = function(e) {
        e.preventDefault();
        var selectedContent = contents[index];
        if (selectedContent) {
          var scrollContainer = document.querySelector('.scroll');
          var headerHeight = document.querySelector('.content-header') ? document.querySelector('.content-header').offsetHeight : 0;
          if (scrollContainer) {
            scrollContainer.scrollTo({
              top: selectedContent.offsetTop - scrollContainer.offsetTop - headerHeight,
              behavior: 'smooth'
            });
          }
        }
      };

      listPage.appendChild(li);
    });

    // Ganti pembuatan Sortable dengan jQuery UI Sortable
    $("#listPage").sortable({
      stop: function(event, ui) {
        updatePresentationOrder();
      }
    });
  }
  
  function updatePresentationOrder() {
    var listItems = Array.from(document.querySelectorAll('#listPage li'));
    var seteditor = document.getElementById(attr.elementById);
    
    listItems.forEach(function(item, index) {
      var contentIndex = Array.from(item.parentNode.children).indexOf(item);
      var content = document.querySelectorAll(`#${attr.elementById} > div[${attr.page}]`)[contentIndex];
      seteditor.appendChild(content);
    });

    // Panggil kembali displayPageList untuk memperbarui daftar
    displayPageList();
  }

  // Modifikasi bagian ini di dalam $(document).ready
  $(document).ready(function() {
    // Tampilkan spinner segera
    showSpinner();

    // Gunakan setTimeout untuk memastikan spinner muncul sebelum pembuatan canvas dimulai
    setTimeout(() => {
      createInitialCanvases();
    }, 0);

    // Tambahkan observer untuk memantau perubahan pada #seteditor
    var observer = new MutationObserver(function(mutations) {
      showSpinner();
      setTimeout(() => {
        createInitialCanvases();
      }, 0);
    });

    observer.observe(document.getElementById(attr.elementById), {
      childList: true,
      subtree: true
    });
  });


      }
