export function sharekey(currentPath) {
  const STG = new Dom.Storage();
  
  const response = STG.Brief({
    "endpoint": "384B8-A31AF-58CF9-977FA",
    "instance": currentPath,  
  });
  
  if (response.length !==0) {
    return response;
  } else {
    return {
      "Notes.txt": null,
    };
  }
}
