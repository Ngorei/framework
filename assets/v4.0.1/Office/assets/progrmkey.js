export function progrmkey(currentPath) {
const STG = new Dom.Storage();
 const response = STG.Brief({
   "endpoint":"13DF4-9446B-01050-6CFD2",
   "program": currentPath,  
 });
 return response
}
