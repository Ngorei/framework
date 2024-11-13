export function Slideshow(config) {
            const sliderTrack = document.querySelector(`.${config.track}`);
            const sliderContainer = document.querySelector(`.${config.container}`);
            const sliderItems = sliderTrack.querySelectorAll(`.${config.items}`);
            const indicatorsContainer = config.indicators ? document.querySelector(`.${config.indicators}`) : null;
            let currentIndex = 0;
            const totalItems = sliderTrack.children.length;
            let autoSlideInterval;

            const settings = {
                itemsPerSlide: config.perSlide || 3,
                autoSlideInterval: config.autoSlideInterval || 3000,
                transitionSpeed: config.transitionSpeed || 500,
                loop: config.loop !== undefined ? config.loop : true
            };
            function setItemsPerSlide(count) {
                settings.itemsPerSlide = count;
                sliderContainer.style.setProperty('--items-per-slide', count);
                if (indicatorsContainer) updateIndicators();
                update();
            }
            function move(direction) {
                currentIndex += direction;
                if (settings.loop) {
                    if (currentIndex < 0) {
                        currentIndex = totalItems - settings.itemsPerSlide;
                    } else if (currentIndex > totalItems - settings.itemsPerSlide) {
                        currentIndex = 0;
                    }
                } else {
                    currentIndex = Math.max(0, Math.min(currentIndex, totalItems - settings.itemsPerSlide));
                }
                update();
            }

            function goToSlide(index) {
                currentIndex = Math.min(Math.max(index, 0), totalItems - settings.itemsPerSlide);
                update();
            }

            function update() {
                const translateX = -currentIndex * (100 / settings.itemsPerSlide);
                sliderTrack.style.transform = `translateX(${translateX}%)`;
                sliderTrack.style.transition = `transform ${settings.transitionSpeed}ms ease-in-out`;
                updateIndicators();
            }

            function updateIndicators() {
                if (!indicatorsContainer) return;
                indicatorsContainer.innerHTML = '';
                const totalSlides = Math.ceil(totalItems / settings.itemsPerSlide);
                for (let i = 0; i < totalSlides; i++) {
                    const indicator = document.createElement('div');
                    indicator.classList.add('slider-indicator');
                    if (i === Math.floor(currentIndex / settings.itemsPerSlide)) {
                        indicator.classList.add('active');
                    }
                    indicator.addEventListener('click', () => goToSlide(i * settings.itemsPerSlide));
                    indicatorsContainer.appendChild(indicator);
                }
            }

            function startAutoSlide() {
                stopAutoSlide();
                autoSlideInterval = setInterval(() => {
                    move(1);
                }, settings.autoSlideInterval);
            }

            function stopAutoSlide() {
                clearInterval(autoSlideInterval);
            }

            let isDragging = false;
            let startPosition;
            let startTranslate;

            function startDrag(e) {
                isDragging = true;
                startPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
                startTranslate = currentIndex * (100 / settings.itemsPerSlide);
                sliderTrack.style.transition = 'none';
                document.addEventListener('mousemove', drag);
                document.addEventListener('touchmove', drag);
                document.addEventListener('mouseup', endDrag);
                document.addEventListener('touchend', endDrag);
            }

            function drag(e) {
                if (!isDragging) return;
                e.preventDefault();
                const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
                const diff = (startPosition - currentPosition) / sliderContainer.offsetWidth * 100;
                const translate = Math.max(Math.min(startTranslate + diff, 100), -100);
                sliderTrack.style.transform = `translateX(-${translate}%)`;
            }

            function endDrag() {
                if (!isDragging) return;
                isDragging = false;
                const threshold = 10; // Persentase pergeseran minimum untuk berpindah slide
                const diff = parseFloat(sliderTrack.style.transform.match(/-?[\d.]+/)[0]) - startTranslate;
                if (Math.abs(diff) > threshold) {
                    move(diff > 0 ? 1 : -1);
                } else {
                    update();
                }
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('mouseup', endDrag);
                document.removeEventListener('touchend', endDrag);
            }

            sliderTrack.addEventListener('mousedown', startDrag);
            sliderTrack.addEventListener('touchstart', startDrag);

            // Inisialisasi slider
            setItemsPerSlide(settings.itemsPerSlide);
            if (config.autoSlideInterval) startAutoSlide();

            // Event listeners
            sliderItems.forEach(item => {
                item.addEventListener('mouseenter', stopAutoSlide);
                item.addEventListener('mouseleave', startAutoSlide);
            });

            document.querySelectorAll('.slider-button').forEach(button => {
                button.addEventListener('click', () => {
                    stopAutoSlide();
                    setTimeout(startAutoSlide, 5000);
                });
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    move(-1);
                } else if (e.key === 'ArrowRight') {
                    move(1);
                }
            });
           window.moveSlide = function (key) {
             move(key);
           };
            // Mengembalikan objek dengan metode publik
            return {
                move,
                setItemsPerSlide,
                startAutoSlide,
                stopAutoSlide,
                goToSlide,
                getCurrentIndex: () => currentIndex,
                startDrag,
                endDrag
            };
}
