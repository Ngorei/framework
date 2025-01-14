 // import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
 // import { getDatabase, ref, set, get, update, remove, push, onValue } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js';

export function Ngorei() {

  return {
     Helper: function() {
       return {
           Encode: function(row) {
              return Encode(row)
           },
           Decode: function(row) {
              return Decode(row)
           },
       }
     },
     Tokenize: function(userData,cradensial) {
        const SECRET_KEY= cradensial.replace(/-/g, "")
        return tokenize(userData,SECRET_KEY)
     },
     Components: function() {
       return {
        ViewStack: function() {
          return new ViewStack();
        },
        SectionId: function() {
          return new SectionId();
        },
        Accordion: function() {
          return Accordion();
        },  
        Alerts: function() {
          return Alerts();
        }, 
        buttonGroups: function() {
          return buttonGroups();
        }, 
        Carousel: function() {
          return initCarousels();
        }, 
        Collapse: function() {
          return Collapse();
        }, 
        Dropdown: function() {
          return Dropdown();
        },
        Lightbox: function() {
          return new Lightbox();
        },
        Sidebar: function(darkModeButton) {
          return new SidebarMenu()
        },
        ListGroup: function() {
          return new ListGroup()
        },
        Offcanvas: function() {
          return new Offcanvas()
        }, 
        Popover: function() {
          return new Popover();
        },
        Progress: function() {
          return Progress();
        },
        Scrollspy: function() {
          return Scrollspy();
        },
        Search: function() {
          return initializeSearch();
        }, 
        Sortable: function() {
          return new Sortable();
        },
        Toast: function() {
          return  Toast();
        },
        Tooltips: function() {
          return  Tooltips();
        },
        DarkMode : function(darkModeButton) {
         return new DarkMode();
        },
        getViewStack : function() {
          return new getViewStack();
         },
        PrismTab: function() {
            const tabCodeContainers = document.querySelectorAll('.nx-tabcode');
          
          tabCodeContainers.forEach(container => {
              const tabBtns = container.querySelectorAll('.nx-tabcode-btn');
              
              tabBtns.forEach(btn => {
                  btn.addEventListener('click', function() {
                      // Hapus kelas active hanya dari tab dalam container yang sama
                      container.querySelectorAll('.nx-tabcode-btn').forEach(b => b.classList.remove('active'));
                      container.querySelectorAll('.nx-tabcode-pane').forEach(pane => pane.classList.remove('active'));
                      
                      // Tambahkan kelas active ke tab yang diklik
                      this.classList.add('active');
                      document.getElementById(this.dataset.tab).classList.add('active');
                  });
              });
          });

        },
        Prism: function() {
          wrapCodeWithTerminal();
          
          window.copyCode = function (button) {
            try {
              // Ambil kode dari elemen
              const pre = button.closest(".terminal").querySelector("pre");
              const code = pre.querySelector("code").innerText;
              // Buat elemen textarea temporary
              const textarea = document.createElement("textarea");
              textarea.value = code;
              textarea.style.position = "fixed"; // Hindari scrolling
              textarea.style.opacity = "0"; // Sembunyikan elemen
              // Tambahkan ke dokumen
              document.body.appendChild(textarea);
              // Select dan copy
              textarea.select();
              document.execCommand("copy");
              // Bersihkan
              document.body.removeChild(textarea);
              // Feedback visual
              const originalText = button.textContent;
              button.innerHTML =
                '<i class="icon-feather-copy"></i> ' + "Tersalin";
              button.classList.add("bg-green-600");
              setTimeout(() => {
                button.innerHTML =
                  '<i class="icon-feather-copy"></i> ' + originalText;
                button.classList.remove("bg-green-600");
              }, 2000);
            } catch (err) {
              console.error("Gagal menyalin:", err);
              alert("Maaf, gagal menyalin kode");
            }
          };
          }
       }
     },
    createForm: async function(ret, callback) {
         // const hasil = await createForm(ret, callback);
         return createForm(ret, callback);
     },
     createModal: function() {
       return createModal()
     },
     Render: function() { 
       return {
          View: function(row) {
            return new View(row);
          },
          Tabel: function(row) {
            return {
              Matrix: function(row) {
                return new TabelMatrix(row)
              }
              
            };
          },
          
          SinglePageApp: function(e) {
             const spa = new SinglePageApp();
              return spa.SinglePageApplication(e)
          },
          latSinglePageApp: function(result) {

            const  latSing=latSinglePageApp({
                     'elementById':result.elementById,
                     'endpoint':result.key,
                     'forceReload': false,
                     'data':result.data.data
                    })
                    .then(response => {
                        if (response) {
                           const contentElement = document.getElementById(result.data.elementById);
                           contentElement.innerHTML =response; 
                          
                        } else {
                            console.log('Data tidak ditemukan');
                        }
                    })
                    .catch(error => {
                        console.error('Terjadi kesalahan:', error);
                    });

             return latSing
          },
       }
     },

     Network: function() {
          return {
           tatiye: function() {
            return tatiye
           },
           WebSocket: function() {
             return tatiye
           },
           Queue: function(row) {
            return Queue(row)
           },
           Brief: function(row) {
            return Brief(row)
           },
           Crypto: function() {
            return new Crypto()
           },
           Buckets: function(row) {
            return Buckets(row)
           },
           RTDb: function(callback,token) {
            return RTDb(callback,token)
           },
           filterRow: function(data, propertyMap) {
            return filterRow(data, propertyMap)
           },
           indexDB: function() {
            const db = new classIndexDB();
            return {
              add: async function(row) {
              try {
                const key = row.key;
                const data = row.data;
                const timestamp = Date.now();
                const hasil = await db.saveData(key, data, timestamp);
                const tersimpan = await db.getData(key);
                return tersimpan;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            get: async function(key) {
              try {
                const data = await db.getData(key);
                return data;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            ref: async function() {
              try {
                const allData = await db.getAllData();
                return allData;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            up: async function(key, newData) {
              try {
                await db.updateData(key, newData);
                const updatedData = await db.getData(key);
                return updatedData;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            del: async function(key) {
              try {
                const result = await db.deleteData(key);
                return result;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            latest: async function() {
              try {
                const latestData = await db.getLatestData();
                return latestData;
              } catch (error) {
                console.error("Error:", error);
              }
            }
          };
        },
        localStorage: function() {
          const storage = new classLocalStorage();
          return {
            add: async function(row) {
              try {
                const key = row.key;
                const data = row.data;
                const timestamp = Date.now();
                await storage.saveData(key, data, timestamp);
                const tersimpan = await storage.getData(key);
                return tersimpan;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            get: async function(key) {
              try {
                const data = await storage.getData(key);
                return data;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            ref: async function() {
              try {
                const allData = await storage.getAllData();
                return allData;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            up: async function(key, newData) {
              try {
                await storage.updateData(key, newData);
                const updatedData = await storage.getData(key);
                return updatedData;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            del: async function(key) {
              try {
                const result = await storage.deleteData(key);
                return result;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            latest: async function() {
              try {
                const latestData = await storage.getLatestData();
                return latestData;
              } catch (error) {
                console.error("Error:", error);
              }
            }
          };
        },
        cookies: function() {
          const storage = new classCookies();
          return {
            add: async function(row, options = {}) {
              try {
                const key = row.key;
                const data = row.data;
                const timestamp = Date.now();
                await storage.saveData(key, data, timestamp, options);
                const tersimpan = await storage.getData(key);
                return tersimpan;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            get: async function(key) {
              try {
                const data = await storage.getData(key);
                return data;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            ref: async function() {
              try {
                const allData = await storage.getAllData();
                return allData;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            up: async function(key, newData, options = {}) {
              try {
                await storage.updateData(key, newData, options);
                const updatedData = await storage.getData(key);
                return updatedData;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            del: async function(key, options = {}) {
              try {
                const result = await storage.deleteData(key, options);
                return result;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            latest: async function() {
              try {
                const latestData = await storage.getLatestData();
                return latestData;
              } catch (error) {
                console.error("Error:", error);
              }
            }
          };
        },
        sessionStorage: function() {
          const storage = new classSessionStorage();
          return {
            add: async function(row) {
              try {
                const key = row.key;
                const data = row.data;
                const timestamp = Date.now();
                await storage.saveData(key, data, timestamp);
                const tersimpan = await storage.getData(key);
                return tersimpan;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            get: async function(key) {
              try {
                const data = await storage.getData(key);
                return data;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            ref: async function() {
              try {
                const allData = await storage.getAllData();
                return allData;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            up: async function(key, newData) {
              try {
                await storage.updateData(key, newData);
                const updatedData = await storage.getData(key);
                return updatedData;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            del: async function(key) {
              try {
                const result = await storage.deleteData(key);
                return result;
              } catch (error) {
                console.error("Error:", error);
              }
            },
            latest: async function() {
              try {
                const latestData = await storage.getLatestData();
                return latestData;
              } catch (error) {
                console.error("Error:", error);
              }
            }
          };
        }
      }
 
     }
  }
}

// Mendefinisikan module pattern untuk Network
if (typeof define === "function" && define.amd) {
  // AMD
  define([], () => Ngorei);
} else if (typeof module === "object" && module.exports) {
  // CommonJS/Node.js
  module.exports = Ngorei;
} else {
  // Browser global
  window.Ngorei = Ngorei;
  window.dbs = new Ngorei(); // Instance default

}
//Komponen Network
// Fungsi untuk menginisialisasi tooltips
export function Tooltips() {
  // Inisialisasi tooltip dengan HTML content
  const htmlTooltips = document.querySelectorAll('[data-tooltip][data-html="true"]');
  htmlTooltips.forEach(tooltip => {
    const content = tooltip.getAttribute('data-tooltip');
    tooltip.setAttribute('data-tooltip', content);
  });

  // Event Tooltip Demo
  const tooltip = document.getElementById('eventTooltip');
  const toggleBtn = document.getElementById('toggleTooltip');

  if (tooltip && toggleBtn) {
    // Event untuk hover
    tooltip.addEventListener('mouseenter', function() {
      this.setAttribute('data-show', 'true');
      console.log('Tooltip ditampilkan');
    });

    tooltip.addEventListener('mouseleave', function() {
      this.removeAttribute('data-show');
      console.log('Tooltip disembunyikan');
    });

    // Event untuk toggle manual
    toggleBtn.addEventListener('click', function() {
      const isVisible = tooltip.hasAttribute('data-show');
      if (isVisible) {
        tooltip.removeAttribute('data-show');
      } else {
        tooltip.setAttribute('data-show', 'true');
      }
    });
  }
}

export function Toast() {
window.showBasicToast = function() {
  const toast = document.getElementById('basicToast');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Fungsi untuk varian toast
window.showToast = function(toastId) {
  const toast = document.getElementById(toastId);
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Fungsi untuk menutup toast
function closeToast(toastId) {
  const toast = document.getElementById(toastId);
  toast.classList.remove('show');
}

// Fungsi untuk toast dengan posisi
window.showPositionedToast = function(position) {
  const toast = document.getElementById(position);
  const toastElement = toast.querySelector('.nx-toast');
  toastElement.classList.add('show');
  setTimeout(() => {
    toastElement.classList.remove('show');
  }, 3000);
}

// Fungsi untuk toast dengan animasi
window.showAnimatedToast = function(toastId) {

  const toast = document.getElementById(toastId);
  toast.classList.add('show');
  
  if (toastId === 'slideToast') {
    // Tambahkan class slide khusus
    toast.classList.add('slide-animation');
  }
  
  setTimeout(() => {
    toast.classList.remove('show');
    if (toastId === 'slideToast') {
      toast.classList.remove('slide-animation');
    }
  }, 3000);
}

// Fungsi untuk toast dengan progress bar
window.showProgressToast = function() {
  const toast = document.getElementById('progressToast');
  const progressBar = toast.querySelector('.toast-progress');
  
  toast.classList.add('show');
  progressBar.style.width = '0%';
  
  let width = 0;
  const interval = setInterval(() => {
    width += 1;
    progressBar.style.width = width + '%';
    
    if (width >= 100) {
      clearInterval(interval);
      toast.classList.remove('show');
    }
  }, 30); // 3000ms / 100 = 30ms per 1%
}

// Fungsi untuk multiple toasts
function showMultipleToasts() {
  const messages = [
    'Toast Pertama',
    'Toast Kedua',
    'Toast Ketiga'
  ];
  
  messages.forEach((message, index) => {
    setTimeout(() => {
      const toast = createToast(message, index);
      document.querySelector('.toast-container').appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 3000);
    }, index * 500);
  });
}

// Helper function untuk membuat toast
function createToast(message, index) {
  const toast = document.createElement('div');
  toast.className = 'nx-toast toast-stack';
  toast.style.transform = `translateY(${index * 10}px)`;
  
  toast.innerHTML = `
    <div class="toast-body">
      ${message}
    </div>
  `;
  
  return toast;
}
window.showNotifikasiToast = function() {
  const toast = document.getElementById('notifikasiToast');
  toast.classList.add('show');
  
  // Animasi masuk dari kanan
  toast.style.transform = 'translateX(100%)';
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto hide setelah 5 detik
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      toast.classList.remove('show');
      toast.style.transform = '';
    }, 300);
  }, 5000);
 }
}
export class Sortable {
  constructor() {
    if (!document.querySelector('.nx-sortable')) {
      return;
    }

    this.dbName = 'sortableDB';
    this.dbVersion = 1;
    this.db = null;
    this.init();
  }

  init() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onerror = (event) => {
      console.error("Database error: " + event.target.error);
    };

    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      if (!this.db.objectStoreNames.contains('sortableState')) {
        this.db.createObjectStore('sortableState', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.restoreState();
      this.initializeSortables();
    };
  }

  saveState(id, items) {
    const transaction = this.db.transaction(['sortableState'], 'readwrite');
    const store = transaction.objectStore('sortableState');
    store.put({
      id: id,
      items: items,
      timestamp: new Date().getTime()
    });
  }

  restoreState() {
    const transaction = this.db.transaction(['sortableState'], 'readonly');
    const store = transaction.objectStore('sortableState');
    
    ['basic-demo', 'handle-demo', 'nested-demo', 'grid-demo'].forEach(id => {
      const request = store.get(id);
      request.onsuccess = (event) => {
        const data = event.target.result;
        if (data) {
          const container = document.getElementById(id);
          if (container) {
            container.innerHTML = '';
            const items = data.items;
            items.forEach(itemHtml => {
              const temp = document.createElement('div');
              temp.innerHTML = itemHtml;
              container.appendChild(temp.firstElementChild);
            });
          }
        }
      };
    });
  }

  getSortableItems(container) {
    return Array.from(container.children).map(item => item.outerHTML);
  }

  initializeSortables() {
    // Basic sortable
    const basicDemo = document.getElementById('basic-demo');
    if (basicDemo) {
      new window.Sortable(basicDemo, {
        animation: 150,
        ghostClass: 'sortable-dragging',
        dragClass: "sortable-dragging",
        onEnd: (evt) => {
          const items = this.getSortableItems(evt.to);
          this.saveState('basic-demo', items);
        }
      });
    }

    // Handle sortable
    const handleDemo = document.getElementById('handle-demo');
    if (handleDemo) {
      new window.Sortable(handleDemo, {
        handle: '.handle',
        animation: 150,
        ghostClass: 'sortable-dragging',
        dragClass: "sortable-dragging",
        onEnd: (evt) => {
          const items = this.getSortableItems(evt.to);
          this.saveState('handle-demo', items);
        }
      });
    }

    // Nested sortable
    const nestedSortables = document.querySelectorAll('#nested-demo .nx-sortable');
    if (nestedSortables.length > 0) {
      nestedSortables.forEach((el) => {
        new window.Sortable(el, {
          group: 'nested',
          animation: 150,
          fallbackOnBody: true,
          ghostClass: 'sortable-dragging',
          dragClass: "sortable-dragging",
          onEnd: (evt) => {
            const items = this.getSortableItems(document.getElementById('nested-demo'));
            this.saveState('nested-demo', items);
          }
        });
      });
    }

    // Grid sortable
    const gridDemo = document.getElementById('grid-demo');
    if (gridDemo) {
      new window.Sortable(gridDemo, {
        animation: 150,
        ghostClass: 'sortable-dragging',
        dragClass: "sortable-dragging",
        grid: 3,
        swapThreshold: 0.65,
        onEnd: (evt) => {
          const items = this.getSortableItems(evt.to);
          this.saveState('grid-demo', items);
        }
      });
    }
  }
}

// Fungsi utama untuk inisialisasi komponen search
export function initializeSearch() {
  // Mendapatkan semua komponen search
  const searchComponents = document.querySelectorAll('.nx-search');

  searchComponents.forEach(search => {
    const input = search.querySelector('input');
    const button = search.querySelector('.nx-search-btn');

    // Event listener untuk tombol search
    button.addEventListener('click', () => {
      handleSearch(input.value);
    });

    // Event listener untuk input ketika menekan Enter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch(input.value);
      }
    });
  });

  initializeAutocomplete();
  initializeSearchWithClear();
  initializeLoadingState();
}

// Fungsi untuk menangani pencarian
function handleSearch(value) {
  console.log('Mencari:', value);
  // Implementasi pencarian sesuai kebutuhan
}

// Fungsi untuk inisialisasi fitur autocomplete
function initializeAutocomplete() {
  const autoCompleteSearches = document.querySelectorAll('.nx-search-autocomplete');

  autoCompleteSearches.forEach(search => {
    const input = search.querySelector('input');
    const suggestions = search.querySelector('.nx-search-suggestions');
    const items = search.querySelectorAll('.nx-search-item');

    input.addEventListener('focus', () => {
      search.classList.add('active');
    });

    input.addEventListener('blur', () => {
      setTimeout(() => {
        search.classList.remove('active');
      }, 200);
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.textContent;
        search.classList.remove('active');
        handleSearch(input.value);
      });
    });
  });
}

// Fungsi untuk inisialisasi fitur clear button
function initializeSearchWithClear() {
  const searchWithClear = document.querySelectorAll('.nx-search-with-clear');

  searchWithClear.forEach(search => {
    const input = search.querySelector('input');
    const clearBtn = search.querySelector('.nx-search-clear');
    
    input.addEventListener('input', () => {
      if (input.value) {
        search.classList.add('has-value');
      } else {
        search.classList.remove('has-value');
      }
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      search.classList.remove('has-value');
      input.focus();
    });
  });
}

// Fungsi untuk inisialisasi loading state
function initializeLoadingState() {
  document.querySelectorAll('.nx-search:not(.nx-search-loading)').forEach(search => {
    const searchBtn = search.querySelector('.nx-search-btn');
    
    searchBtn.addEventListener('click', () => {
      const input = search.querySelector('input');
      if (input.value) {
        search.classList.add('nx-search-loading');
        input.disabled = true;
        searchBtn.disabled = true;
        
        setTimeout(() => {
          search.classList.remove('nx-search-loading');
          input.disabled = false;
          searchBtn.disabled = false;
        }, 2000);
      }
    });
  });
}

// Scrollspy
export function Scrollspy() {
  const scrollSpyContainers = document.querySelectorAll('[data-nx-spy="scroll"]');
  
  scrollSpyContainers.forEach(container => {
    const parentContainer = container.closest('.code-preview');
    if (!parentContainer) return;

    const navContainer = parentContainer.querySelector('[data-nx-nav]');
    if (!navContainer) return;
    
    const navButtons = navContainer.querySelectorAll('[data-nx-scroll-target]');
    const sections = container.querySelectorAll('[data-nx-section]');
    const offset = parseInt(container.getAttribute('data-nx-offset')) || 0;

    if (!navButtons.length || !sections.length) return;
    
    // Event listener untuk tombol navigasi
    navButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('data-nx-scroll-target');
        const targetSection = container.querySelector(`#${targetId}`);
        
        if (targetSection) {
          // Update active state
          navButtons.forEach(btn => btn.classList.remove('active'));
          e.target.classList.add('active');
          
          // Scroll dengan memperhitungkan offset
          let scrollTop = targetSection.offsetTop;
          
          // Jika ini adalah offset scrollspy, tambahkan offset tambahan
          if (container.hasAttribute('data-nx-offset')) {
            scrollTop -= offset;
          }
          
          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Set initial active state
    const firstSection = sections[0];
    if (firstSection) {
      const firstButton = navContainer.querySelector(`[data-nx-scroll-target="${firstSection.id}"]`);
      if (firstButton) {
        firstButton.classList.add('active');
      }
    }
  });
}
// fungsi-fungsi Progress
export function Progress() {
    window.currentProgress = 0;
    window.updateProgress = function(value) {
        const progressBar = document.getElementById('interactiveProgress');
        if (progressBar) {
            window.currentProgress = Math.max(0, Math.min(100, value));
            progressBar.style.width = window.currentProgress + '%';
            progressBar.textContent = window.currentProgress + '%';
        }
    }
    window.increaseProgress = function() {
        window.updateProgress(window.currentProgress + 10);
    }
    window.decreaseProgress = function() {
        window.updateProgress(window.currentProgress - 10);
    }
    return updateProgress(0);
}
export class Popover {
  constructor() {
    this.popovers = document.querySelectorAll('.nx-popover');
    this.init();
  }

  init() {
    // Inisialisasi event listeners
    document.addEventListener('DOMContentLoaded', () => this.initDynamicPopovers());
    window.addEventListener('resize', () => this.initDynamicPopovers());
  }

  initDynamicPopovers() {
    this.popovers.forEach(popover => {
      const content = popover.querySelector('.popover-content');
      const position = popover.getAttribute('data-position');
      
      popover.addEventListener('mouseenter', () => {
        // Reset style
        content.style.transform = '';
        content.style.top = '';
        content.style.bottom = '';
        content.style.left = '';
        content.style.right = '';
        
        // Dapatkan posisi dan ukuran
        const buttonRect = popover.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        
        // Atur posisi berdasarkan data-position
        switch(position) {
          case 'top':
            content.style.bottom = 'calc(100% + 10px)';
            content.style.left = '50%';
            content.style.transform = 'translateX(-50%)';
            break;
            
          case 'right':
            content.style.top = '50%';
            content.style.left = 'calc(100% + 10px)';
            content.style.transform = 'translateY(-50%)';
            break;
            
          case 'bottom':
            content.style.top = 'calc(100% + 10px)';
            content.style.left = '50%';
            content.style.transform = 'translateX(-50%)';
            break;
            
          case 'left':
            content.style.top = '50%';
            content.style.right = 'calc(100% + 10px)';
            content.style.left = 'auto';
            content.style.transform = 'translateY(-50%)';
            break;
        }
      });
    });
  }
} 
export class Offcanvas {
  constructor() {
    this.init();
  }
  init() {
    // Event untuk membuka offcanvas
    document.querySelectorAll('[nx-offcanvas-target]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const targetId = trigger.getAttribute('nx-offcanvas-target');
        this.show(targetId);
      });
    });

    // Event untuk menutup offcanvas
    document.querySelectorAll('[data-offcanvas-close]').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        const offcanvas = closeBtn.closest('.nx-offcanvas');
        this.hide(offcanvas.id);
      });
    });

    // Event untuk menutup offcanvas ketika klik backdrop
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nx-offcanvas-backdrop')) {
        const visibleOffcanvas = document.querySelector('.nx-offcanvas.show');
        if (visibleOffcanvas) {
          this.hide(visibleOffcanvas.id);
        }
      }
    });
  }

  show(offcanvasId) {
    const offcanvas = document.getElementById(offcanvasId);
    if (!offcanvas) return;

    // Buat backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'nx-offcanvas-backdrop';
    document.body.appendChild(backdrop);

    // Tambahkan class show setelah backdrop ditambahkan ke DOM
    setTimeout(() => {
      backdrop.classList.add('show');
      offcanvas.classList.add('show');
    }, 10);

    // Nonaktifkan scroll pada body
    document.body.style.overflow = 'hidden';
  }

  hide(offcanvasId) {
    const offcanvas = document.getElementById(offcanvasId);
    if (!offcanvas) return;

    const backdrop = document.querySelector('.nx-offcanvas-backdrop');
    
    // Hapus class show
    offcanvas.classList.remove('show');
    if (backdrop) {
      backdrop.classList.remove('show');
    }

    // Tunggu animasi selesai sebelum menghapus backdrop
    setTimeout(() => {
      if (backdrop) {
        backdrop.remove();
      }
      // Aktifkan kembali scroll pada body
      document.body.style.overflow = '';
    }, 300);
  }
}
// Menambahkan event listener untuk list items yang dapat diklik
export class ListGroup {
  constructor() {
    this.init();
  }

  init() {
    const listItems = document.querySelectorAll('.nx-list-item');
    
    listItems.forEach(item => {
      if (item.tagName === 'A') {
        item.addEventListener('click', (e) => this.handleClick(e, item));
      }
    });
  }

  handleClick(e, item) {
    if (!item.classList.contains('disabled')) {
      const parent = item.closest('.nx-list-group');
      parent.querySelectorAll('.nx-list-item').forEach(el => {
        el.classList.remove('active');
      });
      item.classList.add('active');
    }
  }
}
// lightbox
export class Lightbox {
  constructor() {
    // Cek apakah ada elemen dengan data-nx-lightbox sebelum inisialisasi
    if (document.querySelectorAll('[data-nx-lightbox]').length > 0) {
      this.init();
    }
  }

  init() {
    // Cek apakah overlay sudah ada sebelum membuatnya
    if (!document.querySelector('.nx-lightbox-overlay')) {
      this.createOverlay();
    }
    
    // Tambahkan event listener ke semua gambar dengan data-nx-lightbox
    document.querySelectorAll('[data-nx-lightbox]').forEach(img => {
      img.addEventListener('click', (e) => this.open(e.target));
    });
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'nx-lightbox-overlay';
    overlay.innerHTML = `
      <div class="nx-lightbox-content">
        <span class="nx-lightbox-close material-icons">close</span>
        <img src="" alt="Lightbox Image">
        <div class="nx-lightbox-caption"></div>
        <span class="nx-lightbox-nav nx-lightbox-prev material-icons">chevron_left</span>
        <span class="nx-lightbox-nav nx-lightbox-next material-icons">chevron_right</span>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    overlay.querySelector('.nx-lightbox-close').addEventListener('click', () => this.close());
    overlay.querySelector('.nx-lightbox-prev').addEventListener('click', () => this.navigate('prev'));
    overlay.querySelector('.nx-lightbox-next').addEventListener('click', () => this.navigate('next'));
  }

  open(imgElement) {
    const overlay = document.querySelector('.nx-lightbox-overlay');
    const lightboxImg = overlay.querySelector('img');
    const caption = overlay.querySelector('.nx-lightbox-caption');
    
    this.currentImg = imgElement;
    this.gallery = document.querySelectorAll(`[data-nx-lightbox="${imgElement.dataset.nxLightbox}"]`);
    
    lightboxImg.src = imgElement.src;
    caption.textContent = imgElement.dataset.nxCaption || '';
    overlay.classList.add('active');
  }

  close() {
    document.querySelector('.nx-lightbox-overlay').classList.remove('active');
  }

  navigate(direction) {
    const currentIndex = Array.from(this.gallery).indexOf(this.currentImg);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.gallery.length - 1;
    } else {
      newIndex = currentIndex < this.gallery.length - 1 ? currentIndex + 1 : 0;
    }

    this.open(this.gallery[newIndex]);
  }
}
// Fungsi untuk toggle dropdown
export function Dropdown() {
    // Fungsi untuk toggle dropdown
    function toggleDropdown(btn) {
        const dropdown = btn.nextElementSibling;
        dropdown.classList.toggle('show');
    }

    // Event listener untuk click di luar dropdown
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.nx-btn')) {
            const dropdowns = document.getElementsByClassName('nx-dropdown-content');
            for (const dropdown of dropdowns) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }
    });

    // Tambahkan event listener ke semua tombol dropdown
    const dropdownButtons = document.querySelectorAll('.nx-btn[data-toggle="dropdown"]');
    dropdownButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleDropdown(this);
        });
    });
}
// Fungsi utama untuk menginisialisasi collapse
export function Collapse() {
  const collapseButtons = document.querySelectorAll('.nx-collapse-btn');
  
  collapseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const target = document.querySelector(this.getAttribute('data-target'));
      if (target) {
        target.classList.toggle('show');
        
        // Trigger custom events
        const event = new CustomEvent(
          target.classList.contains('show') ? 'show.nx-collapse' : 'hide.nx-collapse'
        );
        target.dispatchEvent(event);
      }
    });
  });
}
export class Carousel {
  constructor(element) {
    this.carousel = element;
    this.items = this.carousel.querySelectorAll('.nx-carousel-item');
    this.totalItems = this.items.length;
    this.currentIndex = 0;
    this.isPlaying = true;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.interval = null;
    this.autoplayDuration = parseInt(this.carousel.dataset.interval) || 7000;
    this.transitionDuration = 1000;

    this.init();
  }

  init() {
    this.setupControls();
    this.setupEventListeners();
    if (this.isPlaying) {
      this.startAutoplay();
    }
  }

  setupControls() {
    // Setup navigasi prev/next
    const prevBtn = this.carousel.querySelector('.nx-carousel-prev');
    const nextBtn = this.carousel.querySelector('.nx-carousel-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // Setup indikator
    const indicators = this.carousel.querySelectorAll('.nx-carousel-indicators button');
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Setup tombol play/pause
    const playToggle = this.carousel.querySelector('.nx-carousel-play-toggle');
    if (playToggle) {
      playToggle.addEventListener('click', () => this.togglePlay());
    }
  }

  setupEventListeners() {
    // Pause on hover
    if (this.carousel.classList.contains('nx-carousel-pause-hover')) {
      this.carousel.addEventListener('mouseenter', () => this.pause());
      this.carousel.addEventListener('mouseleave', () => this.play());
    }

    // Touch events untuk mobile
    if (this.carousel.classList.contains('nx-carousel-mobile')) {
      this.carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), {passive: true});
      this.carousel.addEventListener('touchmove', (e) => this.handleTouchMove(e), {passive: true});
      this.carousel.addEventListener('touchend', () => this.handleTouchEnd());
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  next() {
    this.goToSlide((this.currentIndex + 1) % this.totalItems);
  }

  prev() {
    this.goToSlide(this.currentIndex === 0 ? this.totalItems - 1 : this.currentIndex - 1);
  }

  goToSlide(index) {
    // Hapus kelas active dari slide saat ini
    const currentSlide = this.items[this.currentIndex];
    const nextSlide = this.items[index];
    
    // Tambahkan kelas untuk animasi fade out pada slide saat ini
    currentSlide.classList.remove('active');
    currentSlide.classList.add('fade-out');
    
    // Siapkan slide berikutnya
    nextSlide.classList.add('preparing');
    
    // Tunggu animasi fade out selesai
    setTimeout(() => {
      // Hapus kelas fade-out dari slide sebelumnya
      currentSlide.classList.remove('fade-out');
      
      // Aktifkan slide baru dengan animasi fade in
      nextSlide.classList.remove('preparing');
      nextSlide.classList.add('active', 'fade-in');
      
      // Update indikator
      const indicators = this.carousel.querySelectorAll('.nx-carousel-indicators button');
      if (indicators.length) {
        indicators[this.currentIndex].classList.remove('active');
        indicators[index].classList.add('active');
      }

      // Update index
      this.currentIndex = index;
      
      // Hapus kelas fade-in setelah animasi selesai
      setTimeout(() => {
        nextSlide.classList.remove('fade-in');
      }, this.transitionDuration);

      // Reset progress bar
      this.resetProgressBar();
    }, this.transitionDuration / 2);
  }

  startAutoplay() {
    if (this.interval) clearInterval(this.interval);
    setTimeout(() => {
      this.interval = setInterval(() => this.next(), this.autoplayDuration);
      this.updateProgressBar();
    }, 1000);
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startAutoplay();
      this.updatePlayToggleButton();
    }
  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      clearInterval(this.interval);
      this.pauseProgressBar();
      this.updatePlayToggleButton();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.pause();
  }

  handleTouchMove(e) {
    if (!this.touchStartX) return;
    this.touchEndX = e.touches[0].clientX;
  }

  handleTouchEnd() {
    if (!this.touchStartX || !this.touchEndX) return;

    const diff = this.touchStartX - this.touchEndX;
    const threshold = this.carousel.offsetWidth * 0.2;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
    this.play();
  }

  handleKeyboard(e) {
    if (document.activeElement === this.carousel || this.carousel.contains(document.activeElement)) {
      switch(e.key) {
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
        case ' ':
          this.togglePlay();
          e.preventDefault();
          break;
      }
    }
  }

  updateProgressBar() {
    const progressBar = this.carousel.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.transition = `width ${this.autoplayDuration - this.transitionDuration}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  resetProgressBar() {
    const progressBar = this.carousel.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0';
      progressBar.offsetHeight; // Force reflow
      this.updateProgressBar();
    }
  }

  pauseProgressBar() {
    const progressBar = this.carousel.querySelector('.progress-bar');
    if (progressBar) {
      const width = progressBar.offsetWidth;
      progressBar.style.transition = 'none';
      progressBar.style.width = `${width}px`;
    }
  }

  updatePlayToggleButton() {
    const playToggle = this.carousel.querySelector('.nx-carousel-play-toggle');
    if (playToggle) {
      const pauseIcon = playToggle.querySelector('.pause-icon');
      const playIcon = playToggle.querySelector('.play-icon');
      
      if (this.isPlaying) {
        pauseIcon.style.display = '';
        playIcon.style.display = 'none';
      } else {
        pauseIcon.style.display = 'none';
        playIcon.style.display = '';
      }
    }
  }
}

export function initCarousels() {
  const carousels = document.querySelectorAll('.nx-carousel');
  carousels.forEach(carousel => {
    new Carousel(carousel);
  });
}
/**
 * ==============================
 * Class: Button Groups
 * ==============================
 */
export function buttonGroups() {
  const dropToggles = document.querySelectorAll('.nx-dropdown-toggle');
  
  // Fungsi untuk menutup semua dropdown
  function closeAllDropdowns() {
    document.querySelectorAll('.nx-dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
    document.querySelectorAll('.nx-dropdown-toggle').forEach(btn => {
      btn.classList.remove('active');
    });
  }

  // Event listener untuk setiap tombol dropdown
  dropToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.nx-dropdown');
      const menu = dropdown.querySelector('.nx-dropdown-menu');
      
      // Toggle active state
      const isActive = this.classList.contains('active');
      
      // Close all dropdowns first
      closeAllDropdowns();
      
      // If wasn't active, open this dropdown
      if (!isActive) {
        this.classList.add('active');
        menu.classList.add('show');
        
        // Adjust position if needed
        const rect = dropdown.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Check if menu goes beyond right edge
        if (rect.left + menuRect.width > viewportWidth) {
          menu.style.left = 'auto';
          menu.style.right = '0';
        } else {
          menu.style.left = '0';
          menu.style.right = 'auto';
        }
      }
    });
  });

  // Tutup dropdown saat mengklik di luar
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nx-dropdown')) {
      closeAllDropdowns();
    }
  });

  // Tutup dropdown saat menekan tombol Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}

// Export fungsi closeAllDropdowns jika diperlukan di file lain
export function closeAllDropdowns() {
  document.querySelectorAll('.nx-dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
  document.querySelectorAll('.nx-dropdown-toggle').forEach(btn => {
    btn.classList.remove('active');
  });
}

/**
 * ==============================
 * Class: Alerts
 * ==============================
 */
export function Alerts() {
  const timerAlerts = document.querySelectorAll('.nx-alert-timer');
  
  timerAlerts.forEach(alert => {
    const duration = parseInt(alert.dataset.duration) || 5000;
    const timerBar = alert.querySelector('.nx-timer-bar');
    
    if (timerBar) {
      timerBar.style.animationDuration = `${duration}ms`;
    }
    
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, duration);
  });
}
/**
 * ==============================
 * Class: Accordion
 * ==============================
 */
export  function Accordion() {
  const accordionHeaders = document.querySelectorAll('.nx-accordion-header');
  accordionHeaders.forEach(header => {
    if (header.closest('.nx-accordion-item.disabled')) return;
    
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const parentAccordion = this.closest('.nx-accordion');
      const isMultiple = parentAccordion.classList.contains('multiple');
      const isActive = content.classList.contains('active');
      const isAnimated = parentAccordion.classList.contains('animated');
      
      // Handle multiple accordion
      if (!isMultiple) {
        // Tutup semua accordion content dalam grup yang sama
        parentAccordion.querySelectorAll('.nx-accordion-content').forEach(item => {
          if (item !== content) {
            item.classList.remove('active');
            if (isAnimated) {
              item.style.maxHeight = '0px';
            }
          }
        });
        
        // Reset semua icon dalam grup
        parentAccordion.querySelectorAll('.nx-accordion-header .icon, .nx-accordion-header .custom-icon').forEach(icon => {
          if (icon.closest('.nx-accordion-header') !== this) {
            icon.style.transform = 'rotate(0deg)';
            icon.classList.remove('active');
          }
        });
      }
      
      // Toggle active class pada content yang diklik
      content.classList.toggle('active');
      
      // Handle animasi
      if (isAnimated) {
        if (content.classList.contains('active')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0px';
        }
      }
      
      // Handle icon rotation
      const icon = this.querySelector('.icon, .custom-icon');
      if (icon) {
        if (content.classList.contains('active')) {
          icon.style.transform = 'rotate(180deg)';
          icon.classList.add('active');
        } else {
          icon.style.transform = 'rotate(0deg)';
          icon.classList.remove('active');
        }
      }
      
      // Handle nested accordion - recalculate parent height jika animated
      if (isAnimated) {
        const parentContent = this.closest('.nx-accordion-content');
        if (parentContent && parentContent.classList.contains('active')) {
          parentContent.style.maxHeight = parentContent.scrollHeight + 'px';
        }
      }
    });
  });
  
  // Handle animated accordion pada load
  document.querySelectorAll('.nx-accordion.animated .nx-accordion-content').forEach(content => {
    if (content.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      content.style.maxHeight = '0px';
    }
  });
}
 // Fungsi untuk mengelola cookie di browser
export function cookies(element) {
  // Fungsi untuk mengatur cookie
  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  // Fungsi untuk mendapatkan nilai cookie (dengan decode)
  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        // Tambahkan decodeURIComponent untuk decode nilai cookie
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  };

  // Fungsi untuk menghapus cookie
  const deleteCookie = (name) => {
    document.cookie = name + "=; Max-Age=-99999999;";
  };

  return {
    set: setCookie,
    get: getCookie,
    delete: deleteCookie,
  };
}

const cookieManager = cookies();
let HOSTSOKET; // Deklarasi di luar blok
const HOSTW = window.location.host.split('.')[0];
if (HOSTW === '192') {
    HOSTSOKET = window.location.host;
} else {
    HOSTSOKET = '127.0.0.1';
}
// Membuat koneksi WebSocket
const WS_HOST =HOSTSOKET;
const WS_PORT =8080;
export const createWebSocketConnection = () => {
  return new WebSocket(`ws://${WS_HOST}:${WS_PORT}`);
};



const app = {
  app: "Ngorei",
  version: "v1.0.4",
  copyright: "2013-2024",
  vid: cookieManager.get("VID"),
  url: window.location.origin,
};
export default app;
//Komponen Network
export class classIndexDB {
  constructor(dbName = "Database", dbVersion = 1, storeName = "Data") {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
  }

  openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) =>
        reject("Error membuka database: " + event.target.error);

      request.onsuccess = (event) => resolve(event.target.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore(this.storeName, {
          keyPath: "key",
        });
        objectStore.createIndex("updated_at", "updated_at", { unique: false });
      };
    });
  }

  async saveData(key, data, updated_at) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(key);

      getRequest.onsuccess = (event) => {
        const existingData = event.target.result;
        if (existingData && existingData.updated_at >= updated_at) {
          resolve("Data sudah yang terbaru");
        } else {
          const updateRequest = store.put({
            key: key,
            data: data,
            updated_at: updated_at,
          });
          updateRequest.onsuccess = () =>
            resolve("Data berhasil disimpan/diperbarui");
          updateRequest.onerror = (event) =>
            reject("Error menyimpan/memperbarui data: " + event.target.error);
        }
      };

      getRequest.onerror = (event) =>
        reject("Error memeriksa data: " + event.target.error);
    });
  }

  async getData(key) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) =>
        reject("Error mengambil data: " + event.target.error);
    });
  }

  async deleteData(key) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve("Data berhasil dihapus");
      request.onerror = (event) =>
        reject("Error menghapus data: " + event.target.error);
    });
  }
  async getAllData() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) =>
        reject("Error mengambil semua data: " + event.target.error);
    });
  }

  async updateData(key, newData) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(key);

      getRequest.onsuccess = (event) => {
        const existingData = event.target.result;
        if (!existingData) {
          reject("Data tidak ditemukan");
          return;
        }

        const updatedObject = {
          key: key,
          data: { ...existingData.data, ...newData },
          updated_at: Date.now()
        };

        const updateRequest = store.put(updatedObject);
        updateRequest.onsuccess = () => resolve("Data berhasil diupdate");
        updateRequest.onerror = (event) => 
          reject("Error mengupdate data: " + event.target.error);
      };

      getRequest.onerror = (event) =>
        reject("Error memeriksa data: " + event.target.error);
    });
  }

  async getLatestData() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("updated_at");
      const request = index.openCursor(null, "prev");

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          resolve(cursor.value);
        } else {
          resolve(null);
        }
      };
      request.onerror = (event) =>
        reject("Error mengambil data terbaru: " + event.target.error);
    });
  }
}

export class classLocalStorage {
  constructor(prefix = "") {
    this.prefix = prefix;
  }

  saveData(key, data, updated_at) {
    return new Promise((resolve) => {
      const fullKey = this.prefix + key;
      const existingData = localStorage.getItem(fullKey);
      
      if (existingData) {
        const parsed = JSON.parse(existingData);
        if (parsed.updated_at >= updated_at) {
          resolve("Data sudah yang terbaru");
          return;
        }
      }

      const saveObject = {
        key: key,
        data: data,
        updated_at: updated_at
      };
      
      localStorage.setItem(fullKey, JSON.stringify(saveObject));
      resolve("Data berhasil disimpan/diperbarui");
    });
  }

  getData(key) {
    return new Promise((resolve) => {
      const data = localStorage.getItem(this.prefix + key);
      resolve(data ? JSON.parse(data) : null);
    });
  }

  deleteData(key) {
    return new Promise((resolve) => {
      localStorage.removeItem(this.prefix + key);
      resolve("Data berhasil dihapus");
    });
  }

  getAllData() {
    return new Promise((resolve) => {
      const allData = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.prefix)) {
          const data = JSON.parse(localStorage.getItem(key));
          allData.push(data);
        }
      }
      resolve(allData);
    });
  }

  updateData(key, newData) {
    return new Promise((resolve, reject) => {
      const fullKey = this.prefix + key;
      const existingData = localStorage.getItem(fullKey);
      
      if (!existingData) {
        reject("Data tidak ditemukan");
        return;
      }

      const parsed = JSON.parse(existingData);
      const updatedObject = {
        key: key,
        data: { ...parsed.data, ...newData },
        updated_at: Date.now()
      };

      localStorage.setItem(fullKey, JSON.stringify(updatedObject));
      resolve("Data berhasil diupdate");
    });
  }

  async getLatestData() {
    return new Promise((resolve) => {
      let latestData = null;
      let latestTimestamp = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.prefix)) {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.updated_at > latestTimestamp) {
            latestTimestamp = data.updated_at;
            latestData = data;
          }
        }
      }
      resolve(latestData);
    });
  }
}

export class classCookies {
  constructor(prefix = "app_") {
    this.prefix = prefix;
  }

  saveData(key, data, updated_at, options = {}) {
    return new Promise((resolve) => {
      const fullKey = this.prefix + key;
      const existingData = this.getCookie(fullKey);
      
      if (existingData) {
        const parsed = JSON.parse(existingData);
        if (parsed.updated_at >= updated_at) {
          resolve("Data sudah yang terbaru");
          return;
        }
      }

      const saveObject = {
        key: key,
        data: data,
        updated_at: updated_at
      };
      
      // Default options
      const defaultOptions = {
        expires: 365, // hari
        path: '/',
        secure: false,
        sameSite: 'Lax'
      };

      const cookieOptions = { ...defaultOptions, ...options };
      
      // Set expires
      let expires = '';
      if (cookieOptions.expires) {
        const date = new Date();
        date.setTime(date.getTime() + (cookieOptions.expires * 24 * 60 * 60 * 1000));
        expires = `expires=${date.toUTCString()};`;
      }

      // Build cookie string
      let cookieString = `${fullKey}=${encodeURIComponent(JSON.stringify(saveObject))};${expires}`;
      cookieString += `path=${cookieOptions.path};`;
      
      if (cookieOptions.secure) cookieString += 'secure;';
      if (cookieOptions.sameSite) cookieString += `sameSite=${cookieOptions.sameSite};`;

      document.cookie = cookieString;
      resolve("Data berhasil disimpan/diperbarui");
    });
  }

  getCookie(key) {
    const name = this.prefix + key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return null;
  }

  getData(key) {
    return new Promise((resolve) => {
      const data = this.getCookie(key);
      resolve(data ? JSON.parse(data) : null);
    });
  }

  deleteData(key, options = {}) {
    return new Promise((resolve) => {
      const fullKey = this.prefix + key;
      const defaultOptions = {
        path: '/',
        secure: false,
        sameSite: 'Lax'
      };
      
      const cookieOptions = { ...defaultOptions, ...options };
      
      // Set expired date to past
      document.cookie = `${fullKey}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${cookieOptions.path}`;
      resolve("Data berhasil dihapus");
    });
  }

  getAllData() {
    return new Promise((resolve) => {
      const allData = [];
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(';');
      
      for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(this.prefix) === 0) {
          const equalPos = cookie.indexOf('=');
          const value = cookie.substring(equalPos + 1);
          try {
            const data = JSON.parse(value);
            allData.push(data);
          } catch (e) {
            console.error('Error parsing cookie:', e);
          }
        }
      }
      resolve(allData);
    });
  }

  updateData(key, newData, options = {}) {
    return new Promise(async (resolve, reject) => {
      const existingData = await this.getData(key);
      
      if (!existingData) {
        reject("Data tidak ditemukan");
        return;
      }

      const updatedObject = {
        key: key,
        data: { ...existingData.data, ...newData },
        updated_at: Date.now()
      };

      await this.saveData(key, updatedObject.data, updatedObject.updated_at, options);
      resolve("Data berhasil diupdate");
    });
  }

  async getLatestData() {
    return new Promise((resolve) => {
      let latestData = null;
      let latestTimestamp = 0;
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(';');
      
      for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(this.prefix) === 0) {
          const equalPos = cookie.indexOf('=');
          const value = cookie.substring(equalPos + 1);
          try {
            const data = JSON.parse(value);
            if (data.updated_at > latestTimestamp) {
              latestTimestamp = data.updated_at;
              latestData = data;
            }
          } catch (e) {
            console.error('Error parsing cookie:', e);
          }
        }
      }
      resolve(latestData);
    });
  }
}

export class classSessionStorage {
  constructor(prefix = "app_") {
    this.prefix = prefix;
  }

  saveData(key, data, updated_at) {
    return new Promise((resolve) => {
      const fullKey = this.prefix + key;
      const existingData = sessionStorage.getItem(fullKey);
      
      if (existingData) {
        const parsed = JSON.parse(existingData);
        if (parsed.updated_at >= updated_at) {
          resolve("Data sudah yang terbaru");
          return;
        }
      }

      const saveObject = {
        key: key,
        data: data,
        updated_at: updated_at
      };
      
      sessionStorage.setItem(fullKey, JSON.stringify(saveObject));
      resolve("Data berhasil disimpan/diperbarui");
    });
  }

  getData(key) {
    return new Promise((resolve) => {
      const data = sessionStorage.getItem(this.prefix + key);
      resolve(data ? JSON.parse(data) : null);
    });
  }

  deleteData(key) {
    return new Promise((resolve) => {
      sessionStorage.removeItem(this.prefix + key);
      resolve("Data berhasil dihapus");
    });
  }

  getAllData() {
    return new Promise((resolve) => {
      const allData = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith(this.prefix)) {
          const data = JSON.parse(sessionStorage.getItem(key));
          allData.push(data);
        }
      }
      resolve(allData);
    });
  }

  updateData(key, newData) {
    return new Promise((resolve, reject) => {
      const fullKey = this.prefix + key;
      const existingData = sessionStorage.getItem(fullKey);
      
      if (!existingData) {
        reject("Data tidak ditemukan");
        return;
      }

      const parsed = JSON.parse(existingData);
      const updatedObject = {
        key: key,
        data: { ...parsed.data, ...newData },
        updated_at: Date.now()
      };

      sessionStorage.setItem(fullKey, JSON.stringify(updatedObject));
      resolve("Data berhasil diupdate");
    });
  }

  async getLatestData() {
    return new Promise((resolve) => {
      let latestData = null;
      let latestTimestamp = 0;
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith(this.prefix)) {
          const data = JSON.parse(sessionStorage.getItem(key));
          if (data.updated_at > latestTimestamp) {
            latestTimestamp = data.updated_at;
            latestData = data;
          }
        }
      }
      resolve(latestData);
    });
  }
}


/**
 * @class Ngorei
 * @description Kelas utama untuk manajemen komponen dan DOM
 */
export  class NgoreiDOM {
  constructor() {
    this.DOM = new TDSDOM();

    this.Components = function() {
      return {

      };
    };
  }
}

/**
 * @class View
 * @description Kelas untuk menangani view dan template
 */
class View {
  constructor(row) {
    if (!row || typeof row !== "object") {
      throw new Error("Parameter row harus berupa object");
    }

    this.data = row;
    const self = this;
    const firstKey = Object.keys(row.data)[0];
    const sID = "[@" + firstKey + "]";
    const eID = "[/" + firstKey + "]";
    const rowID = firstKey;

    // Inisialisasi TDSDOM
    const domManager = new TDSDOM();

    // Implementasi deep copy yang aman
    function deepCopy(obj) {
      if (obj === null || typeof obj !== 'object') return obj;
      
      const copy = Array.isArray(obj) ? [] : {};
      
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copy[key] = deepCopy(obj[key]);
        }
      }
      
      return copy;
    }

    // Validasi dan sanitasi data
    function validateAndSanitizeData(data) {
      if (!data || typeof data !== 'object') {
        throw new Error('Data tidak valid');
      }
      // Tambahkan validasi lain sesuai kebutuhan
      return data;
    }

    // Fungsi untuk mengurutkan data
    function sortData(data, order = 'ASC', sortBy = 'id') {
      if (!Array.isArray(data)) return data;
      
      return [...data].sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        
        if (order === 'ASC') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    const originalData = validateAndSanitizeData(row.data);
    // Tambahkan pengurutan data
    const sortedData = sortData(originalData[rowID], row.sortOrder || 'ASC', row.sortBy || 'id');
    originalData[rowID] = sortedData;
    const data = deepCopy(originalData);
    const pageLimit = row.order || 10;

    // Validasi element
    const oldElement = document.getElementById(row.elementById);
    if (!oldElement) {
      throw new Error(`Element dengan ID ${row.elementById} tidak ditemukan`);
    }

    // Buat template element
    const templateElement = createTemplateElement(
      firstKey,
      row.elementById,
      oldElement
    );
    const contentElement = createContentElement(
      row.elementById,
      oldElement.className
    );

    // Setup template
    const template = sID + templateElement.innerHTML + eID;

    // Cache DOM elements dan event listeners untuk cleanup
    const domElements = {
      template: templateElement,
      content: contentElement,
      searchInput: row.search ? document.getElementById(row.search) : null,
    };

    /**
     * Membuat element template
     */
    function createTemplateElement(firstKey, elementById, oldElement) {
      const template = document.createElement("script");
      template.type = "text/template";
      template.id = firstKey + "_" + elementById;
      template.innerHTML = oldElement.innerHTML;
      oldElement.parentNode.replaceChild(template, oldElement);
      return template;
    }

    /**
     * Membuat element konten
     */
    function createContentElement(elementById, className) {
      const content = document.createElement("div");
      content.id = elementById + "_content";
      if (className) content.className = className;
      templateElement.parentNode.insertBefore(
        content,
        templateElement.nextSibling
      );
      return content;
    }

    /**
     * @param {number} page - Nomor halaman
     * @returns {Object} Data untuk halaman tertentu
     */
    function curPage(page = 1) {
      const startIndex = (page - 1) * pageLimit;
      const currentData = data[rowID];
      //console.log('Current data:', currentData);
      const slicedData = currentData.slice(startIndex, startIndex + pageLimit);
      //console.log('Sliced data:', slicedData);
      return { [rowID]: slicedData };
    }

    /**
     * @param {string} str - String yang akan dikonversi menjadi slug
     * @returns {string} Slug yang dihasilkan
     */
    function createSlug(str) {
      return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    /**
     * Memproses data dengan menambahkan slug
     */
    function processDataWithSlug(data) {
      return data.map((item) => ({
        ...item,
        slug: item.href ? createSlug(item.href) : null,
      }));
    }

    // Inisialisasi data dengan slug
    if (data[rowID]) {
      data[rowID] = processDataWithSlug(data[rowID]);
    }

    // Pindahkan deklarasi currentPage dan totalPages ke atas sebelum digunakan
    let currentPage = 1;
    const totalPages = Math.ceil(data[rowID].length / pageLimit);

    // Cache untuk template yang sudah dirender
    const templateCache = new Map();

    // Cache untuk fragment DOM
    const fragmentCache = new Map();

    /**
     * Optimasi render dengan caching
     */
    function optimizedRender(data, templateId) {
      const cacheKey = JSON.stringify(data) + templateId;

      // Cek cache
      if (templateCache.has(cacheKey)) {
        return templateCache.get(cacheKey);
      }

      // Render template menggunakan TDSDOM
      const rendered = domManager.render(template, data, templateElement);

      // Simpan ke cache dengan batasan ukuran
      if (templateCache.size > 100) {
        const firstKey = templateCache.keys().next().value;
        templateCache.delete(firstKey);
      }
      templateCache.set(cacheKey, rendered);

      return rendered;
    }

    /**
     * Fragment caching untuk performa
     */
    function createCachedFragment(items, templateId) {
      const cacheKey = templateId + items.length;

      if (fragmentCache.has(cacheKey)) {
        return fragmentCache.get(cacheKey).cloneNode(true);
      }

      const fragment = document.createDocumentFragment();
      items.forEach((item) => {
        const rendered = optimizedRender({ [rowID]: [item] }, templateId);
        const div = document.createElement("div");
        div.innerHTML = rendered;
        fragment.appendChild(div.firstChild);
      });

      fragmentCache.set(cacheKey, fragment.cloneNode(true));
      return fragment;
    }

    /**
     * @param {Object} pageData - Data yang akan dirender
     */
    function renderData(pageData) {
      requestAnimationFrame(() => {
        // Cache DOM queries
        const content = contentElement;
        if (!content) {
          console.error("Content element tidak ditemukan");
          return;
        }

        // Validasi data
        if (!pageData || !pageData[rowID]) {
          console.error("Data tidak valid:", pageData);
          return;
        }

        try {
          // Clear content terlebih dahulu
          content.innerHTML = "";

          const batchSize = 50;
          let currentBatch = 0;

          function processBatch() {
            const batchData = {
              [rowID]: pageData[rowID].slice(
                currentBatch,
                currentBatch + batchSize
              ),
            };

            // Proses data dengan slug
            if (batchData[rowID]) {
              batchData[rowID] = processDataWithSlug(batchData[rowID]);
            }

            // Gunakan cache untuk optimasi
            const cacheKey = JSON.stringify(batchData) + rowID;
            let rendered;

            if (templateCache.has(cacheKey)) {
              rendered = templateCache.get(cacheKey);
            } else {
              // Menggunakan instance TDSDOM untuk render
              rendered = domManager.render(template, batchData, templateElement);
              templateCache.set(cacheKey, rendered);
            }

            // Buat fragment untuk performa lebih baik
            const fragment = domManager.parse(rendered);

            // Append fragment ke content
            content.appendChild(fragment);

            currentBatch += batchSize;

            // Proses batch selanjutnya jika masih ada
            if (currentBatch < pageData[rowID].length) {
              requestAnimationFrame(processBatch);
            } else {
              // Update pagination setelah selesai
              requestAnimationFrame(updatePaginationUI);
            }
          }

          // Mulai proses batch pertama
          processBatch();
        } catch (error) {
          console.error("Error saat render data:", error);
          // Fallback ke render biasa jika terjadi error
          const rendered = domManager.render(template, pageData, templateElement);
          content.innerHTML = rendered;
        }
      });
    }

    // Tambahkan fungsi untuk virtual scrolling jika diperlukan
    function setupVirtualScroll() {
      if (!row.virtualScroll) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load more data when reaching bottom
            if (currentPage < totalPages) {
              currentPage++;
              renderData(curPage(currentPage));
            }
          }
        });
      });

      // Observe last item
      const lastItem = contentElement.lastElementChild;
      if (lastItem) {
        observer.observe(lastItem);
      }

      // Cleanup
      return () => observer.disconnect();
    }

    // Cache DOM queries dan kalkulasi yang sering digunakan
    const cachedData = {
      totalPages: Math.ceil(data[rowID].length / pageLimit),
      searchDebounceTimer: null,
      // Cache DOM elements yang sering digunakan
      paginationElement:
        row.hasOwnProperty("pagination") && row.pagination !== false
          ? document.getElementById(row.pagination)
          : null,
      searchInput:
        row.hasOwnProperty("search") && row.search !== false
          ? document.getElementById(row.search)
          : null,
      // Tambahkan filter select
      filterSelect:
        row.hasOwnProperty("filter") && row.filter !== false
          ? document.getElementById(row.filter)
          : null,
    };

    /**
     * Fungsi debounce untuk search dengan cleanup
     */
    function debounceSearch(fn, delay = 300) {
      let timer = null;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          fn.apply(this, args);
        }, delay);
      };
    }

    // Tambahkan fungsi untuk membuat indeks pencarian
    function createSearchIndex(data, searchableFields) {
      const searchIndex = new Map();

      data.forEach((item, index) => {
        let searchText = searchableFields
          .map((field) => {
            return item[field] ? String(item[field]).toLowerCase() : "";
          })
          .join(" ");

        searchIndex.set(index, searchText);
      });

      return searchIndex;
    }

    // Modifikasi memoizedFilter
    const memoizedFilter = (function () {
      const cache = new Map();
      let searchIndex = null;

      return function (keyword, data, searchableFields) {
        const cacheKey = keyword.trim().toLowerCase();
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        // Buat indeks jika belum ada
        if (!searchIndex) {
          searchIndex = createSearchIndex(data, searchableFields);
        }

        const filtered = data.filter((item, index) => {
          const indexedText = searchIndex.get(index);
          return indexedText.includes(cacheKey);
        });

        cache.set(cacheKey, filtered);
        if (cache.size > 100) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        return filtered;
      };
    })();

    function debounceAndThrottle(fn, delay = 300, throttleDelay = 100) {
      let debounceTimer;
      let throttleTimer;
      let lastRun = 0;

      return function (...args) {
        // Clear existing debounce timer
        if (debounceTimer) clearTimeout(debounceTimer);

        // Throttle check
        const now = Date.now();
        if (now - lastRun >= throttleDelay) {
          fn.apply(this, args);
          lastRun = now;
        } else {
          // Debounce
          debounceTimer = setTimeout(() => {
            fn.apply(this, args);
            lastRun = Date.now();
          }, delay);
        }
      };
    }

    // Deklarasikan worker di level yang tepat
    let worker = null;
    /**
     * Inisialisasi Web Worker
     */
    function initializeWorker() {
      try {
        // Inisialisasi Web Worker dengan path absolut
        const workerPath = new URL(
          app.url + "/js/Worker.js",
          window.location.origin
        ).href;
        //console.log('Worker path:', workerPath);

        worker = new Worker(workerPath);
        //console.log('Worker created successfully');

        // Setup worker message handler
        worker.onmessage = function (e) {
          const { action, result } = e.data;
          //console.log('Worker response:', { action, resultLength: result?.length });

          switch (action) {
            case "filterComplete":
              //console.log('Filter complete:', result);
              data[rowID] = result;
              currentPage = 1;
              renderData(curPage(1));
              break;

            case "searchComplete":
              //console.log('Search complete:', result);
              data[rowID] = result;
              currentPage = 1;
              renderData(curPage(1));
              updatePaginationUI();
              break;

            case "error":
              console.error("Worker error:", result);
              break;
          }
        };

        // Setup error handler
        worker.onerror = function (error) {
          console.error("Worker error:", error);
          worker = null; // Reset worker on error
        };
      } catch (error) {
        //console.error('Failed to create worker:', error);
        worker = null; // Fallback untuk browser yang tidak mendukung Worker
      }
    }

    // Modifikasi fungsi yang menggunakan worker untuk handle fallback
    function handleSearch(keyword, searchFields) {
      if (worker) {
        // Gunakan worker jika tersedia
        worker.postMessage({
          action: "search",
          data: {
            items: originalData[rowID],
            query: keyword,
            searchFields: searchFields,
          },
        });
      } else {
        // Fallback ke proses synchronous
        const searched = searchData(originalData[rowID], keyword, searchFields);
        handleSearchComplete(searched);
      }
    }

    function handleFilter(value, fields) {
      if (worker) {
        // Gunakan worker jika tersedia
        worker.postMessage({
          action: "filter",
          data: {
            items: originalData[rowID],
            keyword: value,
            fields: fields,
          },
        });
      } else {
        // Fallback ke proses synchronous
        const filtered = filterData(originalData[rowID], value, fields);
        handleFilterComplete(filtered);
      }
    }

    // Modifikasi setupSearch
    function setupSearch() {
      if (!row.hasOwnProperty("search") || !row.search) return;

      const searchInput = document.getElementById(row.search);
      if (!searchInput) return;

      const searchHandler = debounceAndThrottle(
        function (event) {
          const keyword = event.target.value.trim();

          if (keyword.length < 2) {
            data[rowID] = [...originalData[rowID]];
            renderData(curPage(1));
            return;
          }

          handleSearch(
            keyword,
            row.searchableFields || Object.keys(originalData[rowID][0] || {})
          );
        },
        300,
        100
      );

      searchInput.addEventListener("input", searchHandler);
    }

    // Modifikasi setupFilter
    function setupFilter() {
      if (!row.hasOwnProperty("filter")) return;

      const filterSelect = document.getElementById(row.filter);
      if (!filterSelect) return;

      filterSelect.addEventListener("change", function (event) {
        const value = event.target.value;

        if (value === "all") {
          data[rowID] = [...originalData[rowID]];
          renderData(curPage(1));
          return;
        }

        handleFilter(value, [row.filterBy]);
      });
    }

    // Modifikasi destroy untuk cleanup worker
    this.destroy = function () {
      if (worker) {
        worker.terminate();
        worker = null;
      }
      // ... cleanup lainnya
    };

    // Inisialisasi _activeFilters di awal
    this._activeFilters = {};

    /**
     * Setup filter select untuk multiple filter
     */
    const setupFilterSelect = () => {
      if (!row.hasOwnProperty("filterBy")) {
        return false;
      }

      // Support untuk multiple filter
      const filterBy = Array.isArray(row.filterBy)
        ? row.filterBy
        : [row.filterBy];

      // Gunakan this langsung karena arrow function
      const handleFilter = (event) => {
        const selectedValue = event.target.value;
        const filterType = event.target.getAttribute("data-filter-type");

        // Reset ke halaman pertama saat filter berubah
        currentPage = 1;

        // Update nilai filter aktif
        if (selectedValue === "all") {
          delete this._activeFilters[filterType];
        } else {
          this._activeFilters[filterType] = selectedValue;
        }

        requestAnimationFrame(() => {
          // Reset data terlebih dahulu
          data[rowID] = [...originalData[rowID]];

          // Filter data berdasarkan semua filter yang aktif
          if (Object.keys(this._activeFilters).length > 0) {
            data[rowID] = data[rowID].filter((item) => {
              return Object.entries(this._activeFilters).every(
                ([filterType, filterValue]) => {
                  if (!item.hasOwnProperty(filterType)) {
                    console.warn(
                      `Properti "${filterType}" tidak ditemukan pada item:`,
                      item
                    );
                    return false;
                  }
                  return String(item[filterType]) === String(filterValue);
                }
              );
            });
          }

          // Update total pages berdasarkan data yang sudah difilter
          const totalItems = data[rowID].length;
          cachedData.totalPages = Math.ceil(totalItems / pageLimit);

          // Pastikan current page valid
          if (currentPage > cachedData.totalPages) {
            currentPage = cachedData.totalPages || 1;
          }

          // Batch DOM updates
          const updates = () => {
            // Render data halaman pertama
            renderData(curPage(currentPage));

            // Update tampilan pagination
            if (cachedData.paginationElement) {
              updatePaginationUI();
            }
          };

          requestAnimationFrame(updates);
        });
      };

      // Setup event listeners untuk setiap filter select
      filterBy.forEach((filterType) => {
        const selectElement = document.getElementById(filterType);
        if (selectElement) {
          selectElement.setAttribute("data-filter-type", filterType);

          // Cleanup dan setup event listener
          selectElement.removeEventListener("change", handleFilter);
          selectElement.addEventListener("change", handleFilter);

          if (!cachedData.filterElements) {
            cachedData.filterElements = [];
          }
          cachedData.filterElements.push({
            element: selectElement,
            handler: handleFilter,
            type: filterType,
          });
        } else {
          console.warn(
            `Element filter dengan ID "${filterType}" tidak ditemukan`
          );
        }
      });

      return true;
    };

    // Setup fitur-fitur dasar
    setupSearch();
    setupFilter();
    setupLazyLoading();

    // Inisialisasi Web Worker
    initializeWorker();

    // Panggil setupFilterSelect setelah didefinisikan
    setupFilterSelect();

    // Initial render
    renderData(curPage(1));

    /**
     * Cleanup method yang lebih komprehensif
     */
    this.destroy = function () {
      if (cachedData.searchInput) {
        cachedData.searchInput.removeEventListener("input", handleSearch);
      }

      // Cleanup untuk filter
      if (cachedData.filterElements) {
        cachedData.filterElements.forEach(({ element, handler }) => {
          element.removeEventListener("change", handler);
        });
      }

      if (cachedData.searchDebounceTimer) {
        clearTimeout(cachedData.searchDebounceTimer);
      }

      // Clear memoization cache
      memoizedFilter.cache = new Map();

      // Cleanup DOM elements
      domElements.content?.remove();
      domElements.template?.remove();

      // Clear cached data
      Object.keys(cachedData).forEach((key) => {
        cachedData[key] = null;
      });
    };

    /**
     * @param {Function} callback - Callback untuk memproses element
     */
    View.prototype.Element = function (callback) {
      if (typeof callback !== "function") {
        throw new Error("Parameter callback harus berupa function");
      }
      const filteredData = [...this.data.data[Object.keys(this.data.data)[0]]];
      callback(filteredData);
    };

    /**
     * Membuat element pagination jika belum ada
     */
    function createPaginationElement() {
      // Cek apakah pagination didefinisikan dan tidak false
      if (!row.hasOwnProperty("pagination") || row.pagination === false) {
        return null;
      }

      const paginationID = row.pagination;

      // Cek apakah element dengan ID yang sesuai ada di HTML
      let paginationElement = document.getElementById(paginationID);

      if (!paginationID || !paginationElement) {
        console.warn("Element pagination tidak ditemukan atau ID tidak sesuai");
        return null;
      }

      // Pastikan element memiliki class pagination
      if (!paginationElement.classList.contains("pagination")) {
        paginationElement.classList.add("pagination");
      }

      return paginationElement;
    }

    /**
     * Membuat dan memperbarui UI pagination
     */
    function updatePaginationUI() {
      // Cek apakah pagination didefinisikan dan tidak false
      if (!row.hasOwnProperty("pagination") || row.pagination === false) {
        return false;
      }

      const paginationList = createPaginationElement();
      if (!paginationList) return false;

      // Reset pagination content
      paginationList.innerHTML = "";

      // Hitung ulang total pages berdasarkan data yang sudah difilter
      const filteredData = getFilteredData();
      const totalItems = filteredData.length;
      const currentTotalPages = Math.ceil(totalItems / pageLimit);

      // Validasi current page
      if (currentPage > currentTotalPages) {
        currentPage = currentTotalPages || 1;
      }

      // Jika tidak ada data atau hanya 1 halaman, sembunyikan pagination
      if (currentTotalPages <= 1) {
        paginationList.style.display = "none";
        return false;
      }

      paginationList.style.display = "flex";

      // Tombol Previous
      const prevLi = document.createElement("li");
      prevLi.classList.add("page-item");
      if (currentPage === 1) prevLi.classList.add("disabled");
      prevLi.innerHTML = `<button class="page-link" data-page="${
        currentPage - 1
      }">Previous</button>`;
      paginationList.appendChild(prevLi);

      // Logika untuk menampilkan nomor halaman
      let startPage, endPage;
      if (currentTotalPages <= 5) {
        startPage = 1;
        endPage = currentTotalPages;
      } else {
        if (currentPage <= 3) {
          startPage = 1;
          endPage = 5;
        } else if (currentPage >= currentTotalPages - 2) {
          startPage = currentTotalPages - 4;
          endPage = currentTotalPages;
        } else {
          startPage = currentPage - 2;
          endPage = currentPage + 2;
        }
      }

      // Tambah fungsi helper untuk mendapatkan data yang sudah difilter
      function getFilteredData() {
        let filteredData = [...data[rowID]];

        // Terapkan filter berdasarkan filterBy yang aktif
        if (row.hasOwnProperty("filterBy")) {
          const filterBy = Array.isArray(row.filterBy)
            ? row.filterBy
            : [row.filterBy];

          filterBy.forEach((filterType) => {
            const filterElement = document.getElementById(filterType);
            if (filterElement && filterElement.value !== "all") {
              filteredData = filteredData.filter(
                (item) =>
                  String(item[filterType]) === String(filterElement.value)
              );
            }
          });
        }

        return filteredData;
      }

      // Modifikasi curPage untuk menggunakan data yang sudah difilter
      function curPage(page = 1) {
        const filteredData = getFilteredData();
        const startIndex = (page - 1) * pageLimit;
        const slicedData = filteredData.slice(
          startIndex,
          startIndex + pageLimit
        );
        return { [rowID]: slicedData };
      }

      // Update event handler untuk filter
      function handleFilterChange() {
        currentPage = 1; // Reset ke halaman pertama saat filter berubah
        const filteredData = getFilteredData();
        renderData(curPage(currentPage));
        updatePaginationUI(); // Update pagination setelah filter
      }

      // Setup filter event listeners
      if (row.hasOwnProperty("filterBy")) {
        const filterBy = Array.isArray(row.filterBy)
          ? row.filterBy
          : [row.filterBy];
        filterBy.forEach((filterType) => {
          const filterElement = document.getElementById(filterType);
          if (filterElement) {
            filterElement.removeEventListener("change", handleFilterChange);
            filterElement.addEventListener("change", handleFilterChange);
          }
        });
      }

      // Render nomor halaman
      for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement("li");
        pageLi.classList.add("page-item");
        if (i === currentPage) pageLi.classList.add("active");
        pageLi.innerHTML = `<button class="page-link" data-page="${i}">${i}</button>`;
        paginationList.appendChild(pageLi);
      }

      // Tombol Next
      const nextLi = document.createElement("li");
      nextLi.classList.add("page-item");
      if (currentPage === currentTotalPages) nextLi.classList.add("disabled");
      nextLi.innerHTML = `<button class="page-link" data-page="${
        currentPage + 1
      }">Next</button>`;
      paginationList.appendChild(nextLi);
    }

    /**
     * Setup event listeners untuk pagination
     */
    function setupPaginationListeners() {
      // Cek apakah pagination didefinisikan dan tidak false
      if (!row.hasOwnProperty("pagination") || row.pagination === false) {
        return false;
      }

      const paginationID = row.pagination;
      if (!paginationID) return false;

      const paginationList = document.getElementById(paginationID);
      if (!paginationList) return false;

      paginationList.addEventListener("click", function (event) {
        const button = event.target.closest(".page-link");
        if (!button) return;

        const newPage = parseInt(button.dataset.page);

        // Validasi halaman
        if (isNaN(newPage) || newPage < 1 || newPage > totalPages) return;
        if (newPage === currentPage) return;

        currentPage = newPage;
        renderData(curPage(currentPage));
        updatePaginationUI();
      });
    }

    // Initial setup
    setupPaginationListeners();

    /**
     * Fungsi untuk memuat ulang data
     * @param {Object|Array} newData - Data baru yang akan dimuat
     * @param {boolean} resetPage - Reset ke halaman pertama (default: true)
     */
    View.prototype.addData = function (newData, resetPage = true) {
      if (
        !newData ||
        (typeof newData !== "object" && !Array.isArray(newData))
      ) {
        throw new Error("Parameter newData harus berupa object atau array");
      }

      try {
        // Backup data lama untuk rollback jika terjadi error
        const oldData = { ...data };
        const oldOriginalData = { ...originalData };

        let newItems = [];

        // Validasi dan ekstrak data baru
        if (Array.isArray(newData)) {
          newItems = [...newData];
        } else {
          const firstKey = Object.keys(newData)[0];
          if (!firstKey || !Array.isArray(newData[firstKey])) {
            throw new Error("Data harus berupa array atau object dengan array");
          }
          newItems = [...newData[firstKey]];
        }

        // Validasi data baru tidak kosong
        if (newItems.length === 0) {
          throw new Error("Data baru tidak boleh kosong");
        }

        try {
          // Proses data baru dengan slug
          const processedNewItems = processDataWithSlug(newItems);

          // Gabungkan data baru di awal dengan data lama
          originalData[rowID] = [...newItems, ...originalData[rowID]];
          data[rowID] = [...processedNewItems, ...data[rowID]];
        } catch (slugError) {
          console.warn("Error saat memproses slug:", slugError);
          // Jika gagal memproses slug, tetap gabungkan data tanpa slug
          originalData[rowID] = [...newItems, ...originalData[rowID]];
          data[rowID] = [...newItems, ...data[rowID]];
        }

        // Update cache dan perhitungan terkait
        cachedData.totalPages = Math.ceil(data[rowID].length / pageLimit);

        // Reset pencarian jika ada
        if (cachedData.searchInput) {
          cachedData.searchInput.value = "";
        }

        // Reset ke halaman pertama jika diminta
        if (resetPage) {
          currentPage = 1;
        }

        // Clear memoization cache karena data berubah
        if (memoizedFilter && memoizedFilter.cache) {
          memoizedFilter.cache.clear();
        }

        // Render ulang dengan data baru
        requestAnimationFrame(() => {
          renderData(curPage(currentPage));

          // Trigger custom event untuk notifikasi reload selesai
          const reloadEvent = new CustomEvent("dataReloaded", {
            detail: {
              success: true,
              newItemsCount: newItems.length,
              totalItems: data[rowID].length,
              currentPage: currentPage,
            },
          });
          document.dispatchEvent(reloadEvent);
        });

        return true;
      } catch (error) {
        console.error("Error saat reload data:", error);

        // Rollback ke data lama jika terjadi error
        data = { ...oldData };
        originalData = { ...oldOriginalData };

        // Trigger custom event untuk notifikasi error
        const errorEvent = new CustomEvent("dataReloadError", {
          detail: {
            error: error.message,
          },
        });
        document.dispatchEvent(errorEvent);

        return false;
      }
    };

    /**
     * Fungsi untuk mendapatkan data saat ini
     * @returns {Object} Data yang sedang ditampilkan
     */
    View.prototype.getCurrentData = function () {
      return {
        all: data[rowID],
        current: curPage(currentPage)[rowID],
        pagination: {
          currentPage: currentPage,
          totalPages: cachedData.totalPages,
          pageLimit: pageLimit,
          totalItems: data[rowID].length,
        },
      };
    };

    /**
     * Fungsi untuk refresh manual dengan tombol
     * @param {string} buttonId - ID tombol refresh
     * @param {Object} options - Data dan opsi refresh
     */
    View.prototype.setupRefreshButton = function (buttonId, options = {}) {
      const refreshButton = document.getElementById(buttonId);
      if (!refreshButton) {
        console.warn("Tombol refresh tidak ditemukan:", buttonId);
        return null;
      }

      const {
        onStart,
        onSuccess,
        onError,
        loadingText = "Memperbarui...",
        data = null,
        reloadOptions = {}
      } = options;

      let isLoading = false;
      const originalText = refreshButton.innerHTML;

      const handleRefresh = async () => {
        if (isLoading) return;

        try {
          isLoading = true;
          refreshButton.disabled = true;
          refreshButton.innerHTML = loadingText;

          if (onStart) await onStart();

          if (data) {
            const success = this.ReloadView(data, reloadOptions);
            if (success && onSuccess) {
              await onSuccess({ data });
            }
          }

        } catch (error) {
          console.error("Error saat refresh:", error);
          if (onError) await onError(error);
        } finally {
          isLoading = false;
          refreshButton.disabled = false;
          refreshButton.innerHTML = originalText;
        }
      };

      const cleanup = () => {
        refreshButton.removeEventListener("click", handleRefresh);
      };

      refreshButton.addEventListener("click", handleRefresh);
      return cleanup;
    };

    /**
     * Fungsi untuk refresh dengan onclick
     * @param {Object} data - Data untuk refresh
     */
    View.prototype.ReloadView = function (newData, options = {}) {
      try {
        // Validasi data dengan lebih fleksibel
        let dataToLoad;
        if (Array.isArray(newData)) {
          dataToLoad = { [rowID]: newData };
        } else if (newData && newData.data && newData.data[rowID]) {
          dataToLoad = { [rowID]: newData.data[rowID] };
        } else if (newData && newData[rowID]) {
          dataToLoad = newData;
        } else {
          throw new Error('Format data tidak valid untuk reload');
        }

        const {
          append = false,
          preserveFilters = false,
          resetPage = true
        } = options;

        // Backup data lama untuk rollback
        const oldData = [...data[rowID]];
        const oldOriginalData = [...originalData[rowID]];

        try {
          if (append) {
            // Tambahkan data baru ke existing data
            originalData[rowID] = [...originalData[rowID], ...dataToLoad[rowID]];
            data[rowID] = [...data[rowID], ...dataToLoad[rowID]];
          } else {
            // Ganti dengan data baru
            originalData[rowID] = [...dataToLoad[rowID]];
            data[rowID] = [...dataToLoad[rowID]];
          }

          // Reset ke halaman pertama jika diminta
          if (resetPage) {
            currentPage = 1;
          }

          // Update UI menggunakan TDSDOM
          const rendered = domManager.render(template, curPage(currentPage), templateElement);
          contentElement.innerHTML = rendered;
          updatePaginationUI();

          return {
            success: true,
            totalItems: data[rowID].length,
            currentPage: currentPage
          };

        } catch (error) {
          // Rollback jika terjadi error
          data[rowID] = oldData;
          originalData[rowID] = oldOriginalData;
          throw error;
        }

      } catch (error) {
        console.error('Error dalam ReloadView:', error);
        return {
          success: false,
          error: error.message
        };
      }
    };

    function renderLargeTemplate(template, data) {
      const chunkSize = 1000; // karakter
      const chunks = [];

      for (let i = 0; i < template.length; i += chunkSize) {
        chunks.push(template.slice(i, i + chunkSize));
      }

      let result = "";
      chunks.forEach((chunk, index) => {
        requestAnimationFrame(() => {
          result += processTemplateChunk(chunk, data);
          if (index === chunks.length - 1) {
            contentElement.innerHTML = result;
          }
        });
      });
    }

    /**
     * Setup lazy loading untuk gambar dan konten
     */
    function setupLazyLoading() {
      const options = {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      };

      // Observer untuk gambar
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              // Load gambar dengan fade effect
              img.style.opacity = "0";
              img.src = img.dataset.src;
              img.onload = () => {
                img.style.transition = "opacity 0.3s";
                img.style.opacity = "1";
              };
              delete img.dataset.src;
              imageObserver.unobserve(img);
            }
          }
        });
      }, options);

      // Observer untuk konten berat
      const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            if (element.dataset.content) {
              loadHeavyContent(element);
              contentObserver.unobserve(element);
            }
          }
        });
      }, options);

      // Load konten berat
      function loadHeavyContent(element) {
        const contentId = element.dataset.content;

        // Gunakan worker untuk load konten berat
        if (worker) {
          worker.postMessage({
            action: "loadContent",
            contentId: contentId,
          });
        }
      }

      // Observe semua gambar lazy
      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });

      // Observe konten berat
      document.querySelectorAll("[data-content]").forEach((element) => {
        contentObserver.observe(element);
      });

      return {
        imageObserver,
        contentObserver,
      };
    }

    // Cleanup untuk lazy loading
    this.destroy = function () {
      if (this.lazyLoadObservers) {
        this.lazyLoadObservers.imageObserver.disconnect();
        this.lazyLoadObservers.contentObserver.disconnect();
      }
      // ... cleanup lainnya
    };

    // Setup lazy loading saat inisialisasi
    this.lazyLoadObservers = setupLazyLoading();

    // Modifikasi destroy untuk membersihkan event listeners
    this.destroy = function () {
      if (worker) {
        worker.terminate();
        worker = null;
      }

      // Cleanup filter elements
      if (cachedData.filterElements) {
        cachedData.filterElements.forEach(({ element, handler }) => {
          element.removeEventListener("change", handler);
        });
      }

      // Cleanup lazy loading observers
      if (this.lazyLoadObservers) {
        this.lazyLoadObservers.imageObserver.disconnect();
        this.lazyLoadObservers.contentObserver.disconnect();
      }
    };

    /**
     * Setup virtual scrolling untuk data besar
     */
    function setupVirtualScrolling() {
      const viewportHeight = window.innerHeight;
      const itemHeight = 50; // Perkiraan tinggi setiap item
      const bufferSize = 5; // Jumlah item buffer atas dan bawah
      const visibleItems =
        Math.ceil(viewportHeight / itemHeight) + bufferSize * 2;

      let startIndex = 0;
      let scrollTimeout;

      const container = contentElement;
      const scrollContainer = document.createElement("div");
      scrollContainer.style.position = "relative";
      container.appendChild(scrollContainer);

      function updateVisibleItems() {
        const scrollTop = container.scrollTop;
        startIndex = Math.floor(scrollTop / itemHeight);
        startIndex = Math.max(0, startIndex - bufferSize);

        const visibleData = data[rowID].slice(
          startIndex,
          startIndex + visibleItems
        );
        const totalHeight = data[rowID].length * itemHeight;

        scrollContainer.style.height = `${totalHeight}px`;

        // Render hanya item yang visible
        const fragment = document.createDocumentFragment();
        visibleData.forEach((item, index) => {
          const itemElement = document.createElement("div");
          itemElement.style.position = "absolute";
          itemElement.style.top = `${(startIndex + index) * itemHeight}px`;
          itemElement.style.height = `${itemHeight}px`;

          const rendered = optimizedRender({ [rowID]: [item] }, rowID);
          itemElement.innerHTML = rendered;

          fragment.appendChild(itemElement);
        });

        // Clear dan update content
        while (scrollContainer.firstChild) {
          scrollContainer.removeChild(scrollContainer.firstChild);
        }
        scrollContainer.appendChild(fragment);
      }

      container.addEventListener("scroll", () => {
        if (scrollTimeout) {
          cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(updateVisibleItems);
      });

      // Initial render
      updateVisibleItems();

      return {
        refresh: updateVisibleItems,
        destroy: () => {
          container.removeEventListener("scroll", updateVisibleItems);
          scrollContainer.remove();
        },
      };
    }

    /**
     * Setup data chunking dan storage
     */
    class DataChunkManager {
      constructor(dbName = "viewDB", storeName = "chunks") {
        this.dbName = dbName;
        this.storeName = storeName;
        this.chunkSize = 1000; // Items per chunk
        this.db = null;
      }

      async init() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(this.dbName, 1);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            this.db = request.result;
            resolve();
          };

          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(this.storeName)) {
              db.createObjectStore(this.storeName, { keyPath: "chunkId" });
            }
          };
        });
      }

      async storeChunks(data) {
        const chunks = this.createChunks(data);
        const store = this.db
          .transaction(this.storeName, "readwrite")
          .objectStore(this.storeName);

        return Promise.all(
          chunks.map(
            (chunk) =>
              new Promise((resolve, reject) => {
                const request = store.put(chunk);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
              })
          )
        );
      }

      async getChunk(chunkId) {
        return new Promise((resolve, reject) => {
          const request = this.db
            .transaction(this.storeName)
            .objectStore(this.storeName)
            .get(chunkId);

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }

      createChunks(data) {
        const chunks = [];
        for (let i = 0; i < data.length; i += this.chunkSize) {
          chunks.push({
            chunkId: Math.floor(i / this.chunkSize),
            data: data.slice(i, i + this.chunkSize),
          });
        }
        return chunks;
      }
    }

    /**
     * Setup data streaming untuk load data besar
     */
    class DataStreamManager {
      constructor(options = {}) {
        this.pageSize = options.pageSize || 50;
        this.worker = options.worker;
        this.chunkManager = new DataChunkManager();
      }

      async init() {
        await this.chunkManager.init();
        this.setupStreamHandlers();
      }

      setupStreamHandlers() {
        let currentChunk = 0;
        let isLoading = false;

        const loadNextChunk = async () => {
          if (isLoading) return;
          isLoading = true;

          try {
            const chunk = await this.chunkManager.getChunk(currentChunk);
            if (chunk) {
              // Process chunk dengan worker
              this.worker.postMessage({
                action: "processChunk",
                data: chunk.data,
              });
              currentChunk++;
            }
          } catch (error) {
            console.error("Error loading chunk:", error);
          } finally {
            isLoading = false;
          }
        };

        // Setup intersection observer untuk infinite scroll
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadNextChunk();
            }
          },
          { threshold: 0.5 }
        );

        // Observe loader element
        const loader = document.querySelector("#chunk-loader");
        if (loader) {
          observer.observe(loader);
        }
      }

      async processStreamedData(data) {
        // Store chunks di IndexedDB
        await this.chunkManager.storeChunks(data);

        // Setup virtual scrolling
        const virtualScroller = setupVirtualScrolling();

        return {
          destroy: () => {
            virtualScroller.destroy();
            // Cleanup lainnya
          },
        };
      }
    }

    // Inisialisasi managers
    const streamManager = new DataStreamManager({ worker });
    let virtualScroller = null;

    async function initializeDataHandling() {
      await streamManager.init();

      if (data[rowID].length > 1000) {
        // Gunakan virtual scrolling untuk data besar
        virtualScroller = setupVirtualScrolling();

        // Process data dengan streaming
        await streamManager.processStreamedData(data[rowID]);
      } else {
        // Render normal untuk data kecil
        renderData(curPage(1));
      }
    }

    // Modify destroy method
    this.destroy = function () {
      if (virtualScroller) {
        virtualScroller.destroy();
      }
      if (worker) {
        worker.terminate();
      }
      // ... cleanup lainnya
    };

    // Initialize
    initializeDataHandling().catch(console.error);

    /**
     * Filter data berdasarkan key dan value
     */
    this.filterKey = function (key, value) {
      if (!key || !value) {
        console.warn("Parameter key dan value harus diisi");
        return this;
      }

      try {
        // Filter data berdasarkan key dan value
        data[rowID] = originalData[rowID].filter(item => {
          return String(item[key]) === String(value);
        });

        // Update UI
        currentPage = 1;
        renderData(curPage(1));
        updatePaginationUI();

        // Return object dengan informasi hasil filter
        return {
          filtered: data[rowID].length,
          total: originalData[rowID].length,
          data: data[rowID]
        };

      } catch (error) {
        console.error('Error dalam filterKey:', error);
        return {
          filtered: 0,
          total: originalData[rowID].length,
          data: []
        };
      }
    };

    /**
     * Internal filter state management
     */
    this._filterState = {
      active: {},
      history: [],
      
      add: function(key, value) {
        this.active[key] = value;
        this.history.push({ 
          key, 
          value, 
          timestamp: Date.now() 
        });
      },
      
      remove: function(key) {
        delete this.active[key];
      },
      
      clear: function() {
        this.active = {};
        this.history = [];
      },
      
      get: function(key) {
        return this.active[key];
      },
      
      getAll: function() {
        return {...this.active};
      }
    };

    /**
     * Internal filter helper
     */
    this._internalFilter = function(key, value) {
      if (!key || !value) return;

      try {
        data[rowID] = data[rowID].filter((item) => {
          // Handle nested object
          if (key.includes('.')) {
            const keys = key.split('.');
            let val = item;
            for (const k of keys) {
              if (val === undefined) return false;
              val = val[k];
            }
            return String(val) === String(value);
          }
          
          // Handle array value
          if (Array.isArray(value)) {
            return value.includes(String(item[key]));
          }
          
          return String(item[key]) === String(value);
        });

      } catch (error) {
        console.error('Error pada internal filter:', error);
      }
    };

    /**
     * Method untuk mengubah urutan data
     * @param {string} order - 'ASC' atau 'DESC'
     * @param {string} sortBy - field yang akan diurutkan
     */
    View.prototype.sort = function(order, sortBy) {
      data[rowID] = sortData(data[rowID], order, sortBy);
      currentPage = 1;
      renderData(curPage(1));
      updatePaginationUI();
    };
  }
}

// Export class-class tambahan jika diperlukan
export { View };




// Export instance WebSocket default
export const tatiye = createWebSocketConnection(); 

export function RTDb(callback,token) {
    let pesanData;
    tatiye.onopen = function() {
      const subscribeMsg = {
        type: 'subscribe',
        endpoint:token
      };
      tatiye.send(JSON.stringify(subscribeMsg));
    };
    tatiye.onmessage = function(event) {
     const data = JSON.parse(event.data);
     if (data.type === 'update') {
       pesanData = data.data.response;
       callback(pesanData);
     }
    };

    tatiye.onerror = function(error) {
      console.error('WebSocket error:', error);
    };

    tatiye.onclose = function() {
      console.log('Terputus dari WebSocket server');
      setTimeout(RTDb, 5000);
    };
}
// ... existing connection code ...
export function Buckets(data = {}) {
  return new Promise((resolve, reject) => {
    if (tatiye.readyState === WebSocket.OPEN) {
      const apiRequest = {
        type: 'apiRequest',
        endpoint: data.endpoint,
        vid:app.vid,
        payload: data.body
      };
      const messageHandler = (e) => {
        try {
          const response = JSON.parse(e.data);
          if (response.type === "apiResponse") {
               tatiye.removeEventListener("message", messageHandler);
               if (response.data.payload.vid===app.vid) {
                  resolve(response.data.payload.response);
               }
          }
        } catch (error) {
          console.error('Error dalam messageHandler:', error);
          reject(error);
        }
      };
      tatiye.addEventListener("message", messageHandler);
      tatiye.send(JSON.stringify(apiRequest));
    } else {
      console.error('WebSocket Status:', tatiye.readyState);
      reject(new Error("WebSocket belum terhubung"));
    }
  });
}

// filebrowser
export async function filebrowser(serverUrl,fileInput, additionalData = {}) {
  const formdata = new FormData();
  formdata.append("file", fileInput.files[0]);
  
  // Menambahkan data tambahan secara dinamis
  Object.entries(additionalData).forEach(([key, value]) => {
    formdata.append(key, value);
  });

  const requestOptions = {
    method: "POST", 
    body: formdata,
    redirect: "follow"
  };

  try {
    const response = await fetch(app.url+"/sdk/"+serverUrl, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}


// PRECODE
export function getLanguageIcon(language) {
  if (!language || typeof language !== "string") {
    return "fas fa-code";
  }
  const iconMap = {
    html: "fab fa-html5",
    css: "fab fa-css3-alt",
    js: "fab fa-js",
    javascript: "fab fa-js",
    python: "fab fa-python",
    php: "fab fa-php",
    java: "fab fa-java",
    react: "fab fa-react",
    vue: "fab fa-vuejs",
    angular: "fab fa-angular",
    node: "fab fa-node-js",
    sass: "fab fa-sass",
    wordpress: "fab fa-wordpress",
    git: "fab fa-git-alt",
    json: "fas fa-brackets-curly",
    wrapped: "fas fa-brackets-curly",
  };

  return iconMap[language.toLowerCase()] || "fas fa-code"; // Default icon
}
// PRE CODE
export function wrapCodeWithTerminal() {
  const codeBlocks = document.querySelectorAll("pre > code:not(.wrapped)");
  codeBlocks.forEach((codeBlock) => {
    // Tandai kode yang sudah diproses
    codeBlock.classList.add("wrapped");

    const classAttr = codeBlock.className;
    const language = classAttr.replace("language-", "").replace(" wrapped", ""); // Hapus class wrapped dari string language
    const title = codeBlock.getAttribute("title") || "";
    const defaultHeight =400; // Nilai default dalam pixel
    const setmaxHeight =parseInt(codeBlock.getAttribute("maxHeight")) || defaultHeight;
    const pxmaxHeight = setmaxHeight + "px"; // Gunakan variabel yang sudah dikonversi
    const languageIcon = getLanguageIcon(language);
    let newsTitiel = "";
    if (title) {
      newsTitiel = title + "." + language;
    } else {
      newsTitiel = language;
    }
    const terminal = document.createElement("div");
    terminal.className = "terminal";
    const terminalHeader = document.createElement("div");
    terminalHeader.className = "terminal-header";
    terminalHeader.innerHTML = `
      <span>
        <i class="${languageIcon}" aria-hidden="true"></i> 
        ${newsTitiel} 
      </span>
      <div class="terminal-buttons">
        <button onclick="copyCode(this)" class="terminal-copy-btn" aria-label="Salin kode">
          <i class="icon-feather-copy" aria-hidden="true"></i>
        </button>
      </div>
    `;

    const terminalFooter = document.createElement("div");
    terminalFooter.className = "terminal-footer";
    if (codeBlock.offsetHeight > setmaxHeight) {
      terminalFooter.innerHTML = `
        <button class="terminal-code-btn" onclick="toggleCode(this)">Lihat selengkapnya</button>
      `;
    }

    const preElement = codeBlock.parentElement;

    preElement.parentNode.insertBefore(terminal, preElement);
    terminal.appendChild(terminalHeader);
    terminal.appendChild(preElement);
    terminal.appendChild(terminalFooter);

    if (codeBlock.offsetHeight > setmaxHeight) {
      preElement.style.maxHeight = pxmaxHeight;
      preElement.style.overflow = "hidden";
    }
  });
}
window.toggleCode = function (button) {
  const terminal = button.closest(".terminal");
  const preElement = terminal.querySelector("pre");
  const codeElement = preElement.querySelector("code");
  const defaultHeight = 200;
  const maxHeight =
    (parseInt(codeElement.getAttribute("maxHeight")) || defaultHeight) + "px";

  if (preElement.style.maxHeight === maxHeight) {
    preElement.style.maxHeight = "none";
    button.textContent = "Lihat lebih sedikit";
  } else {
    preElement.style.maxHeight = maxHeight;
    button.textContent = "Lihat selengkapnya";
  }
};


export function md5(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function F(x, y, z) {
    return (x & y) | (~x & z);
  }
  function G(x, y, z) {
    return (x & z) | (y & ~z);
  }
  function H(x, y, z) {
    return x ^ y ^ z;
  }
  function I(x, y, z) {
    return y ^ (x | ~z);
  }

  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 =
      (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        lWordArray[lWordCount] |
        (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function WordToHex(lValue) {
    var WordToHexValue = "",
      WordToHexValue_temp = "",
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue =
        WordToHexValue +
        WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  var S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  var S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  var S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301;
  b = 0xefcdab89;
  c = 0x98badcfe;
  d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = AddUnsigned(a, AA);
    d = AddUnsigned(d, DD);
    c = AddUnsigned(c, CC);
    b = AddUnsigned(b, BB);
  }
  var temp = WordToHex(a) + WordToHex(d) + WordToHex(c) + WordToHex(b);
  return temp.toUpperCase();
}

export function md5Str(input) {
  const hash = md5(input);
  const codes = [];
  // Membagi hash menjadi 5 bagian yang sama (6 karakter)
  for (let i = 0; i < 5; i++) {
    codes.push(hash.substr(i * 6, 6));
  }
  return codes.join("-");
}
// Fungsi untuk melakukan HTTP request dengan fitur retry, timeout, dan validasi
export function BriefStorage(element) {
  // Konstanta untuk timeout
  const TIMEOUT_DURATION = 5000;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  // Validasi URL
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      throw new Error("URL tidak valid");
    }
  };

  // Rate limiting
  const rateLimiter = {
    lastCall: 0,
    minInterval: 5, // 100ms antara request
    checkLimit() {
      const now = Date.now();
      if (now - this.lastCall < this.minInterval) {
        throw new Error("Terlalu banyak request. Mohon tunggu sebentar.");
      }
      this.lastCall = now;
    },
  };

  // Fungsi helper untuk setup request
  const setupRequest = (method, data = null) => {
    const controller = new AbortController();
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
    };
    if (data) {
      if (typeof data !== "object") {
        throw new Error("Data harus berupa object");
      }
      config.body = JSON.stringify(data);
    }
    return { controller, config };
  };

  // Fungsi retry
  const retry = async (fn, retries = MAX_RETRIES) => {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      console.log(`Mencoba kembali... Sisa percobaan: ${retries - 1}`);
      return retry(fn, retries - 1);
    }
  };

  async function getData(url) {
    validateUrl(url);
    rateLimiter.checkLimit();

    const { controller, config } = setupRequest("GET");
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    return retry(async () => {
      try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw {
            type: "HTTPError",
            status: response.status,
            message: `HTTP error! status: ${response.status}`,
            timestamp: new Date().toISOString(),
            url,
          };
        }

        const data = await response.json();
        console.log({
          type: "Success",
          method: "GET",
          url,
          timestamp: new Date().toISOString(),
        });
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        // console.error({
        //   type: "Error",
        //   method: "GET",
        //   url,
        //   error: error.message,
        //   timestamp: new Date().toISOString(),
        // });
        throw error;
      }
    });
  }

  async function sdk(url, data) {
    // const cookieManager = cookies();
    // const userCookie = cookieManager.get('HOST'); // returns 'john'
    const bseURI = app.url + "/sdk/" + url;
    validateUrl(bseURI);
    rateLimiter.checkLimit();

    const { controller, config } = setupRequest("POST", data);
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    return retry(async () => {
      try {
        const response = await fetch(bseURI, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw {
            type: "HTTPError",
            status: response.status,
            message: `HTTP error! status: ${response.status}`,
            timestamp: new Date().toISOString(),
            url,
            data,
          };
        }

        const result = await response.json();
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        console.error({
          type: "Error",
          method: "POST",
          url,
          error: error.message,
          data,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    });
  }
  return { element, getData, sdk };
}

export async function Brief(row) {
  try {
    if (!row || !row.endpoint) {
      throw new Error("Parameter row dan endpoint diperlukan");
    }

    const briefInstance = BriefStorage(row);
    const data = await briefInstance.sdk(row.endpoint, row);
    return data;
  } catch (error) {
    console.error("Error dalam Brief:", error);
    throw error;
  }
}

export function Queue(row) {
  return {
    add: async function () {
      try {
        if (!row || !row.endpoint) {
          throw new Error("Parameter  dan endpoint diperlukan");
        }

        const briefInstance = BriefStorage(row);
        const data = await briefInstance.sdk(row.endpoint, row);
        return data;
      } catch (error) {
        console.error("Error dalam Queue:", error);
        throw error;
      }
    },
    up: async function (id) {
      try {
        if (!row || !row.endpoint) {
          throw new Error("Parameter  dan endpoint diperlukan");
        }
        const gabungArray = { ...row, id: id };
        const briefInstance = BriefStorage(row);
        const data = await briefInstance.sdk(row.endpoint, gabungArray);
        return { ...row.payload, id: id, data };
      } catch (error) {
        console.error("Error dalam Queue:", error);
        throw error;
      }
    },
    get: async function (id) {
      try {
        if (!row || !row) {
          throw new Error("Parameter  dan endpoint diperlukan");
        }
        const briefInstance = BriefStorage(row);
        const data = await briefInstance.sdk(row, { id: id });
        return data;
      } catch (error) {
        console.error("Error dalam Queue:", error);
        throw error;
      }
    },
    view: async function () {
      try {
        if (!row || !row.endpoint) {
          throw new Error("Parameter  dan endpoint diperlukan");
        }
        const briefInstance = BriefStorage(row);
        const data = await briefInstance.sdk(row.endpoint, row);
        return data;
      } catch (error) {
        console.error("Error dalam Queue:", error);
        throw error;
      }
    },
    del: async function (id) {
      try {
        if (!row || !row) {
          throw new Error("Parameter  dan endpoint diperlukan");
        }
        const briefInstance = BriefStorage(row);
        const data = await briefInstance.sdk(row, { id: id });
        return data;
      } catch (error) {
        console.error("Error dalam Queue:", error);
        throw error;
      }
    },
  };
}

// COMPONENE
/**
 * @class TDSDOM
 * @description Kelas untuk manajemen DOM dan template
 */
class TDSDOM {
  constructor() {
    /**
     * Helper function untuk escape karakter regex
     * @param {string} string - String yang akan di-escape
     * @returns {string} String yang sudah di-escape
     */
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    /**
     * Render template dengan data
     * @param {string} template - Template string
     * @param {Object} data - Data untuk dirender
     * @param {Element} element - Element template
     */
    this.render = function(template, data, element) {
      try {
        // Validasi input
        if (!template || typeof template !== 'string') {
          throw new Error('Template harus berupa string');
        }
        if (!data || typeof data !== 'object') {
          throw new Error('Data harus berupa object');
        }

        let result = template;
        const dataKeys = Object.keys(data);

     
        // Proses setiap key data
        dataKeys.forEach(key => {
          const items = data[key];
          if (!Array.isArray(items)) {
            console.warn(`Data untuk key ${key} bukan array:`, items);
            return;
          }

          // Pattern untuk mencari tag template
          // Support multiple format tags termasuk Mustache-style
          const startTags = [
            `{@${key}}`, 
            `[${key}]`,
            `[@${key}]`,
            `<!--${key}-->`,
            `{{${key}}}`,     // Mustache-style
            `{{#${key}}}`,    // Mustache block
            `{{{${key}}}`,    // Mustache unescaped
            `{$${key}}`,      // PHP-style variable
            `{#${key}}`,      // Hash-style variable
            `\${${key}}`      // Template literal style
          ];  
          const endTags = [
            `{/${key}}`,
            `[/${key}]`,
            `[/${key}]`,
            `<!--/${key}-->`,
            `{{/${key}}}`,    // Mustache-style
            `{{/${key}}}`,    // Mustache block
            `{{{/${key}}}`,   // Mustache unescaped
            `{/${key}}`,      // PHP-style closing
            `{/${key}}`,      // Hash-style closing
            `\${/${key}}`     // Template literal style closing
          ];

          // Debug log
     

          // Cek format yang digunakan
          let templateStart = -1;
          let templateEnd = -1;
          let usedStartTag = '';
          let usedEndTag = '';
          let tagFound = false;

          // Cek format mana yang digunakan dengan case insensitive
          for(let i = 0; i < startTags.length; i++) {
            const startTagRegex = new RegExp(escapeRegExp(startTags[i]), 'i');
            const startMatch = result.match(startTagRegex);
            
            if(startMatch) {
              templateStart = startMatch.index;
              usedStartTag = startMatch[0];
              
              const endTagRegex = new RegExp(escapeRegExp(endTags[i]), 'i');
              const remainingContent = result.slice(templateStart + usedStartTag.length);
              const endMatch = remainingContent.match(endTagRegex);
              
              if(endMatch) {
                templateEnd = templateStart + usedStartTag.length + endMatch.index;
                usedEndTag = endMatch[0];
                tagFound = true;
                //console.debug(`Tag ditemukan: ${usedStartTag} ... ${usedEndTag}`);
                break;
              }
            }
          }
          
          if (!tagFound) {
            console.warn(`Tag template untuk "${key}" tidak ditemukan dalam template`);
            console.warn('Template yang tersedia:', result);
            return;
          }

          const itemTemplate = result.substring(
            templateStart + usedStartTag.length,
            templateEnd
          );

          // console.debug(`Template item untuk "${key}":`, itemTemplate);

          // Render setiap item dengan dukungan Mustache yang lebih baik
          let renderedItems = items.map(item => {
            let itemResult = itemTemplate;
            
            // Replace semua placeholder dengan nilai item
            Object.keys(item).forEach(prop => {
              const value = item[prop] ?? '';
              // Support multiple format placeholders termasuk Mustache
              const patterns = [
                new RegExp(`{${prop}}`, 'g'),
                new RegExp(`\\[${prop}\\]`, 'g'),
                new RegExp(`<!--${prop}-->`, 'g'),
                new RegExp(`{{${prop}}}`, 'g'),       // Mustache escaped
                new RegExp(`{{{${prop}}}}`, 'g'),     // Mustache unescaped
                new RegExp(`{{&${prop}}}`, 'g'),      // Mustache unescaped alternative
                new RegExp(`{\\$${prop}}`, 'g'),      // PHP-style variable
                new RegExp(`{#${prop}}`, 'g'),         // Hash-style variable
                new RegExp(`\\$\\{${prop}\\}`, 'g')   // Template literal style
              ];
              
              patterns.forEach(pattern => {
                // Untuk format Mustache escaped, escape HTML
                if (pattern.toString().includes('{{') && !pattern.toString().includes('{{{')) {
                  itemResult = itemResult.replace(pattern, this.sanitize(String(value)));
                } else {
                  itemResult = itemResult.replace(pattern, String(value));
                }
              });
            });
            
            return itemResult;
          }).join('');

          // Replace template dengan hasil render
          result = result.replace(
            `${usedStartTag}${itemTemplate}${usedEndTag}`,
            renderedItems
          );
        });

        // Debug log hasil akhir
 
        return result;

      } catch (error) {
        console.error('Error dalam render:', error);
        console.error('Template:', template);
        console.error('Data:', data);
        return '';
      }
    };

    /**
     * Parse string template menjadi DOM elements
     * @param {string} template - Template string
     * @returns {DocumentFragment}
     */
    this.parse = function(template) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(template, 'text/html');
      const fragment = document.createDocumentFragment();
      
      while (doc.body.firstChild) {
        fragment.appendChild(doc.body.firstChild);
      }
      
      return fragment;
    };

    /**
     * Sanitize string untuk mencegah XSS
     * @param {string} str - String yang akan disanitize
     * @returns {string}
     */
    this.sanitize = function(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };
  }
}
// SPA
export class SinglePageApp {
  constructor() {
    this.dbName = 'spaCache';
    this.storeName = 'responses';
    this.db = null;
    this.loadingHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Memuat konten...</p>
      </div>
    `;
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 1.5
    };
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  isCryptoSupported() {
    return window.crypto && window.crypto.subtle;
  }

  async getEncryptionKey(endpoint) {
    const keyData = new TextEncoder().encode(endpoint || 'default-endpoint-key');
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(data, endpoint) {
    if (!this.isCryptoSupported()) {
      return { raw: true, data };
    }

    try {
      const key = await this.getEncryptionKey(endpoint);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      return {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData))
      };
    } catch (error) {
      console.warn('Enkripsi gagal:', error);
      return { raw: true, data };
    }
  }

  async decryptData(encryptedObj, endpoint) {
    if (encryptedObj.raw) {
      return encryptedObj.data;
    }

    try {
      const key = await this.getEncryptionKey(endpoint);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedObj.iv) },
        key,
        new Uint8Array(encryptedObj.data)
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.warn('Dekripsi gagal:', error);
      throw error;
    }
  }

  async saveToCache(key, data, endpoint) {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    try {
      const objToEncrypt = JSON.stringify({
        data: data,
        timestamp: new Date().getTime()
      });
      const encryptedData = await this.encryptData(objToEncrypt, endpoint);
      
      await store.put({
        id: key,
        encryptedContent: encryptedData
      });
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  async getFromCache(key) {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise(async (resolve, reject) => {
      try {
        const request = store.get(key);
        request.onsuccess = async () => {
          if (!request.result) {
            resolve(null);
            return;
          }
          
          const decryptedStr = await this.decryptData(request.result.encryptedContent);
          const decryptedObj = JSON.parse(decryptedStr);
          
          resolve({
            id: key,
            data: decryptedObj.data,
            timestamp: decryptedObj.timestamp
          });
        };
        request.onerror = () => reject(request.error);
      } catch (error) {
        console.warn('Cache read error:', error);
        reject(error);
      }
    });
  }

  async clearOldCache() {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 hari
    const now = new Date().getTime();
    
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('timestamp');
    
    const range = IDBKeyRange.upperBound(now - maxAge);
    index.openCursor(range).onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      }
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchWithRetry(url, options, retryCount = 0) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retryCount >= this.retryConfig.maxRetries) {
        throw new Error(`Gagal setelah ${this.retryConfig.maxRetries} percobaan: ${error.message}`);
      }

      const waitTime = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount);
      console.warn(`Percobaan ke-${retryCount + 1} gagal. Mencoba ulang dalam ${waitTime}ms...`);
      
      await this.delay(waitTime);
      return this.fetchWithRetry(url, options, retryCount + 1);
    }
  }

  async SinglePageApplication(e) {
    const encodedData = btoa(JSON.stringify(e));
    const State = {
    url: "https://" + e.endpoint,
    data: e.data || e,
    elementById: e.elementById,
    encodedData: encodedData,
    endpoint: e.endpoint
  }

    if (!this.db) {
      await this.initDB();
    }
    
    const contentElement = document.getElementById(State.elementById);
    contentElement.innerHTML = this.loadingHTML;

    const cacheKey = md5Str(State.encodedData + '_v1');
    
    try {
      const cachedData = await this.getFromCache(cacheKey);
      if (cachedData) {
        contentElement.innerHTML = cachedData.data;
        return cachedData.data;
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await this.fetchWithRetry(app.url + "/worker/" + cacheKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...State.data,
          key: md5Str(State.url) || "",
          brief: State.url || "",
          pageparser:window.location.href,
          timestamp: new Date().getTime(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      const responseData = await response.text();
      
      try {
        await this.saveToCache(cacheKey, responseData, State.endpoint);
        await this.clearOldCache();
      } catch (e) {
        console.warn('Cache write error:', e);
      }
      
      contentElement.innerHTML = responseData;
      return responseData;
    } catch (error) {
      const errorMessage = error.message.includes('Gagal setelah') 
        ? error.message 
        : `Error: ${error.message}`;
      
      contentElement.innerHTML = `<div class="error">${errorMessage}</div>`;
      return contentElement.innerHTML;
    }
  }
}

// Inisialisasi Worker
const worker = new Worker(app.url + "/js/Worker.js");

// Fungsi untuk menggunakan Worker
const useWorker = (action, data) => {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      const { action: responseAction, result, error } = e.data;
      if (responseAction === `${action}Complete`) {
        resolve(result);
      } else if (responseAction === 'error') {
        reject(new Error(error));
      }
    };

    worker.onerror = (error) => {
      reject(error);
    };

    worker.postMessage({ action, data });
  });
};

// Contoh penggunaan Worker untuk filter
async function filterItems(items, filters) {
  try {
    const filteredItems = await useWorker('filter', { items, filters });
    console.log('Filtered items:', filteredItems);
    return filteredItems;
  } catch (error) {
    console.error('Error filtering items:', error);
  }
}

// Contoh penggunaan Worker untuk search
async function searchItems(items, query, searchFields) {
  try {
    const searchResults = await useWorker('search', { items, query, searchFields });
    console.log('Search results:', searchResults);
    return searchResults;
  } catch (error) {
    console.error('Error searching items:', error);
  }
}

export async function latSinglePageApp(e) {
    // Inisialisasi Worker $dataset['pageparser']
  
    const worker = new Worker(app.url + "/js/Worker.js");
    const encodedData = btoa(JSON.stringify(e));
    const State = {
    url: "https://" + e.endpoint,
    data: e.data || e,
    elementById: e.elementById,
    encodedData: encodedData,
    endpoint: e.endpoint
  }
    try { 
        const response = await fetch(app.url + "/worker/" + md5Str(encodedData), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...State.data,
                key: md5Str(State.url) || "",
                brief: State.url || "",
                pageparser:window.location.href,
                timestamp: new Date().getTime(),
            }),
        });

        return await response.text();
    } catch (error) {
        console.error('Error:', error);
        return null;
    } finally {
        // Terminate worker setelah selesai
        worker.terminate();
    }
}

// AND SPA
export function Encode(argument) {
  if (!argument) {
    throw new Error('Input tidak boleh kosong');
  }

  try {
    // Konversi input ke string jika bukan string
    const inputString = typeof argument === 'string' 
      ? argument 
      : JSON.stringify(argument);
    
    // Encode ke Base64 dan buat URL-safe
    const encodedString = btoa(inputString)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    
    return encodedString;
  } catch (error) {
    throw new Error(`Gagal mengencode data: ${error.message}`);
  }
}

// URL-safe Base64 Decode
export function Decode(argument) {
  if (!argument || typeof argument !== 'string') {
    throw new Error('Input harus berupa string');
  }

  try {
    // Konversi ke format Base64 standar
    const paddedString = argument.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (paddedString.length % 4)) % 4;
    const base64String = padding > 0 ? paddedString + "=".repeat(padding) : paddedString;

    // Decode Base64
    const decodedString = atob(base64String);

    // Bersihkan dan parse JSON
    const cleanedData = decodedString
      .replace(/'/g, '"')
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":');

    return JSON.parse(cleanedData);
  } catch (error) {
    throw new Error(`Gagal mendecode data: ${error.message}`);
  }
}

//Tabel Matrix
export class TabelMatrix {
    constructor(options) {
        this.options = options;
        this.currentPage = 1;
        this.paginationId = options.pagination || 'pagination';
        this.paginationPosition = options.paginationPosition || 'center';
        this.searchId = options.search;
        this.exportOptions = options.export || {};
        
        // Pastikan data tersedia sebelum menyalin
        if (options.data) {
            this.data = {
                columns: [...(options.data.columns || [])],
                data: options.data.data ? JSON.parse(JSON.stringify(options.data.data)) : []
            };
            
            this.originalData = {
                columns: [...(options.data.columns || [])],
                data: options.data.data ? JSON.parse(JSON.stringify(options.data.data)) : []
            };
        } else {
            this.data = { columns: [], data: [] };
            this.originalData = { columns: [], data: [] };
        }

        this.virtualScrolling = options.virtualScrolling || false;
        this.chunkSize = options.chunkSize || 100;
        this.bufferSize = options.bufferSize || 50;
        this.rowHeight = options.rowHeight || 40;
        this.memoryLimit = options.memoryLimit || 100000;
        this.visibleRows = [];
        this.scrollTop = 0;
        this.lastScrollTop = 0;
        this.scrollThrottle = null;
        this.renderRequestId = null;
        this.isScrolling = false;
        
        this.requiredLibraries = {
            xlsx: {
                name: 'XLSX',
                url: 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js'
            },
            pdf: {
                name: 'jspdf',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
            },
            autoTable: {
                name: 'jspdf-autotable',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
                depends: 'pdf'
            }
        };
        
        this.headerStyles = {
            backgroundColor: options.headerBackgroundColor || '#e5e9f2',
            color: options.headerTextColor || '#000',
            fontSize: options.headerFontSize || '14px',
            fontWeight: options.headerFontWeight || '700'
        };
        
        this.searchIndex = {};
        this.searchableColumns = options.searchableColumns || [];
        
        // Pindahkan buildSearchIndex setelah data diinisialisasi
        if (this.data && this.data.columns) {
            this.buildSearchIndex();
        }
        
        this.filters = options.filters || {};
        
        this.columnFormatters = options.columnFormatters || {};
        
        // Tambahkan properti baru untuk menangani kolom yang dapat diedit
        this.editableColumns = options.editableColumns || {};
        
        // Properti untuk menyimpan konfigurasi editor yang sedang aktif
        this.activeEditor = null;
        
        this.init();
        this.setupFilters();
        this.setupExportOptions();
    }

    init() {
        const tabelSet = document.getElementById(this.options.containerId);
        if (!tabelSet) return;

        this.data = this.options.data;
        this.perPage = this.options.perPage || 10;
        this.currentPage = 1;
        this.sortDirection = {};

        this.setupExportOptions();

        if (this.virtualScrolling) {
            //console.log('Virtual scrolling aktif');
            this.setupVirtualScrolling();
        } else {
            this.createTable();
        }

        this.setupSearch();
        if (!this.virtualScrolling) {
            this.createPagination();
        }
        this.setupExportButtons();
        this.setupErrorHandling();
    }

    setupErrorHandling() {
        window.onerror = (message, source, lineno, colno, error) => {
            // console.error('Terjadi kesalahan:', message, 'di', source, 'baris', lineno);
        };
    }

    sortTable(columnField) {
        const direction = this.sortDirection[columnField] || 'asc';
        const multiplier = direction === 'asc' ? 1 : -1;

        this.data.data.sort((a, b) => {
            if (a[columnField] < b[columnField]) return -1 * multiplier;
            if (a[columnField] > b[columnField]) return 1 * multiplier;
            return 0;
        });

        this.sortDirection[columnField] = direction === 'asc' ? 'desc' : 'asc';
        this.createTable();
    }

    createTable() {
        if (this.virtualScrolling) {
            if (!this.tableWrapper) return;
            this.tableWrapper.innerHTML = '';
            
            const table = this.createTableElement();
            const thead = this.createTableHeader();
            const tbody = document.createElement('tbody');
            
            table.appendChild(thead);
            table.appendChild(tbody);
            this.tableWrapper.appendChild(table);
            
            this.handleScroll(this.scrollWrapper);
            this.updateSortIcons();
        } else {
            this.clearContainer();
            const table = this.createTableElement();
            const thead = this.createTableHeader();
            const tbody = this.createTableBody();
            
            table.appendChild(thead);
            table.appendChild(tbody);
            
            this.appendTableToContainer(table);
            this.updateSortIcons();
            this.updatePaginationInfo();
        }
    }

    clearContainer() {
        const container = document.getElementById(this.options.containerId);
        container.innerHTML = "";
    }

    createTableElement() {
        const table = document.createElement('table');
        table.style = 'width:100%;';
        return table;
    }

    createTableHeader() {
        const thead = document.createElement('thead');
        const headerRow1 = document.createElement('tr');
        const headerRow2 = document.createElement('tr');
        
        const numberHeader = document.createElement('th');
        this.applyStyles(numberHeader, {
            backgroundColor: this.headerStyles.backgroundColor,
            color: this.headerStyles.color,
            fontSize: this.headerStyles.fontSize,
            fontWeight: this.headerStyles.fontWeight,
            textAlign: 'center',
            verticalAlign: 'middle',
            padding: '10px',
            border: '1px solid #ccc'
        });
        numberHeader.rowSpan = 2;
        numberHeader.innerHTML = 'No';
        headerRow1.appendChild(numberHeader);

        this.data.columns.forEach(column => {
            const th = document.createElement('th');
            this.applyStyles(th, {
                backgroundColor: this.headerStyles.backgroundColor,
                color: this.headerStyles.color,
                fontSize: this.headerStyles.fontSize,
                fontWeight: this.headerStyles.fontWeight,
                textAlign: 'center',
                verticalAlign: 'middle',
                padding: '10px',
                border: '1px solid #ccc',
                cursor: 'pointer'
            });

            if (column.columns) {
                th.colSpan = column.columns.filter(subCol => subCol.colum !== false).length;
                th.rowSpan = 1;
                th.innerHTML = `${column.title.split('\n')[0]} <span class="sort-icon  pull-right" data-field="${column.field}"></span>`;
                headerRow1.appendChild(th);

                column.columns.forEach(subCol => {
                    // Skip kolom jika colum adalah false
                    if (subCol.colum === false) return;

                    const subTh = document.createElement('th');
                    subTh.innerHTML = `${subCol.title.split('\n')[0]} <span class="sort-icon  pull-right" data-field="${subCol.field}"></span>`;
                    
                    // Tambahkan class jika ada
                    if (subCol.class) {
                        subTh.className = subCol.class;
                    }

                    this.applyStyles(subTh, {
                        backgroundColor: this.headerStyles.backgroundColor,
                        color: this.headerStyles.color,
                        fontSize: this.headerStyles.fontSize,
                        fontWeight: this.headerStyles.fontWeight,
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '10px',
                        border: '1px solid #ccc',
                        cursor: 'pointer'
                    });
                    subTh.onclick = () => this.sortTable(subCol.field);
                    headerRow2.appendChild(subTh);
                });
            } else {
                th.rowSpan = 2;
                th.colSpan = 1;
                th.innerHTML = `${column.title.split('\n')[0]} <span class="sort-icon pull-right" data-field="${column.field}"></span>`;
                th.onclick = () => this.sortTable(column.field);
                headerRow1.appendChild(th);

                // Tambahkan class jika ada
                if (column.class) {
                    th.className = column.class;
                }
            }
        });

        thead.appendChild(headerRow1);
        thead.appendChild(headerRow2);
        return thead;
    }

    createTableBody() {
        const tbody = document.createElement('tbody');
        const startIndex = (this.currentPage - 1) * this.perPage;
        const endIndex = startIndex + this.perPage;
        const visibleData = this.data.data.slice(startIndex, endIndex);

        visibleData.forEach((rowData, index) => {
            const row = document.createElement('tr');
            
            // Sel nomor
            const numberCell = document.createElement('td');
            numberCell.innerText = startIndex + index + 1;
            this.applyStyles(numberCell, {
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: '400',
                backgroundColor: '#ffffff',
                padding: '10px',
                border: '1px solid #ccc',
                verticalAlign: 'top'
            });
            row.appendChild(numberCell);

            // Iterasi kolom
            this.data.columns.forEach(column => {
                if (column.columns) {
                    column.columns.forEach(subColumn => {
                        // Skip kolom jika colum adalah false
                        if (subColumn.colum === false) return;
                        
                        const td = this.createDataCell(rowData, subColumn, index);
                        row.appendChild(td);
                    });
                } else {
                    const td = this.createDataCell(rowData, column, index);
                    row.appendChild(td);
                }
            });
            tbody.appendChild(row);
        });

        return tbody;
    }

    appendTableToContainer(table) {
        const container = document.getElementById(this.options.containerId);
        container.appendChild(table);
    }

    updateSortIcons() {
        const icons = document.querySelectorAll('.sort-icon');
        icons.forEach(icon => {
            const field = icon.getAttribute('data-field');
            icon.innerHTML = '';
            if (this.sortDirection[field]) {
                icon.innerHTML = this.sortDirection[field] === 'asc' ? ' <i class="icon-feather-chevron-up"></i>' : ' <i class="icon-feather-chevron-down"></i>';
            }
        });
    }

    setupSearch() {
        if (this.searchId) {
            const searchInput = document.getElementById(this.searchId);
            if (searchInput) {
                //console.log('Search input ditemukan:', this.searchId);
                searchInput.addEventListener('input', (e) => {
                    //console.log('Mencari:', e.target.value);
                    this.performSearch(e.target.value);
                });
            } else {
                console.warn(`Elemen pencarian dengan id "${this.searchId}" tidak ditemukan.`);
            }
        }
    }

    buildSearchIndex() {
        //console.log('Building search index for columns:', this.searchableColumns);
        
        // Pastikan data tersedia sebelum membangun index
        if (!this.data || !this.data.columns) {
            console.warn('Data atau kolom belum tersedia untuk search index');
            return;
        }
        
        if (!this.searchableColumns || this.searchableColumns.length === 0) {
            // Jika searchableColumns tidak ditentukan, indeks semua kolom
            this.searchableColumns = this.data.columns.reduce((acc, col) => {
                if (col.columns) {
                    return [...acc, ...col.columns.map(subCol => subCol.field)];
                }
                return [...acc, col.field];
            }, []);
        }

        // Reset search index
        this.searchIndex = {};

        // Buat indeks untuk setiap kolom yang dapat dicari
        this.searchableColumns.forEach(field => {
            this.searchIndex[field] = new Map();
            
            if (!this.data || !this.data.data) {
                console.warn('Data tidak tersedia untuk indexing');
                return;
            }

            this.data.data.forEach((row, idx) => {
                if (row[field] === undefined) {
                    console.warn(`Field "${field}" tidak ditemukan pada baris ${idx}`);
                    return;
                }

                const value = String(row[field]).toLowerCase();
                if (!this.searchIndex[field].has(value)) {
                    this.searchIndex[field].set(value, new Set());
                }
                this.searchIndex[field].get(value).add(idx);
            });
        });

        //console.log('Search index built:', this.searchIndex);
    }

    performSearch(searchText) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            const startTime = performance.now();
            searchText = searchText.toLowerCase();

            if (searchText.length === 0) {
                this.data = {
                    ...this.originalData,
                    data: [...this.originalData.data]
                };
                this.refreshTable();
                return;
            }

            // Gunakan filter langsung untuk pencarian sederhana
            const filteredData = this.originalData.data.filter(row => {
                return this.searchableColumns.some(field => {
                    const value = String(row[field] || '').toLowerCase();
                    return value.includes(searchText);
                });
            });

            // Update data tabel dengan hasil pencarian
            this.data = {
                ...this.originalData,
                data: filteredData
            };

            const endTime = performance.now();
            //console.log(`Pencarian selesai dalam ${endTime - startTime}ms`);

            this.refreshTable();
        }, 300);
    }

    refreshTable() {
        this.currentPage = 1;
        if (this.virtualScrolling) {
            this.setupVirtualScrolling();
        } else {
            this.createTable();
            this.createPagination();
        }
    }

    // Tambahkan cache untuk hasil pencarian
    searchCache = new Map();
    
    performSearchWithCache(searchText) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            searchText = searchText.toLowerCase();

            // Cek cache
            if (this.searchCache.has(searchText)) {
                this.data.data = this.searchCache.get(searchText);
                this.refreshTable();
                return;
            }

            // Lakukan pencarian
            const results = this.performSearch(searchText);
            
            // Simpan ke cache
            if (this.searchCache.size > 100) { // Batasi ukuran cache
                const firstKey = this.searchCache.keys().next().value;
                this.searchCache.delete(firstKey);
            }
            this.searchCache.set(searchText, results);

        }, 300);
    }

    // Tambahkan metode untuk pencarian fuzzy
    performFuzzySearch(searchText, threshold = 0.3) {
        return this.originalData.data.filter(row => {
            return this.searchableColumns.some(field => {
                const value = String(row[field]).toLowerCase();
                return this.calculateLevenshteinDistance(value, searchText.toLowerCase()) <= threshold;
            });
        });
    }

    calculateLevenshteinDistance(str1, str2) {
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));
        
        for(let i = 0; i <= str1.length; i++) track[0][i] = i;
        for(let j = 0; j <= str2.length; j++) track[j][0] = j;
        
        for(let j = 1; j <= str2.length; j++) {
            for(let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                    track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator
                );
            }
        }
        
        return track[str2.length][str1.length];
    }

    applyStyles(element, styles) {
        Object.keys(styles).forEach(style => {
            element.style[style] = styles[style];
        });
    }

    createPagination() {
        // Cek apakah paginasi dibutuhkan
        if (!this.paginationId || this.virtualScrolling) {
            return;
        }

        const paginationContainer = document.getElementById(this.paginationId);
        if (!paginationContainer) {
            console.warn(`Elemen paginasi dengan id "${this.paginationId}" tidak ditemukan, paginasi tidak akan ditampilkan.`);
            return;
        }

        // Hapus paginasi yang ada jika ada
        paginationContainer.innerHTML = '';

        // Jika tidak ada data, tidak perlu membuat paginasi
        if (!this.data || !this.data.data || this.data.data.length === 0) {
            return;
        }

        const paginationList = document.createElement('ul');
        paginationList.className = `pagination justify-content-${this.paginationPosition}`;

        paginationContainer.appendChild(paginationList);

        this.updatePaginationInfo(paginationList);
    }

    updatePaginationInfo(paginationList) {
        // Jika paginationList tidak diberikan, coba dapatkan dari container
        if (!paginationList && this.paginationId) {
            const paginationContainer = document.getElementById(this.paginationId);
            if (!paginationContainer) {
                return;
            }
            paginationList = paginationContainer.querySelector('.pagination');
            if (!paginationList) {
                return;
            }
        }

        // Jika masih tidak ada paginationList, keluar
        if (!paginationList) {
            return;
        }

        // Bersihkan paginasi yang ada
        paginationList.innerHTML = '';

        const totalPages = Math.ceil(this.data.data.length / this.perPage);
        if (totalPages <= 1) {
            return; // Tidak perlu paginasi jika hanya 1 halaman
        }

        const createPageItem = (text, pageNum, active = false, disabled = false) => {
            const li = document.createElement('li');
            li.className = `page-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.innerText = text;
            if (!disabled) {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (text === 'Previous') {
                        this.goToPage(this.currentPage - 1);
                    } else if (text === 'Next') {
                        this.goToPage(this.currentPage + 1);
                    } else if (text === 'Last') {
                        this.goToPage(totalPages);
                    } else if (text === 'First') {
                        this.goToPage(1);
                    } else {
                        this.goToPage(pageNum);
                    }
                });
            }
            li.appendChild(a);
            return li;
        };

        // Tambahkan tombol First
        paginationList.appendChild(createPageItem('First', 1, false, this.currentPage === 1));

        // Tambahkan tombol Previous
        paginationList.appendChild(createPageItem('Previous', this.currentPage - 1, false, this.currentPage === 1));

        // Tambahkan nomor halaman
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(startPage + 4, totalPages);
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationList.appendChild(createPageItem(i, i, i === this.currentPage));
        }

        // Tambahkan tombol Next
        paginationList.appendChild(createPageItem('Next', this.currentPage + 1, false, this.currentPage === totalPages));

        // Tambahkan tombol Last
        paginationList.appendChild(createPageItem('Last', totalPages, false, this.currentPage === totalPages));

        // Tambahkan info halaman
        const pageInfo = document.createElement('li');
        pageInfo.className = 'page-item disabled';
        pageInfo.innerHTML = `<span class="page-link">
            Halaman ${this.currentPage} dari ${totalPages}
            (Total: ${this.data.data.length} data)
        </span>`;
        paginationList.appendChild(pageInfo);
    }

    goToPage(pageNum) {
        const totalPages = Math.ceil(this.data.data.length / this.perPage);
        if (pageNum >= 1 && pageNum <= totalPages && pageNum !== this.currentPage) {
            this.currentPage = pageNum;
            this.createTable();
            this.updatePaginationInfo();
        }
    }

    nextPage() {
        this.goToPage(this.currentPage + 1);
    }

    prevPage() {
        this.goToPage(this.currentPage - 1);
    }

    setupExportButtons() {
        Object.entries(this.exportOptions).forEach(([format, buttonId]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.textContent = format; // Set label tombol sesuai format
                button.addEventListener('click', () => {
                    this.exportData(format);
                });
            } else {
                console.warn(`Elemen ekspor dengan id "${buttonId}" tidak ditemukan.`);
            }
        });
    }

    async exportData(format) {
        const formatKey = format.toLowerCase();
        if (this.exportFormats[formatKey]) {
            try {
                // Load library yang diperlukan
                if (formatKey === 'xlsx') {
                    await this.loadLibrary('xlsx');
                } else if (formatKey === 'pdf') {
                    await this.loadLibrary('pdf');
                    await this.loadLibrary('autoTable');
                }
                
                this.exportFormats[formatKey].processor();
            } catch (error) {
                console.error(`Error saat export ${format}:`, error);
                this.triggerExportCallback('error', formatKey, error);
            }
        } else {
            console.warn(`Format ekspor "${format}" tidak dikenali.`);
        }
    }

    setupExportOptions() {
        this.exportFormats = {
            xlsx: {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                extension: '.xlsx',
                processor: this.exportXLSX.bind(this)
            },
            pdf: {
                mimeType: 'application/pdf',
                extension: '.pdf',
                processor: this.exportPDF.bind(this)
            },
            csv: {
                mimeType: 'text/csv',
                extension: '.csv',
                processor: this.exportCSV.bind(this)
            },
            json: {
                mimeType: 'application/json',
                extension: '.json',
                processor: this.exportJSON.bind(this)
            }
        };
    }

    exportXLSX() {
        try {
            if (typeof XLSX === 'undefined') {
                throw new Error('Library XLSX tidak tersedia');
            }

            // Persiapkan data untuk export
            const exportData = this.prepareExportData();
            
            // Konfigurasi worksheet
            const ws = XLSX.utils.json_to_sheet(exportData.data);
            
            // Styling worksheet
            const wsStyles = {
                '!cols': exportData.columns.map(() => ({ wch: 15 })), // Auto width
                '!rows': [{ hpt: 25 }], // Header height
            };
            
            // Merge dengan style yang ada
            ws['!cols'] = wsStyles['!cols'];
            ws['!rows'] = wsStyles['!rows'];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, this.options.sheetName || "Sheet1");

            // Tambahkan metadata
            wb.Props = {
                Title: this.options.fileName || "Export Data",
                Author: "System",
                CreatedDate: new Date()
            };

            XLSX.writeFile(wb, `${this.options.fileName || 'export'}.xlsx`);
            
            this.triggerExportCallback('success', 'xlsx');
        } catch (error) {
            console.error('Error exporting XLSX:', error);
            this.triggerExportCallback('error', 'xlsx', error);
        }
    }

    async exportPDF() {
        try {
            if (typeof window.jspdf === 'undefined') {
                await this.loadLibrary('pdf');
                await this.loadLibrary('autoTable');
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: this.options.pdfOrientation || 'landscape',
                unit: 'mm',
                format: this.options.pdfFormat || 'a4'
            });

            // Tambahkan header
            if (this.options.title) {
                doc.setFontSize(16);
                doc.text(this.options.title, 14, 15);
            }

            // Konfigurasi autoTable
            doc.autoTable({
                startY: this.options.title ? 25 : 15,
                head: [this.getHeaderRow()],
                body: this.getDataRows(),
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    overflow: 'linebreak',
                    font: 'helvetica'
                },
                headStyles: {
                    fillColor: [66, 139, 202],
                    textColor: 255,
                    fontSize: 9,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: this.getPDFColumnStyles(),
                didDrawPage: (data) => {
                    // Footer
                    doc.setFontSize(8);
                    doc.text(
                        `Diekspor pada: ${new Date().toLocaleString()}`,
                        data.settings.margin.left,
                        doc.internal.pageSize.height - 10
                    );
                },
                margin: { top: 15, right: 15, bottom: 15, left: 15 },
                theme: 'grid'
            });

            // Simpan file
            doc.save(`${this.options.fileName || 'export'}.pdf`);
            this.triggerExportCallback('success', 'pdf');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            this.triggerExportCallback('error', 'pdf', error);
        }
    }

    exportCSV() {
        try {
            const exportData = this.prepareExportData();
            const headers = this.getHeaderRow().join(',');
            const rows = this.getDataRows().map(row => row.join(','));
            
            const csvContent = [headers, ...rows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            this.downloadFile(blob, 'csv');
            this.triggerExportCallback('success', 'csv');
        } catch (error) {
            console.error('Error exporting CSV:', error);
            this.triggerExportCallback('error', 'csv', error);
        }
    }

    exportJSON() {
        try {
            const exportData = {
                metadata: {
                    exportDate: new Date(),
                    totalRecords: this.data.data.length,
                    filters: this.activeFilters || {},
                    sorting: this.sortDirection || {}
                },
                data: this.data.data
            };

            const blob = new Blob(
                [JSON.stringify(exportData, null, 2)], 
                { type: 'application/json' }
            );
            
            this.downloadFile(blob, 'json');
            this.triggerExportCallback('success', 'json');
        } catch (error) {
            console.error('Error exporting JSON:', error);
            this.triggerExportCallback('error', 'json', error);
        }
    }

    // Tambahkan metode untuk memuat data secara bertahap
    loadDataInChunks(chunkSize = 1000) {
        const totalData = this.originalData.data.length;
        let loadedData = 0;

        const loadChunk = () => {
            const chunk = this.originalData.data.slice(loadedData, loadedData + chunkSize);
            this.data.data = this.data.data.concat(chunk);
            loadedData += chunk.length;

            this.createTable();

            if (loadedData < totalData) {
                setTimeout(loadChunk, 0);
            }
        };

        loadChunk();
    }

    static createInstance(options) {
        return new TabelMatrix(options);
    }

    setupVirtualScrolling() {
        if (!this.virtualScrolling) return;

        const container = document.getElementById(this.options.containerId);
        container.innerHTML = '';
        
        // Buat wrapper untuk virtual scrolling
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'virtual-scroll-wrapper';
        tableWrapper.style.height = `${this.options.virtualScrollHeight || 400}px`;
        tableWrapper.style.overflowY = 'auto';
        tableWrapper.style.position = 'relative';
        tableWrapper.style.width = '100%';
        tableWrapper.style.border = '1px solid #ddd';
        tableWrapper.style.backgroundColor = '#fff';
        
        // Buat table dengan struktur fixed
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.tableLayout = 'fixed';
        
        // Buat dan tambahkan thead
        const thead = this.createTableHeader();
        thead.style.position = 'sticky';
        thead.style.top = '0';
        thead.style.zIndex = '1';
        thead.style.backgroundColor = '#fff';
        table.appendChild(thead);
        
        // Buat tbody container
        const tbodyContainer = document.createElement('div');
        tbodyContainer.style.position = 'relative';
        tbodyContainer.style.width = '100%';
        // Set tinggi total untuk scrolling
        tbodyContainer.style.height = `${this.data.data.length * this.rowHeight}px`;
        
        // Buat tbody untuk konten yang terlihat
        const tbody = document.createElement('tbody');
        tbody.style.position = 'absolute';
        tbody.style.width = '100%';
        
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        container.appendChild(tableWrapper);
        
        this.tableWrapper = tableWrapper;
        this.tbody = tbody;
        this.tbodyContainer = tbodyContainer;
        this.table = table;

        // Hitung jumlah baris yang terlihat
        const visibleRowCount = Math.ceil(tableWrapper.clientHeight / this.rowHeight);
        
        // Sesuaikan buffer size
        this.bufferSize = Math.min(
            Math.ceil(visibleRowCount), // Buffer 1x jumlah baris yang terlihat
            50 // Maksimal 50 baris buffer
        );

        let lastScrollTime = 0;
        const scrollThrottleMs = 16;

        tableWrapper.addEventListener('scroll', () => {
            const now = performance.now();
            if (now - lastScrollTime >= scrollThrottleMs) {
                lastScrollTime = now;
                this.handleScroll(tableWrapper);
            }
        });

        // Render awal
        this.handleScroll(tableWrapper);
    }

    handleScroll(wrapper) {
        if (!wrapper || !this.data.data.length) return;
        
        const scrollTop = wrapper.scrollTop;
        const viewportHeight = wrapper.clientHeight;
        const totalHeight = this.data.data.length * this.rowHeight;
        
        // Hitung indeks baris yang terlihat
        const startIndex = Math.floor(scrollTop / this.rowHeight);
        const visibleCount = Math.ceil(viewportHeight / this.rowHeight);
        
        // Hitung range data dengan buffer
        const start = Math.max(0, startIndex - this.bufferSize);
        const end = Math.min(
            this.data.data.length,
            startIndex + visibleCount + this.bufferSize
        );

        // Update scroll container height jika perlu
        this.tbodyContainer.style.height = `${totalHeight}px`;

        // Render hanya jika range berubah
        const currentRange = `${start}-${end}`;
        if (this.lastRange !== currentRange) {
            this.lastRange = currentRange;
            this.renderRows(start, end);
        }
    }

    renderRows(start, end) {
        const fragment = document.createDocumentFragment();
        
        for (let i = start; i < end; i++) {
            const rowData = this.data.data[i];
            if (!rowData) continue;

            const row = document.createElement('tr');
            row.style.position = 'absolute';
            row.style.top = `${i * this.rowHeight}px`;
            row.style.width = '100%';
            row.style.height = `${this.rowHeight}px`;
            row.style.backgroundColor = '#ffffff';
            row.style.display = 'table';
            row.style.tableLayout = 'fixed';
            
            // Tambahkan nomor
            const numberCell = document.createElement('td');
            numberCell.textContent = (i + 1).toString();
            this.applyStyles(numberCell, {
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: '400',
                backgroundColor: '#ffffff',
                padding: '10px',
                border: '1px solid #ccc',
                verticalAlign: 'middle',
                height: `${this.rowHeight}px`
            });
            row.appendChild(numberCell);

            // Render sel data
            this.data.columns.forEach(column => {
                if (column.columns) {
                    column.columns.forEach(subColumn => {
                        const td = this.createDataCell(rowData, subColumn, i);
                        row.appendChild(td);
                    });
                } else {
                    const td = this.createDataCell(rowData, column, i);
                    row.appendChild(td);
                }
            });

            fragment.appendChild(row);
        }

        // Update tbody
        this.tbody.innerHTML = '';
        this.tbody.appendChild(fragment);
    }

    createDataCell(rowData, column, rowIndex) {
        const td = document.createElement('td');
        const fieldToUse = column.field1 || column.field;
        const editConfig = this.editableColumns[fieldToUse];
        
        // Tambahkan class jika ada
        if (column.class) {
            td.className = column.class;
            if (editConfig) {
                td.className += ' editable-cell';
            }
        } else if (editConfig) {
            td.className = 'editable-cell';
        }

        // Buat container untuk konten
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'position: relative; min-height: 20px;';
        
        // Simpan nilai asli
        const originalValue = rowData[column.field];
        
        // Format nilai untuk tampilan
        let formattedValue = '';
        if (editConfig && editConfig[0] === 'search' || editConfig?.type === 'search') {
            // Untuk tipe search, ambil label dari opsi
            const options = Array.isArray(editConfig) ? editConfig[5] : editConfig.options;
            // Cek apakah originalValue adalah object
            const searchValue = typeof originalValue === 'object' ? originalValue.value : originalValue;
            const option = options?.find(opt => opt.value === searchValue);
            formattedValue = option ? option.label : (searchValue || '');
        } else {
            formattedValue = this.formatCellValue(originalValue, column);
        }
        
        contentDiv.innerHTML = formattedValue || '';
        
        // Tambahkan ikon edit jika sel dapat diedit
        if (editConfig) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'edit-icon';
            iconSpan.innerHTML = '<i data-feather="edit-2" style="width: 14px; height: 14px;"></i>';
            td.appendChild(iconSpan);
            
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
            
            // Event listener untuk edit
            td.addEventListener('click', () => {
                if (this.activeEditor) return;
                
                // Cek kondisional editing jika ada
                if (editConfig.conditional && editConfig.conditional.editable) {
                    if (!editConfig.conditional.editable(rowData)) {
                        return; // Tidak dapat diedit berdasarkan kondisi
                    }
                }
                
                const editor = this.createEditor(
                    editConfig.type || editConfig[0],
                    editConfig,
                    originalValue,
                    (newValue) => {
                        if (newValue !== null) {
                            // Simpan nilai baru
                            rowData[column.field] = newValue;
                            
                            // Format dan tampilkan nilai baru
                            const newFormattedValue = this.formatCellValue(newValue, column);
                            contentDiv.innerHTML = newFormattedValue;
                            
                            if (this.options.onCellEdit) {
                                this.options.onCellEdit(rowData, column.field, newValue, rowIndex);
                            }
                        }
                        editor.remove();
                        contentDiv.style.display = 'block';
                        iconSpan.style.display = 'block';
                    }
                );
                
                contentDiv.style.display = 'none';
                iconSpan.style.display = 'none';
                td.appendChild(editor);
                editor.focus();
                this.activeEditor = editor;
            });
        }
        
        td.appendChild(contentDiv);

        this.applyStyles(td, {
            fontSize: '13px',
            fontWeight: '400',
            backgroundColor: '#ffffff',
            padding: '10px',
            border: '1px solid #ccc',
            textAlign: typeof rowData[column.field] === 'number' ? 'right' : 'left',
            verticalAlign: 'top'
        });

        // Tambahkan CSS classes untuk alignment
        if (td.className.includes('center')) {
            td.style.textAlign = 'center';
        } else if (td.className.includes('right')) {
            td.style.textAlign = 'right';
        } else if (td.className.includes('left')) {
            td.style.textAlign = 'left';
        }

        // Tambahkan CSS class untuk bold
        if (td.className.includes('bold')) {
            td.style.fontWeight = 'bold';
        }

        return td;
    }

    // Tambahkan juga method formatCellValue jika belum ada
    formatCellValue(value, column) {
        if (value === null || value === undefined) return '';
        
        const fieldToUse = column.field1 || column.field;
        
        // Jika ada formatter dan nilai bukan HTML
        if (this.columnFormatters[fieldToUse] && !this.isHTML(value)) {
            return this.columnFormatters[fieldToUse](value);
        }
        
        // Jika nilai sudah dalam format HTML atau tidak ada formatter
        return value;
    }

    // Tambahkan method isHTML jika belum ada
    isHTML(str) {
        if (typeof str !== 'string') return false;
        return str.trim().startsWith('<') && str.trim().endsWith('>');
    }

    // Tambahkan method formatDate ke dalam class TabelMatrix
    formatDate(date, format) {
        const pad = (num) => String(num).padStart(2, '0');
        
        const formatMap = {
            'Y': date.getFullYear(),
            'y': date.getFullYear().toString().slice(-2),
            'm': pad(date.getMonth() + 1),
            'd': pad(date.getDate()),
            'H': pad(date.getHours()),
            'i': pad(date.getMinutes()),
            's': pad(date.getSeconds()),
            'j': date.getDate(),
            'n': date.getMonth() + 1,
            'F': new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date),
            'M': new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date),
            'l': new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date),
            'D': new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date),
        };

        return format.split('').map(char => formatMap[char] || char).join('');
    }

    // Tambahkan juga method untuk parsing tanggal
    parseDate(dateString, format) {
        // Jika dateString sudah dalam format ISO atau timestamp
        if (!isNaN(Date.parse(dateString))) {
            return new Date(dateString);
        }

        // Jika format custom
        const formatParts = format.split(/[^YymdHis]/);
        const dateParts = dateString.split(/[^0-9]/);
        const formatMap = {};

        format.split('').forEach((char, index) => {
            if ('YymdHis'.includes(char)) {
                formatMap[char] = dateParts[formatParts.findIndex(part => part.includes(char))];
            }
        });

        const year = formatMap['Y'] || formatMap['y'] || new Date().getFullYear();
        const month = (formatMap['m'] || 1) - 1;
        const day = formatMap['d'] || 1;
        const hours = formatMap['H'] || 0;
        const minutes = formatMap['i'] || 0;
        const seconds = formatMap['s'] || 0;

        return new Date(year, month, day, hours, minutes, seconds);
    }

    // Tambahkan method Reload
    Reload(options) {
        // Validasi parameter
        if (!options || (!options.row && !options.data)) {
            console.warn('Parameter reload tidak valid. Gunakan format: { row: dataset } atau { data: { columns: [], data: [] }}');
            return;
        }

        try {
            // Update data berdasarkan parameter yang diberikan
            if (options.row) {
                // Jika hanya update data rows
                this.data.data = [...options.row];
                this.originalData.data = [...options.row];
            } else if (options.data) {
                // Jika update keseluruhan struktur data
                this.data = {
                    columns: [...(options.data.columns || this.data.columns)],
                    data: [...options.data.data]
                };
                this.originalData = {
                    columns: [...(options.data.columns || this.data.columns)],
                    data: [...options.data.data]
                };
            }

            // Reset state
            this.currentPage = 1;
            this.sortDirection = {};
            
            // Rebuild search index
            this.buildSearchIndex();
            
            // Reset filters jika ada
            if (this.filters) {
                Object.keys(this.filters).forEach(filterKey => {
                    const filterConfig = this.filters[filterKey];
                    const filterElement = document.getElementById(filterConfig.element);
                    if (filterElement) {
                        if (filterConfig.type === 'select') {
                            this.populateFilterOptions(filterElement, filterConfig.field);
                        }
                        filterElement.value = 'all';
                    }
                });
            }

            // Perbarui tampilan
            if (this.virtualScrolling) {
                this.setupVirtualScrolling();
            } else {
                this.createTable();
                this.createPagination();
            }

            //console.log('Tabel berhasil dimuat ulang');
            return true;

        } catch (error) {
            console.error('Gagal memuat ulang tabel:', error);
            return false;
        }
    }

    // Tambahkan method addTabel
    addTabel(newData) {
        try {
            // Validasi parameter
            if (!newData || !newData.columns) {
                throw new Error('Data tidak valid. Format yang benar: { columns: [...] }');
            }

            // Buat data row baru dari values di kolom
            const newRow = {};
            
            // Map nilai-nilai dari kolom baru ke struktur kolom yang ada
            newData.columns.forEach(column => {
                if (column.columns) {
                    column.columns.forEach(subCol => {
                        // Gunakan field dari struktur kolom yang ada jika ada
                        const existingSubCol = this.originalData.columns
                            .find(c => c.columns)?.columns
                            .find(sc => sc.title === subCol.title);
                        
                        const field = existingSubCol?.field || subCol.field || `field_${Math.random().toString(36).substr(2, 9)}`;
                        if (subCol.value !== undefined) {
                            newRow[field] = subCol.value;
                        }
                    });
                } else {
                    // Untuk kolom tunggal
                    const existingCol = this.originalData.columns
                        .find(c => c.title === column.title);
                    
                    const field = existingCol?.field || column.field || column.value;
                    if (column.value !== undefined) {
                        newRow[field] = column.value;
                    }
                }
            });

            // Gabungkan data baru dengan data yang ada
            this.data = {
                // Gunakan struktur kolom yang ada
                columns: [...this.originalData.columns],
                // Tambahkan data baru di awal array
                data: [newRow, ...this.originalData.data]
            };

            // Update originalData juga
            this.originalData = {
                columns: [...this.originalData.columns],
                data: [newRow, ...this.originalData.data]
            };

            // Reset state
            this.currentPage = 1;
            this.sortDirection = {};
            
            // Rebuild search index
            this.buildSearchIndex();

            // Perbarui tampilan
            if (this.virtualScrolling) {
                this.setupVirtualScrolling();
            } else {
                this.createTable();
                this.createPagination();
            }

            //console.log('Data baru berhasil ditambahkan di urutan pertama');
            return true;

        } catch (error) {
            console.error('Gagal menambahkan data:', error);
            return false;
        }
    }

    // Tambahkan method filterKey ke dalam class TabelMatrix
    filterKey(key, value) {
        try {
            // Validasi parameter
            if (!key || value === undefined) {
                throw new Error('Parameter tidak valid. Gunakan format: filterKey(key, value)');
            }

            // Simpan data yang difilter
            const filteredData = this.originalData.data.filter(row => {
                // Konversi nilai ke string untuk perbandingan yang konsisten
                const rowValue = String(row[key] || '').toLowerCase();
                const searchValue = String(value).toLowerCase();
                
                // Gunakan includes untuk pencocokan parsial
                return rowValue.includes(searchValue);
            });

            // Update data tabel dengan hasil filter
            this.data = {
                columns: [...this.originalData.columns],
                data: filteredData
            };

            // Reset state
            this.currentPage = 1;
            this.sortDirection = {};
            
            // Rebuild search index
            this.buildSearchIndex();

            // Perbarui tampilan
            if (this.virtualScrolling) {
                this.setupVirtualScrolling();
            } else {
                this.createTable();
                this.createPagination();
            }

            //console.log(`Data berhasil difilter berdasarkan ${key}=${value}`);
            return true;

        } catch (error) {
            console.error('Gagal memfilter data:', error);
            return false;
        }
    }

    // Tambahkan method untuk mereset filter
    resetFilter() {
        // Kembalikan ke data original
        this.data = {
            columns: [...this.originalData.columns],
            data: [...this.originalData.data]
        };

        // Reset state
        this.currentPage = 1;
        this.sortDirection = {};
        
        // Rebuild search index
        this.buildSearchIndex();

        // Perbarui tampilan
        if (this.virtualScrolling) {
            this.setupVirtualScrolling();
        } else {
            this.createTable();
            this.createPagination();
        }

        //console.log('Filter direset');
    }

    // Method baru untuk menangani pembuatan editor
    createEditor(type, config, value, callback) {
        if (type === 'search') {
            const editor = document.createElement('select');
            
            // Handle konfigurasi array format
            let width, placeholder, searchable, options;
            
            if (Array.isArray(config)) {
                [, width, , placeholder, searchable, options] = config;
            } else {
                width = config.width || 6;
                placeholder = config.placeholder;
                searchable = config.searchable;
                options = config.options;
            }
            
            editor.className = `form-control col-md-${width}`;
            editor.innerHTML = `<option value="">${placeholder || 'Pilih...'}</option>`;
            
            // Handle options
            const optionsList = Array.isArray(options) ? options : 
                (typeof options === 'function' ? options(this.currentRow) : []);
            
            // Tambahkan semua opsi ke select dan cari label yang sesuai dengan value
            let selectedLabel = '';
            optionsList.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                
                // Simpan label jika value cocok
                if (value === opt.value) {
                    option.selected = true;
                    selectedLabel = opt.label;
                }
                
                editor.appendChild(option);
            });

            // Tambahkan fitur searchable
            if (searchable) {
                if (window.jQuery && window.jQuery.fn.select2) {
                    jQuery(editor).select2({
                        placeholder: placeholder || 'Pilih...',
                        allowClear: true,
                        width: '100%',
                        dropdownParent: jQuery(editor).parent(),
                        // Inisialisasi dengan label yang sesuai
                        initSelection: function(element, callback) {
                            if (value && selectedLabel) {
                                callback({ id: value, text: selectedLabel });
                            }
                        }
                    });

                    // Set nilai awal untuk select2
                    if (value && selectedLabel) {
                        const newOption = new Option(selectedLabel, value, true, true);
                        jQuery(editor).append(newOption).trigger('change');
                    }
                }
            }

            // Event handlers
            editor.addEventListener('change', () => {
                const newValue = editor.value;
                const selectedOption = optionsList.find(opt => opt.value === newValue);
                if (newValue && selectedOption) {
                    // Hanya simpan value, bukan object
                    callback(newValue);
                } else {
                    callback(null);
                }
                this.activeEditor = null;
            });

            editor.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!this.activeEditor) return;
                    const newValue = editor.value;
                    const selectedOption = optionsList.find(opt => opt.value === newValue);
                    if (newValue && selectedOption) {
                        // Hanya simpan value, bukan object
                        callback(newValue);
                    } else {
                        callback(null);
                    }
                    this.activeEditor = null;
                }, 100);
            });

            editor.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.activeEditor = null;
                    callback(null);
                }
            });

            return editor;
        }
        
        // Lanjutkan dengan kode editor yang sudah ada
        const cleanValue = this.cleanValueForEditor(value);
        
        const editor = document.createElement(type === 'select' ? 'select' : 'input');
        
        // Dapatkan konfigurasi yang diperluas
        const editorConfig = this.getEditorConfig(type, config, cleanValue);
        
        switch(type) {
            case 'text':
            case 'number':
                editor.type = type;
                editor.className = `form-control col-md-${editorConfig.width}`;
                editor.placeholder = editorConfig.placeholder;
                editor.value = cleanValue;
                
                // Tambahkan validasi HTML5
                if (editorConfig.validation) {
                    if (editorConfig.validation.required) editor.required = true;
                    if (editorConfig.validation.minLength) editor.minLength = editorConfig.validation.minLength;
                    if (editorConfig.validation.maxLength) editor.maxLength = editorConfig.validation.maxLength;
                    if (editorConfig.validation.pattern) editor.pattern = editorConfig.validation.pattern;
                    if (type === 'number') {
                        if (editorConfig.validation.min) editor.min = editorConfig.validation.min;
                        if (editorConfig.validation.max) editor.max = editorConfig.validation.max;
                        if (editorConfig.validation.step) editor.step = editorConfig.validation.step;
                    }
                }
                break;
                
            case 'select':
                editor.className = `form-control col-md-${editorConfig.width}`;
                editor.innerHTML = `<option value="">${editorConfig.placeholder}</option>`;
                
                // Handle dynamic options
                const options = typeof editorConfig.options === 'function' 
                    ? editorConfig.options(this.currentRow)
                    : editorConfig.options;
                    
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    option.selected = cleanValue === opt.value;
                    editor.appendChild(option);
                });
                
                // Add searchable feature if enabled
                if (editorConfig.searchable) {
                    this.makeSelectSearchable(editor);
                }
                break;
                
            case 'datepicker':
                editor.type = 'date';
                editor.className = `form-control col-md-${editorConfig.width}`;
                editor.placeholder = editorConfig.placeholder;
                
                // Handle date constraints
                if (editorConfig.minDate) editor.min = editorConfig.minDate;
                if (editorConfig.maxDate) editor.max = editorConfig.maxDate;
                
                // Format tanggal untuk input
                if (cleanValue) {
                    const date = new Date(cleanValue);
                    editor.value = date.toISOString().split('T')[0];
                }

                // Tambahkan event handler khusus untuk datepicker
                editor.addEventListener('change', () => {
                    if (!editor.value) {
                        callback(null);
                        return;
                    }

                    const date = new Date(editor.value);
                    let formattedDate;

                    // Format sesuai dengan placeholder yang ditentukan
                    const format = editorConfig.placeholder;
                    if (format) {
                        formattedDate = this.formatDate(date, format);
                    } else {
                        formattedDate = date.toISOString().split('T')[0];
                    }

                    callback(formattedDate);
                    this.activeEditor = null;
                });

                break;
                
            case 'textarea':
                const textarea = document.createElement('textarea');
                textarea.className = `form-control col-md-${editorConfig.width}`;
                textarea.placeholder = editorConfig.placeholder;
                textarea.value = cleanValue;
                textarea.rows = editorConfig.rows || 3;
                if (editorConfig.maxLength) textarea.maxLength = editorConfig.maxLength;
                return textarea;
                
            case 'checkbox':
            case 'radio':
                const wrapper = document.createElement('div');
                wrapper.className = `col-md-${editorConfig.width}`;
                
                editorConfig.options.forEach(opt => {
                    const container = document.createElement('div');
                    container.className = `form-check`;
                    
                    const input = document.createElement('input');
                    input.type = type;
                    input.className = 'form-check-input';
                    input.name = editorConfig.name || 'group';
                    input.value = opt.value;
                    input.checked = cleanValue === opt.value;
                    
                    const label = document.createElement('label');
                    label.className = 'form-check-label';
                    label.textContent = opt.label;
                    
                    container.appendChild(input);
                    container.appendChild(label);
                    wrapper.appendChild(container);
                });
                return wrapper;
        }

        // Tambahkan event handlers
        if (editorConfig.events) {
            Object.entries(editorConfig.events).forEach(([event, handler]) => {
                editor.addEventListener(event, handler);
            });
        }

        // Event handlers default
        editor.addEventListener('blur', () => {
            setTimeout(() => {
                if (!this.activeEditor) return;
                
                let newValue = editor.value;
                
                // Validasi
                if (editorConfig.validation && !this.validateValue(newValue, editorConfig.validation)) {
                    editor.classList.add('is-invalid');
                    return;
                }
                
                // Transform nilai setelah edit
                if (editorConfig.transform && editorConfig.transform.afterEdit) {
                    newValue = editorConfig.transform.afterEdit(newValue);
                }
                
                this.activeEditor = null;
                callback(newValue);
            }, 100);
        });
        
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && type !== 'textarea') {
                e.preventDefault();
                let newValue = editor.value;
                
                if (editorConfig.validation && !this.validateValue(newValue, editorConfig.validation)) {
                    editor.classList.add('is-invalid');
                    return;
                }
                
                if (editorConfig.transform && editorConfig.transform.afterEdit) {
                    newValue = editorConfig.transform.afterEdit(newValue);
                }
                
                this.activeEditor = null;
                callback(newValue);
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                this.activeEditor = null;
                callback(null);
            }
        });

        return editor;
    }

    // Method baru untuk mendapatkan konfigurasi editor yang diperluas
    getEditorConfig(type, config, value) {
        // Jika config adalah array (format lama)
        if (Array.isArray(config)) {
            return {
                type: type,
                width: config[1],
                label: config[2],
                placeholder: config[3],
                options: config[4] || []
            };
        }
        
        // Format baru (object)
        return {
            type: type,
            width: config.width || 12,
            label: config.label || '',
            placeholder: config.placeholder || '',
            validation: config.validation || {},
            transform: config.transform || {},
            events: config.events || {},
            options: config.options || [],
            searchable: config.searchable || false,
            multiple: config.multiple || false,
            rows: config.rows,
            maxLength: config.maxLength,
            minDate: config.minDate,
            maxDate: config.maxDate,
            format: config.format,
            conditional: config.conditional || {}
        };
    }

    // Method untuk validasi nilai
    validateValue(value, validation) {
        if (!validation) return true;
        
        if (validation.required && !value) return false;
        if (validation.minLength && value.length < validation.minLength) return false;
        if (validation.maxLength && value.length > validation.maxLength) return false;
        if (validation.pattern && !validation.pattern.test(value)) return false;
        if (validation.custom && !validation.custom(value)) return false;
        
        return true;
    }

    // Method untuk membuat select searchable
    makeSelectSearchable(select) {
        // Implementasi fitur pencarian untuk select
        // Bisa menggunakan library seperti select2 atau implementasi custom
    }

    // Method untuk membersihkan HTML untuk editor
    cleanValueForEditor(value) {
        if (!value) return '';
        
        // Jika nilai bukan string, konversi ke string
        if (typeof value !== 'string') {
            return String(value);
        }
        
        // Jika nilai adalah HTML
        if (this.isHTML(value)) {
            const temp = document.createElement('div');
            temp.innerHTML = value;
            const cleanText = temp.textContent || temp.innerText || '';
            temp.remove();
            return cleanText;
        }
        
        // Jika nilai bukan HTML, kembalikan apa adanya
        return value;
    }

    // Tambahkan method helper untuk mendapatkan label dari nilai search
    getSearchLabel(value, config) {
        if (!value) return '';
        
        const options = config.options || config[4] || [];
        const option = options.find(opt => opt.value === value);
        return option ? option.label : value;
    }

    // Tambahkan method setupFilters
    setupFilters() {
        if (!this.filters) return;
        
        // Iterasi semua filter yang didefinisikan
        Object.keys(this.filters).forEach(filterKey => {
            const filterConfig = this.filters[filterKey];
            const filterElement = document.getElementById(filterConfig.element);
            
            if (filterElement) {
                // Jika tipe select, populate options
                if (filterConfig.type === 'select') {
                    this.populateFilterOptions(filterElement, filterConfig.field);
                }
                
                // Tambahkan event listener
                filterElement.addEventListener('change', () => {
                    this.filterData();
                });
            }
        });
    }

    // Tambahkan method populateFilterOptions
    populateFilterOptions(selectElement, field) {
        // Dapatkan nilai unik untuk field
        const uniqueValues = [...new Set(this.originalData.data
            .map(item => item[field])
            .filter(Boolean))] // Remove null/undefined
            .sort();
        
        // Tambahkan options ke select element
        selectElement.innerHTML = `
            <option value="all">Semua</option>
            ${uniqueValues.map(value => 
                `<option value="${value}">${value}</option>`
            ).join('')}
        `;
    }

    // Tambahkan method filterData
    filterData() {
        // Mulai dengan semua data original
        let filteredData = [...this.originalData.data];

        // Terapkan setiap filter secara berurutan
        Object.keys(this.filters).forEach(filterKey => {
            const filterConfig = this.filters[filterKey];
            const filterElement = document.getElementById(filterConfig.element);
            
            if (filterElement && filterElement.value && filterElement.value !== 'all') {
                filteredData = filteredData.filter(row => {
                    const filterField = filterConfig.field;
                    const rowValue = row[filterField];
                    
                    // Handle different filter types
                    switch(filterConfig.type) {
                        case 'select':
                            return String(rowValue) === String(filterElement.value);
                        case 'date':
                            if (!rowValue || !filterElement.value) return false;
                            const rowDate = new Date(rowValue);
                            const filterDate = new Date(filterElement.value);
                            return rowDate.toDateString() === filterDate.toDateString();
                        default:
                            return String(rowValue) === String(filterElement.value);
                    }
                });
            }
        });

        // Update data tabel dengan hasil filter
        this.data = {
            columns: [...this.originalData.columns],
            data: filteredData
        };

        // Reset state dan perbarui tampilan
        this.currentPage = 1;
        this.createTable();
        this.createPagination();
        this.buildSearchIndex();
    }
}
//AND Tabel Matrix
// DarkMode
export  class DarkMode {
  constructor() {
    // Properties
    this.body = document.body;
    this.themeToggle = document.getElementById('themeToggle');
    
    // Periksa apakah themeToggle ada sebelum melanjutkan
    if (!this.themeToggle) {
    
      return;
    }

    this.themeIcon = this.themeToggle.querySelector('i');
    this.menuToggle = document.getElementById('menuToggle');
    this.sidebar = document.querySelector('.sidebar-grid');
    this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initialize hanya jika themeToggle ada
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadThemePreference();
  }

  setupEventListeners() {
    // Toggle theme event
    this.themeToggle.addEventListener('click', () => {
      this.body.classList.toggle('dark-mode-grid');
      this.updateThemeIcon();
      this.saveThemePreference();
    });

    // System theme change event
    this.prefersDarkScheme.addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) {
        if (e.matches) {
          this.body.classList.add('dark-mode-grid');
        } else {
          this.body.classList.remove('dark-mode-grid');
        }
        this.updateThemeIcon();
      }
    });
  }

  updateThemeIcon() {
    // Icon akan otomatis berganti karena menggunakan CSS display
    // Tidak perlu mengubah class
  }

  saveThemePreference() {
    const isDarkMode = this.body.classList.contains('dark-mode-grid');
    onCookie('darkmode',isDarkMode || '')
    localStorage.setItem('darkMode', isDarkMode);
  }

  loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');

    if (savedTheme !== null) {
      // Use saved preference
      if (savedTheme === 'true') {
        this.body.classList.add('dark-mode-grid');
      }
    } else {
      // Use system preference
      if (this.prefersDarkScheme.matches) {
        this.body.classList.add('dark-mode-grid');
      }
    }

    this.updateThemeIcon();
  }
}




// AND DarkMode
export class Crypto {
  constructor(tokenize) {
    this.init = new Ngorei();
    this.Net = new Ngorei().Network();
  }

  async authenticate(data, callbacks = {}) {
    try {
      // 1. Generate token
      const encrypt = this.init.Tokenize({
        'payload': data.payload,
      }, data.endpoint);

      // Callback untuk hasil token
      if (callbacks.onToken) {
        callbacks.onToken(encrypt);
      }

      // 2. Kirim request
      const response = await this.Net.Brief({
        endpoint: data.endpoint,
        token: encrypt
      });

      // Callback untuk status permintaan
      if (callbacks.onStatus) {
        callbacks.onStatus(response);
      }

      // 3. Decrypt response
      const decrypt = this.init.Tokenize({
        'payload': response.data.token,
      }, data.endpoint);

      // Callback untuk hasil akhir
      if (callbacks.onResult) {
        callbacks.onResult(decrypt);
      }
      
      return decrypt;

    } catch (error) {
      // console.error('Authentication error:', error);
      // throw error;
    }
  }
}
/**
 * ==============================
 * Class: ViewStack
 * ==============================
 */
export class ViewStack {
    constructor(callbacks = {}) {
        this.pathname = md5(window.location.pathname);
        this.dbName = 'viewStackDB';
        this.storeName = 'viewStates';
        this.callbacks = callbacks;
        this.currentTargetId = null;
        this.initDB();
        
        const style = document.createElement('style');
        style.textContent = `
            [data-stack] {
                display: none;
            }
            [data-stack][data-active] {
                display: block;
            }
            [data-section] {
                display: none;
            }
            [data-section][data-active] {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                this.init();
                resolve();
            };
        });
    }

    async saveViewState(viewId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(viewId, this.pathname);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getViewState() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(this.pathname);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    handleViewChange = async (targetId) => {
        this.currentTargetId = targetId;
        const [parentId, ...childPaths] = targetId.split('/');
        const childId = childPaths.join('/');
        onCookie('pageview',childId || '')
        if (this.callbacks.beforeViewChange) {
            this.callbacks.beforeViewChange(parentId, childId);
        }

        document.querySelectorAll('[data-stack], .viewstack, .Viewstack').forEach(view => {
            view.style.display = 'none';
            view.removeAttribute('data-active');
        });
        
        const parentView = document.getElementById(parentId) || 
                          document.querySelector(`[data-stack="${parentId}"]`) ||
                          document.querySelector(`.viewstack#${parentId}`) ||
                          document.querySelector(`.Viewstack#${parentId}`);
       
        if (parentView) {
            parentView.style.display = '';
            parentView.setAttribute('data-active', '');

            if (!childId) {
                parentView.querySelectorAll('[data-section]').forEach(section => {
                    section.style.display = '';
                    section.setAttribute('data-active', '');
                });
            } else {
                parentView.querySelectorAll('[data-section]').forEach(section => {
                    section.style.display = 'none';
                    section.removeAttribute('data-active');
                });

                const childView = parentView.querySelector(`#${childId}`) ||
                                parentView.querySelector(`[data-section="${childId}"]`);
                
                if (childView) {
                    childView.style.display = '';
                    childView.setAttribute('data-active', '');
                } else {
                    console.warn(`Child view "${childId}" tidak ditemukan dalam "${parentId}"`);
                }
            }
            
            await this.saveViewState(targetId);

            if (this.callbacks.afterViewChange) {
                this.callbacks.afterViewChange(parentId, childId, parentView);
            }
        } else {
            console.warn(`Parent view "${parentId}" tidak ditemukan`);
            if (this.callbacks.onViewNotFound) {
                this.callbacks.onViewNotFound(parentId);
            }
        }
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('href').substring(1);
                e.preventDefault();
                this.handleViewChange(targetId);
                history.pushState(null, '', `#${targetId}`);


                if (this.callbacks.onNavigate) {
                    this.callbacks.onNavigate(targetId);
                }
            });
        });

        window.addEventListener('load', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                this.handleViewChange(hash);
            }
        });

        window.addEventListener('popstate', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                this.handleViewChange(hash);
            }
        });

        (async () => {
            const hash = window.location.hash.substring(1);
            const lastView = await this.getViewState();
            
            if (hash) {
                await this.handleViewChange(hash);
            } else if (lastView) {
                await this.handleViewChange(lastView);
                history.replaceState(null, '', `#${lastView}`);
            }

            if (this.callbacks.onInit) {
                this.callbacks.onInit();
            }
        })();
    }

    getViewInfo() {
        const currentUrl = window.location.hash.substring(1);
        const activeView = document.querySelector('[data-stack][data-active]');
        const activeSection = document.querySelector('[data-section][data-active]');
        
        return {
            URL: currentUrl || 'home',
            View: activeView?.id || 'home',
            Section: activeSection?.id || '',
            Page: currentUrl ? currentUrl.split('/')[0] : 'home',
            Params: currentUrl ? currentUrl.split('/').slice(1).join(', ') : ''
        };
    }
}

export function onCookie(name, value) {
  // Membuat cookie dengan waktu kedaluwarsa sesi
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; path=/`;
}

export function getOnCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
export class getViewStack {
  
    getViewInfo() {
        const currentUrl = window.location.hash.substring(1);
        const activeView = document.querySelector('[data-stack][data-active]');
        
        return {
            URL: currentUrl || 'home',
            View: activeView?.id || 'home',
            Page: currentUrl ? currentUrl.split('/')[0] : 'home',
            Params: currentUrl ? currentUrl.split('/').slice(1).join(', ') : ''
        };
    }
} 

// SidebarMenu
export class SidebarMenu {
    constructor(selector = '.section-header-grid') {
        this.sectionHeaders = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        // Load saved state
        this.loadSavedState();
        
        // Add click listeners
        this.sectionHeaders.forEach(button => {
            button.addEventListener('click', () => this.toggleSection(button));
        });
    }

    toggleSection(button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Jika section sudah terbuka, tutup saja
        if (isExpanded) {
            this.closeSection(button);
            localStorage.removeItem('lastOpenSection');
            return;
        }
        
        // Tutup semua section terlebih dahulu
        this.closeAllSections();
        
        // Buka section yang diklik
        this.openSection(button);
        
        // Simpan ID section yang terakhir dibuka
        const sectionId = button.querySelector('span').textContent;
        localStorage.setItem('lastOpenSection', sectionId);
    }

    closeSection(button) {
        button.setAttribute('aria-expanded', 'false');
        button.nextElementSibling.classList.add('collapsed');
    }

    openSection(button) {
        button.setAttribute('aria-expanded', 'true');
        button.nextElementSibling.classList.remove('collapsed');
    }

    closeAllSections() {
        this.sectionHeaders.forEach(header => this.closeSection(header));
    }

    loadSavedState() {
        const lastOpenSection = localStorage.getItem('lastOpenSection');
        if (lastOpenSection) {
            this.sectionHeaders.forEach(button => {
                const sectionId = button.querySelector('span').textContent;
                if (sectionId === lastOpenSection) {
                    this.openSection(button);
                }
            });
        }
    }
}

export const filterRow = (data, propertyMap) => {
  return data.map((item) => {
    const newObj = {};
    Object.entries(propertyMap).forEach(([oldKey, newKey]) => {
      if (item.hasOwnProperty(oldKey)) {
        newObj[newKey] = item[oldKey];
      }
    });
    return newObj;
  });
};
const TOKEN_CONFIG = {
    expiresIn: 60 * 60 * 24 * 7, // 7 hari dalam detik
    algorithm: 'AES-CBC',
    keySize: 256
};
export function encryptToken(data,cradensial) {
    const tokenData = {
        ...data,
        exp: Math.floor(Date.now() / 1000) + TOKEN_CONFIG.expiresIn,
        iat: Math.floor(Date.now() / 1000)
    };
    try {
        const jsonString = JSON.stringify(tokenData);
        const keyBytes = CryptoJS.SHA256(cradensial);
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(jsonString, keyBytes, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const ivCiphertext = iv.concat(encrypted.ciphertext);
        return encodeURIComponent(CryptoJS.enc.Base64.stringify(ivCiphertext));
    } catch (error) {
        throw new Error('Gagal mengenkripsi data: ' + error.message);
    }
}

export function decryptToken(token,cradensial) {
    try {
        const decodedToken = decodeURIComponent(token);
        const cipherData = CryptoJS.enc.Base64.parse(decodedToken);
        
        const keyBytes = CryptoJS.SHA256(cradensial);
        
        const iv = CryptoJS.lib.WordArray.create(cipherData.words.slice(0, 4));
        const ciphertext = CryptoJS.lib.WordArray.create(cipherData.words.slice(4));
        
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext },
            keyBytes,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        if (!decryptedString) {
            throw new Error('Hasil dekripsi kosong');
        }
        const decoded = JSON.parse(decryptedString);
        
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            throw new Error('Token sudah kadaluarsa');
        }
        
        return decoded;
    } catch (error) {
        throw new Error('Token tidak valid: ' + error.message);
    }
}

export function tokenize(userData,cradensial) {
    if (!userData?.payload) {
        throw new Error('Data tidak lengkap');
    }
    const { payload } = userData;
    
    if (typeof payload === 'string') {
        return decryptToken(payload,cradensial);
    } 
    
    if (Array.isArray(payload) || (typeof payload === 'object' && payload !== null)) {
        return encryptToken(userData,cradensial);
    }
    
    throw new Error('Format payload tidak valid');
}
 

export class SectionId {
    constructor() {
         this.pathname = md5(window.location.pathname);
        // Inisialisasi properti
        this.sections = document.querySelectorAll('section');
        this.links = document.querySelectorAll('a[href*="#"]');
        this.currentSection = null;
        this.dbName = 'sectionDB';
        this.storeName = 'activeSection';

        // Inisialisasi IndexedDB
        this.initIndexedDB().then(() => {
            this.loadActiveSection();
        });

        // Inisialisasi event
        this.init();
    }

    /**
     * Inisialisasi IndexedDB
     */
    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                console.error('Gagal membuka IndexedDB');
                reject();
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
        });
    }

    /**
     * Menyimpan section yang aktif ke IndexedDB
     */
    saveActiveSection(targetId) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        onCookie('pagesection',targetId || '')

        store.put({
            id: this.pathname,
            targetId: targetId
        });
    }

    /**
     * Memuat section yang aktif dari IndexedDB
     */
    async loadActiveSection() {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(this.pathname);

        request.onsuccess = (event) => {
            const result = event.target.result;
            if (result && result.targetId) {
                this.handleClick(result.targetId);
            }
        };
    }

    /**
     * Inisialisasi event dan setup awal
     */
    init() {
        // console.log('Menjalankan init()');
        // console.log('Jumlah links:', this.links.length);
        
        if (this.links.length === 0) {
            // console.warn('Tidak ada link yang ditemukan di halaman');
            return;
        }

        this.links.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                const targetId = e.currentTarget.href.split('#').pop();
                e.preventDefault();
                this.handleClick(targetId);
                history.pushState(null, '', `#${targetId}`);
            });
        });
    }

    /**
     * Menangani event klik
     * @param {string} targetId - ID dari section yang dituju
     */
    handleClick(targetId) {
        // Simpan section yang aktif
        this.currentSection = targetId;
        
        // Simpan ke IndexedDB
        this.saveActiveSection(targetId);
        
        // Sembunyikan semua section terlebih dahulu
        document.querySelectorAll('[data-sectionid], .sectionid').forEach(view => {
            view.style.display = 'none';
            view.removeAttribute('data-active');
        });
        
        // Cari parent view dengan lebih efisien
        const parentView = document.getElementById(targetId) || 
                          document.querySelector(`[data-sectionid="${targetId}"]`) ||
                          document.querySelector(`.sectionid#${targetId}`);

        if (parentView) {
            // Tampilkan parent view
            parentView.style.display = '';
            parentView.setAttribute('data-active', '');
            
            // Jika tidak ada targetId, tampilkan semua child section
            if (!targetId) {
                parentView.querySelectorAll('[data-sectionid]').forEach(section => {
                    section.style.display = '';
                    section.setAttribute('data-active', '');
                });
            } else {
                // Sembunyikan semua child section dulu
                parentView.querySelectorAll('[data-sectionid]').forEach(section => {
                    section.style.display = 'none';
                    section.removeAttribute('data-active');
                });

                // Cari dan tampilkan child section yang sesuai
                const childView = parentView.querySelector(`[data-sectionid="${targetId}"]`);
                
                if (childView) {
                    childView.style.display = '';
                    childView.setAttribute('data-active', '');
                }
            }
        } else {
            // console.warn(`Section dengan id "${targetId}" tidak ditemukan`);
        }
    }
}


export function initFileInput() {
    const fileInputs = document.querySelectorAll('.form-nexa-file-input');
    
    fileInputs.forEach(input => {
        const fileList = input.closest('.form-nexa').querySelector('.form-nexa-file-list');
        const label = input.nextElementSibling;
        
        // Drag & Drop events
        label.addEventListener('dragover', (e) => {
            e.preventDefault();
            label.classList.add('drag-active');
        });
        
        label.addEventListener('dragleave', () => {
            label.classList.remove('drag-active');
        });
        
        label.addEventListener('drop', (e) => {
            e.preventDefault();
            label.classList.remove('drag-active');
            handleFiles(input.files || e.dataTransfer.files);
        });
        
        // File selection event
        input.addEventListener('change', () => {
            handleFiles(input.files);
        });
        
        // Handle selected files
        function handleFiles(files) {
            fileList.innerHTML = ''; // Clear existing list
            
            Array.from(files).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'form-nexa-file-item';
                
                // Format file size
                const size = file.size < 1024 * 1024 
                    ? (file.size / 1024).toFixed(2) + ' KB'
                    : (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                
                fileItem.innerHTML = `
                    <i class="fas fa-file"></i>
                    <span class="form-nexa-file-item-name">${file.name} (${size})</span>
                    <i class="fas fa-times form-nexa-file-item-remove"></i>
                `;
                
                fileList.appendChild(fileItem);
                
                // Remove file
                fileItem.querySelector('.form-nexa-file-item-remove').addEventListener('click', () => {
                    fileItem.remove();
                    // Note: Actual file removal needs to be handled separately
                });
            });
        }
    });
}

export function createForm(ret, callback) {
    const formInput=ret.formid
    const submitForm=ret.submitid
    const fileInput=ret.fileInput

  // formInput,submitForm
  if (fileInput) {
     initFileInput()
  }
    // Mengembalikan Promise untuk menangani data form
    return new Promise((resolve) => {
        // Fungsi untuk menghapus class error
        const removeErrorClass = (element) => {
            const formGroup = element.closest('.form-nexa');
            if (formGroup) {
                formGroup.classList.remove('form-error');
                const errorMessage = formGroup.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        };

        // Fungsi validasi berdasarkan tipe input
        const validateInput = (element) => {
            const type = element.type;
            const name = element.name;
            
            switch(type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(element.value)) {
                        return `${name} harus berupa email yang valid`;
                    }
                    break;
                    
                case 'tel':
                    // Bersihkan nomor dari karakter non-digit
                    const cleanNumber = element.value.replace(/[^\d]/g, '');
                    
                    // Cek format Indonesia
                    const isStartWith08 = /^08\d{8,11}$/.test(cleanNumber); // Format 08xx
                    const isStartWith62 = /^62\d{9,12}$/.test(cleanNumber); // Format 62xx atau +62xx
                    const isStartWithArea = /^[2-3]\d{8,11}$/.test(cleanNumber); // Format fixed line 02x atau 03x
                    
                    if (!element.value) {
                        return `${name} tidak boleh kosong`;
                    }
                    
                    if (!isStartWith08 && !isStartWith62 && !isStartWithArea) {
                        return `${name} tidak valid. Gunakan format: 08xx, +62xx, 02x, atau 03x`;
                    }
                    
                    // Cek panjang minimum dan maksimum
                    if (cleanNumber.length < 8 || cleanNumber.length > 13) {
                        return `${name} harus antara 8-13 digit`;
                    }
                    break;
                    
                case 'radio':
                    const radioGroup = document.querySelectorAll(`input[name="${name}"]`);
                    const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                    if (!isChecked) {
                        return `${name} harus dipilih`;
                    }
                    break;
                    
                case 'checkbox':
                    const checkboxGroup = document.querySelectorAll(`input[name="${name}"]:checked`);
                    if (checkboxGroup.length === 0) {
                        return `${name} minimal pilih satu`;
                    }
                    break;
                    
                case 'select-one':
                    if (!element.value) {
                        return `${name} harus dipilih`;
                    }
                    break;
                    
                case 'file':
                    if (element.required && element.files.length === 0) {
                        return `${name} harus diisi`;
                    }
                    break;
                    
                default:
                    if (!element.value.trim()) {
                        return `${name} tidak boleh kosong`;
                    }
            }
            return null;
        };

        const addErrorClass = (element, message) => {
            const formGroup = element.closest('.form-nexa');
            if (formGroup) {
                formGroup.classList.add('form-error');
                const existingError = formGroup.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                formGroup.appendChild(errorDiv);
            }
        };

        // Hapus window.handleFormData dan ganti dengan event listener
        const submitButton = document.getElementById(submitForm);
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                const form = document.getElementById(formInput);
                const formData = new FormData();
                const dataObject = {};

                const formElements = form.querySelectorAll('[name]');
                
                // Reset semua error state
                formElements.forEach(element => {
                    removeErrorClass(element);
                });

                formElements.forEach(element => {
                    const name = element.name;
                    
                    switch(element.type) {
                        case 'file':
                            if (element.multiple) {
                                const files = Array.from(element.files);
                                dataObject[name] = files.map(file => ({
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    lastModified: file.lastModified,
                                    url: URL.createObjectURL(file)
                                }));
                                files.forEach(file => {
                                    formData.append(name, file);
                                });
                            } else if (element.files[0]) {
                                const file = element.files[0];
                                dataObject[name] = {
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    lastModified: file.lastModified,
                                    url: URL.createObjectURL(file)
                                };
                                formData.append(name, file);
                            }

                            break;

                        case 'checkbox':
                            const checkboxes = form.querySelectorAll(`input[name="${name}"]:checked`);
                            const values = Array.from(checkboxes).map(cb => cb.value);
                            dataObject[name] = values;
                            formData.append(name, values.join(', '));
                            break;
                            
                        case 'radio':
                            const radioSelected = form.querySelector(`input[name="${name}"]:checked`);
                            if (radioSelected) {
                                dataObject[name] = radioSelected.value;
                                formData.append(name, radioSelected.value);
                            }
                            break;
                            
                        default:
                            dataObject[name] = element.value;
                            formData.append(name, element.value);
                    }
                });

                // Validasi yang diperbarui
                let isValid = true;
                const processedNames = new Set();

                formElements.forEach(element => {
                    // Skip jika nama sudah diproses (untuk radio/checkbox groups)
                    if (processedNames.has(element.name)) {
                        return;
                    }

                    const errorMessage = validateInput(element);
                    if (errorMessage) {
                        addErrorClass(element, errorMessage);
                        isValid = false;
                    }

                    // Tandai nama sebagai sudah diproses
                    processedNames.add(element.name);
                });
                
                if (isValid) {
                        const finalData = [dataObject];
                        if (callback) callback(finalData[0]);
                        resolve(finalData);
                        form.reset();
                        if (ret.modalId) {
                          nxMdClose(ret.modalId)
                        }
                 
                }
            });
        }

        // Event listeners untuk validasi real-time
        const form = document.getElementById(formInput);
        form.querySelectorAll('[name]').forEach(element => {
            const events = ['input', 'change', 'blur'];
            events.forEach(eventType => {
                element.addEventListener(eventType, () => {
                    const errorMessage = validateInput(element);
                    if (errorMessage) {
                        addErrorClass(element, errorMessage);
                    } else {
                        removeErrorClass(element);
                    }
                });
            });
        });
    });
}
// AND FORM
export function createModal() {
window.nxModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  // Reset any previous styles
  const modalContent = modal.querySelector('.nx-modal-content');
  const modalBody = modal.querySelector('.nx-modal-body');
  const modalFooter = modal.querySelector('.nx-modal-footer');
  
  if (modalContent) {
    modalContent.style.cssText = ''; // Reset inline styles
  }
  
  if (modalBody) {
    modalBody.style.cssText = ''; // Reset inline styles
  }
  
  if (modalFooter) {
    modalFooter.style.cssText = ''; // Reset inline styles
  }
  
  modal.style.display = "flex"; // Use flex instead of block
  modal.classList.add('show');
  const restoreFocus = trapFocus(modal);
  
  modal.style.display = "block";
  modal.setAttribute('aria-modal', 'true');
  
  // Khusus untuk modal fullscreen
  if (modal.classList.contains('nx-modal-fullscreen')) {
    document.body.style.overflow = 'hidden'; // Mencegah scroll pada body
    modal.style.padding = '0';
    
    const modalContent = modal.querySelector('.nx-modal-content');
    if (modalContent) {
      // Reset style yang mungkin diset sebelumnya
      Object.assign(modalContent.style, {
        width: '100vw',
        height: '100vh',
        margin: '0',
        padding: '0',
        border: '0',
        borderRadius: '0',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        transform: 'none'
      });
      
      // Atur tinggi body modal
      const modalBody = modalContent.querySelector('.nx-modal-body');
      const modalHeader = modalContent.querySelector('.nx-modal-header');
      const modalFooter = modalContent.querySelector('.nx-modal-footer');
      
      if (modalBody && modalHeader && modalFooter) {
        const headerHeight = modalHeader.offsetHeight;
        const footerHeight = modalFooter.offsetHeight;
        modalBody.style.height = `calc(100vh - ${headerHeight + footerHeight}px)`;
        modalBody.style.overflowY = 'auto';
      }
    }
  }
  
  // Inisialisasi fitur interaksi
  if (modal.classList.contains('nx-modal-draggable')) {
    makeDraggable(modalId);
  }
  
  if (modal.classList.contains('nx-modal-resizable')) {
    makeResizable(modalId);
  }
  
  if (modal.classList.contains('nx-modal-stacking')) {
    handleModalStacking(modalId);
  }
  
  // Simpan fungsi restore focus
  modal.restoreFocus = restoreFocus;
  
  // ARIA attributes
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', `${modalId}-title`);
  
  // Center modal jika perlu
  if (modal.classList.contains('nx-modal-centered')) {
    centerModal(modalId);
    // Tambahkan event listener untuk resize
    window.addEventListener('resize', () => centerModal(modalId));
  }
  
  // Animasi
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
  
  // Check overflow untuk modal scrollable
  if (modal.classList.contains('nx-modal-scrollable')) {
    checkModalOverflow(modalId);
  }
  
  // Center modal if needed
  centerModal(modalId);
  
  // Trap focus
  trapFocus(modal);
  
  // Disable scroll pada body kecuali untuk modal scrollable
  if (!modal.classList.contains('nx-modal-scrollable')) {
    document.body.style.overflow = 'hidden';
  }
  
  // Handle custom animations
  if (modal.classList.contains('nx-modal-custom-animation')) {
    modal.addEventListener('animationend', () => {
      modal.classList.add('animation-completed');
    }, { once: true });
  }
  
  // Handle transition timing
  if (modal.classList.contains('nx-modal-transition-timing')) {
    const timing = modal.getAttribute('data-timing') || 'ease';
    setModalTiming(modalId, timing);
  }
  
  // Handle effects
  if (modal.classList.contains('nx-modal-effects')) {
    const effect = modal.getAttribute('data-effect') || 'blur';
    setModalEffect(modalId, effect);
  }
  
  // Add mobile optimizations
  if ('ontouchstart' in window) {
    optimizeForMobile(modalId);
    const cleanup = enableTouchGestures(modalId);
    modal.addEventListener('modal:afterClose', cleanup, { once: true });
  }
  
  // Add responsive behavior
  const cleanupResponsive = handleResponsiveBehavior(modalId);
  modal.addEventListener('modal:afterClose', cleanupResponsive, { once: true });
  
  // Tambahkan window controls jika modal draggable
  if (modal.classList.contains('nx-modal-draggable')) {
    const originalSize = addWindowControls(modalId);
    modal.originalSize = originalSize;
  }

    $('.nx-modal-content').draggable({
      handle: ".nx-modal-header",
      scroll: false,
      start: function () {
        $(this).css({
          transform: "none",
        });
      },
    });

}

window.nxMdClose = function(modalId) {
  const modal = document.getElementById(modalId);
  
  if (!modal) {
    console.warn(`Modal dengan id "${modalId}" tidak ditemukan`);
    return;
  }
  
  // Reset style untuk modal fullscreen
  if (modal.classList.contains('nx-modal-fullscreen')) {
    document.body.style.overflow = 'auto';
    modal.style.padding = '';
    
    const modalContent = modal.querySelector('.nx-modal-content');
    if (modalContent) {
      modalContent.style.cssText = ''; // Reset semua inline styles
    }
  }
  
  // Hapus controls saat modal ditutup
  const controls = modal.querySelector('.nx-modal-controls');
  if (controls) {
    controls.remove();
  }
  
  // Restore focus sebelum menutup modal
  if (modal.restoreFocus) {
    try {
      modal.restoreFocus();
    } catch (error) {
      console.warn('Error saat restore focus:', error);
    }
  }
  
  modal.classList.remove('show');
  
  // Tunggu animasi selesai
  const duration = getTransitionDuration(modal);
  
  setTimeout(() => {
    modal.style.display = "none";
    // Reset ARIA & scroll
    modal.removeAttribute('role');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('aria-labelledby');
    document.body.style.overflow = 'auto';
  }, duration);
  
  // Remove resize event listener jika ada
  if (modal.classList.contains('nx-modal-centered')) {
    window.removeEventListener('resize', () => centerModal(modalId));
  }
}

// Event handler untuk click di luar modal
window.onclick = function(event) {
  if (event.target.className.includes('nx-modal')) {
    const modal = event.target;
    const modalId = modal.id;
    
    // Tambahkan pengecekan modalId
    if (!modalId) {
      console.warn('Modal tidak memiliki ID');
      return;
    }
    
    // Jika bukan modal static, tutup modal
    if (!modal.classList.contains('nx-modal-static')) {
      nxMdClose(modalId);
    } else {
      // Animasi shake untuk modal static
      const modalContent = modal.querySelector('.nx-modal-content');
      if (modalContent) {
        modalContent.style.animation = 'none';
        setTimeout(() => {
          modalContent.style.animation = 'modalShake 0.3s ease-in-out';
        }, 10);
      }
    }
  }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const nxModals = document.querySelectorAll('.nx-modal[style*="display: block"]');
    nxModals.forEach(modal => {
      nxMdClose(modal.id);
    });
  }
});

// Function untuk trap focus di dalam modal
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  // Simpan elemen yang sebelumnya difokus
  const previouslyFocused = document.activeElement;
  
  firstFocusable.focus();
  
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
  
  // Kembalikan fokus saat modal ditutup
  return function restoreFocus() {
    previouslyFocused.focus();
  };
}

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value) {
      isValid = false;
      showError(input, 'Field ini wajib diisi');
    } else if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        showError(input, 'Format email tidak valid');
      }
    }
  });
  
  return isValid;
}

function showError(input, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'nx-form-error';
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
  
  input.classList.add('error');
  
  input.addEventListener('input', function() {
    errorDiv.remove();
    input.classList.remove('error');
  });
}

// Centered modal handling
function centerModal(modalId) {
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector('.nx-modal-content');
  
  if (modal.classList.contains('nx-modal-centered')) {
    // Reset margin yang mungkin diset sebelumnya
    modalContent.style.margin = '0';
    
    // Pastikan modal tidak melebihi viewport
    const windowHeight = window.innerHeight;
    const modalHeight = modalContent.offsetHeight;
    
    if (modalHeight > windowHeight * 0.9) {
      modalContent.style.height = '90vh';
      modalContent.style.overflowY = 'auto';
    } else {
      modalContent.style.height = 'auto';
      modalContent.style.overflowY = 'visible';
    }
  }
}

// Handle window resize for centered modals
window.addEventListener('resize', function() {
  const nxModals = document.querySelectorAll('.nx-modal-centered[style*="display: block"]');
  nxModals.forEach(modal => {
    centerModal(modal.id);
  });
});

// Tambahkan fungsi untuk mengecek overflow
function checkModalOverflow(modalId) {
  const modal = document.getElementById(modalId);
  const modalBody = modal.querySelector('.nx-modal-body');
  
  if (modalBody.scrollHeight > modalBody.clientHeight) {
    modal.classList.add('has-scroll');
  } else {
    modal.classList.remove('has-scroll');
  }
}

// Helper function untuk mendapatkan durasi transisi
function getTransitionDuration(element) {
  const style = window.getComputedStyle(element);
  const duration = style.transitionDuration;
  return parseFloat(duration) * 1000; // Convert to milliseconds
}

// Modal Events & Callbacks
function nxModalWithCallback(modalId) {
  nxModal(modalId);
  const status = document.getElementById('callback-status');
  if (status) {
    status.innerHTML = '<div class="alert alert-success">Modal telah dibuka!</div>';
  }
}

function nxMdCloseWithCallback(modalId) {
  const status = document.getElementById('callback-status');
  if (status) {
    status.innerHTML = '<div class="alert alert-info">Modal akan ditutup...</div>';
  }
  
  setTimeout(() => {
    nxMdClose(modalId);
  }, 1000);
}

// Modal Methods
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal.style.display === "block") {
    nxMdClose(modalId);
  } else {
    nxModal(modalId);
  }
}

function updateModalContent(modalId, content) {
  const modal = document.getElementById(modalId);
  const modalBody = modal.querySelector('.nx-modal-body');
  modalBody.innerHTML = `
    <p>${content}</p>
    <button class="btn btn-info" onclick="updateModalContent('${modalId}', 'Konten Diperbarui Lagi')">
      Update Lagi
    </button>
  `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Tambahkan event listener untuk semua modal
  const modals = document.querySelectorAll('.nx-modal');
  
  modals.forEach(modal => {
    // Before Open Event
    modal.addEventListener('modal:beforeOpen', function(e) {
      console.log('Modal akan dibuka:', e.target.id);
    });
    
    // After Open Event
    modal.addEventListener('modal:afterOpen', function(e) {
      console.log('Modal telah dibuka:', e.target.id);
    });
    
    // Before Close Event
    modal.addEventListener('modal:beforeClose', function(e) {
      console.log('Modal akan ditutup:', e.target.id);
    });
    
    // After Close Event
    modal.addEventListener('modal:afterClose', function(e) {
      console.log('Modal telah ditutup:', e.target.id);
    });
  });
});

// Update fungsi nxModal dan nxMdClose untuk trigger events
function triggerModalEvent(modal, eventName) {
  const event = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true
  });
  modal.dispatchEvent(event);
}

// Event Modal Functions
window.nxModalWithCallback = function(modalId) {
  nxModal(modalId);
  const status = document.getElementById('callback-status');
  if (status) {
    status.innerHTML = '<div class="alert alert-success">Modal telah dibuka!</div>';
  }
}

window.nxMdCloseWithCallback = function(modalId) {
  const status = document.getElementById('callback-status');
  if (status) {
    status.innerHTML = '<div class="alert alert-info">Modal akan ditutup...</div>';
  }
  
  setTimeout(() => {
    nxMdClose(modalId);
  }, 1000);
}

// Method Modal Functions
window.openMethodModal = function(modalId) {
  nxModal(modalId);
  // Tambahkan inisialisasi khusus untuk method modal jika diperlukan
}

window.toggleModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal.style.display === "block") {
    nxMdClose(modalId);
  } else {
    nxModal(modalId);
  }
}

window.updateModalContent = function(modalId, content) {
  const modal = document.getElementById(modalId);
  const modalBody = modal.querySelector('.nx-modal-body');
  modalBody.innerHTML = `
    <p>${content}</p>
    <button class="btn btn-info" onclick="updateModalContent('${modalId}', 'Konten Diperbarui Lagi')">
      Update Lagi
    </button>
  `;
}

// Pastikan semua fungsi yang digunakan dalam onclick tersedia di window
window.showError = function(input, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'nx-form-error';
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
  
  input.classList.add('error');
  
  input.addEventListener('input', function() {
    errorDiv.remove();
    input.classList.remove('error');
  });
}

window.validateForm = function(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value) {
      isValid = false;
      showError(input, 'Field ini wajib diisi');
    } else if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        showError(input, 'Format email tidak valid');
      }
    }
  });
  
  return isValid;
}

// Draggable Modal dengan jQuery UI dan snap to edges
function makeDraggable(modalId) {
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector('.nx-modal-content');
  
  // Posisikan modal di tengah saat pertama dibuka
  const centerModal = () => {
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const modalWidth = $(modalContent).outerWidth();
    const modalHeight = $(modalContent).outerHeight();
    
    $(modalContent).css({
      position: 'fixed',
      left: (windowWidth - modalWidth) / 2,
      top: (windowHeight - modalHeight) / 2
    });
  };

  // Panggil centerModal saat pertama kali
  centerModal();
  
  // Inisialisasi draggable dengan jQuery UI
  $(modalContent).draggable({
    handle: '.nx-modal-header',
    cursor: 'move',
    snap: true,
    snapTolerance: 20,
    
    start: function(event, ui) {
      $(this).addClass('dragging');
    },
    
    drag: function(event, ui) {
      // Batasi area drag
      const windowWidth = $(window).width();
      const windowHeight = $(window).height();
      const modalWidth = $(this).outerWidth();
      const modalHeight = $(this).outerHeight();
      
      ui.position.left = Math.max(0, Math.min(ui.position.left, windowWidth - modalWidth));
      ui.position.top = Math.max(0, Math.min(ui.position.top, windowHeight - modalHeight));
    },
    
    stop: function(event, ui) {
      $(this).removeClass('dragging');
    }
  });

  // Update posisi saat window resize
  $(window).on('resize', centerModal);
  
  // Cleanup function
  return () => {
    try {
      $(modalContent).draggable('destroy');
      $(window).off('resize', centerModal);
    } catch (e) {
      console.warn('Error destroying draggable:', e);
    }
  };
}

// Modal Stacking
let currentZIndex = 1050;

function handleModalStacking(modalId) {
  const modal = document.getElementById(modalId);
  const allModals = document.querySelectorAll('.nx-modal-stacking');
  
  allModals.forEach(m => m.classList.remove('active'));
  modal.classList.add('active');
  modal.style.zIndex = ++currentZIndex;
}

// Resizable Modal
function makeResizable(modalId) {
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector('.nx-modal-content');
  
  // ResizeObserver untuk memantau perubahan ukuran
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      // Trigger event saat ukuran berubah
      const event = new CustomEvent('modal:resize', {
        detail: { width, height }
      });
      modal.dispatchEvent(event);
    }
  });
  
  resizeObserver.observe(modalContent);
}

// Event listener untuk modal resize
document.addEventListener('modal:resize', function(e) {
  const { width, height } = e.detail;
  console.log(`Modal resized to: ${width}x${height}`);
});

// Custom Animation Controller
function setModalAnimation(modalId, animationType) {
  const modal = document.getElementById(modalId);
  const currentAnimation = modal.getAttribute('data-animation');
  
  // Remove current animation class if exists
  if (currentAnimation) {
    modal.classList.remove(currentAnimation);
  }
  
  // Add new animation class
  modal.classList.add(animationType);
  modal.setAttribute('data-animation', animationType);
}

// Transition Timing Controller
function setModalTiming(modalId, timing) {
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector('.nx-modal-content');
  
  modalContent.style.setProperty('--animation-timing', timing);
}

// Special Effects Controller
function setModalEffect(modalId, effect) {
  const modal = document.getElementById(modalId);
  const currentEffect = modal.getAttribute('data-effect');
  
  if (currentEffect) {
    modal.classList.remove(currentEffect);
  }
  
  modal.classList.add(effect);
  modal.setAttribute('data-effect', effect);
}

// Animation Control Functions
window.flipModal = function(modalId) {
  setModalAnimation(modalId, 'flip');
}

window.swingModal = function(modalId) {
  setModalAnimation(modalId, 'swing');
}

window.bounceModal = function(modalId) {
  setModalAnimation(modalId, 'bounce');
}

// Timing Control Functions
window.setModalTiming = function(modalId, timing) {
  const timings = {
    'slow': '0.8s',
    'normal': '0.5s',
    'fast': '0.3s'
  };
  
  setModalTiming(modalId, timings[timing] || timing);
}

// Effect Control Functions
window.setModalEffect = function(modalId, effect) {
  const effects = {
    'blur': 'blur',
    'glass': 'glass',
    'neon': 'neon',
    'shadow-pulse': 'shadow-pulse'
  };
  
  setModalEffect(modalId, effects[effect] || effect);
}

// Modal AJAX Functions
window.loadModalContent = async function(modalId, url, options = {}) {
  const modal = document.getElementById(modalId);
  const modalBody = modal.querySelector('.nx-modal-body');
  
  // Show loading state
  modalBody.innerHTML = `
    <div class="nx-modal-loading">
      <div class="nx-spinner"></div>
      <p>Loading...</p>
    </div>
  `;
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.text();
    modalBody.innerHTML = data;
    
    // Trigger content loaded event
    modal.dispatchEvent(new CustomEvent('modal:contentLoaded', {
      detail: { url, response }
    }));
  } catch (error) {
    modalBody.innerHTML = `
      <div class="nx-modal-error">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading content: ${error.message}</p>
        <button class="btn btn-primary" onclick="loadModalContent('${modalId}', '${url}')">
          Retry
        </button>
      </div>
    `;
    
    // Trigger error event
    modal.dispatchEvent(new CustomEvent('modal:error', {
      detail: { error }
    }));
  }
}

// Dynamic Content Functions
window.updateModalDynamically = function(modalId, content, options = {}) {
  const modal = document.getElementById(modalId);
  const {
    target = 'body',
    animation = true,
    callback
  } = options;
  
  const targetElement = modal.querySelector(`.nx-modal-${target}`);
  
  if (animation) {
    targetElement.style.opacity = '0';
    setTimeout(() => {
      targetElement.innerHTML = content;
      targetElement.style.opacity = '1';
      if (callback) callback();
    }, 300);
  } else {
    targetElement.innerHTML = content;
    if (callback) callback();
  }
}

// Form Handling Functions
window.handleModalForm = async function(formId, options = {}) {
  const form = document.getElementById(formId);
  const modal = form.closest('.nx-modal');
  const {
    url = form.action,
    method = form.method || 'POST',
    validate = true,
    successCallback,
    errorCallback
  } = options;
  
  // Validate form if required
  if (validate && !validateForm(formId)) return false;
  
  // Show loading state
  const submitButton = form.querySelector('[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = `
    <span class="nx-spinner-small"></span>
    Submitting...
  `;
  
  try {
    const formData = new FormData(form);
    const response = await fetch(url, {
      method,
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || 'Form submission failed');
    
    // Handle success
    if (successCallback) {
      successCallback(data);
    } else {
      showModalAlert(modal.id, {
        type: 'success',
        message: data.message || 'Form submitted successfully'
      });
    }
    
    // Close modal after delay
    setTimeout(() => nxMdClose(modal.id), 2000);
    
  } catch (error) {
    // Handle error
    if (errorCallback) {
      errorCallback(error);
    } else {
      showModalAlert(modal.id, {
        type: 'error',
        message: error.message
      });
    }
  } finally {
    // Reset submit button
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
  
  return false; // Prevent form submission
}

// Modal Alert Function
function showModalAlert(modalId, { type, message }) {
  const modal = document.getElementById(modalId);
  const alertDiv = document.createElement('div');
  alertDiv.className = `nx-modal-alert alert alert-${type}`;
  alertDiv.innerHTML = message;
  
  const modalBody = modal.querySelector('.nx-modal-body');
  modalBody.insertBefore(alertDiv, modalBody.firstChild);
  
  setTimeout(() => alertDiv.remove(), 5000);
}

// Theme Controller
window.setModalTheme = function(modalId, theme) {
  const modal = document.getElementById(modalId);
  const themeClasses = ['theme-light', 'theme-dark', 'theme-primary', 'theme-success'];
  
  themeClasses.forEach(className => {
    modal.classList.remove(className);
  });
  
  if (theme) {
    modal.classList.add(`theme-${theme}`);
  }
}

// Layout Controller
window.setModalLayout = function(modalId, layout, options = {}) {
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector('.nx-modal-content');
  
  switch (layout) {
    case 'sidebar':
      modalContent.innerHTML = `
        <div class="nx-modal-sidebar">
          ${options.sidebarContent || ''}
        </div>
        <div class="nx-modal-main">
          <div class="nx-modal-header">
            <h5>${options.title || ''}</h5>
            <span class="nx-close" onclick="nxMdClose('${modalId}')">&times;</span>
          </div>
          <div class="nx-modal-body">
            ${options.bodyContent || ''}
          </div>
          <div class="nx-modal-footer">
            ${options.footerContent || ''}
          </div>
        </div>
      `;
      break;
      
    case 'tabs':
      const tabs = options.tabs || [];
      const tabNav = tabs.map((tab, index) => `
        <div class="nx-modal-tab ${index === 0 ? 'active' : ''}" 
             data-tab="${tab.id}">
          ${tab.title}
        </div>
      `).join('');
      
      const tabContent = tabs.map((tab, index) => `
        <div class="nx-modal-tab-pane ${index === 0 ? 'active' : ''}" 
             id="${tab.id}">
          ${tab.content}
        </div>
      `).join('');
      
      modalContent.innerHTML = `
        <div class="nx-modal-header">
          <h5>${options.title || ''}</h5>
          <span class="nx-close" onclick="nxMdClose('${modalId}')">&times;</span>
        </div>
        <div class="nx-modal-tab-nav">
          ${tabNav}
        </div>
        <div class="nx-modal-body">
          ${tabContent}
        </div>
        <div class="nx-modal-footer">
          ${options.footerContent || ''}
        </div>
      `;
      
      // Add tab click handlers
      modal.querySelectorAll('.nx-modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.dataset.tab;
          switchTab(modalId, tabId);
        });
      });
      break;
  }
}

// Tab Controller
function switchTab(modalId, tabId) {
  const modal = document.getElementById(modalId);
  
  // Update tab buttons
  modal.querySelectorAll('.nx-modal-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  
  // Update tab content
  modal.querySelectorAll('.nx-modal-tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });
}

// Additional Components Controller
window.addModalComponent = function(modalId, component, options = {}) {
  const modal = document.getElementById(modalId);
  
  switch (component) {
    case 'toolbar':
      const toolbar = document.createElement('div');
      toolbar.className = 'nx-modal-toolbar';
      toolbar.innerHTML = `
        <button class="nx-modal-sidebar-toggle">☰</button>
        <div class="nx-modal-search">
          <input type="text" placeholder="Search...">
          <span class="nx-modal-search-icon">🔍</span>
        </div>
        ${options.additionalButtons || ''}
      `;
      modal.querySelector('.nx-modal-content').insertBefore(
        toolbar,
        modal.querySelector('.nx-modal-body')
      );
      break;
      
    case 'statusbar':
      const statusbar = document.createElement('div');
      statusbar.className = 'nx-modal-statusbar';
      statusbar.innerHTML = `
        <div class="status-left">${options.leftContent || ''}</div>
        <div class="status-right">${options.rightContent || ''}</div>
      `;
      modal.querySelector('.nx-modal-content').appendChild(statusbar);
      break;
      
    case 'breadcrumb':
      const breadcrumb = document.createElement('div');
      breadcrumb.className = 'nx-modal-breadcrumb';
      breadcrumb.innerHTML = `
        <ul>
          ${options.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
      modal.querySelector('.nx-modal-content').insertBefore(
        breadcrumb,
        modal.querySelector('.nx-modal-body')
      );
      break;
  }
}

// Modal Performance Functions

// Lazy Loading Controller
window.lazyLoadModal = function(modalId, options = {}) {
  const {
    url,
    placeholder = 'Loading...',
    threshold = 0.5,
    rootMargin = '50px'
  } = options;
  
  const modal = document.getElementById(modalId);
  const modalBody = modal.querySelector('.nx-modal-body');
  
  // Set placeholder content
  modalBody.innerHTML = `
    <div class="nx-modal-placeholder">
      <div class="nx-spinner"></div>
      <p>${placeholder}</p>
    </div>
  `;
  
  // Create Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Load content when modal becomes visible
          loadModalContent(modalId, url)
            .then(() => {
              observer.disconnect();
            });
        }
      });
    },
    {
      threshold,
      rootMargin
    }
  );
  
  observer.observe(modalBody);
}

// Modal Caching System
const modalCache = new Map();

window.loadCachedModal = async function(modalId, options = {}) {
  const {
    url,
    cacheKey = url,
    maxAge = 5 * 60 * 1000, // 5 minutes default
    forceRefresh = false
  } = options;
  
  const modal = document.getElementById(modalId);
  const modalBody = modal.querySelector('.nx-modal-body');
  
  // Check cache first
  if (!forceRefresh && modalCache.has(cacheKey)) {
    const cached = modalCache.get(cacheKey);
    if (Date.now() - cached.timestamp < maxAge) {
      modalBody.innerHTML = cached.content;
      return;
    }
  }
  
  // Load fresh content
  try {
    const response = await fetch(url);
    const content = await response.text();
    
    // Update cache
    modalCache.set(cacheKey, {
      content,
      timestamp: Date.now()
    });
    
    modalBody.innerHTML = content;
    
  } catch (error) {
    console.error('Error loading modal content:', error);
    modalBody.innerHTML = `
      <div class="nx-modal-error">
        <p>Failed to load content. Please try again.</p>
      </div>
    `;
  }
}

// Memory Management
window.optimizeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  
  // Clean up event listeners when modal is closed
  const cleanup = () => {
    const elements = modal.querySelectorAll('*');
    elements.forEach(element => {
      const events = element.getEventListeners?.() || [];
      events.forEach(event => {
        element.removeEventListener(event.type, event.listener);
      });
    });
  };
  
  // Optimize images
  const optimizeImages = () => {
    const images = modal.querySelectorAll('img');
    images.forEach(img => {
      // Add loading="lazy" attribute
      img.loading = 'lazy';
      
      // Use srcset for responsive images
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      
      // Clean up image references when modal closes
      img.onload = null;
      img.onerror = null;
    });
  };
  
  // Optimize iframes
  const optimizeIframes = () => {
    const iframes = modal.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      iframe.loading = 'lazy';
      
      // Remove src until modal is opened
      const src = iframe.src;
      iframe.removeAttribute('src');
      iframe.dataset.src = src;
    });
  };
  
  // Load iframes when modal opens
  modal.addEventListener('modal:beforeOpen', () => {
    const iframes = modal.querySelectorAll('iframe[data-src]');
    iframes.forEach(iframe => {
      iframe.src = iframe.dataset.src;
    });
  });
  
  // Cleanup when modal closes
  modal.addEventListener('modal:afterClose', () => {
    cleanup();
    optimizeImages();
    optimizeIframes();
    
    // Clear unnecessary references
    modal.querySelectorAll('.nx-modal-body *').forEach(el => {
      el.innerHTML = '';
    });
    
    // Suggest garbage collection
    if (window.gc) window.gc();
  });
  
  // Initial optimization
  optimizeImages();
  optimizeIframes();
}

// Performance Monitoring
window.monitorModalPerformance = function(modalId) {
  const modal = document.getElementById(modalId);
  const metrics = {
    openTime: 0,
    renderTime: 0,
    memoryUsage: 0
  };
  
  modal.addEventListener('modal:beforeOpen', () => {
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;
    
    requestAnimationFrame(() => {
      metrics.openTime = performance.now() - startTime;
      metrics.renderTime = performance.now() - startTime;
      metrics.memoryUsage = (performance.memory?.usedJSHeapSize || 0) - startMemory;
      
      console.log('Modal Performance Metrics:', metrics);
    });
  });
  
  return metrics;
}

// Mobile & Touch Functions

// Touch Gesture Controller
function enableTouchGestures(modalId) {
  const modal = document.getElementById(modalId);
  const content = modal.querySelector('.nx-modal-content');
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  
  // Touch event handlers
  function handleTouchStart(e) {
    const touch = e.touches[0];
    startY = touch.clientY;
    isDragging = true;
    modal.classList.add('swiping');
    
    // Capture initial position
    const transform = window.getComputedStyle(content).transform;
    currentY = transform !== 'none' ? 
      parseInt(transform.split(',')[5]) : 0;
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    
    // Only allow swipe down
    if (deltaY < 0) return;
    
    // Add resistance to swipe
    const resistance = 0.4;
    const newY = currentY + (deltaY * resistance);
    
    content.style.transform = `translateY(${newY}px)`;
    
    // Add opacity effect
    const opacity = 1 - (newY / (window.innerHeight * 0.5));
    modal.style.backgroundColor = `rgba(0,0,0,${opacity * 0.5})`;
  }
  
  function handleTouchEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    modal.classList.remove('swiping');
    
    const transform = window.getComputedStyle(content).transform;
    const finalY = transform !== 'none' ? 
      parseInt(transform.split(',')[5]) : 0;
    
    // If swipe distance is greater than threshold, close modal
    if (finalY > window.innerHeight * 0.25) {
      modal.classList.add('swipe-close');
      setTimeout(() => nxMdClose(modalId), 300);
    } else {
      // Reset position
      content.style.transform = '';
      modal.style.backgroundColor = '';
    }
  }
  
  // Add touch event listeners
  content.addEventListener('touchstart', handleTouchStart, { passive: true });
  content.addEventListener('touchmove', handleTouchMove, { passive: false });
  content.addEventListener('touchend', handleTouchEnd);
  
  // Clean up function
  return () => {
    content.removeEventListener('touchstart', handleTouchStart);
    content.removeEventListener('touchmove', handleTouchMove);
    content.removeEventListener('touchend', handleTouchEnd);
  };
}

// Mobile Optimization Controller
function optimizeForMobile(modalId) {
  const modal = document.getElementById(modalId);
  
  // Add mobile-specific classes
  modal.classList.add('nx-modal-touch');
  
  // Enable bottom sheet behavior on mobile
  if (window.innerWidth <= 576) {
    modal.classList.add('nx-modal-bottom-sheet');
  }
  
  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      centerModal(modalId);
    }, 100);
  });
  
  // Handle keyboard appearance on iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const inputs = modal.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        modal.classList.add('keyboard-open');
      });
      input.addEventListener('blur', () => {
        modal.classList.remove('keyboard-open');
      });
    });
  }
  
  // Add fastclick for better touch response
  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(modal);
    }, false);
  }
}

// Responsive Behavior Controller
function handleResponsiveBehavior(modalId) {
  const modal = document.getElementById(modalId);
  const content = modal.querySelector('.nx-modal-content');
  
  // Handle resize events
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { width } = entry.contentRect;
      
      // Adjust modal based on screen size
      if (width <= 576) {
        content.style.width = '100%';
        modal.classList.add('mobile-view');
      } else {
        content.style.width = '';
        modal.classList.remove('mobile-view');
      }
    }
  });
  
  resizeObserver.observe(document.body);
  
  // Return cleanup function
  return () => resizeObserver.disconnect();
}

// Tambahkan fungsi untuk minimize/maximize
function addWindowControls(modalId) {
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector('.nx-modal-content');
  const header = modal.querySelector('.nx-modal-header');
  
  // Cek apakah controls sudah ada
  if (header.querySelector('.nx-modal-controls')) {
    return; // Jika sudah ada, jangan tambahkan lagi
  }
  
  // Simpan ukuran asli untuk restore
  let originalSize = {
    width: modalContent.style.width,
    height: modalContent.style.height,
    top: modalContent.style.top,
    left: modalContent.style.left
  };

  // Tambahkan tombol controls
  const controls = document.createElement('div');
  controls.className = 'nx-modal-controls';
  controls.innerHTML = `
    <button class="nx-btn-minimize" title="Minimize">─</button>
    <button class="nx-btn-maximize" title="Maximize">□</button>
    <button class="nx-btn-restore" title="Restore" style="display:none">❐</button>
  `;
  
  header.insertBefore(controls, header.querySelector('.nx-close'));

  // Event handlers
  controls.querySelector('.nx-btn-minimize').onclick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    minimizeModal(modalId);
  };
  
  controls.querySelector('.nx-btn-maximize').onclick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    maximizeModal(modalId);
  };
  
  controls.querySelector('.nx-btn-restore').onclick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    restoreModal(modalId);
  };

  return originalSize;
}

// Minimize Modal
function minimizeModal(modalId) {
  const modal = document.getElementById(modalId);
  const btnMinimize = modal.querySelector('.nx-btn-minimize');
  const btnMaximize = modal.querySelector('.nx-btn-maximize');
  const btnRestore = modal.querySelector('.nx-btn-restore');

  modal.classList.add('minimized');
  modal.classList.remove('maximized');
  
  btnMinimize.style.display = 'none';
  btnMaximize.style.display = 'block';
  btnRestore.style.display = 'block';
}

// Maximize Modal
function maximizeModal(modalId) {
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector('.nx-modal-content');
  const btnMinimize = modal.querySelector('.nx-btn-minimize');
  const btnMaximize = modal.querySelector('.nx-btn-maximize');
  const btnRestore = modal.querySelector('.nx-btn-restore');

  // Simpan posisi dan ukuran sebelum maximize
  if (!modal.originalState) {
    modal.originalState = {
      width: modalContent.style.width,
      height: modalContent.style.height,
      top: modalContent.style.top,
      left: modalContent.style.left,
      transform: modalContent.style.transform,
      margin: modalContent.style.margin,
      padding: modalContent.style.padding,
      borderRadius: modalContent.style.borderRadius,
      position: modalContent.style.position
    };
  }

  // Set fullscreen styles
  Object.assign(modalContent.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: '0',
    padding: '0',
    borderRadius: '0',
    transform: 'none',
    transition: 'all 0.3s ease-in-out'
  });

  // Adjust body height for scrolling
  const modalBody = modalContent.querySelector('.nx-modal-body');
  if (modalBody) {
    const headerHeight = modalContent.querySelector('.nx-modal-header')?.offsetHeight || 0;
    const footerHeight = modalContent.querySelector('.nx-modal-footer')?.offsetHeight || 0;
    modalBody.style.height = `calc(100vh - ${headerHeight + footerHeight}px)`;
    modalBody.style.overflowY = 'auto';
  }

  modal.classList.add('maximized');
  modal.classList.remove('minimized');
  
  btnMinimize.style.display = 'block';
  btnMaximize.style.display = 'none';
  btnRestore.style.display = 'block';

  // Disable draggable when maximized
  if ($(modalContent).hasClass('ui-draggable')) {
    $(modalContent).draggable('disable');
  }
}

// Restore Modal
function restoreModal(modalId) {
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector('.nx-modal-content');
  const btnMinimize = modal.querySelector('.nx-btn-minimize');
  const btnMaximize = modal.querySelector('.nx-btn-maximize');
  const btnRestore = modal.querySelector('.nx-btn-restore');
  
  // Reset semua style yang mungkin ditambahkan
  modalContent.style.cssText = '';
  
  // Set style default
  Object.assign(modalContent.style, {
    position: 'fixed',
    width: '50%',
    height: 'auto',
    maxWidth: '90%',
    maxHeight: '90vh',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    transition: 'all 0.3s ease-in-out'
  });

  // Reset modal body
  const modalBody = modalContent.querySelector('.nx-modal-body');
  if (modalBody) {
    modalBody.style.height = 'auto';
    modalBody.style.maxHeight = 'calc(90vh - 120px)';
    modalBody.style.overflowY = 'auto';
  }

  // Reset modal footer
  const modalFooter = modalContent.querySelector('.nx-modal-footer');
  if (modalFooter) {
    modalFooter.style.position = 'relative';
    modalFooter.style.bottom = 'auto';
  }

  modal.classList.remove('minimized', 'maximized');
  
  btnMinimize.style.display = 'block';
  btnMaximize.style.display = 'block';
  btnRestore.style.display = 'none';
  
  // Re-enable draggable
  if ($(modalContent).hasClass('ui-draggable')) {
    $(modalContent).draggable('enable');
    
    // Reset draggable position
    $(modalContent).draggable('option', 'position', {
      my: 'center',
      at: 'center',
      of: window
    });
  }
}

// Tambahkan fungsi untuk mengelola multiple modals
let modalStack = [];

window.openMultiModal = function(modalId) {
  const modal = document.getElementById(modalId);
  const zIndex = 1050 + modalStack.length;
  
  modal.style.zIndex = zIndex;
  modal.style.display = 'block';
  
  // Add backdrop for each modal
  const backdrop = document.createElement('div');
  backdrop.className = 'nx-modal-backdrop';
  backdrop.style.zIndex = zIndex - 1;
  document.body.appendChild(backdrop);
  
  modalStack.push({
    modal: modal,
    backdrop: backdrop
  });
  
  requestAnimationFrame(() => {
    modal.classList.add('show');
    backdrop.classList.add('show');
  });
}
window.closeMultiModal = function(modalId) {
  const modalData = modalStack.pop();
  if (!modalData) return;
  
  const { modal, backdrop } = modalData;
  
  modal.classList.remove('show');
  backdrop.classList.remove('show');
  
  setTimeout(() => {
    modal.style.display = 'none';
    backdrop.remove();
  }, 300);
  }
}
// MODAL

