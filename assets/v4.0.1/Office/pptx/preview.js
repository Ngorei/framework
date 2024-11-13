export function previewPPTX(attr,themes) {
           const Tds=new Dom.Components()
           const STG=new Dom.Storage()
          const fullscreenButton = document.getElementById('fullscreenPptx');
          const template = document.getElementById(attr.elementById);
            function templateID(file) {
            const red34=STG.fetch({
                 "5272E-23DB0-56C88-18503":["template","nama='"+file+"'"]
            })
            console.log(red34)
              if (red34.storage.status==="success") {
               try {
                 return JSON.parse(red34.storage.data.template);
               } catch (error) {
                // console.error("Error parsing template data:", error);
                 return red34.storage.data.template; // Mengembalikan data mentah jika parsing gagal
               }
              } else {
                return ''
              }               
            }
          template.innerHTML=templateID(attr.template);
          $(".stbdr").css({'border':'1px dashed #fff'});

          // $("#"+attr.elementById).removeClass('stbdr');
          const presentation = document.getElementById('presentation');
          const slides = Array.from(document.querySelectorAll(`#${attr.elementById} .bg-default`)); // Perbarui pemilihan slide
          const prevButton = document.getElementById('prevSlide');
          const nextButton = document.getElementById('nextSlide');
          const exitFullscreenButton = document.getElementById('exitFullscreen');
          const pageCounter = document.getElementById('pageCounter');
          let currentSlide = 0;
          function applyAnimation(element, animationName, duration = '1s', delay = '0s') {
              element.style.animationDuration = duration; // Set durasi
              element.style.animationDelay = delay; // Set penundaan
              element.classList.add('animated', `${animationName}`);
              element.addEventListener('animationend', () => {
                  element.classList.remove('animated', `${animationName}`);
                  element.style.animationDuration = ''; // Reset durasi
                  element.style.animationDelay = ''; // Reset penundaan
              }, {once: true});
          }
          function showSlide(index) {
              if (!document.fullscreenElement) return;
              // Pastikan index berada dalam rentang yang valid
              index = Math.max(0, Math.min(index, slides.length - 1));

              slides.forEach(slide => {
                  slide.classList.remove('active');
                  slide.style.display = 'none';
                  slide.classList.remove('animated');
                  slide.style.animationDuration = '';
                  slide.style.animationDelay = '';
                  const content = slide.querySelector('.slide-content');
                  if (content) {
                      content.classList.remove('animated');
                      content.style.animationDuration = '';
                      content.style.animationDelay = '';
                  }
              });

              const currentSlide = slides[index];
              if (currentSlide) {
                  currentSlide.classList.add('active');
                  currentSlide.style.display = 'block';
                  if (document.fullscreenElement) {
                      // Menerapkan animasi untuk elemen dengan atribut animate pada presentation
                      const animationName = currentSlide.getAttribute('animate');
                      if (animationName) {
                          applyAnimation(currentSlide, animationName); // Terapkan animasi pada elemen presentation
                      }

                      // Menerapkan animasi untuk elemen dengan atribut animate di dalam slide-content
                      const animatedElements = currentSlide.querySelectorAll('[animate]');
                      animatedElements.forEach(element => {
                          const animationName = element.getAttribute('animate');
                          applyAnimation(element, animationName);
                      });
                  }
           
                  updatePageCounter();
           
                  if (document.fullscreenElement) {
                      // hapusCSSDariStbdr();
                  
                  }
              } else {
                  console.error('Slide tidak ditemukan untuk indeks:', index);
              }
          }

          function updatePageCounter() {
              pageCounter.textContent = `${currentSlide + 1}/${slides.length}`;
          }

                fullscreenButton.addEventListener('click', () => {
                templateID(attr.template)
                // closeModal()
                $("#"+attr.elementById).show();
              if (!document.fullscreenElement) {
                  if (presentation.requestFullscreen) {
                      presentation.requestFullscreen();
                  }
                  // Tampilkan slide pertama saat masuk mode layar penuh
                  currentSlide = 0;
                  showSlide(currentSlide);
              }
          });
          // Sembunyikan kontrol saat mouse tidak bergerak selama beberapa detik
          let timeout;
          presentation.addEventListener('mousemove', () => {
              if (document.fullscreenElement) { // Tambahkan pemeriksaan untuk fullscreen
                  const controls = document.getElementById('pptxcontrols'); // Ganti 'controls' dengan ID yang benar
                  if (controls) {
                      controls.style.opacity = '0.7';
                      clearTimeout(timeout);
                      timeout = setTimeout(() => {
                          controls.style.opacity = '0';
                      }, 3000);
                  }
              }
          });
          prevButton.addEventListener('click', () => {
              if (!document.fullscreenElement) return; // Hanya berfungsi dalam mode layar penuh
              currentSlide = (currentSlide - 1 + slides.length) % slides.length;
              showSlide(currentSlide);
          });
          nextButton.addEventListener('click', () => {
              if (!document.fullscreenElement) return; // Hanya berfungsi dalam mode layar penuh
              currentSlide = (currentSlide + 1) % slides.length;
              showSlide(currentSlide);
          });
          document.addEventListener('keydown', (e) => {
              if (!document.fullscreenElement) return; // Hanya berfungsi dalam mode layar penuh
              if (e.key === 'ArrowLeft') prevButton.click();
              if (e.key === 'ArrowRight') nextButton.click();
          });
          document.addEventListener('fullscreenchange', () => {
              if (document.fullscreenElement) {
                console.log(slides)
                  // Masuk mode layar penuh
                  slides.forEach(slide => {
                      slide.style.width = '100%';
                      slide.style.height = '100vh';
                  });
                  document.getElementById('pptxcontrols').style.display = 'flex';
                  exitFullscreenButton.style.display = 'block';
                  pageCounter.style.display = 'block';
                  showSlide(currentSlide);
                  // Logika untuk pemutaran berdasarkan setAnimat.init.play
                  if (playSetting === 'auto') {
                      playSlideshow();
                  } else if (playSetting === true) {
                      playButton.style.display = 'inline-block';
                      stopButton.style.display = 'none';
                  } else {
                      // Jika false, sembunyikan tombol play dan stop
                      playButton.style.display = 'none';
                      stopButton.style.display = 'none';
                  }
              } else {
                  // Keluar dari mode layar penuh
                  slides.forEach(slide => {
                      slide.style.width = '80%';
                      slide.style.height = '80%';
                      slide.classList.remove('active');
                      slide.style.display = 'none';

                  });
                  // Hapus style dari elemen presentation hanya saat keluar dari fullscreen
                  const presentasi = document.getElementById('presentation');
                  presentasi.removeAttribute('style'); // Menghapus semua style
                  slides.forEach(slide => {
                      slide.style.width = '';
                      slide.style.height = '';
                      slide.style.display = ''; // Mengembalikan tampilan ke default
                  });
                  document.getElementById('pptxcontrols').style.display = 'none';
                  exitFullscreenButton.style.display = 'none';
                  pageCounter.style.display = 'none';
                  stopSlideshow(); // Hentikan slideshow saat keluar dari mode layar penuh

              }
          });

          const playButton = document.getElementById('playSlide');
          const stopButton = document.getElementById('stopSlide');
          let slideInterval;
          let intervalDuration; // Tambahkan deklarasi variabel di sini
          intervalDuration = attr.interval?attr.interval:5000; // Durasi interval dalam milidetik
          exitFullscreenButton.addEventListener('click', () => {
             //$("#tempate").hide();
             //
              if (document.exitFullscreen) {
                  document.exitFullscreen();
                  // Hapus style dari elemen presentation
                  const presentasi = document.getElementById('presentation');
                  presentasi.removeAttribute('style'); // Menghapus semua style
                  // Hanya hapus style jika tidak dalam mode fullscreen
                  if (!document.fullscreenElement) {
                      slides.forEach(slide => {
                          slide.style.width = '';
                          slide.style.height = '';
                          slide.style.display = ''; // Mengembalikan tampilan ke default
                      });
                  }
              }
          });
          function playSlideshow() {
              if (!document.fullscreenElement || playSetting === false) return;
              stopSlideshow(); // Hentikan interval yang mungkin sedang berjalan
              slideInterval = setInterval(() => {
                  currentSlide = (currentSlide + 1) % slides.length;
                  showSlide(currentSlide);
              }, intervalDuration);
              playButton.style.display = 'none';
              stopButton.style.display = 'inline-block';
          }
          function stopSlideshow() {
              clearInterval(slideInterval);
              if (playSetting !== false) {
                  playButton.style.display = 'inline-block';
                  stopButton.style.display = 'none';
              } else {
                  playButton.style.display = 'none';
                  stopButton.style.display = 'none';
              }
          }
          // Modifikasi event listener untuk tombol play dan stop
          playButton.addEventListener('click', () => {
              if (playSetting !== false) {
                  playSlideshow();
              }
          });
          stopButton.addEventListener('click', stopSlideshow);
          // Modifikasi event listener untuk keyboard
          document.addEventListener('keydown', (e) => {
              if (!document.fullscreenElement) return;
              if (e.key === 'ArrowLeft') {
                  stopSlideshow();
                  prevButton.click();
              }
              if (e.key === 'ArrowRight') {
                  stopSlideshow();
                  nextButton.click();
              }
              if (e.key === ' ' && playSetting !== false) { // Spasi untuk play/pause
                  if (playButton.style.display === 'none') {
                      stopSlideshow();
                  } else {
                      playSlideshow();
                  }
              }
          });

          function hapusCSSDariStbdr() {
              const presentasi = document.getElementById('presentation');
              const elemenStbdr = presentasi.querySelectorAll('.stbdr');
              elemenStbdr.forEach(elemen => {
                  elemen.style.cssText = '';
                  elemen.removeAttribute('style');
              });
              console.log('Jumlah elemen .stbdr yang diproses:', elemenStbdr.length);
          }
          // Pengaturan awal
          const playSetting = attr.play?attr.play:false; // true|auto|false
          // Fungsi untuk memulai presentasi
          function startPresentation() {
              if (playSetting === "auto") {
                  playSlideshow();
               
              }
          }
              document.addEventListener('fullscreenchange', () => {
                  if (document.fullscreenElement) {
                     $("#"+attr.elementById).css(
                      {'padding':'0px'},
                      {'margin-bottom':'0px'},
                      {'height':'100vh'});
                      $(".scroll").css({'height':'100vh'});
                  } else {
                     $("#"+attr.elementById).css(
                      {'padding':'20px'},
                      {'background-color':'#F5F6FA'},
                      {'margin-bottom':'20px'},
                      {'height':'100vh'});
                  }
              });


          // Panggil fungsi untuk memulai presentasi
          startPresentation();
          // PAGE LIST
          
       
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
      number.textContent = 'Slide ' + (index + 1);

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