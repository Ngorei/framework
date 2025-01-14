<?php
use app\Ngorei;
$Tds = new Ngorei();
$val = json_decode(file_get_contents("php://input"), true);
   $queue = $Tds->Queue('demo_queue');//nama tabel kustom//input"), true);
$id = $val['id']; // ID item yang akan diupdate
$data =$val['payload'];
$options = [
    'priority' => 7,
    'status' => 'completed',
    'max_attempts' => 3
];
// 3. Lakukan update
$queue->update($id, $data, $options);
$item = $queue->refId($id);
return $item;
// SDK JSON Body 
  //  {
  //      "id":"1",
  //      "payload":{
  //          "data":"tabel",
  //          "index":"dantrik"
  //      }
  // }
