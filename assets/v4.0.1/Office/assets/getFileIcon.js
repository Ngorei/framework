 export function getFileIcon(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "txt":
        return {
          icon: "docs-homescreen-icon-docs-44",
          color: "text-file-color",
        };
      case "doc":
      case "docx":
        return {
          icon: "docs-homescreen-icon-docs-44",
          color: "word-file-color",
        };
      case "xls":
      case "xlsx":
        return {
          icon: "docs-homescreen-icon-sheets-44",
          color: "excel-file-color",
        };
      case "ppt":
      case "pptx":
        return {
          icon: "docs-homescreen-icon-slides-44",
          color: "powerpoint-file-color",
        };
      case "cts":
        return {
          icon: "docs-homescreen-icon-forms-44",
          color: "cts-color",
        };
      case "sld":
        return { icon: "ms-Icon ms-Icon--SwayLogo16", color: "sld-color" };
      case "pdf":
        return { icon: "docs-homescreen-icon-sites-44", color: "pdf-file-color" };
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return { icon: "ms-Icon--Photo2", color: "image-file-color" };
      case "mp3":
      case "wav":
        return {
          icon: "ms-Icon--MusicInCollection",
          color: "audio-file-color",
        };
      case "mp4":
      case "video":
      case "avi":
      case "mov":
        return { icon: "ms-Icon--Video", color: "video-file-color" };
      default:
        return { icon: "ms-Icon--Document", color: "default-file-color" };
    }
  }