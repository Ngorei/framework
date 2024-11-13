let dbAi;
let dbReady = false;
// Fungsi untuk membuka database
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ChatDatabase", 2);

    request.onerror = (event) => {
      console.error("Error membuka database:", event.target.error);
      reject("Error membuka database");
    };

    request.onsuccess = (event) => {
      dbAi = event.target.result;
      dbReady = true;
      console.log("Database berhasil dibuka");
      resolve(dbAi);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Perbaikan: Periksa apakah object store sudah ada sebelum membuatnya
      if (!db.objectStoreNames.contains("conversations")) {
        const objectStore = db.createObjectStore("conversations", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("timestamp", "timestamp", { unique: false });
        objectStore.createIndex("conversationTitle", "conversationTitle", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains("conversationTitles")) {
        const titleStore = db.createObjectStore("conversationTitles", {
          keyPath: "id",
          autoIncrement: true,
        });
        titleStore.createIndex("title", "title", { unique: true });
      }

      console.log("Database berhasil di-upgrade");
    };
  });
}