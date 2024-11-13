export function rootGaleri(icon) {
  // "F6DFF-84BAD-ECE19-A7256"
  const STG = new Dom.Storage();
   const response = STG.Brief({
     "endpoint": "F6DFF-84BAD-ECE19-A7256",
     "select":icon,  
   });
   return response['data'][0][0]

}