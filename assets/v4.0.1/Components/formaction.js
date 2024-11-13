
// Fungsi untuk membuat form
export function formAction(config) {
    const Tds=new Dom.Components();
    const form = document.createElement('form');
    form.action = "";
    form.method = "POST";
    form.role = "form";
    // Buat elemen div baru dengan kelas "row row-xl"
    const row = document.createElement('div');
    row.className = "row row-xl";
    // Bersihkan elemen form yang sudah ada (jika ada) di dalam elemen dengan ID yang diberikan
    const keysbit = Object.keys(config.action);
    document.getElementById(config.elementById).innerHTML = '';
    if (config.quill) {
      var retData = Tds.storageRed(config.storage, config.key,keysbit);
    } else {
      var retData = Tds.storageKey(config.storage, config.key,keysbit);

    }
    // Buat array untuk menyimpan ID field untuk validasi
    const fieldIDs = [];
    // Iterasi melalui konfigurasi aksi untuk membuat grup form
    for (const [key, [type, colSize, label, placeholder, position, iconClass, minLength,valueLabel]] of Object.entries(config.action)) {
        // Buat elemen div baru untuk kolom
        if (label) {
            var ud=''; 
            var udF=label; 
        } else {
            var ud=' hidden';
            var udF=''; 
        }
        const col = document.createElement('div');
        col.className = `col-md-${colSize} form-group`;
        // Buat elemen span kecil untuk label
        const labelSpan = document.createElement('small');
        labelSpan.id = `label_${key}`;
        labelSpan.className = `label_${key}` +ud;
        labelSpan.textContent = label; // Tetapkan teks label

        // Buat kontainer grup input
        const inputGroup = document.createElement('div');
        inputGroup.className = "input-group";

        // Buat elemen input baru
        const input = document.createElement('input');
        input.type = type;
        input.className = "form-control";
        input.name = key;


       if (valueLabel) {
           input.value = valueLabel;
        } 
        if (config.status==="update") {
           input.value = retData[key];
        }
        input.placeholder = placeholder + " " + udF;
        input.setAttribute('aria-label', label);

        // Tetapkan atribut panjang minimum jika diberikan
        if (minLength && minLength > 0) {
            input.setAttribute('minlength', minLength);
        }

        // Buat elemen div untuk ikon input group append
        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.className = "input-group-append" +ud;

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
            // Tambahkan input dan ikon toggle ke kontainer
             if (position === 'left') {
                 inputContainer.appendChild(toggleIcon);
                 inputContainer.appendChild(input);
             } else if (position === 'right') {
                 inputContainer.appendChild(input);
                 inputContainer.appendChild(toggleIcon);
             }
              // Tambahkan kontainer ke kolom
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
        } else if (type === 'element') {
          var neWelement = document.createElement("input");
           var newDiv = document.createElement("div");
          newDiv.innerHTML = placeholder;
          neWelement.type = "hidden";
          neWelement.name=key;
          neWelement.value=minLength;
          col.appendChild(neWelement);
          col.appendChild(newDiv);

        } else if (type === 'select') {
          const selectlSpan = document.createElement('small');
          const selectlDiv = document.createElement('div');
          selectlSpan.id = `label_${key}`;
          selectlDiv.id = `selectID_${key}`;
          selectlSpan.textContent = label; // Tetapkan teks label 
          col.appendChild(selectlSpan);
          col.appendChild(selectlDiv);


        } else if (type === 'search') {
          const selectlSpan = document.createElement('small');
          const selectlDiv = document.createElement('div');
          selectlSpan.id = `label_${key}`;
          selectlDiv.id = `suggestions_${key}`;
          selectlSpan.textContent = label; // Tetapkan teks label 
         const searchFormDiv = document.createElement('div');
         searchFormDiv.className = 'search-form';
         // Membuat elemen <input>
         const inputElement = document.createElement('input');
         inputElement.id = "search"+key;
         inputElement.type = 'search';
         inputElement.name = key;
         inputElement.className = 'form-control';
         inputElement.placeholder =placeholder + " " + label;
         inputElement.autocomplete = 'off';
         
         // Membuat elemen <button>
         const buttonElement = document.createElement('button');
         buttonElement.className = 'btn';
         buttonElement.type = 'button';
         // Membuat elemen <i> untuk ikon dan menambahkannya ke tombol
         const iconElement = document.createElement('i');
         iconElement.setAttribute('class', iconClass);
         // Menambahkan elemen <i> ke <button>
         buttonElement.appendChild(iconElement);
         
         // Menambahkan elemen <input> dan <button> ke <div>
         searchFormDiv.appendChild(inputElement);
         searchFormDiv.appendChild(buttonElement);
          col.appendChild(selectlSpan);
          col.appendChild(searchFormDiv);
          col.appendChild(selectlDiv);
        } else if (type === 'texteditor') {
          var newDiv = document.createElement("div");
          newDiv.classList.add("texteditor");
          newDiv.id ="area"+key;
    
          var newInput = document.createElement("input");
          newInput.type = "hidden";
          newInput.name =key;
          // newInput.value = "Masukkan teks di sini";
           if (config.status==="update") {
                newDiv.innerHTML=retData[key]
                newInput.value=retData[key]
            
            }
          newInput.classList.add("myInputClass");
          newInput.id = "inputId"+key;
          col.appendChild(newInput);
          col.appendChild(newDiv);
        } else {
            // Posisikan ikon
            if (position === 'left') {
                inputGroupAppend.appendChild(iconSpan);
                inputGroup.appendChild(inputGroupAppend);
                inputGroup.appendChild(input);
                col.appendChild(labelSpan);
                col.appendChild(inputGroup);
            } else if (position === 'right') {
                inputGroup.appendChild(input);
                inputGroupAppend.appendChild(iconSpan);
                inputGroup.appendChild(inputGroupAppend);
                col.appendChild(labelSpan);
                col.appendChild(inputGroup);
            } else {
                // inputGroupAppend.appendChild(iconSpan);
                // inputGroup.appendChild(inputGroupAppend);
                inputGroup.appendChild(input);
                col.appendChild(labelSpan);
                col.appendChild(inputGroup);
            }
            // Tambahkan grup input ke kolom
          
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
        var nmsendclassName = config.footer.class ? config.footer.class : '';
        var nmsendStalye = config.footer.styleTop ? config.footer.styleTop : '';
        var btn = nmsendclassName === 'block' ? 'btn-block' : '';
        var nmsend = config.footer.save;
        var nmcancel = config.footer.cancel;
        footer.className = "form-group mb-10px pt-10px " + nmsendclassName;
        footer.style.paddingTop =nmsendStalye;

        // Buat tombol Simpan
        const saveButton = document.createElement('button');
        saveButton.type = "button";
        saveButton.className = "btn bold btn-" + nmsend[1] + " " + btn;
        saveButton.innerHTML = nmsend[2] ? '<i class="' + nmsend[2] + '"></i> ' + nmsend[0] : nmsend[0];

        // Simpan teks asli tombol
        const originalButtonText = saveButton.innerHTML;

        // Tambahkan event listener untuk tombol Simpan
        saveButton.addEventListener('click', () => {
           
            saveButton.disabled = true;
            saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
           
            form.send(config).then((formData) => {
                return sendDataToServer(config.status, config.cradensial, "info_" + config.elementById, config, formData);
            }).then(() => {
                setTimeout(() => {
                    saveButton.disabled = false;
                    saveButton.innerHTML = originalButtonText;
                }, 1000); // Delay 1 detik
            }).catch((error) => {
                // console.error('Error:', error);
                // setTimeout(() => {
                    saveButton.disabled = false;
                    saveButton.innerHTML = originalButtonText;
                // }, 1000); // Delay 1 detik
            });
        });

        if (nmcancel[0]) {
            // Buat tombol Batal
            const cancelButton = document.createElement('button');
            cancelButton.type = "button";
            // cancelButton.id = "cancel";
            cancelButton.className = "btn bold btn-" + nmcancel[1];
            cancelButton.innerHTML = nmcancel[2] ? '<i class="' + nmcancel[2] + '"></i> ' + nmcancel[0] : nmcancel[0];
            // Tambahkan event listener untuk tombol Batal
            cancelButton.addEventListener('click', () => {
                // Tangani aksi batal
                Tds.closeModal()
                // document.getElementById(config.elementById).innerHTML = '';
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
    return new Promise((resolve, reject) => {
    
        const { isValid, formData } = validasiSend(fieldIDs, form, config.cradensial, config.status, "info_" + config.elementById, config);
        //console.log('Hasil dari validasiSend:', { isValid, formData });

        if (isValid && typeof config.sendCallback === 'function') {
           // console.log('Memanggil sendCallback...');
            config.sendCallback(formData);
            resolve(formData);
              $(
          'input[type="file"], input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="url"], input[type="tel"], input[type="date"], select, textarea'
        ).val("");
        } else {
            console.log('Menolak promise karena data tidak valid atau callback tidak tersedia');
            reject(new Error('Data formulir tidak valid atau callback tidak tersedia'));
        }
    });
};
}

// Fungsi untuk validasi data dan penyimpanan
export function validasiSend(fieldIDs, form, cradensial='', status='', idInfo='', config) {
    let isValid = true;
    const Tds = new Dom.Components();
    const keysbit = Object.keys(config.action);
    const formData = {};
    fieldIDs.forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        const infoSpan = document.getElementById(`info_${key}`);
        const labelElement = document.getElementById(`label_${key}`);
        
        if (!input) {
            console.error(`Element dengan name ${key} tidak ditemukan.`);
            return;
        }

        const inputValue = input.value.trim();
        const inputType = input.type;
        const label = labelElement ? labelElement.textContent : key;
        // Selalu tambahkan nilai ke formData
        formData[key] = inputValue;
        if (!inputValue) {
            isValid = false;
            if (infoSpan) infoSpan.textContent = `${label} tidak boleh kosong`;
        } else if (inputType === 'url' && !isValidURL(inputValue)) {
            isValid = false;
            if (infoSpan) infoSpan.textContent = `${label} harus berupa URL yang valid`;
        } else {
            if (infoSpan) infoSpan.textContent = '';
        }
    });
    return { isValid, formData };
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

export function sendDataToServer(status, cradensial, idInfo, config,formData) {
    if (navigator.onLine) {
        // Implementasi pengiriman data ke server di sini
        //console.log('Mengirim data ke server:', formData);
    } else {
        console.log('Saat ini offline. Data tidak dapat dikirim.');
    }
}
