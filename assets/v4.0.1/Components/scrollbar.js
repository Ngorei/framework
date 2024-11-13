// Fungsi untuk membuat form
export function Scrollbar(attr) {
            function setElementStyles(elementId, styles) {
                const element = document.getElementById(elementId);
                if (element) {
                    for (const [key, value] of Object.entries(styles)) {
                        element.style[key] = value;
                    }
                }
            }
            // Contoh gaya untuk #scroll-container
            const styles = {
                overflow: 'auto',
                //width: '300px',
                height: attr.maxHeight,
                padding: '1px',
                // whiteSpace: 'nowrap'
            };
            // Terapkan gaya ke elemen
            setElementStyles(attr.elementById, styles);
            // Fungsi untuk mengatur scrollbar
            function setScrollbar(type) {
                const element = document.getElementById('scroll-container');
                element.classList.remove('scrollbarY', 'scrollbarX');
                if (type === 'Y') {
                    element.classList.add('scrollbarY');
                } else if (type === 'X') {
                    element.classList.add('scrollbarX');
                } else if (type === 'both') {
                    element.classList.add('scrollbarY', 'scrollbarX');
                }
            }
            // Contoh penggunaan
            setScrollbar(attr.type); // Aktifkan scrollbar horizontal
}
