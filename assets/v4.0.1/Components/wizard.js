export class Wizard {
            constructor(config) {
                console.log(config.elementById)
                this.formElement = document.getElementById(config.elementById);
                this.currentStep = 0;
                this.config = config; // Store the config for later use
                this.init();
            }

            init() {
                const colom = this.config.colom;
                const actions = Object.keys(this.config.action).map(key => {
                    const [type, colSize, label, placeholder, iconPosition, iconClass, options] = this.config.action[key];
                    return this.createFormGroup(key, type, colSize, label, placeholder, iconPosition, iconClass, options);
                });

                this.steps = [];
                for (let i = 0; i < actions.length; i += colom) {
                    this.steps.push(actions.slice(i, i + colom));
                }

                this.renderStep();
                this.createNavigationButtons();
            }

            createFormGroup(id, type, colSize, label, placeholder, iconPosition, iconClass, options) {
                const colDiv = document.createElement('div');
                colDiv.className = `col-md-${colSize}`;

                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                formGroup.style.position = 'relative';

                if (iconClass) {
                    const icon = document.createElement('i');
                    icon.className = iconClass;
                    icon.style.position = 'absolute';
                    icon.style.top = '10px';
                    icon.style[iconPosition] = '10px';
                    formGroup.appendChild(icon);
                }

                let input;
                if (type === 'select') {
                    input = document.createElement('select');
                    input.className = 'form-control';
                    input.setAttribute('id', id);
                    options.forEach(option => {
                        const opt = document.createElement('option');
                        opt.value = option.value;
                        opt.textContent = option.label;
                        input.appendChild(opt);
                    });
                } else {
                    input = document.createElement('input');
                    input.type = type;
                    input.className = 'form-control';
                    input.placeholder = placeholder;
                    input.setAttribute('aria-label', label);
                    input.setAttribute('id', id);
                    input.required = true;

                    if (iconPosition === 'right') {
                        $(input).css({'padding-left': '10px'});
                    } else {
                        $(input).css({'padding-left': '30px'});
                    }
                }

                formGroup.appendChild(input);

                const errorMessage = document.createElement('span');
                errorMessage.id = `info_${id}`;
                errorMessage.className = 'info_input1 error-message';
                $(errorMessage).css({
                    "color": "red",
                    "font-size": "0.875em",
                    "display": "none"
                });
                formGroup.appendChild(errorMessage);

                colDiv.appendChild(formGroup);

                return colDiv;
            }

            renderStep() {
                this.formElement.innerHTML = '';
                const row = document.createElement('div');
                row.className = 'row';
                this.steps[this.currentStep].forEach(step => row.appendChild(step));
                this.formElement.appendChild(row);
            }

            createNavigationButtons() {
                const navButtons = document.createElement('div');
                navButtons.className = 'form-group';

                if (this.currentStep > 0) {
                    const prevButton = document.createElement('button');
                    prevButton.className = 'btn btn-secondary btn-xs float-left';
                    prevButton.textContent = 'Previous';
                    prevButton.addEventListener('click', () => this.previousStep());
                    navButtons.appendChild(prevButton);
                }

                if (this.currentStep < this.steps.length - 1) {
                    const nextButton = document.createElement('button');
                    nextButton.className = 'btn btn-primary btn-xs float-right ml-2';
                    nextButton.textContent = 'Next';
                    nextButton.addEventListener('click', () => this.nextStep());
                    navButtons.appendChild(nextButton);
                } else {
                    const finishButton = document.createElement('button');
                    finishButton.className = 'btn btn-success btn-xs float-right';
                    finishButton.textContent = 'Submit';
                    finishButton.addEventListener('click', () => this.finishWizard());
                    navButtons.appendChild(finishButton);
                }

                this.formElement.appendChild(navButtons);
            }

            validateCurrentStep() {
                let isValid = true;
                this.steps[this.currentStep].forEach(step => {
                    const input = step.querySelector('input, select');
                    const errorMessage = step.querySelector('.error-message');
                    if (input.value.trim() === '') {
                        isValid = false;
                        errorMessage.textContent = 'This field is required.';
                        errorMessage.style.display = 'block';
                    } else {
                        errorMessage.style.display = 'none';
                    }
                });
                return isValid;
            }

            nextStep() {
                if (this.validateCurrentStep()) {
                    if (this.currentStep < this.steps.length - 1) {
                        this.currentStep++;
                        this.renderStep();
                        this.createNavigationButtons();
                    }
                }
            }

            previousStep() {
                if (this.currentStep > 0) {
                    this.currentStep--;
                    this.renderStep();
                    this.createNavigationButtons();
                }
            }

            finishWizard() {
                var set=this.config;
                 const cradensial = set.cradensial;
                 const formData = this.collectFormData();
                 const Tabel = set.cradensial ? "FROM_" + set.cradensial : 'formEntries';
                   console.log(set)
                 // Get existing data from localStorage or initialize an empty array
                 let storedData = JSON.parse(localStorage.getItem(Tabel)) || [];
                 // Add the new form data to the array
                 storedData.push(formData);
                 // Save updated data to localStorage
                 localStorage.setItem(Tabel, JSON.stringify(storedData));

                 // Clear form 
               
                 if (navigator.onLine) {
                     if (cradensial) {
                       sendDataToServer(set.status, cradensial, set.elementById, set);
                     }
                 } else {
                     console.log('Anda sedang offline. Data Anda telah disimpan dan akan dikirim setelah Anda kembali online.');
                 }
                if (this.config.sendCallback) {
                    this.config.sendCallback(formData);
                }
            }

            collectFormData() {
                const formData = {};
                Object.keys(this.config.action).forEach((key, index) => {
                    const step = this.steps.flat()[index];
                    const input = step.querySelector('input, select');
                    formData[key] = input ? input.value : null;
                });

                return formData;
            }
        }


export function sendDataToServer(status, cradensial, idInfo, config) {
    var Tabel="FROM_"+cradensial;
    const storedData = JSON.parse(localStorage.getItem(Tabel)) || [];
    if (storedData.length > 0 && navigator.onLine) { // Cek status online
         console.log(storedData[0]);
           new Dom.Storage().From({
              "endpoint":cradensial, //Large|Content
              "tabel":Tabel,
              "status":status, 
              "data":storedData, 
              "idInfo": idInfo,
              "config": config,
           })
    } else if (!navigator.onLine) {
        console.log('Saat ini offline. Data akan dikirim ketika kembali online.');
    }
}

// Periksa status online dan kirim data saat jaringan kembali
window.addEventListener('online', sendDataToServer);
