// Fungsi untuk membuat form
export function slider(attr) {
        console.log(attr)
        const deshow=attr.data
        let slideIndex = 0;
        let autoSlide = attr.autoSlide; // True itu Play, false itu Stop
        const SLIDE_DURATION = attr.nextSlide; // 5 detik
        const slideshowContainer = document.getElementById(attr.elementById);
        const dotContainer = document.getElementById('dot-container');
        let slideInterval;

        // Membuat elemen slide dan dot
        deshow.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
                <img src="${item.href}" alt="${item.caption}" onclick="openViewbox(this)">
                <div class="caption">${item.caption}</div>
            `;
            slideshowContainer.appendChild(slide);

            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.onclick = () => currentSlide(index);
            dotContainer.appendChild(dot);
        });

        slideshowContainer.innerHTML += `
            <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>
        `;

        function showSlides(n) {
            const slides = document.getElementsByClassName("slide");
            const dots = document.getElementsByClassName("dot");
            if (slides.length === 0 || dots.length === 0) return; // Tambahkan pengecekan ini
            if (n >= slides.length) {slideIndex = 0}
            if (n < 0) {slideIndex = slides.length - 1}
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndex].style.display = "block";
            dots[slideIndex].className += " active";
        }

        function plusSlides(n) {
            showSlides(slideIndex += n);
        }

        function currentSlide(n) {
            showSlides(slideIndex = n);
        }

        function nextSlide() {
            if (autoSlide) {
                plusSlides(1);
            }
        }

        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, SLIDE_DURATION);
        }

        function stopAutoSlide() {
            clearInterval(slideInterval);
        }

        // Inisialisasi slideshow
        showSlides(slideIndex);
        startAutoSlide();

        // Fungsi untuk Viewbox
        function openViewbox(img) {
            const viewbox = document.getElementById("my-slideshow-viewbox");
            const viewboxImg = document.getElementById("my-slideshow-viewbox-image");
            const captionText = document.getElementById("my-slideshow-viewbox-caption");
            viewbox.style.display = "block";
            viewboxImg.src = img.src;
            captionText.innerHTML = img.alt;
        }

        // Menutup Viewbox
        const viewboxClose = document.getElementsByClassName("my-slideshow-viewbox-close")[0];
        viewboxClose.onclick = function() { 
            document.getElementById("my-slideshow-viewbox").style.display = "none";
        }

        // Tambahkan fungsi ke objek window
        window.plusSlides = plusSlides;
        window.currentSlide = currentSlide;
        window.openViewbox = openViewbox;

}
