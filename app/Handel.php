<?php
use app\Tds;
 use app\Ngorei;
header('Content-Type: application/json');
$tds = new \app\Tds();


// Contoh penggunaan:
$searchLink = "http://192.168.1.112/DOM5/#web/proyek"; // URL yang ingin dicari
$result = $tds->linkThread($searchLink);
// Memanggil method Navigation()
$navigasi = $tds->Navigation();
$meta = $tds->properti();
echo json_encode($navigasi);