// Fungsi untuk membuat form
export function toolbar(attr) {
function createToolbar() {
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  const toolbarItems = [
    { id: 'dowppt', icon: 'ms-Icon ms-Icon ms-Icon--PublisherLogoInverse16 powerpoint-file-color', type: 'button' },
    { id: 'insertOrderedList', icon: 'fa-list-ol', type: 'button' },
    { id: 'insertUnorderedList', icon: 'fa-list', type: 'button' },
    { id: 'undo', icon: 'fa-rotate-left', type: 'button' },
    { id: 'redo', icon: 'fa-rotate-right', type: 'button' },
    { id: 'createLink', icon: 'fa-link', type: 'button', class: 'adv-option-button' },
    { id: 'unlink', icon: 'fa-unlink', type: 'button' },
    { id: 'justifyLeft', icon: 'fa-align-left', type: 'button', class: 'align' },
    { id: 'justifyCenter', icon: 'fa-align-center', type: 'button', class: 'align' },
    { id: 'justifyRight', icon: 'fa-align-right', type: 'button', class: 'align' },
    { id: 'justifyFull', icon: 'fa-align-justify', type: 'button', class: 'align' },
    //{ id: 'indent', icon: 'fa-indent', type: 'button', class: 'spacing' },
// ms-Icon ms-Icon ms-Icon--PublisherLogoInverse16 powerpoint-file-color




    //{ id: 'outdent', icon: 'fa-outdent', type: 'button', class: 'spacing toolbar_spacing' },
    { id: 'zoom-in',     text: '<i class="icon-feather-zoom-in"></i>', type: 'button', class: 'align' },
    { id: 'zoom-out',    text: '<i class="icon-feather-zoom-out"></i>', type: 'button', class: 'align' },
    { id: 'formatBlock', type: 'select', options: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'], class: 'adv-option-button' },
    { id: 'fontName',    type: 'select', class: 'adv-option-button' },
    { id: 'fontSize',    type: 'select', class: 'adv-option-button' },
    { id: 'foreColor',   type: 'color', label: '', class: 'adv-option-button' },
    { id: 'backColor',   type: 'color', label: '', class: 'adv-option-button' },
    { id: 'remove',      text: '<i class="icon-trash"></i>',  type: 'button', class: 'toolbar_spacing' },
    { id: 'freepik',     text: '<i class="icon-feather-image"></i>', type: 'button', class: 'toolbar_spacing' },
    { id: 'addFile',     text: '<i class="icon-feather-inbox"></i>', type: 'button', class: 'toolbar_spacing' },
    { id: 'unsplash',    text: '<i class="icon-feather-camera"></i>', type: 'button', class: 'toolbar_spacing' },
    { id: 'preview',   text: '<i class="icon-feather-maximize"></i>', type: 'button', class: 'toolbar_spacing' },
  ];


  toolbarItems.forEach(item => {
    let element;
    if (item.type === 'button') {
      element = document.createElement('button');
      element.id = item.id;
      element.className = `option-button ${item.class || ''}`;
      if (item.icon) {
        const icon = document.createElement('i');
        icon.className = `fa fa-solid ${item.icon}`;
        element.appendChild(icon);
      } else if (item.text) {
        element.innerHTML = item.text;
      }
    } else if (item.type === 'select') {
      element = document.createElement('select');
      element.id = item.id;
      element.className = item.class || '';
      if (item.options) {
        item.options.forEach(optionText => {
          const option = document.createElement('option');
          option.value = optionText;
          option.textContent = optionText;
          element.appendChild(option);
        });
      }
    } else if (item.type === 'color') {
      const wrapper = document.createElement('div');
      wrapper.className = 'input-wrapper';
      element = document.createElement('input');
      element.type = 'color';
      element.id = item.id;
      element.className = item.class || '';
      const label = document.createElement('label');
      label.htmlFor = item.id;
      label.textContent = item.label;
      wrapper.appendChild(element);
      wrapper.appendChild(label);
      element = wrapper;
    }
    toolbar.appendChild(element);
  });

  return toolbar;
}
document.getElementById(attr.elementById).appendChild(createToolbar());
// Gunakan fungsi ini untuk menambahkan toolbar ke dalam dokumen
  // document.querySelector('.col-md-12').appendChild(createToolbar());
  let optionsButtons = document.querySelectorAll(".option-button");
  let advancedOptionButton = document.querySelectorAll(".adv-option-button");
  let fontName = document.getElementById("fontName");
  let fontSizeRef = document.getElementById("fontSize");
  let linkButton = document.getElementById("createLink");
  let alignButtons = document.querySelectorAll(".align");
  let spacingButtons = document.querySelectorAll(".spacing");
  let formatButtons = document.querySelectorAll(".format");
  let scriptButtons = document.querySelectorAll(".script");

  let fontList = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Garamond",
    "Georgia",
    "Courier New",
    "cursive",
  ];

  //Initial Settings
  const initializer = () => {
    //function calls for highlighting buttons
    //No highlights for link, unlink,lists, undo,redo since they are one time operations
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);
    highlighter(scriptButtons, true);

    //create options for font names
    fontList.map((value) => {
      let option = document.createElement("option");
      option.value = value;
      option.innerHTML = value;
      fontName.appendChild(option);
    });

    //fontSize allows only till 7
    for (let i = 1; i <= 7; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.innerHTML = i;
      fontSizeRef.appendChild(option);
    }

    //default size
    fontSizeRef.value = 3;
  };

  //main logic
  const modifyText = (command, defaultUi, value) => {
    //execCommand executes command on selected text
    document.execCommand(command, defaultUi, value);
  };

  //For basic operations which don't need value parameter
  optionsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modifyText(button.id, false, null);
    });
  });

  //options that require value parameter (e.g colors, fonts)
  advancedOptionButton.forEach((button) => {
    button.addEventListener("change", () => {
      modifyText(button.id, false, button.value);
    });
  });

  //link
  linkButton.addEventListener("click", () => {
    let userLink = prompt("Enter a URL");
    //if link has http then pass directly else add https
    if (/http/i.test(userLink)) {
      modifyText(linkButton.id, false, userLink);
    } else {
      userLink = "http://" + userLink;
      modifyText(linkButton.id, false, userLink);
    }
  });

  //Highlight clicked button
  const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
      button.addEventListener("click", () => {
        //needsRemoval = true means only one button should be highlight and other would be normal
        if (needsRemoval) {
          let alreadyActive = false;

          //If currently clicked button is already active
          if (button.classList.contains("active")) {
            alreadyActive = true;
          }

          //Remove highlight from other buttons
          highlighterRemover(className);
          if (!alreadyActive) {
            //highlight clicked button
            button.classList.add("active");
          }
        } else {
          //if other buttons can be highlighted
          button.classList.toggle("active");
        }
      });
    });
  };

  const highlighterRemover = (className) => {
    className.forEach((button) => {
      button.classList.remove("active");
    });
  };
  window.onload = initializer();

  window.addEventListener("load", function () {
    const savedContent = localStorage.getItem("ppt");
    if (savedContent) {
      writingArea.innerHTML = savedContent;
    }
  });
}





