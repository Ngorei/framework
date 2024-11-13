export  function Select(all, callback) {
     const container = document.getElementById(all.elementById);
        const customSelect = document.createElement('div');
        customSelect.classList.add('custom-select');
        customSelect.style.position = 'relative';
        customSelect.style.width = '100%';
        customSelect.style.border = '1px solid #ccc';
        customSelect.style.borderRadius = '4px';
        customSelect.style.backgroundColor = '#fff';
        customSelect.style.cursor = 'pointer';
        const selectInput = document.createElement('input');
        selectInput.type = 'text';
        selectInput.name = all.attrName?all.attrName:'noname';
        selectInput.classList.add('select-input');
        selectInput.placeholder = all.placeholder?all.placeholder:'Select an option...';
        selectInput.style.width = '100%';
        selectInput.style.border = 'none';
        selectInput.style.padding = '1px';
        selectInput.style.boxSizing = 'border-box';
        selectInput.style.outline = 'none';
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.width = '100%';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.borderRadius = '4px';
        dropdown.style.backgroundColor = '#fff';
        dropdown.style.maxHeight = '200px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.display = 'none';

        customSelect.appendChild(selectInput);
        customSelect.appendChild(dropdown);
        container.appendChild(customSelect);

        selectInput.addEventListener('input', function() {
            const searchTerm = selectInput.value.toLowerCase();
            dropdown.innerHTML = '';
            const filteredOptions = all.options.filter(option => option.label.toLowerCase().includes(searchTerm));
            filteredOptions.forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.textContent = option.label;
                optionDiv.style.padding = '8px';
                optionDiv.style.cursor = 'pointer';
                optionDiv.style.borderBottom = '1px solid #eee';
                optionDiv.addEventListener('click', () => selectOption(option));
                dropdown.appendChild(optionDiv);
            });
            dropdown.style.display = 'block';
        });
        selectInput.addEventListener('click', function() {
            const searchTerm = selectInput.value.toLowerCase();
            dropdown.innerHTML = '';
            const filteredOptions = all.options.filter(option => option.label.toLowerCase().includes(searchTerm));
            filteredOptions.forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.textContent = option.label;
                optionDiv.style.padding = '8px';
                optionDiv.style.cursor = 'pointer';
                optionDiv.style.borderBottom = '1px solid #eee';
                optionDiv.addEventListener('click', () => selectOption(option));
                dropdown.appendChild(optionDiv);
            });
            dropdown.style.display = 'block';
        });

        selectInput.addEventListener('focus', function() {
            dropdown.style.display = 'block';
        });

        document.addEventListener('click', function(event) {
            if (!customSelect.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });

        function selectOption(option) {
            selectInput.value = option.label;
            dropdown.style.display = 'none';
            if (callback) {
                callback(option); // Call the callback function with the selected option
            }
        } 
    }
