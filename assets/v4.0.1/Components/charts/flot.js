export function flot(attr) {
   var data = attr.data;
   // Menyiapkan data untuk area chart

    var flotData = data.tabel.map((item, index) => ({
                label: item.persen,
                data: [[index + 1, parseFloat(item.data)]],
                color: item.color
            }));


            var options = {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.6,
                        align: "center"
                    },
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