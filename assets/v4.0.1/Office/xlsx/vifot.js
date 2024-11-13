// Data as per your input
const data = [
    [
        { "value": "Kecamatan", "alignment": "center" },
        { "value": "Jumlah Hotel/Penginapan", "alignment": "center" },
        { "value": "Kamar", "alignment": "center" }
    ],
    [
        { "value": "Marisa", "alignment": "center" },
        { "value": "14", "alignment": "center" },
        { "value": "176", "alignment": "center" }
    ],
    [
        { "value": "Duhiadaa", "alignment": "center" },
        { "value": "4", "alignment": "center" },
        { "value": "55", "alignment": "center" }
    ],
    [
        { "value": "Buntulia", "alignment": "center" },
        { "value": "2", "alignment": "center" },
        { "value": "51", "alignment": "center" }
    ],
    [
        { "value": "Popayato", "alignment": "center" },
        { "value": "4", "alignment": "center" },
        { "value": "30", "alignment": "center" }
    ],
    [
        { "value": "Lemito", "alignment": "center" },
        { "value": "1", "alignment": "center" },
        { "value": "5", "alignment": "center" }
    ],
    [
        { "value": "Paguat", "alignment": "center" },
        { "value": "2", "alignment": "center" },
        { "value": "26", "alignment": "center" }
    ],
    [
        { "value": "Total", "alignment": "center" },
        { "value": "30", "alignment": "center" },
        { "value": "26", "alignment": "center" }
    ]
];

// Function to generate pivot table structure
function generatePivotTable(data) {
    let headers = data[0].map(item => item.value); // Extracting headers
    let table = [headers]; // Initialize pivot table with headers

    // Loop through rows and format them into the pivot table structure
    for (let i = 1; i < data.length; i++) {
        let row = data[i].map(item => item.value); // Extract each row's values
        table.push(row);
    }

    return table;
}

// Convert data into pivot table
const pivotTable = generatePivotTable(data);

// Print out the pivot table
console.log(pivotTable);
