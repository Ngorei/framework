export function doughnut(attr) {
   var data = attr.data;
   // Menyiapkan data untuk area chart

   // Tambahkan elemen canvas terlebih dahulu
   $("#" + attr.elementById).html('<canvas id="chartDonut"></canvas>');

   var datapie = {
          labels: data.labels,
          datasets: [{
            data: data.datasets.data,
            backgroundColor: data.datasets.backgroundColor
          }]
        };

        var optionpie = {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            display: false,
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        };
        // For a pie chart
          var ctx2 = document.getElementById('chartDonut');
          var myDonutChart = new Chart(ctx2, {
            type: 'doughnut',
            data: datapie,
            options: optionpie
          });
}