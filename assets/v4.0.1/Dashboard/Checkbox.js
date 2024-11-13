// Fungsi untuk membuat form
export function Checkbox(attr) {
   const checkboxes = document.querySelectorAll('.checkbox');
   const STG = new Dom.Storage();
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
     const getboxdata = (value) => {
         const data = attr.variabel;
         return data.data.row.find(item => item.no === parseInt(value) || item.id === parseInt(value) || item.value === value);
     };
      
      const packageName = this.value;
      const boxData = getboxdata(packageName);

      if (!boxData) {
        console.error('Data tidak ditemukan untuk packageName:', packageName);
        return;
      }

      const data = {
        uid: this.attributes.key.value,
        item: boxData.value, // Menggunakan value dari boxData
        status: this.checked ? 'insert' : 'delete'
      };

      var gabungArray = { ...data, ...boxData };
      const from = STG.BriefSnd({
        "endpoint": attr.endpoint,
        "data": gabungArray,  
      });
      if (attr.modal) {
         modalClose()
      }
      // Sisa kode...
    });
    
    // Pastikan checkbox dapat diklik
    checkbox.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  });
}