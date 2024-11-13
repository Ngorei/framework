import { decryptObject, setToken, user_id, getCookie } from "../ngorei.js";

/**
 * Fungsi utama untuk membuat formulir dinamis
 * @param {Object} config - Konfigurasi untuk pembuatan formulir
 */
export function drive(config) {
  const Tds = new Dom.Components();
  const basisData = window.Ngorei;
  const red = decryptObject(basisData.tokenize, "manifestStorage");
  const keysbit = Object.keys(config.action);
  if (config.quill) {
    var retData = Tds.storageRed(config.storage, config.key, keysbit);
  } else {
    var retData = Tds.storageKey(config.storage, config.key, keysbit);
  }

  // Periksa apakah config.elementById ada dan valid
  if (!config.elementById) {
    console.error("config.elementById tidak ditentukan");
    return;
  }

  // Coba dapatkan elemen target ""
  const targetElement = document.getElementById(config.elementById);
  if (!targetElement) {
    console.error(`Elemen dengan ID ${config.elementById} tidak ditemukan.`);
    return;
  }

  if (config.status === "update") {
    var dataset = Tds.storageKey(config.storage, config.key);
  } else {
    var dataset = false;
  }

  // Buat form baru
  const form = document.createElement("form");
  form.action = "";
  form.method = "POST";
  form.id = "from_" + config.elementById;
  form.role = "form";
  form.enctype = "multipart/form-data";

  // Buat elemen div baru dengan kelas "row row-xl"
  const row = document.createElement("div");
  row.className = "row row-xl pt-10px pb-10px";

  // Bersihkan elemen target dan tambahkan form baru
  targetElement.innerHTML = "";
  targetElement.appendChild(form);
  form.appendChild(row);

  // Buat array untuk menyimpan ID field untuk validasi
  const fieldIDs = [];

  // Iterasi melalui konfigurasi aksi untuk membuat grup form
  for (const [
    key,
    [type, colSize, label, placeholder, position, iconClass, minLength],
  ] of Object.entries(config.action)) {
    // Buat elemen div baru untuk kolom
    const col = document.createElement("div");
if (type === "file") {
    col.className = `col-md-${colSize} form-group`;
} else {
    col.className = `col-md-${colSize} form-group mb-5px`;

}

    // Buat elemen span kecil untuk label
    const labelSpan = document.createElement("small");
    labelSpan.id = `label_${key}`;
    labelSpan.textContent = label; // Tetapkan teks label

    // Buat kontainer grup input
    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    // Buat elemen input baru
    const input = document.createElement("input");
    input.type = type;
    input.className = "form-control";
    input.name = key;
    if (config.status === "update") {
      if (key !== "thumbnail") {
        input.value = retData[key];
      }
    }
    input.placeholder = placeholder + " " + label;
    input.setAttribute("aria-label", label);

    // Tetapkan atribut panjang minimum jika diberikan
    if (minLength && minLength > 0) {
      input.setAttribute("minlength", minLength);
    }

    // Buat elemen div untuk ikon input group append
    const inputGroupAppend = document.createElement("div");
    inputGroupAppend.className = "input-group-append";

    // Buat elemen span untuk ikon
    const iconSpan = document.createElement("span");
    iconSpan.className = "input-group-text";
    iconSpan.innerHTML = `<i class="${iconClass}"></i>`; // Tambahkan ikon berdasarkan kelas

    // Tangani visibilitas toggle untuk input password
    if (type === "password") {
      // Buat kontainer untuk input dan ikon
      const inputContainer = document.createElement("div");
      inputContainer.className = "input-group";
      // Buat ikon mata untuk toggle visibilitas password
      const toggleIcon = document.createElement("span");
      toggleIcon.className = "input-group-text";
      toggleIcon.innerHTML = `<i class="fa fa-eye-slash"></i>`;
      toggleIcon.style.cursor = "pointer";
      // Tambahkan input dan ikon toggle ke kontainer
      if (position === "left") {
        inputContainer.appendChild(toggleIcon);
        inputContainer.appendChild(input);
      } else if (position === "right") {
        inputContainer.appendChild(input);
        inputContainer.appendChild(toggleIcon);
      }
      // Tambahkan kontainer ke kolom
      col.appendChild(labelSpan);
      col.appendChild(inputContainer);
      // Tambahkan event listener untuk toggle visibilitas password
      toggleIcon.addEventListener("click", () => {
        if (input.type === "password") {
          input.type = "text";
          toggleIcon.innerHTML = '<i class="fa fa-eye"></i>';
        } else {
          input.type = "password";
          toggleIcon.innerHTML = '<i class="fa fa-eye-slash"></i>';
        }
      });
    } else if (type === "select") {
      const selectlSpan = document.createElement("small");
      const selectlDiv = document.createElement("div");
      selectlSpan.id = `label_${key}`;
      selectlDiv.id = `selectID_${key}`;
      selectlSpan.textContent = label; // Tetapkan teks label
      col.appendChild(selectlSpan);
      col.appendChild(selectlDiv);
    } else if (type === "search") {
      const selectlSpan = document.createElement("small");
      const selectlDiv = document.createElement("div");
      selectlSpan.id = `label_${key}`;
      selectlDiv.id = `suggestions_${key}`;
      selectlSpan.textContent = label; // Tetapkan teks label
      const searchFormDiv = document.createElement("div");
      searchFormDiv.className = "search-form";
      // Membuat elemen <input>
      const inputElement = document.createElement("input");
      inputElement.id = "search" + key;
      inputElement.type = "search";
      inputElement.name = key;
      inputElement.className = "form-control";
      inputElement.placeholder = placeholder + " " + label;
      inputElement.autocomplete = "off";

      // Membuat elemen <button>
      const buttonElement = document.createElement("button");
      buttonElement.className = "btn";
      buttonElement.type = "button";
      // Membuat elemen <i> untuk ikon dan menambahkannya ke tombol
      const iconElement = document.createElement("i");
      iconElement.setAttribute("class", iconClass);
      // Menambahkan elemen <i> ke <button>
      buttonElement.appendChild(iconElement);

      // Menambahkan elemen <input> dan <button> ke <div>
      searchFormDiv.appendChild(inputElement);
      searchFormDiv.appendChild(buttonElement);
      col.appendChild(selectlSpan);
      col.appendChild(searchFormDiv);
      col.appendChild(selectlDiv);
    } else if (type === "texteditor") {
      var newDiv = document.createElement("div");
      newDiv.classList.add("texteditor");
      newDiv.id = "area" + key;
      var newInput = document.createElement("input");
      newInput.type = "hidden";
      // newInput.value = "Masukkan teks di sini";
      if (config.status === "update") {
        newDiv.innerHTML = retData[key];
        newInput.value = retData[key];
      }
      newInput.placeholder = "Masukkan teks di sini";
      newInput.name = key;
      newInput.classList.add("myInputClass");
      newInput.id = "inputId" + key;
      col.appendChild(newInput);
      col.appendChild(newDiv);
} else if (type === "textarea") {
  const textarea = document.createElement("textarea");
  textarea.className = "form-control";
  textarea.name = key;
  textarea.id = key;
  textarea.placeholder = placeholder + " " + label;
  textarea.setAttribute("aria-label", label);
  
  if (config.status === "update" && retData[key]) {
    textarea.value = retData[key];
  }
  // Jika ada atribut rows, tambahkan ke textarea
  if (config.action[key][7]) {
    textarea.rows = config.action[key][7];
  }
  col.appendChild(labelSpan);
  col.appendChild(textarea);

  
    } else if (type === "file") {
      if (config.status === "update") {
        if (key == "thumbnail") {
          var img = red.endpoint + "img/" + retData[key];
        }
      } else {
        var img = window.Ngorei.baseURL + "img/Drive.png";
      }
      const data = [
        {
          imgSrc: img,
          title: "Informasi Ambil file",
          description: "Klik di bagian foto samping kiri Anda",
          additionalInfo: "",
        },
        // Anda bisa menambahkan lebih banyak objek di sini
      ];

      data.forEach((item) => {
        const colDiv = document.createElement("div");
        // colDiv.classList.add('col-md-12', 'mb-0px', 'form-group', 'stec');
        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body", "pd-t-15", "pb-10px", "mb-5px");
        cardBodyDiv.style.border = "1px solid #c0ccda";

        const mediaDiv = document.createElement("div");
        mediaDiv.classList.add("media");

        const label = document.createElement("label");
        label.setAttribute("for", "thumbnail");

        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("avatar");

        const img = document.createElement("img");
        img.id = "previewthumbnail";
        img.src = item.imgSrc;
        img.classList.add("rounded-circle");
        img.alt = "";

        avatarDiv.appendChild(img);
        label.appendChild(avatarDiv);
        const basisData = window.Ngorei;
        const input = document.createElement("input");
        input.style.display = "none";
        input.type = "file";
        input.name = "thumbnail";
        input.id = "thumbnail";
        input.classList.add("none");
        $(input).change(function (e) {
          var file = e.target.files[0]; // Mendapatkan file yang diunggah
          if (file) {
            var fileType = file.type;

            var allowedTypes = [
              {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                name: "xlsx",
              },
              {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                name: "docx",
              },
              {
                type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                name: "pptx",
              },
              { type: "application/pdf", name: "PDF" },
              { type: "text/csv", name: "csv" },
              { type: "application/json", name: "json" }, // perbaikan dari 'text/json' ke 'application/json'
              { type: "application/vnd.ms-excel", name: "xlsx" },
              { type: "image/jpeg", name: "img" },
              { type: "image/png", name: "img" },
              { type: "image/jpg", name: "img" },
            ];

            var allowedFile = allowedTypes.find(function (allowedType) {
              return allowedType.type === fileType;
            });

            if (allowedFile) {
              var fileName = allowedFile.name;
              if (fileName == "img") {
                var reader = new FileReader();
                reader.onload = function () {
                  // console.log(reader.result)
                  // Menampilkan pratayang gambar jika file adalah gambar
                  $("#previewthumbnail").attr("src", reader.result);
                  $("#label_thumbnail").html(
                    "Unggahan file sesuai ekstensi yang ditentukan "
                  );
                  $("#alert").html("Informasi Ambil foto");
                };
                reader.readAsDataURL(file); // Membaca file sebagai URL data
              } else {
                $("#previewthumbnail").attr(
                  "src",
                  basisData.baseURL + "assets/images/doc/" + fileName + ".png"
                );
                $("#label_thumbnail").html(
                  "Unggahan file sesuai ekstensi yang ditentukan "
                );
                $("#alert").html("Informasi Ambil foto");
              }
            } else {
              // Menampilkan pesan kesalahan jika tipe file tidak diperbolehkan
              $("#previewthumbnail").attr("src", item.imgSrc); // Menghapus pratayang
              $("#label_thumbnail").html("Unggahan file tidak sesuai ekstensi");
              $("#thumbnail").html(
                "Tipe file tidak diperbolehkan. Silakan unggah file dengan tipe: " +
                  allowedTypes.join(", ")
              );
            }
          } else {
            // Menampilkan pesan kesalahan jika tidak ada file yang diunggah
            $("#previewthumbnail").attr("src", item.imgSrc); // Menghapus pratayang
            $("#label_thumbnail").html("");
            $("#thumbnail").html("Tidak ada file yang diunggah");
          }
        });

        label.appendChild(input);
        const mediaBodyDiv = document.createElement("div");
        mediaBodyDiv.classList.add("media-body", "mg-l-15");

        const title = document.createElement("h6");
        title.classList.add("tx-13", "mg-b-2");
        title.id = "thumbnail";
        title.textContent = item.title;

        const description = document.createElement("p");
        description.classList.add("tx-color-03", "tx-12", "mg-b-1");
        description.id = "label_thumbnail";
        description.textContent = item.description;

        const additionalInfo = document.createElement("p");
        additionalInfo.classList.add("tx-color-03", "tx-11", "mg-b-3");
        additionalInfo.id = "info_thumbnail";
        additionalInfo.textContent = "";

        mediaBodyDiv.appendChild(title);
        mediaBodyDiv.appendChild(description);
        // mediaBodyDiv.appendChild(additionalInfo);

        mediaDiv.appendChild(label);
        mediaDiv.appendChild(mediaBodyDiv);

        cardBodyDiv.appendChild(mediaDiv);
        colDiv.appendChild(cardBodyDiv);
        // col.appendChild(labelSpan);
        col.appendChild(colDiv);
        //  listGroupContainer.appendChild(colDiv);
      });
    } else {
      // Posisikan ikon
      if (position === "left") {
        inputGroupAppend.appendChild(iconSpan);
        inputGroup.appendChild(inputGroupAppend);
        inputGroup.appendChild(input);
      } else if (position === "right") {
        inputGroup.appendChild(input);
        inputGroupAppend.appendChild(iconSpan);
        inputGroup.appendChild(inputGroupAppend);
      }
      // Tambahkan grup input ke kolom
      col.appendChild(labelSpan);
      col.appendChild(inputGroup);
    }
    // Buat dan tambahkan elemen span info
    const infoSpan = document.createElement("span");
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
    const footer = document.createElement("div");
    var nmsendclassName = config.footer.class ? config.footer.class : "";
    var nmsendStalye = config.footer.styleTop ? config.footer.styleTop : "";
    var btn = nmsendclassName === "block" ? "btn-block" : "";
    var nmsend = config.footer.save;
    var nmcancel = config.footer.cancel;
    footer.className = "form-group mb-10px " + nmsendclassName;
    footer.style.paddingTop = nmsendStalye;
    // Buat tombol Simpan
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.id = "send" + config.elementById;
    saveButton.className = "btn bold btn-" + nmsend[1] + " " + btn;
    saveButton.innerHTML = nmsend[2]
      ? '<i class="' + nmsend[2] + '"></i> ' + nmsend[0]
      : nmsend[0];

    // Simpan teks asli tombol
    const originalButtonText = saveButton.innerHTML;

    // Tambahkan event listener untuk tombol Simpan
    saveButton.addEventListener('click', () => {
      // Ubah tampilan tombol menjadi loading
      saveButton.disabled = true;
      saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
      
      // Panggil metode send
      form.send().then(() => {
        // Tombol akan dikembalikan ke keadaan semula di dalam sendDataToServer
      }).catch(error => {
        console.error('Terjadi kesalahan:', error);
        // Kembalikan tampilan tombol jika terjadi kesalahan
        saveButton.disabled = false;
        saveButton.innerHTML = originalButtonText;
      });
    });
    if (nmcancel[0]) {
      // Buat tombol Batal
      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "btn bold btn-" + nmcancel[1];
      cancelButton.innerHTML = nmcancel[2]
        ? '<i class="' + nmcancel[2] + '"></i> ' + nmcancel[0]
        : nmcancel[0];
      // Tambahkan event listener untuk tombol Batal
      cancelButton.addEventListener("click", () => {
        // Tangani aksi batal
        Tds.closeModal();
      });
      // Tambahkan tombol Batal ke footer
      footer.appendChild(cancelButton);
    }
    // Tambahkan tombol Simpan ke footer
    footer.appendChild(saveButton);
    // Tambahkan footer ke form
    form.appendChild(footer);
  }
  // Tambahkan metode send ke prototipe form
  form.send = function () {
    return new Promise((resolve, reject) => {
      const formData = validasiSend(
        fieldIDs,
        form,
        config.cradensial,
        config.status,
        "info_" + config.elementById,
        config,
        dataset
      );
      if (formData) {
        if (typeof config.sendCallback === "function") {
          try {
            const result = config.sendCallback(formData);
            if (result && typeof result.then === "function") {
              result.then(resolve).catch(reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(formData);
        }
      } else {
        resolve(); // Jika data tidak valid
      }
    });
  };
}

/**
 * Fungsi untuk memvalidasi dan mempersiapkan data untuk dikirim
 * @param {Array} fieldIDs - Array ID field yang akan divalidasi
 * @param {HTMLFormElement} form - Elemen formulir
 * @param {string} cradensial - Kredensial untuk otorisasi (opsional)
 * @param {string} status - Status operasi (misalnya "update")
 * @param {string} idInfo - ID untuk elemen info
 * @param {Object} config - Objek konfigurasi
 * @param {Object} dataset - Data yang sudah ada (untuk kasus update)
 * @returns {Promise} Promise yang menyelesaikan dengan data yang valid atau menolak jika tidak valid
 */
export function validasiSend(
  fieldIDs,
  form,
  cradensial = "",
  status = "",
  idInfo = "",
  config,
  dataset
) {
  let uidSet = user_id().oauth;

  const Tds = new Dom.Components();
  const keysbit = Object.keys(config.action);
  if (config.quill) {
    var retData = Tds.storageRed(config.storage, config.key, keysbit);
  } else {
    var retData = Tds.storageKey(config.storage, config.key, keysbit);
  }
  const basisData = window.Ngorei;
  const red = decryptObject(basisData.tokenize, "manifestStorage");
  var fileInput = document.querySelector("input[type=file]");
  var file = fileInput ? fileInput.files[0] : null;
  let isValid = true;
  const formData = {};
  const Tabel = cradensial ? "FROM_" + cradensial : "formEntries";

  fieldIDs.forEach((key) => {
    const input = document.querySelector(`input[name=${key}], textarea[name=${key}]`);
    const infoSpan = document.getElementById(`info_${key}`);
    const labelElement = document.getElementById(`label_${key}`);
    const minLength = input ? input.getAttribute("minlength") : null;

    if (!input) {
      //console.error(`Element input dengan name ${key} tidak ditemukan.`);
      return;
    }

    if (!infoSpan) {
      //console.error(`Element span dengan id info_${key} tidak ditemukan.`);
      return;
    }

    if (!labelElement) {
      //console.error(`Element label dengan id label_${key} tidak ditemukan.`);
      return;
    }

    const label = labelElement.textContent;

    if (!input.value.trim()) {
      isValid = false;
      infoSpan.textContent = `${label} tidak boleh kosong`;
    } else if (
      minLength &&
      input.value.trim().length < parseInt(minLength, 10)
    ) {
      isValid = false;
      infoSpan.textContent = `${label} harus memiliki minimal ${minLength} karakter`;
    } else {
      infoSpan.textContent = "";
      formData[key] = input.value.trim(); // Simpan nilai input yang telah divalidasi
      formData["id"] = dataset.id ? dataset.id : false;
      formData["userid"] = uidSet.red ? uidSet.red : false;
      formData["explorer"] = getCookie("explorer")
        ? getCookie("explorer")
        : false;
    }
  });

  if (isValid) {
    if (navigator.onLine) {
      if (config.quill) {
        var texteditor = $("#inputId" + config.quill.elementById).val();
        formData[config.quill.elementById] = texteditor;
      }
      if (cradensial) {
        var documentItem = new FormData();
        documentItem.append("file", file); // Menambahkan file ke FormData
        documentItem.append("jsonData", JSON.stringify(formData)); // Menambahkan data JSON ke FormData
        fetch(red.endpoint + "/api/v1/upload/" + config.cradensial, {
          method: "POST",
          body: documentItem,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "success") {
              return sendDataToServer(
                status,
                cradensial,
                idInfo,
                config,
                result.data
              );
            } else {
              $("#label_thumbnail").html(result.message);
              throw new Error(result.message);
            }
          }).catch((error) => {
          });
      }
    } else {
      console.log(
        "Anda sedang offline. Data Anda telah disimpan dan akan dikirim setelah Anda kembali online."
      );
      resetSaveButton(config);
      return Promise.reject("Offline");
    }
    return formData; // Return form data if valid
  }
  
  resetSaveButton(config);
}

/**
 * Fungsi untuk mengatur ulang tombol
 * @param {Object} config - Objek konfigurasi
 */
function resetSaveButton(config) {
  const saveButton = document.getElementById("send" + config.elementById);
  if (saveButton) {
    saveButton.disabled = false;
    saveButton.innerHTML = config.footer.save[2]
      ? '<i class="' + config.footer.save[2] + '"></i> ' + config.footer.save[0]
      : config.footer.save[0];
  }
}

/**
 * Fungsi untuk mengirim data ke server
 * @param {string} status - Status operasi
 * @param {string} cradensial - Kredensial untuk otorisasi
 * @param {string} idInfo - ID untuk elemen info
 * @param {Object} config - Objek konfigurasi
 * @param {Object} dataset - Data yang akan dikirim
 * @returns {Promise} Promise yang menyelesaikan dengan respons dari server
 */
export function sendDataToServer(status, cradensial, idInfo, config,dataset) {
   const Tabel = "FROM_" + cradensial;
     const Tds = new Dom.Components();
   const storedData = JSON.parse(localStorage.getItem(Tabel)) || [];
   const basisData = window.Ngorei;
   const red = decryptObject(basisData.tokenize, "manifestStorage");
   if (navigator.onLine) { // Cek status online
       const STG = new Dom.Storage();
         let response = [];
          $.ajax({
            url: red.endpoint + "sdk/" + cradensial,
            headers: {
              Authorization: cradensial,
              "Content-Type": "application/json",
            },
            method: "POST",
            data: JSON.stringify(setToken({
               "status": status,
               "data": dataset,
             })),
            dataType: "json",
            async: false,
            success: function (data) {
              localStorage.removeItem(Tabel);
              var add = JSON.stringify(data, null, 10);
              response = JSON.parse(add);
            },
          });
          if (response.status==='success') {

            resetSaveButton(config);
    
                  $("#previewthumbnail").attr(
                    "src",
                    window.Ngorei.baseURL + "img/Drive.png"
                  );
                  $(
                    'input[type="file"], input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="url"], input[type="tel"], input[type="date"], select, textarea'
                  ).val("");
                  $('input[type="radio"], input[type="checkbox"]').prop(
                    "checked",
                    false
                  );
                  if (config.quill && config.quill.elementById) {
                    $("#area" + config.quill.elementById + " .ql-editor").html("");
                  }

              Tds.closeModal();
              onReload();

            }

       return response;

     } else if (!navigator.onLine) {
      console.log('Anda sedang offline');
    }

}

/**
 * Fungsi untuk mengevaluasi kekuatan password
 * @param {string} password - Password yang akan dievaluasi
 * @returns {string} Hasil evaluasi: "Lemah", "Standar", atau "Kuat"
 */
export function evaluatePasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) {
    return "Lemah";
  } else if (strength <= 3) {
    return "Standar";
  } else {
    return "Kuat";
  }
}

// Periksa status online dan kirim data saat jaringan kembali
window.addEventListener("online", sendDataToServer);
