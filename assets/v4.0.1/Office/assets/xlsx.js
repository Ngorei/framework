export function rootXlsx(attr,id,item) {
	console.log(attr,id,item)
	const STG = new Dom.Storage();
	 const File= STG.localData('xlsx').get(item)
	 const storage = {file: item};
	if (File) {
       var setFile=File.sumber;
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
           var setFile=fromApps[0].sumber;
       } else {
          var setFile=item;
       }
	}
	if (setFile==="Bps") {
		  const offSdk = STG.localData("office").get(item);
		  console.log(offSdk)
          if (offSdk && offSdk.no===2) {
             STG.localStorage("explorer").setItem(["dataset","#preview/bpsdinamis",storage]);
             onRoute(["dataset", "#preview/bpsdinamis", storage]);
          } else {
              STG.localStorage("explorer").setItem(["dataset","#preview/bps",storage]);
              onRoute(["dataset", "#preview/bps", storage]);
          }
      $("#mainoffice").hide();
	} else {
        if (attr.uid===id.uid) {
            console.log('assets/docx.js')
        } else {   
             STG.localStorage("explorer").setItem([
               "dataset",
               "#preview/xlsx",
                storage,
             ]);
             onRoute(["dataset", "#preview/xlsx", storage]);
             $("#mainoffice").hide();
        }

	}

}