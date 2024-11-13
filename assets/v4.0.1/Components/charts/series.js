export function series(attr) {
   var data = attr.data;
   // Menyiapkan data untuk area chart

          $.plot("#"+attr.elementById, [{
            data: getRandomData(150,50),
            color: '#00cccc',
            lines: {
              lineWidth: 1.7,
              fill: true,
              fillColor: { colors: [ { opacity: 0 }, { opacity: 0.4 } ] }
            }
          },{
            data: getRandomData(150,50),
            color: '#e1e5ed',
            lines: {
              lineWidth: 1,
              fill: true,
              fillColor: { colors: [ { opacity: 0 }, { opacity: 0.2 } ] }
            }
          }], {
          series: {
            shadowSize: 0,
            lines: {
              show: true,
            }
          },
          grid: {
            borderWidth: 0,
            labelMargin: 10,
            aboveData: true
          },
          yaxis: {
            show: false,
            max: 150
          },
          xaxis: {
            show: true,
            tickColor: 'rgba(72,94,144, 0.07)',
            ticks: [[25,' '],[50,' '],[75,' '],[100,' '],[125,' ']],
            //min: 35,
            //max: 125
          }
        });

         function getRandomData(totalPoints = 150, start = 50) {
          var data = [];
          // Do a random walk
          while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : start;
            var y = prev + Math.random() * 10 - 5;

            if(y < 0) { y = Math.random() * 10; }
            else if(y > 100) { y = 80; }

            data.push(y);
          }

          // Zip the generated y values with the x values
          var res = [];
          for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
          }

          return res;
    }
}