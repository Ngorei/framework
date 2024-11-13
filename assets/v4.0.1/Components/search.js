export  function Search(el) {
               const getElementById=el.getElementById
               const content=el.textInput
               const addset=el
               const widthPosisi=el.widthPosisi?el.widthPosisi:33;
               // console.log(el.widthPosisi)

              // Ambil kunci dari objek suggestions
              var suggestionsKeys = Object.keys(addset.suggestions);
              var labelKey = suggestionsKeys[0]; // 'label'
              var valueKey = suggestionsKeys[1]; // 'value'
              var imgKey = suggestionsKeys[2]; // 'imgKey'
              
              // Ambil nama kunci dari suggestions
              var labelName = addset.suggestions[labelKey]; // 'title'
              var valueName = addset.suggestions[valueKey]; // 'url'
              var imageName = addset.suggestions[imgKey]?addset.suggestions[imgKey]:''; // 'url'
  
              // Ubah kunci objek data secara otomatis
              addset.data = addset.data.map(item => {
                  // Buat salinan dari item dan ganti kunci sesuai suggestions
                  let newItem = { ...item };
                  // Ganti kunci yang diinginkan
                  newItem[labelKey] = newItem[labelName];
                  newItem[valueKey] = newItem[valueName];
                  // Hapus kunci lama yang sudah diganti
                  delete newItem[labelName];
                  delete newItem[valueName];
                  
                  return newItem;
               });

               const sendCallback=el.sendCallback
              // const getElementById, content, data, sendCallback }
              const suggestionsContainer = document.getElementById(getElementById);
                //const hasilContainer = document.getElementById('hasil');

    // console.log(imageName)

                function getSuggestions(query) {
                    // console.log('Data yang diterima:', addset.data);
                    if (!Array.isArray(addset.data)) {
                        // console.error('addset.data bukan array');
                        return [];
                    }
                    return addset.data.filter(item => {
                        if (!item) {
                            // console.warn('Item tidak valid:', item);
                            return false;
                        }
                        if (!item.label) {
                            // console.warn('Item tidak memiliki properti label:', item);
                            return false;
                        }
                        if (typeof item.label !== 'string') {
                            // console.warn('Label bukan string:', item.label);
                            return false;
                        }
                        return item.label.toLowerCase().includes(query.toLowerCase());
                    });
                }

                function displaySuggestions(suggestions) {
                    suggestionsContainer.innerHTML = '';
                    //hasilContainer.innerHTML = ''; // Kosongkan hasil sebelumnya
                    suggestionsContainer.style.border = '1px solid #ccc';
                    suggestionsContainer.style.maxHeight = '150px'; // Perbaiki 'max-height' menjadi 'maxHeight'
                    suggestionsContainer.style.overflowY = 'auto';  // Perbaiki 'overflow-y' menjadi 'overflowY'
                    suggestionsContainer.style.position = 'absolute';
                    suggestionsContainer.style.backgroundColor = 'white'; // Perbaiki 'background-color' menjadi 'backgroundColor'
                        suggestionsContainer.style.zIndex = "1";
                    //suggestionsContainer.style.width = '90%';
                    suggestionsContainer.style.padding = '0';
                    suggestionsContainer.style.listStyle = 'none'; // Perbaiki 'list-style' menjadi 'listStyle'
                    suggestionsContainer.classList.add('suggestions');

                     const colMd6Element = document.getElementById(content);
                     function adjustSuggestionsWidth() {
                         if (colMd6Element) {
                             const colMd6Width = colMd6Element.offsetWidth;
                             suggestionsContainer.style.width = `${(colMd6Width+widthPosisi)}px`;
                         }
                     }
                // Menyesuaikan lebar saat halaman dimuat atau jendela diubah ukurannya
                window.addEventListener('resize', adjustSuggestionsWidth);
                adjustSuggestionsWidth();
                    suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement('li');
                        suggestionItem.style.padding = '10px';
                        suggestionItem.style.cursor = 'pointer';
                        suggestionItem.style.display = 'flex';
                        suggestionItem.style.alignItems = 'top';

                        suggestionItem.addEventListener('mouseover', () => {
                            suggestionItem.style.backgroundColor = '#f0f0f0';
                        });
                        suggestionItem.addEventListener('mouseout', () => {
                            suggestionItem.style.backgroundColor = '';
                        });

                        const image = document.createElement('img');
                        image.src = suggestion[imageName]?suggestion[imageName]:'https://via.placeholder.com/350';
                        image.alt = '';
                        image.style.width = '30px';
                        image.style.height = '30px';
                        image.style.borderRadius = '50%';
                        image.style.marginRight = '15px';

                        const contentDiv = document.createElement('div');
                        const title = document.createElement('h6');
                        title.textContent = suggestion.label;
                        title.style.margin = '0';
                        title.style.fontSize = '13px';
                        title.style.fontWeight = 'bold';
                        const timestamp = document.createElement('span');
                        timestamp.textContent = `Timestamp: ${suggestion.timestamp}`;
                        timestamp.style.fontSize = '11px';
                        timestamp.style.color = '#999';

                        const url = document.createElement('span');
                        url.textContent = `Data: ${suggestion.value}`;
                        url.style.fontSize = '11px';
                        url.style.color = '#999';

                        const target = document.createElement('span');
                        target.textContent = `Target: ${suggestion.target}`;
                        target.style.fontSize = '11px';
                        target.style.color = '#999';

                        contentDiv.appendChild(title);
                        contentDiv.appendChild(url);
                        //contentDiv.appendChild(timestamp);
                        //contentDiv.appendChild(target);
                        if (imageName) {
                        suggestionItem.appendChild(image);
                        }
                        suggestionItem.appendChild(contentDiv);

                        suggestionItem.addEventListener('click', () => {
                            document.getElementById(content).value = suggestion.label; // Tambahkan nilai yang dipilih ke dalam input
                            suggestionsContainer.innerHTML = '';
                            suggestionsContainer.style.border = '0px solid #ccc';
                            sendCallback(suggestion); // Panggil sendCallback dengan item yang dipilih
                        });

                        suggestionsContainer.appendChild(suggestionItem);
                    });
                }

                document.getElementById(content).addEventListener('input', (event) => {
                    const query = event.target.value;
                    if (query.length > 0) {
                        // console.log('Query:', query);
                        const suggestions = getSuggestions(query);
                        // console.log('Suggestions:', suggestions);
                        displaySuggestions(suggestions);
                    } else {
                        suggestionsContainer.innerHTML = '';
                        suggestionsContainer.style.border = '0px solid #ccc';
                        //hasilContainer.innerHTML = ''; // Kosongkan hasil jika input dikosongkan
                    }
                });
}