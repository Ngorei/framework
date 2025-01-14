<?php
use app\tatiye;
use app\Ngorei;
$Tds = new Ngorei();
// Tambahkan validasi dan security
    try {
     $query = $Tds->Network->Brief('demo');
     // Contoh 1: Mendapatkan data spesifik
     $info = $query->setUploadPath(ROOT.'/uploads')
    ->uploadFile(
        $_FILES['file'], 
        'thumbnail',
        'file_type',
        'file_size'
    )
    ->size(5)
    ->type([
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'application/pdf'
    ])
    ->imageSizes([
        '100x100',
        '250x250',
        '600x600',
    ])
    ->insert([
        'title' => 'John Doe',
        'created_at' => date('Y-m-d H:i:s')
    ]);

    $id = $info->idFile();
// Ambil data spesifik berdasarkan ID
   return $info->getDataById($id, ['id', 'title', 'thumbnail']);
} catch (\RuntimeException $e) {
    return [
        'status'  => 'error',
        'request' =>$val,
        'message' => $e->getMessage()
    ];
}
  

