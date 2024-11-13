// Fungsi untuk membuat form
export function Alert(attr) {
    // console.log(attr)
            // Membuat elemen div untuk alert
            const alertDiv = document.createElement('div');
            alertDiv.className =attr.class?attr.class:'alert alert-primary d-flex align-items-center';
            alertDiv.role = 'alert';
            if (attr.icon) {
               const icon = document.createElement('i');
               icon.className = 'mr-10px '+attr.icon;
               alertDiv.appendChild(icon);
            }

            // Membuat elemen span untuk teks
            const text = document.createElement('span');
            text.textContent = attr.headline ;
            // Menambahkan ikon dan teks ke elemen alert
            
            alertDiv.appendChild(text);
            // Menambahkan elemen alert ke container
            document.getElementById(attr.elementById).appendChild(alertDiv);
        }
