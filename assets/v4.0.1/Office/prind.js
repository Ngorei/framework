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

	window.printSelectedContent = function() {
		const selectedValue = document.getElementById('pageSelect').value;
		let printContents = '';

		if (selectedValue === 'all') {
			// Ambil semua konten jika 'Semua Halaman' dipilih
			contents.forEach(content => {
				printContents += `${content.innerHTML}<div style="page-break-after: always;"></div>`;
			});
		} else {
			const selectedContent = contents[selectedValue];
			if (selectedContent) {
				printContents = selectedContent.innerHTML;
			} else {
				console.error(`Konten untuk halaman ${selectedValue} tidak ditemukan`);
				alert("Halaman yang dipilih tidak ditemukan.");
				return;
			}
		}

		if (printContents) {
			const printWindow = window.open('', '', 'height=580px,width=500px');
			if (!printWindow) {
				alert("Popup diblokir. Mohon izinkan popup untuk situs ini.");
				return;
			}

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
			
			// Tunggu sampai semua sumber daya dimuat sebelum mencetak
			printWindow.onload = function() {
				printWindow.print();
				printWindow.close();
			};
		} else {
			alert("Silakan pilih konten untuk dicetak.");
		}
	}
}