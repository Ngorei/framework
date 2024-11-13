export function xlsxApps(item) {
	const STG = new Dom.Storage();
	const File= STG.localData('xlsx').get(item)
    if (File) {
       return File
    } else {
       const fromApps = STG.Brief({
          "endpoint":"63569-B382A-D3348-4E48E",
          "file":item,  
        });
       if (fromApps.length) {
          var dataArray={
            [item]:fromApps[0]
          }
           STG.localData('xlsx').add(dataArray)
           var setFile=item;
       } else {
          var setFile=false;
       }
      return setFile;   
    }
}