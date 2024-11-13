import { toolbar } from "./tool.js";
import { contextmenu } from "./contextmenu.js";
import {user_id} from "../../ngorei.js";
export function docx(attr) {
    console.log(attr)
    var DIR=window.location.href.split('#')
    var URL=window.Ngorei.baseURL+'public/'+DIR[1]+'/'
    var hostName=window.Ngorei.baseURL;
    const HTML=new Dom.html(); 
    const Tds=new Dom.Components()
    const STG=new Dom.Storage()
    const officeMenu = STG.localData("office").get(attr.fileName);
    var uid=user_id().oauth;
    toolbar(attr)
    const pagePresentation=localStorage.getItem(attr.fileName);
    const data=Tds.jsonFile(attr.data)
   
    let freepik = document.getElementById("freepik");
    let addFile = document.getElementById("addFile");
    let unsplash = document.getElementById("unsplash");
    let preview = document.getElementById("preview");
    let dowppt = document.getElementById("dowppt");
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');



    let removeList = document.getElementById("remove");
    let writingArea = document.getElementById(attr.contenteditable);
//     freepik
// 
    // Hapus Elemen PPTX
    function removeContent() {
      localStorage.removeItem(attr.fileName);
    }
    removeList.addEventListener("click", function (e) {
      removeContent();
         onRoute([attr.contenteditable,data.indexOn,false])
    });
    // Tampilan  Elemen PPTX
    function handlePresentation() {
        if (pagePresentation && pagePresentation !== 'undefined') {
            $("#" + attr.contenteditable).html(pagePresentation);
            return;
        }

        const template = STG.fetch({
            "5272E-23DB0-56C88-18503": ["id,template", "nama='" + attr.fileName + "' AND userid='" + uid.red + "'  ORDER BY id DESC"]
        });

        if (template.storage && template.storage.data.template) {
            $("#" + attr.contenteditable).html(JSON.parse(template.storage.data.template));
        } else {
            onRoute([attr.contenteditable, data.indexOn, false]);
        }
    }
    handlePresentation()

    contextmenu({ 
        attr: attr,
        file: attr.fileName,
        datatum:officeMenu,
        data:data,
        contenteditable: attr.contenteditable
     });

    data.page.forEach(item => {
         item.img = URL + item.img;
     });
 
     const row={
          'elementById' :attr.template,
          'content'     :'row',
          'order'       :20,
           'data' :{
               "row":data.page
            }
       }
     HTML.ES1(row)

   function saveContent() {
     // localStorage.setItem(attr.fileName, writingArea.innerHTML);
      STG.localStorage(attr.fileName).element(writingArea.innerHTML);
    }




    printid.addEventListener("click", function (e) {
        onRoute(["Office","Print","#setting/print",attr])
  
    });


    freepik.addEventListener("click", function (e) {
      onRoute(["Modal","Images","#presentasi/images"])
    });



    preview.addEventListener("click", function (e) {
      onRoute(["Office","Pratinjau","#explorer/presentationdocx",attr])
      //onRoute(["Office", 'Pengaturan', "#setting/xlsx",dataTerproses]);
    });



    addFile.addEventListener("click", function (e) {
     
       onRoute(["Modal","Drive","#presentasi/file"])
    });

    unsplash.addEventListener("click", function (e) {
       onRoute(["Modal","Unsplash","#presentasi/unsplash"])
    });
   window.addTheme=function (value) {
      $.each(data.page,function(row, key){
        if(key.code == value) {
            //|append
            onRoute(["Model",attr.contenteditable,key.file,'append'])
            saveContent();
         }
      });
   }
// Kejadian Dobel klik
writingArea.addEventListener("dblclick", function(e) {
    const STG=new Dom.Storage()
    const animation= STG.localStorage("animation").get();
  const target = e.target;
   const localStyle = event.target.style;
  if (target.tagName === "IMG") {
    const images=localStorage.getItem('textToCopy');
    if (images) {
       target.src=images
       saveContent();
       localStorage.setItem('textToCopy','');

    }
    // Lakukan sesuatu ketika gambar di-double klik
    console.log("Gambar di-double klik:", target.src);
    // Tambahkan logika tambahan di sini sesuai kebutuhan
  } else if (target.tagName === "P" || target.tagName === "H1" || target.tagName === "H2") {
    // Lakukan sesuatu ketika teks di-double klik
    console.log("Teks di-double klik:", target.tagName);
  
    // animate="fadeInUp" Tambahkan logika tambahan di sini sesuai kebutuhan
  }

  if (animation) {
     $(target).attr('animate',animation);
     console.log(e)
    console.log(e.target)
     // localStorage.removeItem('animation');
     STG.localStorage('animation').setItem(false);
  }
  if(localStyle.backgroundColor) {
     document.getElementById('backColor').addEventListener('input', function() {
         localStyle.backgroundColor = this.value;
     });
  }
});




  let scale = 1;
const seteditor = document.getElementById('seteditor');

const previewButton = document.getElementById('preview-btn');

// console.log('seteditor:', seteditor);
// console.log('zoomInButton:', zoomInButton);
// console.log('zoomOutButton:', zoomOutButton);
// console.log('previewButton:', previewButton);
function updateScale() {
    // console.log('Updating scale to:', scale);
    seteditor.style.transform = `scale(${scale})`;
}

function zoomIn() {
    //console.log('Zoom in clicked');
    scale += 0.1;
    updateScale();
}

function zoomOut() {
    //console.log('Zoom out clicked');
    scale -= 0.1;
    if (scale < 0.1) scale = 0.1; // Mencegah skala terlalu kecil
    updateScale();
}

if (zoomInButton) {
    zoomInButton.addEventListener('click', zoomIn);
    //console.log('Zoom in event listener added');
} else {
    //console.error('Zoom in button not found');
}

if (zoomOutButton) {
    zoomOutButton.addEventListener('click', zoomOut);
    //console.log('Zoom out event listener added');
} else {
    //console.error('Zoom out button not found');
}

 Tds.officePage({
     "elementById":"seteditor",
     "page":"presentation",
     "select":"listPage",
  })

}


