
import { pptx } from "./pptx/index.js";
import { docx } from "./docx/index.js";
import { prind } from "./prind.js";
import { page } from "./page.js";
import { previewPPTX } from "./pptx/preview.js";
import { previewDOCX } from "./docx/preview.js";
import { previewNEWS } from "./news/index.js";
import { previewXLSX } from "./xlsx/index.js";
import { previewXLSXsheet } from "./xlsx/previewXLSXsheet.js";

import { presentation } from "./pptx/presentation.js";
import { spreadsheet } from "./spreadsheet/index.js";

export function officecode() {
  return {
    pptx: function(argument) {
       return pptx(argument)
    },
    previewPPTX: function(argument) {
       return previewPPTX(argument)
    },
    docx: function(argument) {
       return docx(argument)
    },
    previewDOCX: function(argument) {
       return previewDOCX(argument)
    },
    previewNEWS: function(argument) {
       return previewNEWS(argument)
    },
    previewXLSX: function(argument) {
       return previewXLSX(argument)
    },
   previewXLSXsheet: function(argument) {
       return previewXLSXsheet(argument)
    },


    
    Spreadsheet: function(argument) {
       return spreadsheet(argument)
    },
    prind: function(config) {
     return prind(config)
    },
    officePage: function(config) {
     return page(config)
    },
    presentation: function(config) {
      return presentation(config)
    },
  };
}