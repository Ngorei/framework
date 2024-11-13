export function prind(attr) {
	const select = document.getElementById(attr.select);
	const contents = document.querySelectorAll(`#${attr.elementById} > div[${attr.page}]`);
	
	// Tambahkan opsi "Semua Halaman"
	const allOption = document.createElement('option');
	allOption.value = 'all';
	allOption.textContent = 'Semua Halaman';
	select.appendChild(allOption);

	// Tambahkan opsi untuk setiap halaman
	contents.forEach((content, index) => {
		const option = document.createElement('option');
		option.value = index;
		option.textContent = `Halaman ${index + 1}`;
		select.appendChild(option);
	});

	// Tambahkan dropdown untuk memilih format output
	const formatSelect = document.createElement('select');
	formatSelect.id = 'formatSelect';
	['Print', 'PPTX'].forEach(format => {
		const option = document.createElement('option');
		option.value = format.toLowerCase();
		option.textContent = format;
		formatSelect.appendChild(option);
	});
	select.parentNode.insertBefore(formatSelect, select.nextSibling);

	window.processSelectedContent = function() {
		const selectedValue = document.getElementById('pageSelect').value;
		const selectedFormat = document.getElementById('formatSelect').value;
		let selectedContents = [];

		if (selectedValue === 'all') {
			selectedContents = Array.from(contents);
		} else {
			const selectedContent = contents[selectedValue];
			if (selectedContent) {
				selectedContents = [selectedContent];
			} else {
				console.error(`Konten untuk halaman ${selectedValue} tidak ditemukan`);
				alert("Halaman yang dipilih tidak ditemukan.");
				return;
			}
		}

		if (selectedContents.length > 0) {
			if (selectedFormat === 'print') {
				printContent(selectedContents);
			} else if (selectedFormat === 'pptx') {
				loadPptxGenJs().then(() => exportToPPTX(selectedContents));
			}
		} else {
			alert("Silakan pilih konten untuk diproses.");
		}
	}

	function printContent(contents) {
		const printWindow = window.open('', '', 'height=580px,width=500px');
		if (!printWindow) {
			alert("Popup diblokir. Mohon izinkan popup untuk situs ini.");
			return;
		}

		const printContents = contents.map(content => content.innerHTML).join('<div style="page-break-after: always;"></div>');

		printWindow.document.write(`
			<html>
				<head>
					<title>Print</title>
					${Array.from(document.getElementsByTagName('link'))
						.filter(link => link.rel === 'stylesheet')
						.map(link => link.outerHTML)
						.join('')}
				</head>
				<body>
					${printContents}
				</body>
			</html>
		`);
		printWindow.document.close();
		
		printWindow.onload = function() {
			printWindow.print();
			printWindow.close();
		};
	}

	function loadPptxGenJs() {
		return new Promise((resolve, reject) => {
			if (typeof PptxGenJS !== 'undefined') {
				resolve();
			} else {
				const script = document.createElement('script');
				script.src = '/POSDIPW2/assets/lib/pptx/pptxgen.bundle.js';
				script.onload = resolve;
				script.onerror = () => reject(new Error('Gagal memuat PptxGenJS'));
				document.head.appendChild(script);
			}
		});
	}

	async function exportToPPTX(contents) {
		try {
			await loadPptxGenJs();
			if (typeof PptxGenJS === 'undefined') {
				throw new Error('PptxGenJS tidak tersedia setelah dimuat');
			}
			const pptx = new PptxGenJS();
			
			// Atur tema default
			pptx.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
			pptx.layout = 'LAYOUT_16x9';
			
			for (const content of contents) {
				const slide = pptx.addSlide();
				await processElement(content, slide, 0, 0, 10, 5.625);
			}

			// Simpan PPTX
			const fileName = 'presentation.pptx';
			await pptx.writeFile({ fileName });
			alert(`File ${fileName} telah disimpan.`);
		} catch (error) {
			console.error('Gagal membuat presentasi:', error);
			alert('Terjadi kesalahan saat membuat presentasi. Silakan coba lagi.');
		}
	}

	async function processElement(element, slide, x, y, w, h) {
		if (element.nodeType === Node.TEXT_NODE) {
			if (element.textContent.trim()) {
				slide.addText(element.textContent.trim(), {
					x: x, y: y, w: w, h: h,
					fontSize: 12,
					color: '363636',
					fontFace: 'Arial',
					breakLine: true
				});
			}
		} else if (element.nodeType === Node.ELEMENT_NODE) {
			switch (element.tagName.toLowerCase()) {
				case 'h1':
				case 'h2':
				case 'h3':
				case 'h4':
				case 'h5':
				case 'h6':
					slide.addText(element.textContent.trim(), {
						x: x, y: y, w: w, h: 0.5,
						fontSize: 24 - (parseInt(element.tagName.charAt(1)) * 2),
						bold: true,
						color: '363636',
						fontFace: 'Arial'
					});
					y += 0.6;
					break;
				case 'p':
					slide.addText(element.textContent.trim(), {
						x: x, y: y, w: w, h: 0.5,
						fontSize: 12,
						color: '363636',
						fontFace: 'Arial',
						breakLine: true
					});
					y += 0.6;
					break;
				case 'img':
					try {
						const imgData = await getBase64Image(element.src);
						slide.addImage({
							data: imgData,
							x: x, y: y,
							w: Math.min(w, 5),
							h: 'auto',
							sizing: { type: 'contain', w: Math.min(w, 5), h: 2 }
						});
						y += 2.2;
					} catch (imgError) {
						console.warn(`Gagal menambahkan gambar: ${imgError.message}`);
						slide.addText('(Gambar tidak tersedia)', {
							x: x, y: y, w: w, h: 0.5,
							fontSize: 10,
							color: 'FF0000',
							fontFace: 'Arial',
							align: 'center'
						});
						y += 0.6;
					}
					break;
				default:
					for (const child of element.childNodes) {
						await processElement(child, slide, x, y, w, h);
						y += 0.2; // Sedikit spasi antara elemen
					}
			}
		}
		return y; // Mengembalikan posisi y terakhir
	}

	// Fungsi untuk mengubah URL gambar menjadi base64
	function getBase64Image(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'Anonymous';
			img.onload = function() {
				const canvas = document.createElement('canvas');
				canvas.width = this.width;
				canvas.height = this.height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(this, 0, 0);
				const dataURL = canvas.toDataURL('image/png');
				resolve(dataURL);
			};
			img.onerror = function() {
				reject(new Error('Gagal memuat gambar'));
			};
			img.src = url;
		});
	}

	// Tambahkan baris ini di akhir fungsi prind
	window.printSelectedContent = window.processSelectedContent;
}