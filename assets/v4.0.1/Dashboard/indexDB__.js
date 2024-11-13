// Fungsi-fungsi IndexedDB di luar initModule
export const STGindexDB = {
    dbName: '',
    dbVersion: 0,
    storeName: '',

    initialize: function(dbName, dbVersion, storeName) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.storeName = storeName;
    },

    openDB: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = event => reject("Error membuka database: " + event.target.error);

            request.onsuccess = event => resolve(event.target.result);

            request.onupgradeneeded = event => {
                const db = event.target.result;
                const objectStore = db.createObjectStore(this.storeName, { keyPath: 'key' });
                objectStore.createIndex('updated_at', 'updated_at', { unique: false });
            };
        });
    },

    saveData: function(key, data, updated_at) {
        return this.openDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);

                const getRequest = store.get(key);

                getRequest.onsuccess = event => {
                    const existingData = event.target.result;
                    if (existingData && existingData.updated_at >= updated_at) {
                        resolve("Data sudah yang terbaru");
                    } else {
                        const updateRequest = store.put({ key: key, data: data, updated_at: updated_at });
                        updateRequest.onsuccess = () => resolve("Data berhasil disimpan/diperbarui");
                        updateRequest.onerror = event => reject("Error menyimpan/memperbarui data: " + event.target.error);
                    }
                };

                getRequest.onerror = event => reject("Error memeriksa data: " + event.target.error);
            });
        });
    },

    getData: function(key) {
        return this.openDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(key);

                request.onsuccess = event => resolve(event.target.result);
                request.onerror = event => reject("Error mengambil data: " + event.target.error);
            });
        });
    },

    deleteData: function(key) {
        return this.openDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(key);

                request.onsuccess = () => resolve("Data berhasil dihapus");
                request.onerror = event => reject("Error menghapus data: " + event.target.error);
            });
        });
    }
};

export function initModule(file) {
    const STG = new Dom.Storage();
    // Inisialisasi STGindexDB
    STGindexDB.initialize('BPSDatabase', 1, 'bpsData');
    
    // Coba ambil data dari IndexedDB terlebih dahulu
    STGindexDB.getData(file)
        .then(result => {
            if (result && result.data) {
                // Data ditemukan di IndexedDB
                console.log("Data diambil dari IndexedDB");
                processData(result.data, result.updated_at);
            } else {
                // Data tidak ditemukan di IndexedDB, ambil dari API
                fetchDataFromAPI();
            }
        })
        .catch(error => {
            console.error("Error saat mengambil data dari IndexedDB:", error);
            fetchDataFromAPI();
        });

    function fetchDataFromAPI() {
        const redbig2 = STG.big({
            'endpoint': "45868-306DC-30176-14CE2",
            "file": file
        });
        const jsonData = redbig2.storage[0].data;
        const updated_at = redbig2.storage[0].updated_at;
        
        // Simpan data ke IndexedDB
        STGindexDB.saveData(file, jsonData, updated_at)
            .then(message => console.log(message))
            .catch(error => console.error("Error menyimpan ke IndexedDB:", error));

        processData(jsonData, updated_at);
    }

    function processData(jsonData, updated_at) {
        console.log("Memproses data:", jsonData);
        $("#titlefile").html(jsonData.title || "Judul tidak tersedia");

        // ... kode lainnya untuk memproses data ...
    }
}

export const STGlocalStorage = {
    setItem: function(key, data, updated_at) {
        const item = JSON.stringify({ data: data, updated_at: updated_at });
        localStorage.setItem(key, item);
    },

    getItem: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    removeItem: function(key) {
        localStorage.removeItem(key);
    }
};

export function initModuleStorage(file) {
    const STG = new Dom.Storage();

    // Coba ambil data dari Local Storage terlebih dahulu
    const localData = STGlocalStorage.getItem(file);
    if (localData) {
        console.log("Data ditemukan di Local Storage");
        // Periksa apakah data perlu diperbarui
        checkForUpdates(localData.data, localData.updated_at);
    } else {
        // Data tidak ditemukan di Local Storage, ambil dari API
        fetchDataFromAPI();
    }

    function checkForUpdates(existingData, existingUpdatedAt) {
        // Ambil informasi terbaru dari API
        const redbig2 = STG.big({
            'endpoint': "45868-306DC-30176-14CE2",
            "file": file
        });
        const latestUpdatedAt = redbig2.storage[0].updated_at;

        if (latestUpdatedAt > existingUpdatedAt) {
            console.log("Data di server lebih baru, memperbarui...");
            fetchDataFromAPI();
        } else {
            console.log("Data lokal sudah yang terbaru");
            processData(existingData, existingUpdatedAt);
        }
    }

    function fetchDataFromAPI() {
        const redbig2 = STG.big({
            'endpoint': "45868-306DC-30176-14CE2",
            "file": file
        });
        const jsonData = redbig2.storage[0].data;
        const updated_at = redbig2.storage[0].updated_at;
        
        // Simpan data ke Local Storage
        STGlocalStorage.setItem(file, jsonData, updated_at);
        console.log("Data baru disimpan ke Local Storage");

        processData(jsonData, updated_at);
    }

    function processData(jsonData, updated_at) {
        console.log("Memproses data:", jsonData);
        $("#titlefile").html(jsonData.title || "Judul tidak tersedia");

        // Tambahkan logika pemrosesan data lainnya di sini
        // Misalnya, memperbarui UI dengan data yang diterima
    }

    // Fungsi untuk membersihkan data yang sudah kadaluarsa
    function cleanupExpiredData() {
        const currentTime = new Date().getTime();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const item = STGlocalStorage.getItem(key);
            if (item && (currentTime - item.updated_at > expirationTime)) {
                STGlocalStorage.removeItem(key);
                console.log(`Data kadaluarsa dihapus: ${key}`);
            }
        }
    }

    // Jalankan pembersihan data kadaluarsa setiap kali modul diinisialisasi
    cleanupExpiredData();
}


