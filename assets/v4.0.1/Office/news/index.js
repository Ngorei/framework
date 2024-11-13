export function previewNEWS(attr) {
console.log(attr)
const Tds=new Dom.Components()
const STG=new Dom.Storage()
const template = document.getElementById(attr.elementById);
  function templateID(file) {
  const red34=STG.fetch({
       "5272E-23DB0-56C88-18503":["template","nama='"+file+"'"]
  });
    if (red34.storage.status==="success") {
     try {
       return JSON.parse(red34.storage.data.template);
     } catch (error) {
      // console.error("Error parsing template data:", error);
       return red34.storage.data.template; // Mengembalikan data mentah jika parsing gagal
     }
    } else {
      return ''
    }               
  }
  template.innerHTML=templateID(attr.template);
$(".stbdr").css({'border':'1px dashed #fff'});



      }