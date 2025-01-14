<?php
namespace package;
use app\Ngorei;
$Tds = new Ngorei();
try {
$val = json_decode(file_get_contents("php://input"), true);
return $Tds->Network
    ->Brief($val['tabel'])
    ->select(['id', 'title'])
    ->where('row',$val['row'])
    ->limit(2)
    ->execute();
} catch (\RuntimeException $e) {
    return [
        'status' => 'error',
        'request' =>$val,
        'message' => $e->getMessage()
    ];
}
// SDK JSON Body 
// {
//     "tabel":"demo",
//     "row":1
// }