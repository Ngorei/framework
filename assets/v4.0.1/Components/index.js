import { spinner } from './spinner.js';
import { form } from './form.js';
import { Oauth } from './Oauth.js';
import { Alert } from './Alert.js';
import { drive } from './drive.js';
import { Modal } from './Modal.js';
import { Wizard } from './wizard.js';
import { Select } from './select.js';
import { Search } from './search.js';
import { Dopdown } from './dopdown.js';
import { Collapse } from './collapse.js';
import { Carousel } from './carousel.js';
import { Scrollbar } from './scrollbar.js';
import { Tab } from './Tab.js';
import { accordion } from './accordion.js';
import { createModal } from './createModal.js';
import { Slideshow } from './slideshow.js';
import { Gradients } from './Gradients.js';
import { Mode } from './Mode.js';
import { initializeAssistant } from "./assistant.js";
import { Checkbox } from "./Checkbox.js";
import { charts } from "./charts/index.js";
import { toolbar } from "./toolbar.js";
import { downloadRaw } from "./download.js";
import { fullscreen } from "./fullscreen.js";
import { Filebrowser } from "./filebrowser.js";
import { Filebrowserpdf } from "./Filebrowserpdf.js";
import { slider } from "./slider.js";
import { formAction } from "./formaction.js";
import { googleSignup } from "../Google/signup.js";
import { googleSignin } from "../Google/signin.js";
//import { presentation } from "./pptx/presentation.js";

export function Components() {
  return {
    charts: function() {
       return new charts();
    },
    slider: function(argument) {
       return slider(argument);
    },
    googleSignup: function(argument) {
       return googleSignup(argument);
    },
    googleSignin: function(argument) {
       return googleSignin(argument);
    },

    spinner: function(argument) {
      return spinner(argument)
    },
    downloadRaw: function(argument) {
      return downloadRaw(argument)
    },
    fullscreen: function(argument) {
      return fullscreen(argument)
    },
    toolbar: function(argument) {
      return toolbar(argument)
    },
    Form: function(argument) {
       return form(argument)
    },
    formAction: function(argument) {
       return formAction(argument)
    },
    Brief: function(argument) {
       return Brief(argument)
    },
    Oauth: function(argument) {
       return Oauth(argument)
    },
    Alert: function(argument,info) {
      return Alert(argument,info)
    },
    Filebrowserpdf: function(argument,info) {
      return Filebrowserpdf(argument,info)
    },
    Filebrowser: function(argument,info) {
      return Filebrowser(argument,info)
    },
    drive: function(argument,info) {
      return drive(argument,info)
    },
    
    Select: function(options, callback='') {
      return Select(options, callback)
    },
    Search: function(options) {
      return Search(options)
    },
    Modal: function(modalId, title, bodyContent) {
      return Modal(modalId, title, bodyContent)
    },
    Wizard: function(argument) {
     return new Wizard(argument)
    },
    Dopdown: function(argument) {
     return Dopdown(argument)
    },
    Collapse: function(argument) {
     return Collapse(argument)
    },
    Carousel: function(argument) {
     return Carousel(argument)
    },
    Scrollbar: function(argument) {
     return Scrollbar(argument)
    },
    Tab: function(argument) {
     return Tab(argument)
    },
    Accordion: function(argument) {
     return accordion(argument)
    },
    Slideshow: function(config) {
     return Slideshow(config)
    },
    Mode: function(config) {
     return Mode(config)
    },
    Checkbox: function(config, callback) {
      return Checkbox(config, callback);
    },
    Gradients: function(config) {
       return  Gradients(config).init();
    },
    assistant: function(config,tokenize) {
        return initializeAssistant(config,tokenize);   
    }
  };
}