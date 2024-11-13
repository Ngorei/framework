export function ES2(row) {
  this.data = row;
  const self = this;
  var firstKey = Object.keys(row.data)[0];
  var iID = "#" + firstKey;
  var sID = "{@" + firstKey + "}";
  var eID = "{/" + firstKey + "}";
  var rowID = Object.keys(row.data)[0];
  var originalData = row.data;
  var data = { ...originalData };
  var currentPage = 1;

  var search = row.search;
  var pageLimit = row.order;
  var rowPerPage = data[rowID].length; // Jumlah item per halaman
  rowPerPage = rowPerPage > pageLimit ? pageLimit :pageLimit; // Batasi rowPerPage tidak lebih dari 5
  var totalPages = Math.ceil(data[rowID].length / pageLimit);
  var oldElement = document.getElementById(row.elementById);
  if (!oldElement) {
    // console.error("Elemen dengan ID tersebut tidak ditemukan.");
    return;
  }

  // Tambahkan pengecekan untuk children
  if (!oldElement.children || oldElement.children.length === 0) {
    return;
  }

  var elID = oldElement.children[0].id;

  // Membuat elemen baru <script> dengan atribut type="text/template"

  var newElement = document.createElement("script");
  newElement.setAttribute("type", "text/template");
  newElement.setAttribute("id", firstKey + "_" + row.elementById);
  if (oldElement.className) {
    newElement.className = oldElement.className;
  }
  // Menyalin atribut dari elemen lama ke elemen baru
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var attr = oldElement.attributes[i];
    newElement.setAttribute(attr.name, attr.value);
  }

  // Menyalin konten dari elemen lama ke elemen baru
  newElement.innerHTML = oldElement.innerHTML;
  // Mengganti elemen lama dengan elemen baru di dalam DOM
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var el = oldElement.children[0];
  var elID = oldElement.children[0].id;
  el.id = firstKey;
  el.innerHTML = sID + el.innerHTML + eID;
  var es2newElement = document.createElement("div");
  var es2Template = document.getElementById(row.elementById);
  es2newElement.innerHTML = oldElement.innerHTML;

  let template = oldElement.innerHTML;

  let rowContent = template
    .substring(template.indexOf(sID), template.indexOf(eID) + eID.length)
    .trim();

  var hasilTemplate = document.getElementById(row.elementById);
  var elx = hasilTemplate.children[0];
  var indexID = row.elementById + "_" + elID;
  var newElement = document.createElement("div");
  newElement.id = indexID;
  hasilTemplate.parentNode.insertBefore(newElement, hasilTemplate);


  

  function curPage(page = "") {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }



  function renderData(data) {
    var rendered = DOM.render(template, data, oldElement);
    document.getElementById(indexID).innerHTML = rendered;
    const rootElement = document.getElementById(indexID);
    nodeElement(rootElement);
  }

  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
    }
  }

  // Create an array to store attribute names to be removed
  const attributesToRemove = [];
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
      // Add the attribute name to the array for later removal
      attributesToRemove.push(attr.name);
    }
  }
  // Remove the attributes from the script element
  for (let attrName of attributesToRemove) {
    hasilTemplate.removeAttribute(attrName);
  }
  function filterData(keyword) {
    const searchText = keyword.trim().toLowerCase();
    const setfilteredData = originalData[rowID].filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(keyword)
      )
    );
    return setfilteredData;
  }
  // Event listener untuk input pencarian
  if (search) {
    document.getElementById(search).addEventListener("input", function (event) {
      var keyword = event.target.value;
      if (keyword === "") {
        data = { ...originalData }; // Kembalikan data ke data asli jika pencarian kosong
      } else {
        var filteredData = filterData(keyword);
        data[rowID] = filteredData;
      }
      renderData(curPage(1));
    });
  }
  renderData(curPage(1));
}

ES2.prototype.Element = function (callback) {
  const self = this; // Simpan referensi this untuk digunakan di dalam fungsi event listener
  let filteredData = [...self.data.data.row]; // Salin data.row agar tidak mengubah data asli

  // Event listener untuk input pencarian
  document
    .getElementById(self.data.search)
    .addEventListener("input", function (event) {
      const keyword = event.target.value.trim().toLowerCase(); // Ambil kata kunci pencarian
      if (keyword !== "") {
        filteredData = self.data.data.row.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" && value.toLowerCase().includes(keyword)
          )
        );
      } else {
        filteredData = [...self.data.data.row]; // Kembalikan ke data asli jika pencarian kosong
      }
      // Panggil callback dengan panjang data yang sudah difilter
      callback(filteredData);
    });
  callback(self.data.data.row);
};
