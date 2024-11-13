export function rootVideoid(id) {
  const STG = new Dom.Storage();
   const response = STG.Brief({
     "endpoint":"DC688-76B24-15BCD-DA85A",
     "search":id,  
   });
   return response

}