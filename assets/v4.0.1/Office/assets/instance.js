export function instance(currentPath) {
const STG = new Dom.Storage();
 const response = STG.BriefSnd({
   "endpoint":"4CFB3-1C8D9-D626F-F285F",
   "instance": currentPath,  
 });
 return response[0]
}
