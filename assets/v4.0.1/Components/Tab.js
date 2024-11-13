export function Tab(attr) {
    // Fungsi untuk menampilkan tab
    function showTab(tabId) {
        // Sembunyikan semua konten tab dan hapus kelas aktif dari semua tombol
        const contents = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-button');
        contents.forEach(content => content.style.display = 'none');
        buttons.forEach(button => button.classList.remove('active'));

        // Tampilkan konten tab yang dipilih
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }

        // Tandai tombol tab sebagai aktif
        const selectedButton = Array.from(buttons).find(button => button.getAttribute('data-id') === tabId);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }

        // Simpan tab yang dipilih ke localStorage
        localStorage.setItem('selectedTab' + attr.elementById, tabId);
    }

    // Fungsi untuk membuat elemen tombol tab berdasarkan template
    function createTabButton(tab) {
        // Ganti placeholder dalam template dengan data aktual
        let buttonHTML = attr.template
            .replace('id', tab.id)
            .replace('title', tab.title)
            .replace('icon', tab.icon ? tab.icon : '');

        // Buat elemen dari HTML string
        const buttonElement = document.createElement('div');
        buttonElement.innerHTML = buttonHTML;

        const button = buttonElement.firstChild;
        button.classList.add('tab-button'); // Tambahkan kelas 'tab-button' untuk seleksi nanti
        button.setAttribute('data-id', tab.id); // Set atribut 'data-id' sesuai dengan tab.id
        button.style.cursor = 'pointer';
        button.onclick = (e) => {
            e.preventDefault(); // Mencegah navigasi default dari <a>
            showTab(tab.id);
        };
        return button;
    }

    const tabsContainer = document.getElementById(attr.elementById);

    // Buat tombol tab berdasarkan konfigurasi
    attr.action.forEach(tab => {
        const button = createTabButton(tab);
        tabsContainer.appendChild(button);
    });

    // Muat tab yang terakhir dipilih dari localStorage
    const savedTab = localStorage.getItem('selectedTab' + attr.elementById);
    if (savedTab) {
        showTab(savedTab);
    } else if (attr.action.length > 0) {
        // Secara default, tampilkan tab pertama
        showTab(attr.action[0].id);
    }
}
