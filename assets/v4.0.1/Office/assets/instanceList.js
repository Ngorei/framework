export function instanceList(currentPath) {
const STG = new Dom.Storage();
 const response = STG.Brief({
   "endpoint":"28978-D9680-8148B-5EA9D",
   "instance": currentPath,  
 });
 return response
}
