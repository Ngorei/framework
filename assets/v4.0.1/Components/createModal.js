// Fungsi untuk membuat form
export function createModal(modalId, title, bodyContent) {
 const modal = document.createElement('div');
                    modal.className = 'modal fade';
                    modal.id = modalId;
                    modal.tabIndex = -1;
                    modal.role = 'dialog';
                    modal.setAttribute('aria-labelledby', 'exampleModalLabel');
                    modal.setAttribute('aria-hidden', 'true');
        
                    // Membuat elemen dialog modal
                    const modalDialog = document.createElement('div');
                    modalDialog.className = 'modal-dialog';
                    modalDialog.role = 'document';
        
                    // Membuat elemen konten modal
                    const modalContent = document.createElement('div');
                    modalContent.className = 'modal-content tx-14';
        
                    // Membuat elemen header modal
                    const modalHeader = document.createElement('div');
                    modalHeader.className = 'modal-header';
        
                    // Membuat elemen judul modal
                    const modalTitle = document.createElement('h6');
                    modalTitle.className = 'modal-title';
                    modalTitle.id = 'exampleModalLabel';
                    modalTitle.innerText = title;
        
                    // Membuat tombol tutup (close button) di header modal
                    const closeButton = document.createElement('button');
                    closeButton.type = 'button';
                    closeButton.className = 'close';
                    closeButton.setAttribute('data-dismiss', 'modal');
                    closeButton.setAttribute('aria-label', 'Close');
        
                    // Membuat elemen span untuk ikon '×' pada tombol tutup
                    const closeSpan = document.createElement('span');
                    closeSpan.setAttribute('aria-hidden', 'true');
                    closeSpan.innerHTML = '&times;';
        
                    // Merangkai elemen header modal
                    closeButton.appendChild(closeSpan);
                    modalHeader.appendChild(modalTitle);
                    modalHeader.appendChild(closeButton);
        
                    // Membuat elemen body modal
                    const modalBody = document.createElement('div');
                    modalBody.className = 'modal-body';
        
                    // Membuat paragraf di body modal
                    const modalParagraph = document.createElement('p');
                    modalParagraph.className = 'mg-b-0';
                    modalParagraph.innerText = bodyContent;
        
                    // Merangkai elemen body modal
                    modalBody.appendChild(modalParagraph);
        
                    // Membuat elemen footer modal
                    const modalFooter = document.createElement('div');
                    modalFooter.className = 'modal-footer';
        
                    // Membuat tombol 'Close' di footer modal
                    const closeBtn = document.createElement('button');
                    closeBtn.type = 'button';
                    closeBtn.className = 'btn btn-secondary tx-13';
                    closeBtn.setAttribute('data-dismiss', 'modal');
                    closeBtn.innerText = 'Close';
        
                    // Membuat tombol 'Save changes' di footer modal
                    const saveChangesBtn = document.createElement('button');
                    saveChangesBtn.type = 'button';
                    saveChangesBtn.className = 'btn btn-primary tx-13';
                    saveChangesBtn.innerText = 'Save changes';
        
                    // Merangkai elemen footer modal
                    modalFooter.appendChild(closeBtn);
                    modalFooter.appendChild(saveChangesBtn);
        
                    // Merangkai elemen modal
                    modalContent.appendChild(modalHeader);
                    modalContent.appendChild(modalBody);
                    modalContent.appendChild(modalFooter);
                    modalDialog.appendChild(modalContent);
                    modal.appendChild(modalDialog);
                    document.body.appendChild(modal);
                    return modal;     

}
