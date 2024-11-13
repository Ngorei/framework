const dbName = "AvatarDB";
let dbVersion = 1; // Ubah menjadi let agar bisa diperbarui
const STG=new Dom.Storage();
async function initIndexedDB() {
   // console.log("Menginisialisasi IndexedDB");
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(dbName);
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            dbVersion = db.version;
            db.close();
            
            // Buka kembali database dengan versi terbaru
            request = indexedDB.open(dbName, dbVersion);
            
            request.onsuccess = function(event) {
                //console.log("Database berhasil dibuka dengan versi:", dbVersion);
                resolve(event.target.result);
            };
            
            request.onerror = function(event) {
                //console.error("Gagal membuka database:", event.target.error);
                reject(event.target.error);
            };
        };
        
        request.onerror = function(event) {
            //console.error("Gagal membuka database:", event.target.error);
            reject(event.target.error);
        };

        request.onupgradeneeded = function(event) {
            //console.log("Upgrade database diperlukan");
            const db = event.target.result;
            if (!db.objectStoreNames.contains("avatars")) {
                db.createObjectStore("avatars", { keyPath: "id" });
               // console.log("Object store 'avatars' berhasil dibuat");
            }
            if (!db.objectStoreNames.contains("failedUploads")) {
                db.createObjectStore("failedUploads", { autoIncrement: true });
               // console.log("Object store 'failedUploads' berhasil dibuat");
            }
        };
    });
}

export async function avatar(attr) {
   // console.log("Memulai fungsi avatar dengan attr:", attr);
    let db;

    try {
        db = await initIndexedDB();
    } catch (error) {
        console.error("Gagal menginisialisasi database:", error);
        return;
    }

    function saveAvatar(imageData) {
      //  console.log("Mencoba menyimpan avatar");
        return new Promise((resolve, reject) => {
            if (!db) {
               // console.error("Database belum diinisialisasi");
                reject(new Error("Database belum diinisialisasi"));
                return;
            }

            const transaction = db.transaction(["avatars"], "readwrite");
            const store = transaction.objectStore("avatars");
            const avatar = { id: 1, data: imageData };
            const request = store.put(avatar);

            request.onsuccess = function() {
                //console.log("Avatar berhasil disimpan di IndexedDB");
                sendAvatarToServer(imageData);
                resolve();
            };

            request.onerror = function(event) {
                console.error("Error menyimpan avatar di IndexedDB:", event.target.error);
                saveFailedUpload(imageData);
                reject(event.target.error);
            };
        });
    }

    // Fungsi untuk mengirim avatar ke server
    function sendAvatarToServer(imageData) {
       const from=STG.Brief({
         "endpoint":attr.credensial,
         "status":"insert", //insert|update
         "data":{
            "avatar":imageData
         }, 
       })
    }

    // Fungsi untuk menyimpan informasi upload yang gagal
    function saveFailedUpload(imageData) {
        const transaction = db.transaction(["failedUploads"], "readwrite");
        const store = transaction.objectStore("failedUploads");
        const failedUpload = { data: imageData };
        store.add(failedUpload);
    }

    // Fungsi untuk memuat avatar dari IndexedDB
    function loadAvatar() {
        if (!db.objectStoreNames.contains("avatars")) {
           // console.error("Object store 'avatars' tidak ditemukan");
            return;
        }
        const transaction = db.transaction(["avatars"], "readonly");
        const store = transaction.objectStore("avatars");
        const request = store.get(1);

        request.onsuccess = function(event) {
            if (request.result) {
                updateAvatars(request.result.data);
            }
        };

        request.onerror = function(event) {
           // console.error("Error saat memuat avatar:", event.target.error);
        };
    }

    // Fungsi untuk memperbarui semua elemen avatar
    function updateAvatars(imageData) {
        const avatarElements =attr.elementById;
        avatarElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.src = imageData;
            }
        });
    }

    // Fungsi untuk mencoba mengirim ulang upload yang gagal
    function retryFailedUploads() {
        const transaction = db.transaction(["failedUploads"], "readwrite");
        const store = transaction.objectStore("failedUploads");
        const request = store.getAll();

        request.onsuccess = function(event) {
            const failedUploads = event.target.result;
            failedUploads.forEach(upload => {
                sendAvatarToServer(upload.data);
                store.delete(upload.id);
            });
        };
    }

    document.getElementById('fileInput').addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
           // console.log("File dipilih:", file.name);
            try {
                const reader = new FileReader();
                reader.onload = async function(e) {
                    const imageData = e.target.result;
                    updateAvatars(imageData);
                    try {
                        await saveAvatar(imageData);
                        console.log("Proses penyimpanan avatar selesai");
                    } catch (error) {
                        //console.error("Gagal menyimpan avatar:", error);
                    }
                }
                reader.readAsDataURL(file);
            } catch (error) {
                //console.error("Error saat memproses file:", error);
            }
        }
    });

    // Coba kirim ulang upload yang gagal saat halaman dimuat
    window.addEventListener('online', function() {
        if (db) {
            retryFailedUploads();
        }
    });
    avatarID(attr.elementById)
}

export async function avatarID(elementIds) {
    //console.log("Memulai fungsi avatarID");
    try {
        const db = await initIndexedDB();
        await loadAvatar(db, elementIds);
    } catch (error) {
       // console.error("Error dalam avatarID:", error);
    }
}

function loadAvatar(db, elementIds) {
    return new Promise((resolve, reject) => {
        if (!db.objectStoreNames.contains("avatars")) {
         //   console.log("Object store 'avatars' belum dibuat. Tidak ada avatar yang tersimpan.");
            resolve();
            return;
        }

        const transaction = db.transaction(["avatars"], "readonly");
        const store = transaction.objectStore("avatars");
        const request = store.get(1);

        request.onsuccess = function(event) {
            if (request.result) {
              //  console.log("Avatar ditemukan, memperbarui elemen");
                const imageData = request.result.data;
                elementIds.forEach(elementId => {
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.src = imageData;
                    } else {
                       // console.log(`Elemen dengan ID ${elementId} tidak ditemukan`);
                    }
                });
            } else {
              //  console.log("Avatar tidak ditemukan di IndexedDB");
            }
            resolve();
        };

        request.onerror = function(event) {
            //console.error("Error mengambil avatar dari IndexedDB:", event.target.error);
            reject(event.target.error);
        };
    });
}