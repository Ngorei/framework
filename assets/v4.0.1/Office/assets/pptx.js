export function rootPptx(attr,id,item) {
	const STG = new Dom.Storage();
    var storage = {file: item};
	if (attr.uid===id.uid) {
     console.log('assets/docx.js')
	} else {     
     STG.localStorage("explorer").setItem(["dataset","#preview/pptx",storage]);
     onRoute(["dataset", "#preview/pptx", storage]);
     $("#mainoffice").hide();
	}
	

}