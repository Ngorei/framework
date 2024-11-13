export function rootDocx(attr,id,item) {
	const STG = new Dom.Storage();
     var storage = {
       file: item,
     };
	if (attr.uid===id.uid) {
     console.log('assets/docx.js')
	} else {
		console.log(attr)
       STG.localStorage("explorer").setItem([
         "dataset",
         "#preview/docx",
         storage,
       ]);
         onRoute(["dataset", "#preview/docx", storage]);
       $("#mainoffice").hide();
	}
	

}