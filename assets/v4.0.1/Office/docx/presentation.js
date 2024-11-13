export function presentation(attr) {
 const Tds=new Dom.Components()
 const STG=new Dom.Storage()


        // const tempalate = document.getElementById('seteditor');
        const fullscreenButton = document.getElementById('fullscreenPptx');
        const template = document.getElementById('presentationID');
        template.style.display = 'none';



         function templateID(file) {
           const pagePresentation=localStorage.getItem(file);
           return pagePresentation;
         }
        template.innerHTML=templateID(attr.template);
        const presentation = document.getElementById('presentation');
        const slides = Array.from(document.querySelectorAll('#presentationID .bg-default')); // Perbarui pemilihan slide
       // const chartsID = Array.from(document.querySelectorAll('#presentationID *[charts]')); // Perbarui pemilihan slide
        

               // if (chartsID) {
               //      $.each(chartsID,function(red, row){
               //        var file=$(row).attr('base64image');
               //         var elementById=$(row).attr('content');
               //        $(this).html('<img src="'+file+'" alt="">');
               //      })
               //    }





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
            currentSlide.classList.add('active');
            currentSlide.style.display = 'block';


            
            // Tambahkan log untuk memeriksa currentSlide
            //console.log('Menampilkan slide:', index);
            
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
        }

        function updatePageCounter() {
            pageCounter.textContent = `${currentSlide + 1}/${slides.length}`;
        }

              fullscreenButton.addEventListener('click', () => {
              templateID(attr.template)
              // closeModal()
              $("#presentationID").show();
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
                $(".stbdr").css({'border':'1px dashed #fff'});
                // hapusCSSDariStbdr();
               
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
           $("#presentationID").hide();
           //
            if (document.exitFullscreen) {
                document.exitFullscreen();
                // Hapus style dari elemen presentation
              
                const presentasi = document.getElementById('presentation');
                presentasi.removeAttribute('style'); // Menghapus semua style
               $(".stbdr").css({'border':'1px dashed #ccc'});


                // Hanya hapus style jika tidak dalam mode fullscreen
                if (!document.fullscreenElement) {
                    slides.forEach(slide => {
                        slide.style.width = '';
                        slide.style.height = '';
                        slide.style.display = ''; // Mengembalikan tampilan ke default
                    });
                      $("#presentationID").hide();
                    
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
                // Logika untuk memulai pemutaran otomatis
                playSlideshow();
                
            }
        }
            document.addEventListener('fullscreenchange', () => {
                if (document.fullscreenElement) {
                    $("#presentationID").show();
                } else {
                    $("#presentationID").hide(); // Tambahkan log ini
                    // ... existing code ...
                }
            });


        // Panggil fungsi untuk memulai presentasi
        startPresentation();

           
       



      }