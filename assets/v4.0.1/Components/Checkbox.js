// Fungsi untuk membuat form
export function Checkbox(attr) {
  const checkboxes = document.querySelectorAll('.checkbox');
  const STG=new Dom.Storage();
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const packageName = this.value;
      const uid = this.key;
      const isChecked = this.checked;
      const data = {
        uid: this.attributes.key.value,
        item: packageName,
        status: isChecked ? 'insert' : 'delete'
      };
       const from=STG.BriefSnd({
         "endpoint":attr.endpoint,
         "data":data, 
         "attr":attr, 
         
       })
      // Anda mungkin ingin mengirim data ini ke server atau melakukan sesuatu dengannya
    });
    
    // Pastikan checkbox dapat diklik
    checkbox.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  });
}