export function Gradients(config) {
    // Definisikan konstanta
    const GRADIENT_CLASSES = ['gradient-0', 'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5'];
    const DEFAULT_GRADIENT = 'gradient-0';
    // Fungsi untuk mendapatkan daftar elementIds
    function getElementIds() {
        return config.getElementIds; // Tambahkan ID elemen lain sesuai kebutuhan
    }

    // Fungsi untuk menerapkan gradien
    function applyGradient(gradientNumber) {
        const elementIds = getElementIds();
        
        elementIds.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                // Hapus semua kelas gradien yang mungkin ada sebelumnya
                element.classList.remove(...GRADIENT_CLASSES);
                // Tambahkan kelas gradien baru
                element.classList.add(GRADIENT_CLASSES[gradientNumber]);
            }
        });
        // Simpan gradien yang dipilih ke localStorage
        localStorage.setItem('selectedGradient', gradientNumber);
    }

    // Fungsi untuk memuat gradien yang tersimpan
    function loadSavedGradients() {
        const elementIds = getElementIds();
        const savedGradient = localStorage.getItem('selectedGradient');
        elementIds.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                if (savedGradient !== null) {
                    element.classList.remove(...GRADIENT_CLASSES);
                    element.classList.add(GRADIENT_CLASSES[savedGradient]);
                } else {
                    // Jika tidak ada gradien yang tersimpan, gunakan default
                    element.classList.add(DEFAULT_GRADIENT);
                }
            }
        });
    }

    function createGradientPicker() {
        const gradientPicker = document.getElementById(config.elementById);
        if (!gradientPicker) {
            console.error('Elemen dengan id "gradientPicker" tidak ditemukan');
            return;
        }
        
        const wrapper = document.createElement('div');
        wrapper.className = 'pt-10px';
        
        const imgGroup = document.createElement('div');
        imgGroup.className = 'img-group pull-'+config.position;
        
        for (let i = 0; i < GRADIENT_CLASSES.length; i++) {
            const span = document.createElement('span');
            span.onclick = () => applyGradient(i);
            span.className = `cursor img wd-20 ht-20 mr-${i === GRADIENT_CLASSES.length - 1 ? '10' : '30'}px rounded-circle ${GRADIENT_CLASSES[i]} bd bd-white`;
            imgGroup.appendChild(span);
        }
        
        wrapper.appendChild(imgGroup);
        gradientPicker.appendChild(wrapper);
    }

    // Fungsi inisialisasi
    function init() {
        loadSavedGradients();
        createGradientPicker();
    }

    // Objek yang akan diekspor
    const GradientsObj = {
        init,
        applyGradient,
        loadSavedGradients,
        createGradientPicker
    };

    return GradientsObj;
}