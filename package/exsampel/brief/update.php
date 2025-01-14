<?php
namespace package;
use app\Ngorei;
$Tds = new Ngorei();
$val = json_decode(file_get_contents("php://input"), true);
try {
     // Buat builder terlebih dahulu
     $builder = $Tds->Network->Brief('demo');
     // Lakukan update
     $builder->where('id',$val['id'])
        ->update([
            'title' => $val['title']
        ]);
     // Ambil data yang sudah diupdate
     return $builder->getUpdateById($val['id'], ['id','title']);
} catch (\RuntimeException $e) {
    return [
        'status' => 'error',
        'request' =>$val,
        'message' => $e->getMessage()
    ];
}

// SDK JSON Body 
  // {
  //     "id":4,
  //     "title":"Helllo"
  // }









