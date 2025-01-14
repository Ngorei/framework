<?php
use app\Ngorei;
$Tds = new Ngorei();
$val = json_decode(file_get_contents("php://input"), true);
   $queue = $Tds->Queue('demo_queue');//nama tabel kustom
  // 2. Hapus item dengan ID tertentu
  $id = $val['id']; // ID item yang akan dihapus
  $result = $queue->delete($id);
  // 3. Cek hasil
  return $result;
