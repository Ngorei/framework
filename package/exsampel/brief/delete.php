<?php
namespace package;
use app\Ngorei;
$Tds = new Ngorei();
$val = json_decode(file_get_contents("php://input"), true);
try {
    $result = $Tds->Network->Brief('demo')
        ->where('id',$val['id'])
        ->delete();
        
    return [
        'status' => 'success',
        'message' => 'Data berhasil dihapus',
        'affected_rows' => $result
    ];

} catch (\RuntimeException $e) {
    return [
        'status' => 'error',
        'request' => $val,
        'message' => $e->getMessage()
    ];
}

// SDK JSON Body 
// {
//     "id":4
// }

