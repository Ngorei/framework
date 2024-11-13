export function morris(attr) {
   var data = attr.data;
   // Menyiapkan data untuk area chart
   var areaData = data.labels.map((label, index) => ({
     y: label,
     a: data.area[index].a
   }));

   new Morris.Area({
      element:attr.elementById,
      data: areaData,
      xkey: 'y',
      ykeys: ['a'],
      labels: ['Total'],
      lineColors: data.color,
      lineWidth: 1,
      fillOpacity: 0.9,
      gridLineColor: '#e0e0e0',
      gridStrokeWidth: 1,
      gridTextSize: 11,
      hideHover: 'auto',
      resize: true,
      xLabelAngle: 45,
      parseTime: false
    });






   
}