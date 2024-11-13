export function Dopdown(config) {
    const links = config.action;
    const dropdownContainer = document.getElementById(config.elementById);
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.style.position = 'relative';
    dropdown.style.display = 'inline-block';

    const button = document.createElement('div');
    button.innerHTML = dropdownContainer.innerHTML;
    dropdownContainer.style.cursor = 'pointer';
    dropdownContainer.onclick = tglDropdown;
    dropdownContainer.innerHTML = '';

    const dropdownContent = document.createElement('div');
    dropdownContent.style.display = 'none';
    dropdownContent.style.position = 'absolute';
    dropdownContent.style.backgroundColor = '#fff';
    //dropdownContent.style.minWidth = '160px';
    // dropdownContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
    dropdownContent.style.zIndex = '1';
    dropdownContent.className = 'dropdown-menu';

    for (const key in links) {
        if (links.hasOwnProperty(key)) {
            const [title, iconClass, href] = links[key];

            const link = document.createElement('a');
            link.href = href;
            link.className = 'dropdown-item';
            link.innerHTML = `<i class="${iconClass}"></i> ${title}`;
            link.style.color = 'black';
            link.style.textDecoration = 'none';
            link.style.display = 'block';
            link.style.whiteSpace = 'nowrap';

            const icon = link.querySelector('i');
            if (icon) {
                icon.style.marginRight = '5px';
            }

            dropdownContent.appendChild(link);
        }
    }

    dropdown.appendChild(button);
    dropdown.appendChild(dropdownContent);
    dropdownContainer.appendChild(dropdown);

    function tglDropdown() {
        if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
            dropdownContent.style.display = 'block';
        } else {
            dropdownContent.style.display = 'none';
        }
    }

    // Menambahkan event listener pada document untuk menangani klik di luar dropdown
    document.addEventListener('click', function(event) {
        const isClickInsideDropdown = dropdown.contains(event.target);

        if (!isClickInsideDropdown) {
            dropdownContent.style.display = 'none';
        }
    });
}
