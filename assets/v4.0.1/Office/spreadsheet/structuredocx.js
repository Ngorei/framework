export function menuStructure(attr) {
  
   const STG = new Dom.Storage();
   const toTabel = STG.localStorage('textToTabel').get();
   const toCharts = STG.localStorage('textToCharts').get();
    const toPptx = STG.localData('office').get(attr.attr.fileName)
    console.log(toPptx)
   if (toPptx && toPptx.status==='success') {
       var pptx=null
   } else {
     var pptx=true
   }

  
   const menuStructure = {
     className: 'menu',
     children: [
       {
         type: 'ul',  
         className: 'menu-list',
         children: [
           {
             type: 'li',
             className: 'menu-item',
             attributes: { 'data-action': 'addPageIndex' },
             children: [
               {
                 type: 'div',
                 className: 'menu-button',
                 children: [
                   { type: 'i', className: 'ti-plus' },
                   { type: 'span', textContent: 'Halaman Baru' },
                   { type: 'span', id: 'draggable', attributes: { 'data-action': 'draggable' }, textContent: 'On' }
                 ]
               }
             ]
           },
         ]
       },
       toTabel ? {
         type: 'ul',
         className: 'menu-list',
         children: [
           {
             type: 'li',
             id: 'tabelset',
             className: 'menu-item',
             attributes: { 'data-action': 'addTabel' },
             children: [
               {
                 type: 'div',
                 className: 'menu-button',
                 children: [
                   { type: 'i', className: 'icon-feather-database' },
                   { type: 'span', textContent: 'Tabel' },
                   { type: 'span', id: 'appTabel', attributes: { 'data-action': 'tabel' }, textContent: toTabel.file }
                 ]
               }
             ]
           }
         ]
       } : null,

       toCharts ? {
         type: 'ul',
         className: 'menu-list',
         children: [
           {
             type: 'li',
             id: 'asChart',
             className: 'menu-item',
             attributes: { 'data-action': 'addChart' },
             children: [
               {
                 type: 'div',
                 className: 'menu-button',
                 children: [
                   { type: 'i', className: 'icon-feather-pie-chart' },
                   { type: 'span', textContent: 'Chart' },
                   { type: 'span', id: 'appTabel', attributes: { 'data-action': 'chart' }, textContent: toCharts.file }
                 ]
               }
             ]
           }
         ]
       } : null,
       {
         type: 'ul',
         className: 'menu-list',
         children: [
           {
             type: 'li',
             className: 'menu-item',
             attributes: { 'data-action': 'menuTataletak' },
             children: [
               {
                 type: 'div',
                 className: 'menu-button',
                 children: [
                   { type: 'i', className: 'icon-feather-layout' },
                   { type: 'span', textContent: 'Ubah Tata Letak' },
                   { type: 'span', id: 'menuTab', attributes: { 'data-action': 'sortable' }, textContent: 'Disable' }
                 ]
               }
             ]
           },
           {
             type: 'li',
             className: 'menu-item',
             children: [
               {
                 type: 'div',
                 className: 'menu-button',
                 children: [
                   { type: 'i', className: 'icon-feather-hard-drive' },
                   { type: 'span', textContent: 'Buat Components' },
                   { type: 'span', className: 'ti-angle-right' }
                 ]
               },
               {
                 type: 'ul',
                 className: 'menu-sub-list',
                 attributes: { style: 'width:200px;' },
                 children: attr.data.element
               }
             ]
           },
           {
             type: 'li',
             id: 'gridElement',
             className: 'menu-item',
             children: [
               {
                 type: 'div',
                 className: 'menu-button',
                 children: [
                   { type: 'i', className: 'icon-feather-grid' },
                   { type: 'span', textContent: 'Column Grid System' },
                     { type: 'span', className: 'ti-angle-right' }
                 ]
               },
               {
                 type: 'ul',
                 className: 'menu-sub-list',
                 attributes: { style: 'width:180px;' },
                 children: attr.data.grid
               }
             ]
           }
         ]
       },
       {
         type: 'ul',
         className: 'menu-list',
         children: [
           {
             type: 'li',
             className: 'menu-item context-buttons',
             children: [
              {
                 type: 'div',
                 id: 'scissors',
                 className: 'settings-button cursor pl-22px',
                 attributes: { "data-action": "addgrid", "data-type": "12" },
                 children: [{ type: 'i', className: 'icon-feather-plus' }]
               },
               {
                 type: 'div',
                 id: 'scissors',
                 className: 'settings-button cursor',
                 attributes: { 'data-action': 'cut' },
                 children: [{ type: 'i', className: 'icon-feather-scissors' }]
               },
               {
                 type: 'div',
                 id: 'copyElement',
                 className: 'settings-button cursor',
                 attributes: { 'data-action': 'copy' },
                 children: [{ type: 'i', className: 'icon-feather-copy' }]
               },
               {
                 type: 'div',
                 id: 'pasteElement',
                 className: 'settings-button cursor',
                 attributes: { 'data-action': 'paste' },
                 children: [{ type: 'i', className: 'icon-feather-clipboard' }]
               }
         
             ]
           }
         ]
       },
       {
         type: 'ul',
         className: 'menu-list',
         children: [
           {
             type: 'li',
             className: 'menu-item context-buttons',
             children: [
 
               {
                 type: 'div',
                 id: 'printer',
                 className: 'settings-button cursor pl-22px',
                 attributes: { 'data-action': 'printer' },
                 children: [{ type: 'i', className: 'icon-feather-printer' }]
               },
               {
                 type: 'div',
                 id: 'cameras',
                 className: 'settings-button cursor',
                 attributes: { 'data-action': 'capture' },
                 children: [{ type: 'i', className: 'icon-feather-camera' }]
               },
               {
                 type: 'div',
                 id: 'scissors',
                 className: 'settings-button cursor pl-5px',
                 attributes: { 'data-action': 'animation' },
                 children: [{ type: 'i', className: 'icon-feather-layers' }]
               },
               {
                 type: 'div',
                 id: 'pasteElement',
                 className: 'settings-button cursor pl-5px red',
                 attributes: { 'data-action': 'deletegrid' },
                 children: [{ type: 'i', className: 'icon-feather-trash' }]
               }
             ]
           }
         ]
       },
       {
         type: 'ul',
         className: 'menu-list',
         children: [
           {
             type: 'li',
             id: 'simpan',
             className: 'menu-item',
             attributes: { 'data-action': 'save' },
             children: [
               {
                 type: 'div',
                 className: 'menu-button',
                 children: [
                   { type: 'i', className: 'ti-save' },
                   { type: 'span', textContent: 'Simpan' },
                   { type: 'span', textContent: 'CTRL+S' }
                 ]
               }
             ]
           }
         ]
       },
       pptx ? {
         type: 'ul',
         className: 'menu-list',
         children: [
           {
             type: 'li',
             id: 'public',
             className: 'menu-item',
             attributes: { 'data-action': 'public' },
             children: [
               {
                 type: 'div',
                 className: 'menu-button',
                 children: [
                   { type: 'i', className: 'icon-feather-globe' },
                   { type: 'span', textContent: 'Publikasikan' }
                 ]
               }
             ]
           }
         ]
       }:null,
       {
         type: 'ul',
         className: 'menu-list',
         children: [
           {
             type: 'li',
             id: 'removePage',
             className: 'menu-item',
             attributes: { 'data-action': 'removePage' },
             children: [
               {
                 type: 'div',
                 className: 'menu-button menu-button--delete',
                 children: [
                   { type: 'i', className: 'icon-feather-trash' },
                   { type: 'span', textContent: 'Hapus' },
                   { type: 'span', id: 'hapusPage', textContent: 'Halaman' }
                 ]
               }
             ]
           }
         ]
       }
     ].filter(Boolean)
   };
   return menuStructure;
}



export function createElementFromStructure(structure) {
  const element = document.createElement(structure.type || 'div');
  
  if (structure.id) element.id = structure.id;
  if (structure.className) element.className = structure.className;
  if (structure.textContent) element.textContent = structure.textContent;
  
  if (structure.attributes) {
    for (const [key, value] of Object.entries(structure.attributes)) {
      element.setAttribute(key, value);
    }
  }
  if (structure.children) {
    structure.children.forEach(child => {
      element.appendChild(createElementFromStructure(child));
    });
  }
  return element;
}
