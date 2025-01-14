<?php
namespace package;
use app\Ngorei;
$Tds = new Ngorei();
try {
$val = json_decode(file_get_contents("php://input"), true);
// Contoh penggunaan pagination
return $Tds->Network->Brief('demo')
    ->where('row', 1)
    ->orderBy('id', 'DESC')
    ->perPage($val['perPage'])      // Set 10 item per halaman
    ->page($val['page'])          // Ambil halaman pertama
    ->paginate();      // Gunakan pagination
// Hasil akan berupa array dengan format:
// [
//     'data' => [...], // Data untuk halaman yang diminta
//     'pagination' => [
//         'total_rows' => 100,        // Total semua data
//         'per_page' => 10,           // Jumlah item per halaman
//         'current_page' => 1,        // Halaman saat ini
//         'total_pages' => 10,        // Total halaman
//         'has_previous' => false,    // Apakah ada halaman sebelumnya
//         'has_next' => true,         // Apakah ada halaman selanjutnya
//         'previous_page' => 1,       // Nomor halaman sebelumnya
//         'next_page' => 2,           // Nomor halaman selanjutnya
//         'first_page' => 1,          // Halaman pertama
//         'last_page' => 10           // Halaman terakhir
//     ]
// ]
} catch (\RuntimeException $e) {
    return [
        'status' => 'error',
        'request' =>$val,
        'message' => $e->getMessage()
    ];
}
// SDK JSON Body 
// {
//     "perPage":2,
//     "page":1
// }