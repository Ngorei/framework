<?php
use app\Ngorei;
$Tds = new Ngorei();
$val = json_decode(file_get_contents("php://input"), true);
   $queue = $Tds->Queue('demo_queue');//nama tabel kustom
  $id = $val['id']; // ID item yang akan dihapus
  $queue->setCacheConfig([
       'enabled' => true,           // Mengaktifkan cache
       'ttl' => 600,               // Time-to-live 600 detik (10 menit)
       'prefix' => 'myapp:queue:', // Prefix kustom untuk key cache
       'views_ttl' => 120,         // TTL khusus untuk view queue (2 menit)
       'stats_ttl' => 300          // TTL khusus untuk statistik (5 menit)
   ]);
    $queue->enableCache();  // Untuk mengaktifkan
   // $queue->disableCache(); // Untuk menonaktifkan
    $item = $queue->refId($id);
    return $item;
