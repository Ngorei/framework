
    const STG = new Dom.Storage();
    TdsDB.getData("Luas_Panen_Kelapa.xlsx")
        .then(result => {
            if (result && result.data) {
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
            "file": "Luas_Panen_Kelapa.xlsx"
        });
        const jsonData = redbig2.storage[0];
        const updated_at = redbig2.storage[0].updated_at;
        
        // Simpan data ke IndexedDB
        TdsDB.saveData("Luas_Panen_Kelapa.xlsx", jsonData, updated_at)
            .then(message => console.log(message))
            .catch(error => console.error("Error menyimpan ke IndexedDB:", error));
        processData(jsonData, updated_at);
    }



    function processData(rows, updated_at) {
      console.log(rows)

    }
