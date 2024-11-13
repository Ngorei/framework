export function Carousel(elm) {
        // Create carousel container
        const carouselContainer = document.createElement('div');
        carouselContainer.style.position = 'relative';
        carouselContainer.style.width = '100%';
        // carouselContainer.style.margin = 'auto';
        carouselContainer.style.overflow = 'hidden';

        // Create carousel inner container
        const carouselInner = document.createElement('div');
        carouselInner.style.display = 'flex';
        carouselInner.style.transition = 'transform 0.5s ease-in-out';

        // Add elm to the carousel
         elm.action.forEach((item, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.style.minWidth = '100%';
            carouselItem.style.boxSizing = 'border-box';
            carouselItem.style.position = 'relative';

            const img = document.createElement('img');
            img.src = item.images;
            img.alt = `Image ${index + 1}`;
            img.style.width = '100%';
            img.style.height = 'auto';

            const caption = document.createElement('div');
            caption.style.position = 'absolute';
            caption.style.bottom = '10px';
            caption.style.left = '10px';
            caption.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            caption.style.color = 'white';
            caption.style.padding = '10px';
            caption.style.borderRadius = '5px';

            const titleElement = document.createElement('h5');
            titleElement.textContent = item.title;
            titleElement.style.color = 'white';
            caption.appendChild(titleElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = item.deskripsi;
            caption.appendChild(descriptionElement);

            carouselItem.appendChild(img);
            carouselItem.appendChild(caption);
            carouselInner.appendChild(carouselItem);
        });

        carouselContainer.appendChild(carouselInner);

        // Create carousel indicators
        const indicatorsContainer = document.createElement('ol');
        indicatorsContainer.classList.add('carousel-indicators');
        indicatorsContainer.style.position = 'absolute';
        indicatorsContainer.style.bottom = '10px';
        indicatorsContainer.style.left = '50%';
        indicatorsContainer.style.transform = 'translateX(-50%)';
        indicatorsContainer.style.display = 'flex';
        indicatorsContainer.style.padding = '0';
        indicatorsContainer.style.margin = '0';
        indicatorsContainer.style.listStyle = 'none';
        indicatorsContainer.style.zIndex = '10';

        elm.action.forEach((_, index) => {
            const indicator = document.createElement('li');
            indicator.dataset.target = '#carouselID';
            indicator.dataset.slideTo = index;
            if (index === 0) indicator.classList.add('active');
            indicator.style.width = '12px';
            indicator.style.height = '12px';
            indicator.style.backgroundColor = '#bbb'; // Inactive color
            indicator.style.borderRadius = '50%';
            indicator.style.margin = '0 5px';
            indicator.style.cursor = 'pointer';
            indicator.style.transition = 'background-color 0.3s'; // Smooth transition for color change
            indicatorsContainer.appendChild(indicator);
        });

        carouselContainer.appendChild(indicatorsContainer);

        // Create previous button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&#10094;';
        prevButton.style.position = 'absolute';
        prevButton.style.top = '50%';
        prevButton.style.left = '10px';
        prevButton.style.width = '50px';
        prevButton.style.height = '50px';
        prevButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        prevButton.style.color = 'white';
        prevButton.style.border = 'none';
        prevButton.style.cursor = 'pointer';
        prevButton.style.transform = 'translateY(-50%)';
        prevButton.setAttribute('aria-label', 'Previous Slide');
        prevButton.addEventListener('click', () => {
            prevSlide();
            resetInterval(); // Reset the interval when navigating manually
        });

        // Create next button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&#10095;';
        nextButton.style.position = 'absolute';
        nextButton.style.top = '50%';
        nextButton.style.right = '10px';
        nextButton.style.width = '50px';
        nextButton.style.height = '50px';
        nextButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        nextButton.style.color = 'white';
        nextButton.style.border = 'none';
        nextButton.style.cursor = 'pointer';
        nextButton.style.transform = 'translateY(-50%)';
        nextButton.setAttribute('aria-label', 'Next Slide');
        nextButton.addEventListener('click', () => {
            nextSlide();
            resetInterval(); // Reset the interval when navigating manually
        });
        carouselContainer.appendChild(prevButton);
        carouselContainer.appendChild(nextButton);
        document.getElementById(elm.elementById).appendChild(carouselContainer);
        let currentIndex = 0;
        let intervalId;
        function showSlide(index) {
            const slides = carouselInner.children;
            if (index >= slides.length) currentIndex = 0;
            if (index < 0) currentIndex = slides.length - 1;

            const offset = -currentIndex * 100;
            carouselInner.style.transform = `translateX(${offset}%)`;

            // Update indicators
            const indicators = indicatorsContainer.children;
            Array.from(indicators).forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
                indicator.style.backgroundColor = i === currentIndex ? '#333' : '#bbb'; // Active and inactive colors
            });
        }

        function nextSlide() {
            currentIndex++;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex--;
            showSlide(currentIndex);
        }

        function startAutoSlide() {
            intervalId = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        }

        function resetInterval() {
            clearInterval(intervalId);
            startAutoSlide();
        }

        // Initialize the carousel
        showSlide(currentIndex);
        startAutoSlide();

        // Pause auto slide on mouse over and resume on mouse out
        carouselContainer.addEventListener('mouseover', () => {
            clearInterval(intervalId);
        });

        carouselContainer.addEventListener('mouseout', () => {
            resetInterval();
        });

        // Add event listener to indicators
        indicatorsContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'LI') {
                const slideTo = parseInt(event.target.dataset.slideTo, 10);
                currentIndex = slideTo;
                showSlide(currentIndex);
                resetInterval(); // Reset the interval when navigating manually
            }
        });
  
}
