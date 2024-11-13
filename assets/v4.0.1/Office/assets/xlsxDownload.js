export function xlsxDownload(cradensial, item) {

  const STG = new Dom.Storage();
  const File= STG.localData('xlsxfile').get(item)



    if (File) {
       return File
    } else {
            const file34 = STG.fetch({
              "5272E-23DB0-56C88-18503":["id,thumbnail", "nama='" + item + "'"]
            });
        if (file34.storage && file34.storage.status !=='error') { // Perubahan di sini
          if (file34.storage.data && file34.storage.data.thumbnail) { // Perubahan di sini
              var dataArray={
                [item]:file34.storage.data
              }
              STG.localData('xlsxfile').add(dataArray)
              return dataArray;   
          } else {
           return false
          }
        } else {
          return false
        }
 
    }
}