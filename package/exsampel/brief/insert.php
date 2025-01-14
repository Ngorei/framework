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
           'title' =>$val['title'],
           'deskripsi' =>$val['deskripsi']
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
  //     "title":"Ngorei SDK Endpoint",
  //     "deskripsi":"framework v4.0.2"
  // }

