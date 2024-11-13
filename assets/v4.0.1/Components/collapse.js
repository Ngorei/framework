export function Collapse(options) {
        const defaultOptions = {
          elementById: "switch-collapse",
          Close: "fa fa-caret-down",
          Open: "fa fa-caret-up",
        };
        const mergedOptions = { ...defaultOptions, ...options };

        const container = document.getElementById(mergedOptions.elementById);
        if (!container) {
          console.error(
            `Element dengan ID "${mergedOptions.elementById}" tidak ditemukan.`
          );
          return;
        }

        const elements = container.querySelectorAll(".switch-content");

        elements.forEach((element) => {
          const switchIcon = element.querySelector(".switch-icon");
          switchIcon.innerHTML = `<i class="${mergedOptions.Close}"></i>`;

          element.addEventListener("click", function () {
            this.classList.toggle("terbuka");
            const content = this.nextElementSibling;

            if (content.style.maxHeight) {
              content.style.maxHeight = null;
              switchIcon.innerHTML = `<i class="${mergedOptions.Close}"></i>`;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
              switchIcon.innerHTML = `<i class="${mergedOptions.Open}"></i>`;
            }
          });
        });
    // const links = config.action;
    //        const toggleDiv = document.getElementById(config.elementById);
    //         const collapseContent = document.getElementById(config.content);
    //         // Mengatur gaya CSS untuk elemen Collapse
    //         collapseContent.style.overflow = 'hidden';
    //         collapseContent.style.transition = 'max-height 0.3s ease-out';
    //         collapseContent.style.maxHeight = '0'; // Mulai dengan konten tersembunyi
    //         collapseContent.style.display = 'none'; // Mulai dengan konten tersembunyi
    //         // Mengatur gaya CSS untuk div yang bertindak sebagai tombol
    //         toggleDiv.style.cursor = 'pointer';
    //         // toggleDiv.style.padding = '10px';
    //         // toggleDiv.style.backgroundColor = '#007bff';
    //         // toggleDiv.style.color = 'white';
    //         // toggleDiv.style.textAlign = 'center';
    //         // toggleDiv.style.borderRadius = '5px';
    //         toggleDiv.style.userSelect = 'none'; // Menghindari seleksi teks saat diklik

    //         // Gaya saat hover
    //         toggleDiv.addEventListener('mouseover', function() {
    //             //toggleDiv.style.backgroundColor = '#0056b3';
    //         });
    //         toggleDiv.addEventListener('mouseout', function() {
    //             //toggleDiv.style.backgroundColor = '#007bff';
    //         });

    //         toggleDiv.addEventListener('click', function() {
    //             if (collapseContent.style.maxHeight === '0px') {
    //                 // Konten sedang tersembunyi, tampilkan
    //                 collapseContent.style.display = 'block';
    //                 collapseContent.style.maxHeight = collapseContent.scrollHeight + 'px';
    //             } else {
    //                 // Konten sedang ditampilkan, sembunyikan
    //                 collapseContent.style.maxHeight = '0';
    //                 collapseContent.style.display = 'none';
    //             }
    //         });
}
