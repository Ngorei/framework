<?php
namespace package;
use app\Ngorei;
$Tds = new Ngorei();
$val = json_decode(file_get_contents("php://input"), true);
try {
     // Buat builder terlebih dahulu
     $builder = $Tds->Network->Brief('demo');
     // Lakukan Insert
     $builder->insert([
           'title' =>$builder->validasi($val['title'], 'text', 15) ,
           'deskripsi' =>$builder->validasi($val['deskripsi'], 'text', 15) 
       ]);

  $lastId = $builder->idFile();
  return  $builder->getDataById($lastId,['id','title','deskripsi']); // Hanya mengambil kolom  ,['id','title']

} catch (\RuntimeException $e) {
    return [
        'status'  => 'error',
        'request' =>$val,
        'message' => $e->getMessage()
    ];
}

// SDK JSON Body 
// {
//      "title":"Ngorei SDK Endpoint",
//      "deskripsi":"framework v4.0.2"
// }

// FORMAT VALIDASI
// 'email' => $builder->validasi('user@gmail.com', 'email'),
// 'phone' => $builder->validasi('081234567890', 'phone'),
// 'username' => $builder->validasi('John_Doe123', 'username'),
// 'slug' => $builder->validasi('Judul Article', 'slug'),
// 'warna' => $builder->validasi('#FF5733', 'color'),
// 'ip_address' => $builder->validasi('192.168.1.1', 'ip'),
// 'settings' => $builder->validasi('{"theme":"dark"}', 'json'),
// 'tags' => $builder->validasi(['php','mysql'], 'array'),
// 'is_active' => $builder->validasi('yes', 'boolean'),
// 'harga' => $builder->validasi('Rp 1.000.000', 'currency'),
// 'file' => $builder->validasi('document.pdf', 'file_extension')
