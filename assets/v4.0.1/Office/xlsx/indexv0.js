import {tokenize} from "../../ngorei.js";
export function previewXLSX(attr) {
   const STG = new Dom.Storage();
   const Token=attr.endpoint+"_"+attr.file;
   let dsdownload = document.getElementById(attr.download);
   let dssettings = document.getElementById(attr.settings[0]);
    dssettings.addEventListener("click", function (e) {
       var storage = {
         token: Token,
       };
       var gabungArray = { ...storage, ...attr };
       onRoute(["Office","Settings",attr.settings[1],gabungArray])
    });


  const officeData = STG.localData("office").get(Token) || {};
  var grid = officeData.grid ||1;
  var color = officeData.color || "#E5E9F2";
  TdsDB.getData(Token)
    .then((result) => {
      if (result && result.data) {
        processData(result.data, result.updated_at);
      } else {
        // Data tidak ditemukan di IndexedDB, ambil dari API
        fetchDataFromAPI();
      }
    })
    .catch((error) => {
    //  console.error("Error saat mengambil data dari IndexedDB:", error);
      fetchDataFromAPI();
    });

  function fetchDataFromAPI() {
    const red = STG.big({
      endpoint: attr.endpoint,
      file:attr.file,
    });

     const jsonData = red.storage;
     const updated_at =red.storage.updated_at;
     
     TdsDB.saveData(Token, jsonData, updated_at)
      .then((message) => console.log(message))
      .catch((error) => console.error("Error menyimpan ke IndexedDB:", error));
     processData(jsonData, updated_at);
  }





  function processData(rows, updated_at) {


console.log(rows)

    dsdownload.addEventListener("click", function (e) {
      if (rows.file) {
           window.location.href =tokenize().endpoint+"public/drive/"+rows.file;
      }
     
    });
    $("#"+attr.intro.title).html(rows.title);
    $("#"+attr.intro.instansi).html(rows.instansi);
    $("#"+attr.intro.date).html(rows.date);
    function createTable(data) {
      console.log(data)
      let table = document.createElement("table");
       table.style.width = "100%";

      data.forEach((row, rowIndex) => {
        let tr = document.createElement("tr");

        row.forEach((cell) => {
          let td = document.createElement("td");
          td.textContent = cell.value;

          if (cell.colspan) td.colSpan = cell.colspan;
          if (cell.rowspan) td.rowSpan = cell.rowspan;

          td.style.textAlign = cell.alignment;
         
          // Tambahkan gaya overflow dan teks tebal untuk 7 baris pertama
          if (rowIndex < grid) {
            td.classList.add('header-cell');
            td.style.backgroundColor = color || "#E5E9F2";
          }

          tr.appendChild(td);
        });

        table.appendChild(tr);
      });

      return table;


    }
    let table = createTable(rows.tabel);
    document.getElementById(attr.elementById).appendChild(table);
    // Fungsi untuk mengidentifikasi baris terakhir dari penomoran
    function identifikasiBarisAwalData(table) {
      const rows = table.getElementsByTagName("tr");
      let barisAwalData = 0;

      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        let isNomorBaris = true;

        for (let j = 0; j < cells.length; j++) {
          const cellText = cells[j].textContent.trim();
          if (isNaN(cellText) && cellText !== "") {
            isNomorBaris = false;
            break;
          }
        }

        if (!isNomorBaris) {
          barisAwalData = i;
          break;
        }
      }

      return barisAwalData;
    }

    const barisAwalData = identifikasiBarisAwalData(table);

    // Modifikasi fungsi pencarian
    const searchInput = document.getElementById(attr.search);
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const tableRows = table.getElementsByTagName("tr");

      for (let i =grid; i < tableRows.length; i++) {
        const row = tableRows[i];
        const cells = row.getElementsByTagName("td");
        let found = false;

        for (let j = 0; j < cells.length; j++) {
          const cellText = cells[j].textContent.toLowerCase();
          if (cellText.includes(searchTerm)) {
            found = true;
            break;
          }
        }

        row.style.display = found ? "" : "none";
      }
    });
  }

}