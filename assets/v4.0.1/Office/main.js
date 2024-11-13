import {
user_id,
officeTabelQuery,
setCookie,
decryptObject,
closeModal,
tokenize,
md5 
} from "../ngorei.js";

import { getFileIcon } from "./assets/getFileIcon.js";
import { system } from "./assets/system.js";
import { instance } from "./assets/instance.js";
import { instanceProgrm } from "./assets/progrm.js";
import { instanceList } from "./assets/instanceList.js";
import { progrmkey } from "./assets/progrmkey.js";
import { sharekey } from "./assets/sharekey.js";





import { rootGaleri } from "./assets/galeri.js";
import { rootVideoid } from "./assets/videoid.js";

import { genProgrm } from "./assets/genProgrm.js";
import { fileuser } from "./assets/fileuser.js";
import { rootLevel } from "./assets/rootLevel.js";
import {rootDocx} from "./assets/docx.js";
import {rootPptx} from "./assets/pptx.js";
import {rootXlsx} from "./assets/xlsx.js";
import {xlsxApps} from "./assets/xlsxApps.js";
import {xlsxDownload} from "./assets/xlsxDownload.js";
import {notifProgram} from "./firebase/index.js";





  const FileExplorer = (function () {
  const STG = new Dom.Storage();
  const ID = STG.user_id();
  const fileSystem = {
    Document: {
        "Notes.txt": null,
    },
    Apps: {
      "Notes.txt": null,
    },
    [ID.instance]: {
      "Notes.txt": null,
    }, 
    Program: {
      "Notes.txt": null,
    },
    Share:sharekey(ID.instance),
    [ID.name]: {
      "Notes.txt": null,
    },
  };

// ms-Icon ms-Icon--FabricUserFolder
  const galleryItems = ['galeri', 'foto', 'images', 'img'];
  const notFolderItems = ['galeri', 'foto', 'images', 'img'];
  const postinganItems = ['artikel','tulisan','konten','postingan','berita','ulasan','posting'];
  let currentPath = [];
  let history = [];
  let currentHistoryIndex = -1;
  let clipboardItem = null;
  let viewMode = "horizontal"; // Default ke tampilan horizontal
  let deletedFolders = [];
  let renamedFolders = [];
  let download = "";
  let galeriItem=[];

  function updateBreadcrumb() {
    const breadcrumb = document.getElementById("breadcrumb");
    if (!breadcrumb) {
      console.warn("Elemen dengan id 'breadcrumb' tidak ditemukan.");
      return; // Keluar dari fungsi jika elemen tidak ditemukan
    }

    breadcrumb.innerHTML = `
    <span class="breadcrumb-item cursor" data-path="[]">Explorer</span>
    ${currentPath
      .map(
        (folder, index) =>
          `<span class="breadcrumb-item cursor" data-path='${JSON.stringify(
            currentPath.slice(0, index + 1)
          )}'>${folder}</span>`
      )
      .join("")}
  `;

    document.querySelectorAll(".breadcrumb-item").forEach((item) => {
      item.addEventListener("click", function () {
        $("#mainoffice").show();
        $("#dataset").html("");
        STG.localStorage("explorer").setItem(false);
        const path = JSON.parse(this.getAttribute("data-path"));
        navigateTo(path);
      });
    });
  }

  function navigateTo(path) {
    STG.localStorage("breadcrumb").setItem(path);
    try {
      let currentFolder = fileSystem;
      for (const folder of path) {
        if (currentFolder[folder] === undefined) {
          throw new Error(`Folder "${folder}" tidak ditemukan`);
        }
        currentFolder = currentFolder[folder];
      }
      currentPath = path;
      if (currentPath[0] ==='Document' ||currentPath[0] ==='Program') {
        // STG.officeFile()
      }
      history = history.slice(0, currentHistoryIndex + 1);
      history.push(path);
      currentHistoryIndex = history.length - 1;
      renderContent();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
function applyIconImage(element) {
  const iconElement = element.querySelector('.iconurl');
  if (iconElement && iconElement.hasAttribute('img')) {
    const imgUrl = iconElement.getAttribute('img');
    iconElement.style.backgroundImage = `url('${imgUrl}')`;
    iconElement.style.display = 'inline-block';
    iconElement.style.width = '40px'; // Sesuaikan ukuran sesuai kebutuhan
    iconElement.style.height = '40px';
    iconElement.style.backgroundSize = 'cover';
    iconElement.style.backgroundPosition = 'center';
    iconElement.style.backgroundRepeat = 'no-repeat';
  }
}
  function renderContent() {
    updateBreadcrumb();
     const STG3=new Dom.Storage();
    const content = document.getElementById("main-content");
    content.innerHTML = "";
    content.className = `${viewMode}-view`; // Terapkan kelas sesuai mode tampilan
    const fragment = document.createDocumentFragment();
    let currentFolder = getCurrentFolder();
    let isEmpty = true;
    for (const item in currentFolder) {
      isEmpty = false;
      const itemElement = document.createElement("div");
      itemElement.className = "item";
      itemElement.setAttribute("role", "button");
      itemElement.setAttribute("tabindex", "0");

      const isFolder = currentFolder[item] !== null;
      const iconElement = document.createElement("div");
      iconElement.className = `icon ${isFolder ? "folder" : "file"}`;
      if (isFolder) {
        if (item==='Access') {
           if (ID.role ==='admin') {
             iconElement.innerHTML ='<i class="ms-Icon picons-thin-icon-thin-0051_settings_gear_preferences powerpoint-file-color"></i>';
           } else {
             iconElement.innerHTML ='<i class="ms-Icon entypo-icon-box folder-icon"></i>';
           }
        } else if (galleryItems.includes(item.toLowerCase())) {
          iconElement.innerHTML ='<i class="ms-Icon entypo-icon-folder-images folder-icon"></i>';
        } else if (item===ID.name) {
          iconElement.innerHTML ='<i class="ms-Icon mdi mdi-folder-account fs-40px folder-icon"></i>';
        } else if (item==='Video') {
          iconElement.innerHTML ='<i class="ms-Icon entypo-icon-folder-video folder-icon"></i>';
        } else if (item ==='Share') {
           iconElement.innerHTML ='<i class="ms-Icon mdi mdi-folder-move fs-40px folder-icon"></i>';
        } else if (postinganItems.includes(item.toLowerCase())) {
          iconElement.innerHTML ='<i class="ms-Icon entypo-icon-archive folder-icon"></i>';
        } else {
         iconElement.innerHTML ='<i class="ms-Icon entypo-icon-folder folder-icon"></i>';
        }



// Berbagi mdi-folder-star








//mdi mdi-folder-account
        //mdi mdi-folder-edit  fi-folder-lock fs-42px folder-icon
      } else {
        const { icon, color } = getFileIcon(item);
        if (getFileType(item) == "image") {
           const offSdk = STG.localData("galeri").get(item);
           if (offSdk) {
              iconElement.innerHTML = `<i class="iconurl" img="${offSdk.icon}"></i>`;
              applyIconImage(iconElement);
             
           } else {
            let galeriID=rootGaleri(item);
            if (galeriID) {
               iconElement.innerHTML = `<i class="iconurl" img="${galeriID.icon}"></i>`;
               applyIconImage(iconElement);
                 var dataArray={
                     [item]:galeriID
                }
               
               STG.localData('galeri').add(dataArray)

            } else {
                 iconElement.innerHTML = `<i class="ms-Icon ${icon} ${color}"></i>`;
            }
       
                
           }
        } else if (getFileType(item) == "video") {
           const offSdk = STG.localData("video").get(item);
           if (offSdk) {
               iconElement.innerHTML = `<i class="iconurl" img="${offSdk.thumbnail}"></i>`;
               applyIconImage(iconElement);
           } else {
            var cideoid=rootVideoid(item);
            if (cideoid) {
             iconElement.innerHTML = `<i class="iconurl" img="${cideoid.thumbnail}"></i>`;
             applyIconImage(iconElement);
                  var dataArray={
                        [item]:cideoid
                     }
                   STG.localData('video').add(dataArray)
            }
           }
          
        } else {
          iconElement.innerHTML = `<i class="ms-Icon ${icon} ${color}"></i>`;
        }
      }

      const nameElement = document.createElement("div");
      nameElement.className = "item-name";
      nameElement.textContent = item;

      itemElement.appendChild(iconElement);
      itemElement.appendChild(nameElement);

      if (isFolder) {
        itemElement.addEventListener("click", () =>
          navigateTo([...currentPath, item])
        );
      }

      itemElement.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        showContextMenu(e, item, isFolder, currentFolder);
      });

      fragment.appendChild(itemElement);
    }

    content.appendChild(fragment);

    content.style.height = isEmpty ? "200px" : "auto";

    content.removeEventListener("contextmenu", handleContextMenu);

    content.addEventListener("contextmenu", handleContextMenu);
    // $("#mainoffice").html('Helllo');
    const wodInner = STG.localStorage("explorer").get();
    if (wodInner) {
      onRoute(wodInner);
      $("#mainoffice").hide();
    }
  }

  function handleContextMenu(e) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const isClickInsideContent =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (isClickInsideContent) {
      let currentFolder = getCurrentFolder();
      showContextMenu(e, null, true, currentFolder);
    }
  }

  function showContextMenu(e, item, isFolder, currentFolder) {
    // if (item && (galleryItems.includes(item.toLowerCase()) || postinganItems.includes(item.toLowerCase()) || item === 'Video')) {
    //     return; // Jangan tampilkan apapun jika kondisi terpenuhi
    // }
    const officeData = STG.localData("office").get(item);
    const existingMenu = document.querySelector(".context-menu");
    if (existingMenu) {
      existingMenu.remove();
    }
    const contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";
    contextMenu.style.position = "absolute";
    // Hitung dimensi dan posisi menu
    const menuWidth    = 200;
    const menuHeight   = 300;
    const subMenuWidth = 180; // Perkiraan lebar submenu
    const windowWidth  = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = e.pageX;
    let top = e.pageY;

    // Pastikan menu utama tidak keluar dari batas jendela
    if (left + menuWidth > windowWidth) {
      left = windowWidth - menuWidth;
    }
    if (top + menuHeight > windowHeight) {
      top = windowHeight - menuHeight;
    }

    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
    let actions = [];
    const isRootLevel = currentPath.length === 0;
    const isProtectedItem =
    isRootLevel && Object.keys(fileSystem).includes(item);
    //rootLevel(e, item, isFolder, currentFolder)
    if (item === null) {
      const isMainOffice = e.target.closest("#mainoffice") !== null;
      if (isMainOffice) {
        const isInCurrentPath = e.target.closest("#main-content") !== null;
        if (
          currentPath.length > 0 &&
          currentPath[0] !== "Program" &&
          currentPath[0] !== "Document" &&
          currentPath[0] !== ID.instance &&
          currentPath[0] !== "Apps"
        ) {

        

          if (currentPath[0] =='Program') {
            // if (ID.role ==='admin') {
            //   actions = [{ text: "Buat Program", icon: "ms-Icon",className: "itmlabel bold", }]; 

            // if (currentPath.length == 1) {
            //  actions.push(
                //  { text: "Refresh", icon: "ms-Icon entypo-icon-cycle",className: "itmlabel1"}
                //  );  
            // }
            // }
          } else {
            actions = [
              { text: "Buat Folder", icon: "entypo-icon-folder folder-icon",className: "itmlabel bold", }];

               if (clipboardItem !== null) {
                 actions.push({
                   text: "Paste",
                   icon: "ms-Icon picons-thin-icon-thin-0255_paste_clipboard",
                   className: "itmlabel",
                 });
               }



          }

    if (currentPath[1] && galleryItems.includes(currentPath[1].toLowerCase())) {
        const jumlah = Object.keys(currentFolder).length;
        if (currentPath[2]) {
        actions.push(
            { text: "Upload Gambar", icon: "ms-Icon icon-feather-upload", className: "itmlabel" }
        );
        if (jumlah) {
            actions.push(
                { text: "Slideshow", icon: "ms-Icon picons-thin-icon-thin-0112_folder_images_photos", className: "itmlabel" }
            );
        }
       }
     } else if (currentPath[1] && postinganItems.includes(currentPath[1].toLowerCase())) {
        actions.push(
            { text: "Buat "+currentPath[1], icon: "ms-Icon docs-homescreen-icon-docs", className: "itmlabel" }
        );              
     } else if (currentPath[1] === 'Video') {
             if (currentPath[2]) {
                  actions.push(
                    {
                      text: "Upload Video",
                      icon: "ms-Icon icon-feather-play-circle",
                      className: "itmlabel",
                    }
                  );
             }

          } else {

          // if (currentPath[0] =='Program') {
            if (ID.role ==='admin') {
              //if (currentPath[1]) {
                  actions.push(
                      {
                        text: "Refresh",
                        icon: "icon-refresh",
                        className: "itmlabel1",
                      },
                      {
                        text: "Buat File Xlsx",
                        icon: "ms-Icon docs-homescreen-icon-sheets",
                        className: "itmlabel1",
                      },
                      {
                        text: "Buat File Charts",
                        icon: "ms-Icon docs-homescreen-icon-forms",
                        className: "itmlabel1",
                      },
                      {
                        text: "Buat File Pptx",
                        icon: "ms-Icon docs-homescreen-icon-slides",
                        className: "itmlabel1",
                      }, 
                      {
                        text: "Buat File Docx",
                        icon: "ms-Icon docs-homescreen-icon-docs",
                        className: "itmlabel1",
                      },
                      {  text: "Buat File Pdf", 
                         icon: "ms-Icon docs-homescreen-icon-sites",
                         className: "itmlabel2", 
                      }
                    );
             // }
            //}
          } else {
              actions.push(
                {
                  text: "Refresh",
                  icon: "icon-refresh",
                  className: "itmlabel1",
                },
                {
                  text: "Buat File Xlsx",
                  icon: "ms-Icon docs-homescreen-icon-sheets",
                  className: "itmlabel1",
                },
                {
                  text: "Buat File Charts",
                  icon: "ms-Icon docs-homescreen-icon-forms",
                  className: "itmlabel1",
                },
                {
                  text: "Buat File Pptx",
                  icon: "ms-Icon docs-homescreen-icon-slides",
                  className: "itmlabel1",
                }, 
                {
                  text: "Buat File Docx",
                  icon: "ms-Icon docs-homescreen-icon-docs",
                  className: "itmlabel1",
                },
                {  text: "Buat File Pdf", 
                   icon: "ms-Icon docs-homescreen-icon-sites",
                   className: "itmlabel2", 
                }
              );
          }

          }
 
        } else {
          // Tidak menampilkan menu jika berada di Explorer/Public atau root
          // return;
        }
      }
    } else {
      if (isRootLevel && !isFolder) {
        actions = [
          { text: "Open", icon: "false", className: "itmlabel1" },
          {
            text: "Download",
            icon: "ms-Icon icon-feather-download",
            className: "itmlabel1",
          },
          {
            text: "Delete",
            icon: "ms-Icon icon-feather-trash",
            className: "itmlabel",
          },
        ];
      } else if (isRootLevel && isFolder) {

      } else if (isFolder) {
        if (
          currentPath.length > 0 &&
          currentPath[0] !== "Document" &&
          currentPath[0] !== "Apps" &&
          currentPath[0] !== "Program" &&
          currentPath[0] !== ID.instance
        ) {
          //JIKA FOLDER MEMILIKI FILE
          const jumlah = Object.keys(currentFolder[item]).length;
          if (jumlah) {
              actions = [
                { text: "Open", icon: "false", className: "itmlabel1" },
                {
               text: "Copy",
               icon: "ms-Icon icon-feather-file",
               className: "itmlabel1"
           },
              ];

              if (currentPath[0]===ID.name) {
               if (item && (galleryItems.includes(item.toLowerCase()) || postinganItems.includes(item.toLowerCase()) || item === 'Video')) {
                   return; // Jangan tampilkan apapun jika kondisi terpenuhi
               }
               
              
               if (item==='Program') {
                  if (ID.role ==='admin') {
                      actions.push({
                         text: "Public Program",
                         icon: "ms-Icon icon-feather-globe",
                         className: "itmlabel1",
                         label: "itmlabel1",
                      })
                  }
               } else {
                  if (currentPath[1] !=='Program') {
                      actions.push({
                         text: "Program",
                         icon: "ms-Icon icon-feather-globe",
                         className: "itmlabel1",
                         label: "itmlabel1",
                      },
                      {
                         text: "Share Folder",
                         icon: "ms-Icon icon-feather-share-2",
                         className: "itmlabel1",
                         label: "itmlabel1",
                      });

                  }

               }
              }

          }

        }

        // console.log(officeData2)
        if (currentPath[0] == "Document" || currentPath[0] == "Apps" || currentPath[0] == "Program" || currentPath[0] == ID.instance) {
          actions.push(
            { text: "Open", icon: "false", className: "itmlabel1" },
            {
              text: "Copy",
              icon: "ms-Icon icon-feather-file",
              className: "itmlabel1",
            }
          );
          if (ID.role==='admin') {
             if (Object.keys(currentFolder[item]).length === 0) {
               actions.push({
                 text: "Delete",
                 icon: "ms-Icon icon-feather-trash",
                 className: "itmlabel",
               });
             }
         }
          

        }

        if (currentPath[0] !== "Document" && currentPath[0] !== "Program" && currentPath[0] !== "Apps" && currentPath[0] !== ID.instance) {
           if (clipboardItem) {
             actions.push({
               text: "Paste",
               icon: "ms-Icon picons-thin-icon-thin-0255_paste_clipboard",
               className: "itmlabel",
             });
           }
           // JIKA FOLDER BELUM ADA FILE
             if (Object.keys(currentFolder[item]).length === 0) {
               actions.push( 
                 { text: "Open", icon: "false", className: "itmlabel1" },
                 {
                     text: "Rename",
                     icon: "ms-Icon icon-feather-edit-3",
                     className: "itmlabel1",
           },
                 {
                    text: "Delete",
                    icon: "ms-Icon icon-feather-trash",
                    className: "itmlabel",
               });
             }

           }
      } else {
        if (currentPath[0] !== "Document" && currentPath[0] !== "Apps"  && currentPath[0] !== ID.instance) {
           const fileType = getFileType(item);
           const officeMenu = STG.localData("office").get(item);
          if (fileType ==='image') {
            actions = [
              { text: "Preview", icon: "false", className: "itmlabel1" },
              { text: "Copy",icon: "ms-Icon icon-feather-file",className: "itmlabel1"},
              { text: "Delete",icon: "ms-Icon icon-feather-trash",className: "itmlabel"}
            ];
            } else if (fileType ==='video') {
               actions = [
                 { text: "Preview Video", icon: "false", className: "itmlabel1" },
                 { text: "Copy",icon: "ms-Icon icon-feather-file",className: "itmlabel1"},
                 { text: "Delete",icon: "ms-Icon icon-feather-trash",className: "itmlabel"}
               ];
            } else {



              actions = [
                { text: "Open", icon: "false", className: "itmlabel1" },
                {
                  text: "Copy",
                  icon: "ms-Icon icon-feather-file",
                  className: "itmlabel1",
                },
              ];
              if (fileType==='pdf') {
                 if (officeMenu && officeMenu.userid===ID.red) {
                    actions.push( 
                       {
                         text: "Delete",
                         icon: "ms-Icon icon-feather-trash",
                         className: "itmlabel",
                    });
                 }

              }
       

                if (currentPath[0] =='Program') {
                     if (ID.role ==='admin') {
                       if (!officeData) {
                              actions.push( 
                               {
                                 text: "Settings",
                                 icon: "ms-Icon icon-feather-settings",
                                 className: "itmlabel1",
                               },
                              { text: "Delete",icon: "ms-Icon icon-feather-trash",className: "itmlabel1"},
                             );
                        }
                      }



                } else {
                       if (!officeData) {
                        if (fileType==='pdf') {
                              actions.push( 
                              { text: "Delete",icon: "ms-Icon icon-feather-trash",className: "itmlabel1"},
                             );

                        } else {
                              actions.push( 
                               {
                                 text: "Settings",
                                 icon: "ms-Icon icon-feather-settings",
                                 className: "itmlabel1",
                               },
                              { text: "Delete",icon: "ms-Icon icon-feather-trash",className: "itmlabel1"},
                             );

                        }



                        } 
                }
   
                   
              // }

          if (officeMenu) {
            if (fileType !== "cts" && fileType !== "pptx") {
              if (fileType === "xlsx") {
                
                 if (officeData && officeData.folder !=='Apps') {
                 const dbData = xlsxDownload(officeMenu.cradensial, item);  
                 if (dbData) {
                     download = dbData.thumbnail;
                     actions.push({
                       text: "Copy name",
                        icon: "ms-Icon icon-feather-copy",
                       className: "itmlabel1",
                     },
                     {
                       text: "Download",
                       icon: "ms-Icon icon-feather-download",
                       className: "itmlabel1",
                     },
                     // {
                     //    text: "Cradensial",
                     //    icon: "ms-Icon icon-feather-shield",
                     //    className: "itmlabel1",
                     // }
                    );
                 }

                  if (!dbData) {
                          actions.push({
                            text: "Upload File",
                            icon: "ms-Icon icon-feather-upload",
                            className: "itmlabel1",
                          });
                  }

                 }
              }
            }
          } else {
           // const rowApps = STG.localData('apps').get(item);
           // if (!rowApps) {
           //   actions.push(
           //        {
           //          text: "Copy name",
           //          icon: "ms-Icon icon-feather-copy",
           //          className: "itmlabel1",
           //        },
           //   {
           //     text: "Rename",
           //     icon: "ms-Icon icon-feather-edit-3",
           //     className: "itmlabel1",
           //   }); 
           // }


          }

          if (!isProtectedItem) {
            if (officeData && officeData.folder !=='Apps') {
                 if (officeData.uid===ID.red) {
                actions.push(
                  {
                    text: "Settings",
                    icon: "ms-Icon icon-feather-settings",
                    className: "itmlabel1",
                  },
                   {
                        text: "Delete",
                        icon: "ms-Icon icon-feather-trash red",
                        className: "itmlabel1",
                      },
                  {
                    text: "Properties",
                    icon: "ms-Icon",
                    subMenu: [
                      {
                        text: "Cradensial",
                        icon: "ms-Icon icon-feather-shield",
                        className: "itmlabel1",
                      }
                    ],
                    className: "itmlabel",
                  }
                );
            }
            } else {
              if (officeData && officeData.folder === 'Apps') {
                 actions.push(
                  { text: "Delete",icon: "ms-Icon icon-feather-trash",className: "itmlabel1"},
                  {text: "Properties",icon: "ms-Icon ",className: "itmlabel"},
                  );  
               }
            }
      
           }
          }
        } else {
          if (currentPath[0] === "Apps") {

           if (officeData && officeData.folder === 'Apps') {
            actions = [
              { text: "Open", icon: "false", className: "itmlabel1" },
              {
                text: "Copy",
                icon: "ms-Icon icon-feather-file",
                className: "itmlabel1",
              },
              {
                text: "Properties",
                icon: "ms-Icon ",
                className: "itmlabel",
              },
             ];
           } else {
            actions = [
              { text: "Open", icon: "false", className: "itmlabel1" },
              {
                text: "Properties",
                icon: "ms-Icon ",
                className: "itmlabel",
              },
             ];   
           }


          } else {
            actions = [
              { text: "Open", icon: "false", className: "itmlabel1" },
              {
                text: "Copy",
                icon: "ms-Icon icon-feather-file",
                className: "itmlabel1",
              },
              {
                text: "Copy name",
                icon: "ms-Icon icon-feather-copy",
                className: "itmlabel1",
              }
            ];
          }
        }
      }
    }
    actions.forEach((action) => {
      const actionItem = document.createElement("div");
      actionItem.className = "menu-item " + action.className;
      if (action.icon !== "false") {
        actionItem.innerHTML = `<i class="${action.icon}"></i> 
          <span class="itmlabel">${action.text}</span>  
          `;
      } else {
        actionItem.innerHTML = `<i class="${action.icon}"></i> 
           <b class="itmlabel">${action.text}</b>  
          `;
      }

      if (Array.isArray(action.subMenu)) {
        actionItem.classList.add("has-submenu");
        const subMenu = document.createElement("div");
        subMenu.className = "sub-menu";

        // Tentukan posisi submenu
        const subMenuLeft = left + menuWidth;
        const isSubMenuOutOfBounds = subMenuLeft + subMenuWidth > windowWidth;

        subMenu.style.left = isSubMenuOutOfBounds ? "auto" : "100%";
        subMenu.style.right = isSubMenuOutOfBounds ? "100%" : "auto";

        action.subMenu.forEach((subAction) => {
          const subActionItem = document.createElement("div");
          subActionItem.className = "menu-item " + subAction.className;
          subActionItem.innerHTML = `
             <i class="${subAction.icon}"></i>
             <span class="itmlabel">${subAction.text}</span>  
          `;
          subActionItem.onclick = (event) => {
            event.stopPropagation();
            handleContextMenuAction(subAction.text, item, currentFolder);
            contextMenu.remove();
          };
          subMenu.appendChild(subActionItem);
        });

        actionItem.appendChild(subMenu);
      } else {
        actionItem.onclick = (event) => {
          event.stopPropagation();
          handleContextMenuAction(action.text, item, currentFolder);
          contextMenu.remove();
        };
      }

      contextMenu.appendChild(actionItem);
    });

    if (actions.length > 0) {
      document.body.appendChild(contextMenu);

      setTimeout(() => {
        document.addEventListener("click", function removeContextMenu(event) {
          if (!contextMenu.contains(event.target)) {
            contextMenu.remove();
            document.removeEventListener("click", removeContextMenu);
          }
        });
      }, 0);
    }
  }

  window.sendCallbackOffice = function (key) {
    if (typeof key === 'object' && key !== null && 'type' in key) {
    const officeData = STG.localData("office").get(key.type);
    if (key.data === "hapus") {
       deleteItem(key.type);
         const from = STG.BriefSnd({
          endpoint: "7A557-643C2-8DBC7-30972",
          data: key,
        });
    
      STG.localData("office").del(key.type);
      STG.localData('history').del(key.type)
      LoadHistory()
    } else {
      if (key.type === "folder") {
        // Buat folder Disini
        createItem(key.data, key.title);
      } else {
        
         if (key.destroy === "img") {
          let nmFile=key.title+"."+key.type
          const basisData = window.Ngorei;
          const red = decryptObject(basisData.tokenize, "manifestStorage");
           var dataArray={
               [nmFile]:{
                "id":key.id,
                "uid":key.userid,
                "file":nmFile,
                "title":key.title,
                "type":key.type,
                "icon":red.endpoint+"img/"+key.thumb100,
                "thumbnail":red.endpoint+"img/"+key.thumb600,
                "large":red.endpoint+"img/"+key.thumbnail,
                "data":key
               }
          }
           STG.localData('galeri').add(dataArray)
           createItem('file', key.title, key.type);
        } else if (key.destroy === "pdf") {
            const from = STG.BriefSnd({
              "endpoint":"84EE4-0CDF9-2E9EB-618AA",
              "data": key,  
            });
          createItem(key.data, key.title, key.type);
        } else {
     
     
            if (key.type==="video") {
             let nmFile=key.formdata.title+"."+key.type
               var dataArray={
                   [nmFile]:{
                    "id":key.data.id,
                    "title":key.data.title,
                    "thumbnail":key.data.thumbnail_url,
                    "data":key,
                   }
                }
               
                STG.localData('video').add(dataArray)
                createItem('file', nmFile, key.type);
            } else {
                createItem(key.data, key.title, key.type);

            }
        }

      }
    }
    closeModal();
     } else {
       console.error("Invalid key object:", key);
    // Tambahkan penanganan kesalahan yang sesuai di sini
     }
     loadFileSystem()
  };

  function copyTextToClipboard(text) {
    return new Promise((resolve, reject) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(resolve).catch(reject);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);
          if (successful) {
            resolve();
          } else {
            reject("Tidak dapat menyalin teks");
          }
        } catch (err) {
          document.body.removeChild(textArea);
          reject(err);
        }
      }
    });
  }

  function handleContextMenuAction(action, item, currentFolder) {
    const renderData = getSTGData(item,action);
    switch (action) {
      case "Open":
        if (item !== null) {
          if (currentFolder[item] !== null) {
            navigateTo([...currentPath, item]);
          } else {
             const setType = getFileType(item);
             const officeData = STG.localData("office").get(item);
             const icon=getFileIcon(item);
             const hist={
                  [item]:{
                    "file":item,
                    "icon":icon.icon+" "+icon.color,
                    "type":setType,
                    "data":renderData
                  }
               }
              STG.localData('history'+ID.name).history(hist)
              LoadHistory()
            // DATA XLSX
            if (setType === "xlsx") {
              const storage = {file: item};
         const officeData = STG.localData("office").get(item);
         if (officeData) {
                   if (currentPath[0]==='Apps') {
               if (officeData.theme===2) {
                       STG.localStorage("explorer").setItem(["dataset","#preview/bpsdinamis",storage]);
                       onRoute(["dataset", "#preview/bpsdinamis", storage]);
               } else {
                       STG.localStorage("explorer").setItem(["dataset","#preview/bps",storage]);
                       onRoute(["dataset", "#preview/bps", storage]);
               }
                     $("#mainoffice").hide();
             } else {
              if (officeData.no===1) {
             

                       if (officeData.theme===2) {  
                          STG.localStorage("explorer").setItem(["dataset","#explorer/xlsdinamis",renderData]);
                          onRoute(["dataset", "#explorer/xlsxdinamis", renderData]);
                       } else {
                          STG.localStorage("explorer").setItem(["dataset","#explorer/xls",renderData]);
                          onRoute(["dataset", "#explorer/xls", renderData]);
                       }
                        $("#mainoffice").hide();


                        // STG.localStorage("explorer").setItem(["dataset","#explorer/xls",renderData]);
                        // onRoute(["dataset", "#explorer/xls", renderData]);
                        // $("#mainoffice").hide();
              } else if (officeData.no===2) {
                       if (officeData.theme===2) {  
                          STG.localStorage("explorer").setItem(["dataset","#explorer/xlsxdinamis",renderData]);
                          onRoute(["dataset", "#explorer/xlsxdinamis", renderData]);
                       } else {
                          STG.localStorage("explorer").setItem(["dataset","#explorer/xlsx",renderData]);
                          onRoute(["dataset", "#explorer/xlsx", renderData]);
                       }
                        $("#mainoffice").hide();
              } else if (officeData.no===12) {
                       STG.localStorage("explorer").setItem(["dataset","#preview/bpsdinamis",storage]);
                       onRoute(["dataset", "#preview/bpsdinamis", storage]);
              } else  if (officeData.no===11) {
                       STG.localStorage("explorer").setItem(["dataset","#preview/bps",storage]);
                       onRoute(["dataset", "#preview/bps", storage]);
              } 
                      $("#mainoffice").hide();
             }
         } else {
                   if (currentPath[0]==='Apps') {
                       STG.localStorage("explorer").setItem(["dataset","#preview/bps",storage]);
                       onRoute(["dataset", "#preview/bps", storage]);
                       $("#mainoffice").hide();
             } else {
                 if (officeData) {
                         STG.localStorage("explorer").setItem(["dataset","#explorer/xlsx",renderData]);
                         onRoute(["dataset", "#explorer/xlsx", renderData]);
                 }

             }

         }
        
            } else if (setType === "pdf") {
                   const basisData = window.Ngorei;
                   const red = decryptObject(basisData.tokenize, "manifestStorage");
                   console.log(renderData.filename)
                   renderData["link"]=red.endpoint+"public/drive/"+renderData.filename
                   STG.localStorage("explorer").setItem([
                     "dataset",
                     "#preview/pdf",
                      renderData,
                   ]);
                   onRoute(["dataset", "#preview/pdf", renderData]);
                   $("#mainoffice").hide();
            } else if (setType === "docx") {
              if (renderData.no == 6 || renderData.no == 7 ) {
                  const renderDataID = getSTGDataID(item);
                  var storage = {
                    file: item,
                  };
                  if (renderDataID) {
                      var gabungArray = { ...ID, ...storage };
                      STG.localStorage("explorer").setItem([
                        "dataset",
                        "#explorer/docx",
                        gabungArray,
                      ]);
                      onRoute(["dataset", "#explorer/docx", gabungArray]);
                      $("#mainoffice").hide();
                  } else {
                     rootDocx(renderData,ID,item);
                  }
              } else {
                  STG.localStorage("explorer").setItem([
                    "dataset",
                    "#preview/docx",
                    storage,
                  ]);
                  onRoute(["dataset", "#preview/docx", storage]);
                  $("#mainoffice").hide();
               }
            } else if (setType === "pptx") {
              if (renderData.no === 4 || renderData.no === 5) {
                  const renderDataID = getSTGDataID(item);
                  var storage = {
                    file: item
                  };
                  if (renderDataID) {
                       var gabungArray = { ...ID, ...storage };
                       STG.localStorage("explorer").setItem([
                         "dataset",
                         "#explorer/pptx",
                          gabungArray,
                       ]);
                       onRoute(["dataset", "#explorer/pptx", gabungArray]);
                       $("#mainoffice").hide();
                  } else {
                      rootPptx(renderData,ID,item);

                      // STG.localStorage("explorer").setItem(["dataset","#preview/pptx",storage]);
                    // onRoute(["dataset", "#preview/pptx", storage]);
                    // $("#mainoffice").hide();
                  }
                 } else {
                    var storage = {file: item};
                    STG.localStorage("explorer").setItem(["dataset","#preview/pptx",storage]);
                    onRoute(["dataset", "#preview/pptx", storage]);
                    $("#mainoffice").hide();    
                 }
            } else if (setType === "cts") {
              if (renderData.no ==3) {
                 STG.localStorage("explorer").setItem([ "dataset", "#explorer/charts", renderData]);
                 onRoute(["dataset", "#explorer/charts", renderData]);
                 $("#mainoffice").hide();
              } else {
                var storage = {
                  file: item,
                };
                STG.localStorage("explorer").setItem(["dataset","#preview/cts",storage]);
                onRoute(["dataset", "#preview/cts", storage]);
                $("#mainoffice").hide();
              }
            }
            //} 
            // Batas File 
          }
        }
        break;

      case "Upload Video":
        var uid = user_id();
        var dataCradensial = {
          type: 'video',
          file: item,
          uid: uid.oauth.red,
        };
        onRoute([
          "Office",
          "Link Video",
          "#setting/linkvideo",
          dataCradensial,
        ]);
        break;
      case "Public Program":
           const getinitProgrm=progrmkey(currentFolder[item])
        break;
      case "Share Folder":
             const initProgrm3=instanceList(ID.instance)
             const addProgrma2={
                'sharefolder':initProgrm3,
                'instance':ID.instance,
                'status':ID.role,
                'cradensial':md5(ID.red+item),
                'folder':item,
                'count':Object.keys(currentFolder[item]).length,
                'data':{
                  [item]:currentFolder[item],
                }
             }
console.log(addProgrma2)
            STG.localStorage("share").setItem(addProgrma2);
            onRoute([
             "Office",
             "Share Folder",
             "#setting/share",
              addProgrma2,
           ]);



        break;
      case "Program":
            const initProgrm=instanceProgrm(ID.instance)
             const addProgrma={
                'program':Object.keys(initProgrm),
                'instance':ID.instance,
                'status':ID.role,
                'cradensial':md5(ID.red+item),
                'folder':item,
                'count':Object.keys(currentFolder[item]).length,
                'data':currentFolder[item],
             }
            STG.localStorage("prgminstance").setItem(addProgrma);
            onRoute([
             "Office",
             "Program",
             "#setting/program",
              addProgrma,
           ]);
        break;
      case "Rename":
        if (item !== null) {
          editItemInline(item);
        }
        break;
      case "Apps":
        var storage = {
          file: item,
        };
             const setType = getFileType(item);
             const offSdk = STG.localData("office").get(item);
             const icon=getFileIcon(item);
             const dataArray={
                  [item]:{
                    "file":item,
                    "icon":icon.icon+" "+icon.color,
                    "type":setType,
                    "apps":'Apps',
                    "data":'Apps'
                  }
               }
              STG.localData('history'+ID.name).history(dataArray)
              STG.localData('apps').history(dataArray)
              LoadHistory()
        if (offSdk && offSdk.no===2) {
           STG.localStorage("explorer").setItem(["dataset","#preview/bpsdinamis",storage]);
           onRoute(["dataset", "#preview/bpsdinamis", storage]);
        } else {
            STG.localStorage("explorer").setItem(["dataset","#preview/bps",storage]);
            onRoute(["dataset", "#preview/bps", storage]);
        }
        $("#mainoffice").hide();

        break;

      case "Rename":
        if (item !== null) {
          editItemInline(item);
        }
        break;
      case "Delete":
        if (item) {
          var addItem = currentFolder[item] !== null ? "folder" : "file";
          onModal([
            "Office",
            "Hapus " + addItem,
            "hapus",
            "Apakah Anda yakin ingin menghapus " + addItem,
            item,
          ]);
          // STG.localData('history').del(item)
          //  LoadHistory()

        }
        break;
      case "Download":
        if (item !== null) {
          window.location.href =
            tokenize().endpoint + "public/drive/" + download;
        }
        break;
      case "Upload File":
        onModal([renderData.check]);
        setCookie("explorer", renderData.file);
        break;
      case "Buat Folder":
        onModal([
          "Office",
          "Buat Folder",
          "folder",
          "Masukkan nama folder baru:",
        ]);
        break;
      case "Buat Program":
         onModal([
           "Office",
           "Buat Program",
           "folder",
           "Masukkan nama program baru:",
         ]);
         // onRoute(["Office", "Buat Program", "#explorer/program", ID]);
         STG.localStorage("createItem").setItem('Program');
        break;
      case "Buat File Teks":
        onModal([
          "Office",
          "Buat File Txt",
          "file",
          "Masukkan nama file teks baru:",
          "txt",
        ]);
        break;
      case "Buat File Slide":
        onModal([
          "Office",
          "Buat File Slide",
          "file",
          "Masukkan nama file sld",
          "sld",
        ]);
        break;
      case "Buat File Docx":
        onModal([
          "Office",
          "Buat File Docx",
          "file",
          "Masukkan nama file docx",
          "docx",
        ]);
        break;
      case "Buat File Xlsx":
        onModal([
          "Office",
          "Buat File Xlsx",
          "file",
          "Masukkan nama file xlsx",
          "xlsx",
        ]);
        break;
      case "Buat File Charts":
        onModal([
          "Office",
          "Buat File Cts",
          "file",
          "Masukkan nama file cts:",
          "cts",
        ]);
        break;
      case "Buat File Pdf":
        var uid = user_id();
        var dataCradensial = {
          type: 'img',
          file: item,
          uid: uid.oauth.red,
        };
        onRoute([
          "Office",
          "Upload PDF",
          "#setting/filepdf",
          dataCradensial,
        ]);
        let docPdf=currentPath.length
         setCookie("explorer", currentPath[docPdf-1]);
        console.log(docPdf)
       //  var imgPht=currentPath.length
       // setCookie("explorer", "PDF");
        break;
      case "Buat File Pptx":
        onModal([
          "Office",
          "Buat File Pptx",
          "file",
          "Masukkan nama file pptx",
          "pptx",
        ]);
        break;
      case "Cradensial":
        var uid = user_id();
        var type = getFileType(item);
        var typeIcon = getFileIcon(item);
        var dataCradensial = {
          type: type,
          file: item,
          uid: uid.oauth.red,
          color: typeIcon.color,
          icon: typeIcon.icon,
        };
        onRoute([
          "Office",
          "Cradensial",
          "#setting/cradensial",
          dataCradensial,
        ]);
        break;
      case "Upload Gambar":
        var uid = user_id();
        let imgPht=currentPath.length
        var dataCradensial = {
          type: 'img',
          file: currentPath[imgPht-1],
          uid: uid.oauth.red,
        };
        console.log(dataCradensial)
        onRoute([
          "Office",
          "File Browser",
          "#setting/filebrowser",
          dataCradensial,
        ]);
        
         console.log(currentPath[imgPht-1],ID)
        setCookie("explorer", currentPath[imgPht-1]);
        break;
      case "Settings":
        const officeData = STG.localData("office").get(item);
        var folder = currentPath.join('/');
        console.log(currentPath)
        var uid = user_id();
        var type = getFileType(item);
        var typeIcon = getFileIcon(item);
        const dataTerproses = {
          uid: uid.oauth.red,
          color: typeIcon.color,
          icon: typeIcon.icon,
          folder:folder,
          type: type,
          file: item,
        };
        if (type === "xlsx") {
          const dtsApps= xlsxApps(item)
              if (dtsApps) {
                  var type = getFileType(item);
                  var typeIcon = getFileIcon(item);
                  const dataTer = {
                    uid:ID.red,
                    color: typeIcon.color,
                    icon: typeIcon.icon,
                    type: type,
                    file: item,
                  };
               onRoute(["Office", "Pengaturan", "#setting/pvttable", dataTer]);
              } else {
                 if (officeData) {
                   onRoute(["Office", "Pengaturan", "#setting/properties", dataTerproses]);
                 } else {
                   onRoute(["Office", "Pengaturan", "#setting/xlsx", dataTerproses]);
                 }  
              }
        } else if (type === "docx") {
      let splitAction =currentPath;
      if (splitAction.length > 1) {
          let valItem = splitAction[1]; // Mendapatkan kata kedua
          const actionItems = ['Artikel', 'Tulisan', 'Konten', 'Postingan','Berita', 'Ulasan', 'Posting'];
          let index = actionItems.indexOf(valItem);
          if (index !== -1) {
             onRoute(["Office", "Pengaturan", "#setting/news", dataTerproses]);
          } else {
              onRoute(["Office", "Pengaturan", "#setting/docx", dataTerproses]);
          }
      } else {
         onRoute(["Office", "Pengaturan", "#setting/docx", dataTerproses]);
      }

        } else if (type === "pptx") {
          onRoute(["Office", "Pengaturan", "#setting/pptx", dataTerproses]);
        } else if (type === "cts") {
          onRoute(["Office", "Pengaturan", "#setting/cts", dataTerproses]);
        }
        break;
      case "Copy":
        if (item !== null) {

          clipboardItem = {
            name: item,
            content: JSON.parse(JSON.stringify(currentFolder[item])),
            isCut: false,
            sourcePath: [...currentPath],
          };
          // alert(`Item "${item}" telah disalin ke clipboard`);
        }
        break;
      case "Potong":
        if (item !== null) {
          clipboardItem = {
            name: item,
            content: currentFolder[item],
            isCut: true,
            sourcePath: [...currentPath],
          };
          //alert(`Item "${item}" telah dipotong ke clipboard`);
        }
      case "Paste":
        if (clipboardItem !== null) {
          pasteItem(currentFolder);
        }
        break;
      case "Copy name":
        if (item) {
          copyTextToClipboard(item)
            .then(() => {
              console.log("Nama file berhasil disalin:", item);
              // alert('Nama file berhasil disalin!');
            })
            .catch((err) => {
              console.error("Gagal menyalin nama file:", err);
              // alert('Gagal menyalin nama file. Silakan coba lagi.');
            });
        }
        break;
        case "Slideshow":
    

      if (currentPath[1] && galleryItems.includes(currentPath[1].toLowerCase())) {
          const dataArray = {
              folder: currentPath[currentPath.length - 1],
              file: currentFolder
          };

          STG.localStorage("properties").setItem(dataArray);
          onModal(["Properties", "Properties", "#setting/slideshow", dataArray]);
      } else {
              var uid = user_id();
              var type = getFileType(item);
              var typeIcon = getFileIcon(item);
              const dataTer = {
                uid: uid.oauth.red,
                color: typeIcon.color,
                icon: typeIcon.icon,
                type: type,
                file: item,
              };
              onRoute(["Office", "Pengaturan", "#setting/pvttable", dataTer]);
              }
        break;
        case "Properties":
        const officeData3 = STG.localData("office").get(item);
        console.log(officeData3)    
        var uid = user_id();
        var type = getFileType(item);
        var typeIcon = getFileIcon(item);
        const dataTer = {
          uid: uid.oauth.red,
          color: typeIcon.color,
          icon: typeIcon.icon,
          type: type,
          file: item,

        };

        onRoute(["Office", "Pengaturan", "#setting/pvttable", dataTer]);
        break;
        case "Preview Video":
          const video = STG.localData("video").get(item);
           const dataVideo = {
             id:video.id,
             file:item,
           };
             if (video) {
                onRoute([
                  "Properties",
                   video.title,
                  "#preview/video",
                  dataVideo,
                ]);
             }
        break;
        case "Preview":
           const image = STG.localData("galeri").get(item);
           if (image) {
              onRoute([
                "Office",
                "Preview",
                "#preview/image",
                image,
              ]);
           }
        break;
      default:
      let splitAction = action.split(' ');
      if (splitAction.length > 1) {
          let valItem = splitAction[1]; // Mendapatkan kata kedua
          console.log(`valItem: ${valItem}`);
          const actionItems = ['Artikel', 'Tulisan', 'Konten', 'Postingan','Berita', 'Ulasan', 'Posting'];
          // Cari indeks dari kata kedua dalam array actionItems
          let index = actionItems.indexOf(valItem);
          if (index !== -1) {
                     onModal([
                       "Office",
                       "Buat File "+actionItems[index],
                       "file",
                       "Masukkan nama file docx",
                       "docx",
                     ]);
              // console.log("Item yang dipilih:", actionItems[index]);
          } else {
              console.log("Aksi tidak dikenal:", action);
          }
      } else {
        if (action ==='Refresh') {
                 
                
                     // setTimeout(() => {
                      onLink('#explorer')
                      // refreshProgrm(true)
                        STG.officeFile()
                      // }, 1000); // Delay 1 detik
        } else {
           console.log(`ah Aksi tidak dikenal: ${action}`);
        }
        
      }


        
    }
  }
  function getSTGData(fileName,action) {
        const STG3 = new Dom.Storage();
    if (action ==='Open' || action ==='Upload File' ) {
        const red3 = STG3.fetch({
          "5272E-23DB0-56C88-18503":["setQuery", "nama='" + fileName + "'"]
        });
        if (red3.storage.status ==='success') {
          var renderData =JSON.parse(red3.storage.data.setQuery);
        } else {
          var renderData = false;
        }
    } else {
         var renderData = false;
    }

     return renderData;
  }

 function getSTGDataID(fileName) {
    const STG3 = new Dom.Storage();
    const red3 = STG3.fetch({
      "5272E-23DB0-56C88-18503":["setQuery", "nama='" + fileName + "' AND userid='"+ID.red+"'"]
    });
    if (red3.storage.status==='success') {
      var renderData =JSON.parse(red3.storage.data.setQuery);
    } else {
      var renderData = false;
    }
    return renderData;
  }



  function getFileType(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "txt":
        return "txt";
      case "docx":
        return "docx";
      case "xlsx":
        return "xlsx";
      case "pptx":
        return "pptx";
      case "pdf":
        return "pdf";
      case "cts":
        return "cts";
      case "sld":
        return "sld";
      case "video":
        return "video";
      case "jpg":
      case "jpeg":
      case "png":
        return "image";
      default:
        return "folder";
    }
  }

  function editItemInline(item) {
    const itemElements = document.querySelectorAll(".item");
    let itemElement;

    for (const element of itemElements) {
      if (element.querySelector("div:last-child").textContent === item) {
        itemElement = element;
        break;
      }
    }

    if (!itemElement) return;

    const nameElement = itemElement.querySelector("div:last-child");
    const originalName = nameElement.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = originalName;
    input.style.width = "100%";

    nameElement.textContent = "";
    nameElement.appendChild(input);
    input.focus();

    input.addEventListener("blur", finishEditing);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        finishEditing();
      } else if (e.key === "Escape") {
        nameElement.textContent = originalName;
      }
    });

    function finishEditing() {
      const newName = input.value.trim();
      if (newName && newName !== originalName) {
        editItem(originalName, newName);
      } else {
        nameElement.textContent = originalName;
      }
    }
  }

  function editItem(oldName, newName) {
    let currentFolder = getCurrentFolder();
    if (currentFolder[newName] === undefined) {
      currentFolder[newName] = currentFolder[oldName];
      delete currentFolder[oldName];

      // Periksa apakah item yang diedit adalah folder
      if (typeof currentFolder[newName] === "object") {
        renamedFolders.push({ oldName, newName });
      }

      // Periksa apakah item yang diedit adalah folder baru
      let newFolders = JSON.parse(localStorage.getItem("newFolders") || "[]");
      const index = newFolders.indexOf(oldName);
      if (index !== -1) {
        newFolders[index] = newName;
        localStorage.setItem("newFolders", JSON.stringify(newFolders));
      }

      saveFileSystem();
      renderContent();
    } else {
      // alert(`Item dengan nama "${newName}" sudah ada.`);
    }
  }



  function searchFiles() {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase();
    const results = [];

    function searchInFolder(folder, path = []) {
      for (const item in folder) {
        const fullPath = [...path, item];
        if (folder[item] === null) {
          if (item.toLowerCase().includes(searchTerm)) {
            results.push({ name: item, path: fullPath.join("/") });
          }
        } else {
          searchInFolder(folder[item], fullPath);
        }
      }
    }

    searchInFolder(fileSystem);
    const content = document.getElementById("main-content");
    content.innerHTML = "";
    if (results.length === 0) {
      content.innerHTML += "<p>Tidak ada file yang ditemukan.</p>";
    } else {
      const fragment = document.createDocumentFragment();
      results.forEach((result) => {
        const itemElement = document.createElement("div");
        itemElement.className = "item";
        const { icon, color } = getFileIcon(result.name);
        itemElement.innerHTML = `
          <div class="icon file"><i class="ms-Icon ${icon} ${color}"></i></div>
          <div class="item-name">${result.name}</div>
        `;
        fragment.appendChild(itemElement);
      });
      content.appendChild(fragment);
    }
  }

  function initializeSearch() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("keyup", function () {
        this.value.length > 0 ? searchFiles() : renderContent();
      });
    } else {
      console.warn("Elemen search-input tidak ditemukan");
    }
  }
function initializeDragAndDrop() {
  const content = document.getElementById("main-content");
  let draggedItem = null;
  let dragOverItem = null;

  content.addEventListener("mousedown", function(e) {
    if (e.target.closest(".item")) {
      const item = e.target.closest(".item");
      item.setAttribute("draggable", "true");
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragend", handleDragEnd);
    }
  });

  content.addEventListener("mouseup", function(e) {
    const items = content.querySelectorAll(".item");
    items.forEach(item => {
      item.setAttribute("draggable", "false");
      item.removeEventListener("dragstart", handleDragStart);
      item.removeEventListener("dragend", handleDragEnd);
    });
  });

  function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.querySelector("div:last-child").textContent);
    this.style.opacity = "0.5";
  }

  function handleDragEnd(e) {
    this.style.opacity = "";
    draggedItem = null;
    dragOverItem = null;
  }

  content.addEventListener("dragover", function(e) {
    e.preventDefault();
    const targetItem = e.target.closest(".item");
    if (targetItem && targetItem !== draggedItem) {
      dragOverItem = targetItem;
      targetItem.classList.add("drag-over");
    }
  });

  content.addEventListener("dragleave", function(e) {
    const targetItem = e.target.closest(".item");
    if (targetItem) {
      targetItem.classList.remove("drag-over");
    }
  });

  content.addEventListener("drop", function(e) {
    e.preventDefault();
    const dropTarget = e.target.closest(".item");
    
    if (dropTarget && draggedItem && dropTarget !== draggedItem) {
      dropTarget.classList.remove("drag-over");
      swapItems(draggedItem, dropTarget);
    }
  });
}

function swapItems(item1, item2) {
  const name1 = item1.querySelector("div:last-child").textContent;
  const name2 = item2.querySelector("div:last-child").textContent;
  if (!name1 || !name2) {
    console.error("Nama item kosong");
    return;
  }
  
  let currentFolder = getCurrentFolder();
  const aturposisi = [name2, name1]; // Urutkan sesuai dengan posisi drop
  
  // Reorder the object
  currentFolder = reorderObject(currentFolder, aturposisi);
  
  // Update the file system
  if (currentPath.length === 0) {
    fileSystem = currentFolder;
  } else {
    let folder = fileSystem;
    for (let i = 0; i < currentPath.length - 1; i++) {
      folder = folder[currentPath[i]];
    }
    folder[currentPath[currentPath.length - 1]] = currentFolder;
  }
  
  // Save changes and re-render
  saveFileSystem();
  renderContent();
}

function reorderObject(data, aturposisi) {
  const reordered = {};
  // First, add the items in the specified order
  aturposisi.forEach(key => {
    if (data.hasOwnProperty(key)) {
      reordered[key] = data[key];
    }
  });
  // Then, add any remaining items
  for (const key in data) {
    if (!aturposisi.includes(key)) {
      reordered[key] = data[key];
    }
  }
  return reordered;
}


  function moveItem(itemName, targetFolder) {
    let sourceFolder = getCurrentFolder();
    let item = sourceFolder[itemName];

    if (item !== undefined) {
      delete sourceFolder[itemName];
      let targetFolderObj = getFolder([...currentPath, targetFolder]);
      targetFolderObj[itemName] = item;
      saveFileSystem();
      renderContent();
    }
  }

        function getCurrentFolder() {
          return currentPath.reduce((folder, path) => folder[path], fileSystem);
        }

        function getFolder(path) {
          return path.reduce((folder, p) => folder[p], fileSystem);
        }
      function kirimKeAPI(data) {

        const basisData = window.Ngorei;
        const red = decryptObject(basisData.tokenize, "manifestStorage");
        console.log(red.endpoint);
        return fetch(red.endpoint + "api/v1/filesystem/"+md5(red.endpoint), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 0) {
              throw new Error("Kesalahan CORS: Tidak dapat mengakses API. Pastikan server mengizinkan permintaan dari origin ini.");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
         // console.log("Data JSON respons:", JSON.stringify(data, null, 2));
          return data;
        })
        .catch((error) => {
          console.error("Gagal menyimpan data ke API:", error.message);
          // Tambahkan logika penanganan kesalahan di sini
        });
      }

  function saveFileSystem() {
    const UID = user_id().oauth;
    const dataUntukDisimpan = JSON.stringify(fileSystem);

    // Simpan ke localStorage sebagai cadangan
    localStorage.setItem("fileSystem", dataUntukDisimpan);

    // Ambil daftar folder baru
    const newFolders = JSON.parse(localStorage.getItem("newFolders") || "[]");

    // Kirim ke API dengan informasi folder baru, folder yang dihapus, dan folder yang direname
    kirimKeAPI({
      oauth: {
      "red":UID.red
      },
      fileSystem: dataUntukDisimpan,
      newFolders: newFolders,
      deletedFolders: deletedFolders,
      renamedFolders: renamedFolders,
    })
      .then(() => {
        // Bersihkan daftar folder baru, folder yang dihapus, dan folder yang direname setelah berhasil dikirim
        localStorage.removeItem("newFolders");
        deletedFolders = [];
        renamedFolders = [];
      })
      .catch((error) => {
        console.error("Gagal menyimpan data ke API:", error);
        //alert('Gagal menyimpan data ke server. Data disimpan secara lokal.');
      });

  }

  function loadFileSystem(data='') {
    const savedFileSystem = localStorage.getItem("fileSystem");
    if (savedFileSystem) {
      const parsedFileSystem = JSON.parse(savedFileSystem);
      Object.assign(fileSystem, parsedFileSystem);
    }

    // Reset folder Public
   const OPD=ID.instance;
   const OPDUID=ID.name;
    // fileSystem.Document = {};
    fileSystem.Apps = {};
    fileSystem.Program = {};
    fileSystem[OPD] = {};


    //Apps
    const redbig = STG.big({
      endpoint: "B1360-5B5FA-DA9EE-8A6F8",
      data: "data",
    });
    if (
      redbig &&
      redbig.storage &&
      redbig.storage.Bps &&
      Array.isArray(redbig.storage.Bps)
    ) {
      redbig.storage.Bps.forEach((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        var logID3 = (fileSystem.Apps[key] = value);
      });
    }
      
      // Public
      const publicSystem=system(ID.role)
      publicSystem.forEach((item) => {
         const key = Object.keys(item)[0];
         const value = JSON.parse(item[key]);
       if (key !=='Access') {
         if (ID.role==='admin') {
           (fileSystem.Document[key] = value);
         } else {
            if (key===OPD) {
             (fileSystem.Document[key] = value);
            } 
         }
       }
      })
      // console.log(ID.roleid)
 
        // Program
      if (ID.role =='admin') {
       const uidProgrm=genProgrm()
       if (uidProgrm) {
        Object.assign(fileSystem.Program, uidProgrm);
       }
      } else {
       const opdProgrm=genProgrm(ID.instance)
       if (opdProgrm) {
        Object.assign(fileSystem.Program, opdProgrm);
       }
      }

      // Instance
     const appsInstance=instance(ID.instance)
     if (appsInstance) {
          const valueInstansi = JSON.parse(appsInstance[OPD]);
          fileSystem[OPD]=valueInstansi  
     }
   

   const conudUid = Object.keys(fileSystem[OPDUID]).length;
   if (conudUid==1) {
        const appsFileuser=fileuser(ID)
        if (appsFileuser) {
            const key =Object.keys(appsFileuser)[0];
            const value = JSON.parse(appsFileuser[key]);
            const jumlahData = Object.keys(value).length;
            if (jumlahData) {
              (fileSystem[OPDUID]= value);
            } 
        }


   }
   
  }





function createItem(type, name, extension = "") {
  console.log(currentPath[1])
  if (currentPath[1]==='Program') {
        const notifItem = STG.localStorage("createItem").get();
        if (notifItem) {
            notifProgram({
                [name]: {
                    title: name,
                    name: ID.nama,
                    thumbnail: ID.thumbnail,
                    date: TDSDate.date()
                }
            });
        } 
  }

    if (!name) return; // Jika pengguna membatalkan prompt

    // Cek apakah nama diawali dengan angka jika tipe adalah folder
    if (type === "folder" && /^\d/.test(name)) {
        alert("Nama folder tidak boleh diawali dengan angka.");
        return;
    }

    if (extension && !name.endsWith(`.${extension}`)) {
        name += `.${extension}`;
    }

    let currentFolder = getCurrentFolder();
    if (currentFolder[name] === undefined) {
        currentFolder[name] = type === "folder" ? {} : null;

        // Catat nama folder baru jika tipe adalah folder
        if (type === "folder") {
            let newFolders = JSON.parse(localStorage.getItem("newFolders") || "[]");
            newFolders.push(name);
            localStorage.setItem("newFolders", JSON.stringify(newFolders));
        }
        saveFileSystem();
        renderContent();
    } else {
        // alert(`${type === "folder" ? "Folder" : "File"} dengan nama "${name}" sudah ada.`);
    }
}

  // ... existing code ...

  function pasteItem(targetFolder) {
    if (!clipboardItem) return;
    let newName = clipboardItem.name;
    let counter = 1;

    while (targetFolder[newName] !== undefined) {
      const nameParts = clipboardItem.name.split(".");
      if (nameParts.length > 1) {
        newName = `${nameParts
          .slice(0, -1)
          .join(".")} (${counter}).${nameParts.slice(-1)}`;
      } else {
        newName = `${clipboardItem.name} (${counter})`;
      }
      counter++;
    }

    targetFolder[newName] = clipboardItem.content;
    if (clipboardItem.isCut) {
      let sourceFolder = getFolder(clipboardItem.sourcePath);
      delete sourceFolder[clipboardItem.name];
    }
    // Reset clipboardItem setelah penempelan
    clipboardItem = null;

    saveFileSystem();
    renderContent();
    // alert(`Item "${newName}" berhasil ditempel`);
  }

  function deleteItem(name) {
    let currentFolder = getCurrentFolder();
    if (currentFolder[name] !== undefined) {
      // Jika item yang dihapus adalah folder, tambahkan ke daftar deletedFolders
      if (typeof currentFolder[name] === "object") {
        deletedFolders.push(name);
      }
      delete currentFolder[name];
      saveFileSystem();
      renderContent();
    }
  }

  function init() {
    loadFileSystem();
    // Muat preferensi tampilan dari localStorage
    viewMode = localStorage.getItem("viewMode") || "horizontal";

    renderContent();
    history.push([]);
    currentHistoryIndex = 0;
    initializeSearch();
    initializeDragAndDrop();

    window.addEventListener("mousedown", function (e) {
      // if (e.button === 3) goBack();
      // else if (e.button === 4) goForward();
    });

    document.addEventListener("keydown", function (e) {
      // if (e.altKey && e.key === "ArrowLeft") goBack();
      // else if (e.altKey && e.key === "ArrowRight") goForward();
    });

    const mainOffice = document.getElementById("mainoffice");
    if (mainOffice) {
      mainOffice.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        const target = e.target.closest(".item");
        if (target) {
          const item = target.querySelector("div:last-child").textContent;
          const isFolder = target
            .querySelector(".icon")
            .classList.contains("folder");
          showContextMenu(e, item, isFolder, getCurrentFolder());
        } else {
          showContextMenu(e, null, true, getCurrentFolder());
        }
      });
    } else {
      console.warn("Elemen #mainoffice tidak ditemukan");
    }

    // Tambahkan tombol toggle ke UI
    const toggleButton = document.getElementById("toggleViewButtonq");

    toggleButton.addEventListener("click", toggleViewMode);
    // Perbarui tampilan tombol toggle sesuai dengan mode yang aktif
    updateToggleButtonAppearance();
  }

  return {
    init,
    navigateTo,
    searchFiles,
    saveFileSystem,
  };
})();

export default FileExplorer;