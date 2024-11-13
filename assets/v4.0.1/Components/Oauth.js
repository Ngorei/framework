// Fungsi untuk membuat form
export function Oauth(config) {
    // Buat elemen form baru
    const form = document.createElement('form');
    form.action = "";
    form.method = "POST";
    form.role = "form";

    // Buat elemen div baru dengan kelas "row row-xl"
    const row = document.createElement('div');
    row.className = "row row-xl";

    // Bersihkan elemen form yang sudah ada (jika ada) di dalam elemen dengan ID yang diberikan
    document.getElementById(config.elementById).innerHTML = '';

    // Buat array untuk menyimpan ID field untuk validasi
    const fieldIDs = [];

    // Iterasi melalui konfigurasi aksi untuk membuat grup form
    for (const [key, [type, colSize, label, placeholder, position, iconClass, minLength]] of Object.entries(config.action)) {
        // Buat elemen div baru untuk kolom
        const col = document.createElement('div');
        col.className = `col-md-${colSize} form-group`;

        // Buat elemen span kecil untuk label
        const labelSpan = document.createElement('small');
        labelSpan.id = `label_${key}`;
        labelSpan.textContent = label; // Tetapkan teks label

        // Buat kontainer grup input
        const inputGroup = document.createElement('div');
        inputGroup.className = "input-group";

        // Buat elemen input baru
        const input = document.createElement('input');
        input.type = type;
        input.className = "form-control";
        input.name = key;
        input.placeholder = placeholder + " " + label;
        input.setAttribute('aria-label', label);

        // Tetapkan atribut panjang minimum jika diberikan
        if (minLength && minLength > 0) {
            input.setAttribute('minlength', minLength);
        }

        // Buat elemen div untuk ikon input group append
        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.className = "input-group-append";

        // Buat elemen span untuk ikon
        const iconSpan = document.createElement('span');
        iconSpan.className = "input-group-text";
        iconSpan.innerHTML = `<i class="${iconClass}"></i>`; // Tambahkan ikon berdasarkan kelas

        // Tangani visibilitas toggle untuk input password
        if (type === 'password') {
            // Buat kontainer untuk input dan ikon
            const inputContainer = document.createElement('div');
            inputContainer.className = "input-group";
            // Buat ikon mata untuk toggle visibilitas password
            const toggleIcon = document.createElement('span');
            toggleIcon.className = "input-group-text";
            toggleIcon.innerHTML = `<i class="fa fa-eye-slash"></i>`;
            toggleIcon.style.cursor = 'pointer';

           if (position === 'left') {
               inputContainer.appendChild(toggleIcon);
               inputContainer.appendChild(input);
           } else if (position === 'right') {
               inputContainer.appendChild(input);
               inputContainer.appendChild(toggleIcon);
           }
            col.appendChild(labelSpan);
            col.appendChild(inputContainer);
            // Tambahkan event listener untuk toggle visibilitas password
            toggleIcon.addEventListener('click', () => {
                if (input.type === 'password') {
                    input.type = 'text';
                    toggleIcon.innerHTML = '<i class="fa fa-eye"></i>';
                } else {
                    input.type = 'password';
                    toggleIcon.innerHTML = '<i class="fa fa-eye-slash"></i>';
                }
            });

        
input.addEventListener('input', () => {
    const password = input.value;
    if (password) {
        const strength = evaluatePasswordStrength(password);
       labelSpan.textContent =`Kekuatan Password: ${strength}`;
        // strengthIndicator.style.display = 'block'; // Tampilkan indikator
    } else {
        labelSpan.textContent = label;
        // strengthIndicator.style.display = 'none'; // Sembunyikan indikator
    }
});



        } else if (type === 'select') {
          const selectlSpan = document.createElement('small');
          const selectlDiv = document.createElement('div');
          selectlSpan.id = `label_${key}`;
          selectlDiv.id = `selectID_${key}`;
          selectlSpan.textContent = label; // Tetapkan teks label 
          col.appendChild(selectlSpan);
          col.appendChild(selectlDiv);



        } else {
            // Posisikan ikon
            if (position === 'left') {
                inputGroupAppend.appendChild(iconSpan);
                inputGroup.appendChild(inputGroupAppend);
                inputGroup.appendChild(input);
            } else if (position === 'right') {
                inputGroup.appendChild(input);
                inputGroupAppend.appendChild(iconSpan);
                inputGroup.appendChild(inputGroupAppend);
            }
            // Tambahkan grup input ke kolom
            col.appendChild(labelSpan);
            col.appendChild(inputGroup);
        }
        // Buat dan tambahkan elemen span info
        const infoSpan = document.createElement('span');
        infoSpan.id = `info_${key}`;
        infoSpan.className = "info_input error-message"; // Terapkan gaya pesan error
        col.appendChild(infoSpan);
        // Tambahkan kolom ke baris
        row.appendChild(col);
        // Simpan ID field untuk validasi
        fieldIDs.push(key);
    }

    // Tambahkan baris ke form
    form.appendChild(row);

    // Buat elemen div untuk footer
    if (config.footer) {
        const footer = document.createElement('div');
        var nmsendclassName = config.footer.style ? config.footer.style : '';
        var btn = nmsendclassName === 'block' ? 'btn-block' : '';
        var nmsend = config.footer.save;
        var nmcancel = config.footer.cancel;
        footer.className = "form-group " + nmsendclassName;
        // Buat tombol Simpan
        const saveButton = document.createElement('button');
        saveButton.type = "button";
        saveButton.className = "btn bold btn-" + nmsend[1] + " " + btn;
        saveButton.innerHTML = nmsend[2] ? '<i class="' + nmsend[2] + '"></i> ' + nmsend[0] : nmsend[0];

        // Tambahkan event listener untuk tombol Simpan
        saveButton.addEventListener('click', () => {
            form.send(); // Panggil metode send ketika tombol Simpan diklik
        });

        if (nmcancel[0]) {
            // Buat tombol Batal
            const cancelButton = document.createElement('button');
            cancelButton.type = "button";
            cancelButton.className = "btn bold btn-" + nmcancel[1];
            cancelButton.innerHTML = nmcancel[2] ? '<i class="' + nmcancel[2] + '"></i> ' + nmcancel[0] : nmcancel[0];

            // Tambahkan event listener untuk tombol Batal
            cancelButton.addEventListener('click', () => {
                document.getElementById(config.elementById).innerHTML = '';
            });

            // Tambahkan tombol Batal ke footer
            footer.appendChild(cancelButton);
        }

        // Tambahkan tombol Simpan ke footer
        footer.appendChild(saveButton);

        // Tambahkan footer ke form
        form.appendChild(footer);
    }

    // Tambahkan form ke dalam elemen dengan ID yang diberikan
    document.getElementById(config.elementById).appendChild(form);

    // Tambahkan metode send ke prototipe form
    form.send = function() {
        const formData = validasiSend(fieldIDs, form, config.cradensial, config.status, "info_" + config.elementById, config);
        if (formData && typeof config.sendCallback === 'function') {
            config.sendCallback(formData); // Panggil callback yang diberikan dengan data valid
        }
    };
}
export function evaluatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) {
        return 'Lemah';
    } else if (strength <= 3) {
        return 'Standar';
    } else {
        return 'Kuat';
    }
}
// Fungsi untuk validasi data dan penyimpanan
export function validasiSend(fieldIDs, form, cradensial='', status='', idInfo='', config) {
    let isValid = true;
    const formData = {};
    const Tabel = cradensial ? "FROM_" + cradensial : 'formEntries';

    fieldIDs.forEach(key => {
        const input = document.querySelector(`input[name=${key}]`);
        const infoSpan = document.getElementById(`info_${key}`);
        const minLength = input.getAttribute('minlength');
        if (!input.value.trim()) {
            isValid = false;
            infoSpan.textContent = `${document.getElementById(`label_${key}`).textContent} tidak boleh kosong`;
        } else if (minLength && input.value.trim().length < parseInt(minLength, 10)) {
            isValid = false;
            infoSpan.textContent = `${document.getElementById(`label_${key}`).textContent} harus memiliki minimal ${minLength} karakter`;
        } else {
            infoSpan.textContent = '';
            formData[key] = input.value.trim(); // Store validated input values
        }
    });

    if (isValid) {
        // Get existing data from localStorage or initialize an empty array
        let storedData = JSON.parse(localStorage.getItem(Tabel)) || [];
        // Add the new form data to the array
        storedData.push(formData);
        // Save updated data to localStorage
        localStorage.setItem(Tabel, JSON.stringify(storedData));
        if (status !=="signup") {
            fieldIDs.forEach(key => {
                document.querySelector(`input[name=${key}]`).value = '';
            });    
        }


        if (navigator.onLine) {
            if (cradensial) {
                sendDataToServer(status, cradensial, idInfo, config);
            }
        } else {
            console.log('Anda sedang offline. Data Anda telah disimpan dan akan dikirim setelah Anda kembali online.');
        }

        return formData; // Return form data if valid
    }
}

// Fungsi untuk mengirim data ke server
export function sendDataToServer(status, cradensial, idInfo, config) {
    const Tabel = "FROM_" + cradensial;
    const storedData = JSON.parse(localStorage.getItem(Tabel)) || [];
    if (storedData.length > 0 && navigator.onLine) { // Cek status online
        new Dom.Storage().Oauth({
            "endpoint": cradensial, //Large|Content
            "tabel": Tabel,
            "status": status,
            "data": storedData,
            "idInfo": idInfo,
            "config": config,
        });
    } else if (!navigator.onLine) {
        console.log('Saat ini offline. Data akan dikirim ketika kembali online.');
    }
}

// Periksa status online dan kirim data saat jaringan kembali
window.addEventListener('online', () => sendDataToServer(status, cradensial, idInfo, config));
