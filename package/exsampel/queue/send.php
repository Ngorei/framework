<?php
use app\Ngorei;
$Tds = new Ngorei();
$val = json_decode(file_get_contents("php://input"), true);
   $queue = $Tds->Queue('demo_queue');//nama tabel kustom
    // 1. Push data ke queue
    $queue->push($val['tabel'],$val['payload']);

   // 2. Pop dan proses data
   $item = $queue->pop($val['tabel']);
    if ($item) {
       try {
            $queue->complete($item['id']);
        } catch (Exception $e) {
            // Jika gagal, tandai sebagai failed
            $queue->fail($item['id'], $e->getMessage());
        }
    }
 $stats = $queue->viewQueue($val['tabel']);
 $limitedStats = array_slice($stats, 0, 1);
return $limitedStats;

// SDK JSON Body 
  //  {
  //     "tabel":"demo",
  //      "payload":{
  //          "title":"Ngorei SDK Endpoint",
  //          "deskripsi":"framework v4.0.2"
  //      }
  // }
