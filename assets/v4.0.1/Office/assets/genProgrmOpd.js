export function genProgrmOpd(currentPath) {
  const STG = new Dom.Storage();
   const response = STG.Brief({
     "endpoint": "4F1E1-092F3-7EB92-C507E",
     "instance": currentPath,  
   });
   return response
}
