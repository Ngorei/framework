export function fileuser(initUID) {
   const STG = new Dom.Storage();
const redbig = STG.big({
  endpoint: "B0C67-B5988-C361D-83929",
});
const red = STG.bigQuery({
  "5272E-23DB0-56C88-18503":["setQuery", "userid='"+initUID.red+"' AND nama='"+initUID.name+"'"]
});
const rows2 = red.storage.map((row) => ({
  [initUID.name]: row.setQuery
}));
return rows2[0];
// console.log(rows2[0])
// const redbig = STG.big({
//   endpoint: "B0C67-B5988-C361D-83929",
// });
// const red = STG.bigQuery({
//   "5272E-23DB0-56C88-18503":["nama", "userid='"+initUID.red+"' AND nama NOT IN('Access','"+initUID.name+"','"+initUID.instance+"')"]
// });
// const rows2 = red.storage.map((row) => ({
//   [row.nama]: null
// }));
// const rows = redbig.storage.row.map((row) => {
//   if (initUID.name === Object.keys(row)[0]) {
//     return {
//       [Object.keys(row)[0]]: JSON.stringify(Object.assign({}, ...rows2))
//     };
//   }
// }).filter(Boolean);
//  return rows[0]
}
