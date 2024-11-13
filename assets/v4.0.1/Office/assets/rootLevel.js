export function rootLevel(e, item, isFolder, currentFolder,fileSystem,currentPath,isRootLevel,isProtectedItem,ID,clipboardItem) {
   let actions = [];
if (item === null) {
      const isMainOffice = e.target.closest("#mainoffice") !== null;
      if (isMainOffice) {
        const isInCurrentPath = e.target.closest("#main-content") !== null;
        if (
          currentPath.length > 0 &&
          currentPath[0] !== "Public" &&
          currentPath[0] !== ID.instance &&
          currentPath[0] !== "Apps"
        ) {
          actions = [{ text: "Buat Folder", icon: "false" }];
          if (clipboardItem !== null) {
            actions.push({
              text: "Paste",
              icon: "ms-Icon ms-Icon--Paste",
              className: "itmlabel",
            });
          }
          if (currentPath[2] ==='Galeri' || 
                currentPath[2] ==='Foto' || 
                currentPath[2] ==='foto' || 
                currentPath[2] ==='galeri' || 
                currentPath[2] ==='Images' || 
                currentPath[2] ==='images' || 
                currentPath[2] ==='img' || 
                currentPath[2] ==='Img') {
               const jumlah = Object.keys(currentFolder).length;

                 if (jumlah) {
                      actions.push(
                        {text: "Upload Gambar",icon: "ms-Icon ms-Icon--Photo2Add",className: "itmlabel"},
                        {text: "Slideshow",icon: "ms-Icon ms-Icon--Package",className: "itmlabel" }
                      )
                 } else {
                    actions.push(
                      {text: "Upload Gambar",icon: "ms-Icon ms-Icon--Photo2Add",className: "itmlabel"},
                    );
                 }


          } else if (currentPath[2] ==='Video' ) {
              actions.push(
                {
                  text: "Link Video",
                  icon: "ms-Icon ms-Icon--MSNVideosSolid",
                  className: "itmlabel",
                }
              );
          } else {
            actions.push(
              {
                text: "Buat File Xlsx",
                icon: "ms-Icon ms-Icon--ExcelDocument",
                className: "itmlabel",
              },
              {
                text: "Buat File Charts",
                icon: "ms-Icon ms-Icon--DelveLogo",
                className: "itmlabel",
              },
              {
                text: "Buat File Pptx",
                icon: "ms-Icon ms-Icon--PowerPointDocument",
                className: "itmlabel",
              }, 
              {
                text: "Buat File Docx",
                icon: "ms-Icon ms-Icon--WordDocument",
                className: "itmlabel",
              },
              //{ text: "Buat File Slide", icon:" ms-Icon ms-Icon--SwayLogo16",className:"itmlabel"},
              { text: "Buat File PDF", icon: "ms-Icon ms-Icon--PDF" }
            );
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
            icon: "ms-Icon ms-Icon--Download",
            className: "itmlabel1",
          },
          {
            text: "Delete",
            icon: "ms-Icon ms-Icon--Delete",
            className: "itmlabel",
          },
        ];
      } else if (isRootLevel && isFolder) {
      } else if (isFolder) {
        if (
          currentPath.length > 0 &&
          currentPath[0] !== "Public" &&
          currentPath[0] !== "Apps" &&
          currentPath[0] !== ID.instance
        ) {
          actions = [
            { text: "Open", icon: "false", className: "itmlabel1" },
            {
              text: "Rename",
              icon: "ms-Icon ms-Icon--PageEdit",
              className: "itmlabel1",
            }
          ];
         // image
          if (currentPath[2] ==='Galeri' || 
                currentPath[2] ==='Foto' || 
                currentPath[2] ==='foto' || 
                currentPath[2] ==='galeri' || 
                currentPath[2] ==='Images' || 
                currentPath[2] ==='images' || 
                currentPath[2] ==='img' || 
                currentPath[2] ==='Img') {
                 // console.log(currentPath[2])
                 // console.log( currentFolder[item])
                 const jumlah = Object.keys(currentFolder[item]).length;
                 if (jumlah) {
                      actions.push(
                        {text: "Copy",icon: "ms-Icon ms-Icon--Copy",className: "itmlabel1" },
                        // {text: "Properties",icon: "ms-Icon ms-Icon--Package",className: "itmlabel" }
                      )
                 }
                }

        }
        if (currentPath[0] == "Public" || currentPath[0] == "Apps" || currentPath[0] == ID.instance) {
          actions.push(
            { text: "Open", icon: "false", className: "itmlabel1" },
            {
              text: "Copy",
              icon: "ms-Icon ms-Icon--Copy",
              className: "itmlabel1",
            }
          );
        }
        if (clipboardItem) {
          actions.push({
            text: "Paste",
            icon: "ms-Icon ms-Icon--Paste",
            className: "itmlabel",
          });
        }
        if (currentPath[0] !== "Public" && currentPath[0] !== "Apps" && currentPath[0] !== ID.instance) {
          if (Object.keys(currentFolder[item]).length === 0) {
            actions.push({
              text: "Delete",
              icon: "ms-Icon ms-Icon--Delete",
              className: "itmlabel",
            });
          }
        }
      } else {
        if (currentPath[0] !== "Public" && currentPath[0] !== "Apps"  && currentPath[0] !== ID.instance) {
           const fileType = getFileType(item);
           const officeMenu = STG.localData("office").get(item);
          if (fileType ==='image') {
            actions = [
              { text: "Preview", icon: "false", className: "itmlabel1" },
              { text: "Copy",icon: "ms-Icon ms-Icon--Copy",className: "itmlabel1"},
              { text: "Delete",icon: "ms-Icon ms-Icon--Delete",className: "itmlabel"}
            ];
            } else {
               const rowApps = STG.localData('apps').get(item);
              if (rowApps) {
                    actions = [
                      { text: rowApps.apps, icon: "false", className: "itmlabel1" },
                      {
                        text: "Copy",
                        icon: "ms-Icon ms-Icon--Copy",
                        className: "itmlabel1",
                      }
                    ];
              } else {
                    actions = [
                      { text: "Open", icon: "false", className: "itmlabel1" },
                      {
                        text: "Copy",
                        icon: "ms-Icon ms-Icon--Copy",
                        className: "itmlabel1",
                      }
                    ];
              }

          if (officeMenu) {
            const dbData = officeTabelQuery(officeMenu.cradensial, item);        
            if (fileType !== "cts" && fileType !== "pptx") {
              if (fileType == "xlsx") {
                if (dbData.status !== "error") {
                  download = dbData.download;
                  actions.push({
                    text: "Download",
                    icon: "ms-Icon ms-Icon--Download",
                    className: "itmlabel1",
                  });
                } else {
                   if (!rowApps) {
                        actions.push({
                          text: "Upload File",
                          icon: "ms-Icon ms-Icon--Add",
                          className: "itmlabel1",
                        });
                }
                }
              }
            }
          } else {
           // const rowApps = STG.localData('apps').get(item);
           if (!rowApps) {
             actions.push({
               text: "Rename",
               icon: "ms-Icon ms-Icon--PageEdit",
               className: "itmlabel1",
             });  
           }


          }

          if (!isProtectedItem) {
            actions.push(
              {
                text: "Settings",
                icon: "ms-Icon ms-Icon--Settings",
                className: "itmlabel1",
              },
              {
                text: "Properties",
                icon: "ms-Icon ms-Icon--Package",
                subMenu: [
                  {
                    text: "Copy name",
                    icon: "ms-Icon ms-Icon--Tab",
                    className: "itmlabel1",
                  },
                  {
                    text: "Cradensial",
                    icon: "ms-Icon ms-Icon--ReportHacked",
                    className: "itmlabel1",
                  },
                  {
                    text: "Delete",
                    icon: "ms-Icon ms-Icon--Delete red",
                    className: "itmlabel",
                  },
                ],
                className: "itmlabel",
              }
            );
          }
          }
        } else {
          if (currentPath[0] === "Apps") {
            actions = [
              { text: "Bps", icon: "false", className: "itmlabel1" },
              {
                text: "Copy",
                icon: "ms-Icon ms-Icon--Copy",
                className: "itmlabel1",
              },
              {
                text: "Copy name",
                icon: "ms-Icon ms-Icon--Tab",
                className: "itmlabel1",
              },
              {
                text: "Properties",
                icon: "ms-Icon ms-Icon--Package",
                className: "itmlabel",
              },
            ];
          } else {
            actions = [
              { text: "Open", icon: "false", className: "itmlabel1" },
              {
                text: "Copy",
                icon: "ms-Icon ms-Icon--Copy",
                className: "itmlabel1",
              },
              {
                text: "Copy name",
                icon: "ms-Icon ms-Icon--Tab",
                className: "itmlabel1",
              }
            ];
          }
        }
      }
    }
}
