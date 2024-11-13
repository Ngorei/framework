export function line(attr) {
   var data = attr.data;
   // Menyiapkan data untuk area chart
    
 var flotData = [{
                label: "Data",
                data: data.tabel.map((item, index) => [index + 1, parseFloat(item.data)]),
                color: "#007bff",
                lines: {
                    show: true,
                    fill: false
                },
                points: {
                    show: true
                }
            }];

            var options = {
                series: {
                    animator: { // Menambahkan opsi animator
                        steps: 30,
                        duration: 1000,
                        start: 0
                    }
                },
                xaxis: {
                    ticks: data.labels.map((label, index) => [index + 1, label])
                },
                grid: {
                    hoverable: true,
                    borderWidth: 1,
                    borderColor: "#ddd"
                },
                tooltip: {
                    show: true,
                    content: "%s: %y"
                }
            };

       $.plot("#"+attr.elementById, flotData, options);


}