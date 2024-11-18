<?php
use app\Tds;
$TABELID=explode('img/',$_GET['url']);
$imagePath=Tds::imgPath($TABELID[1]);
    if (file_exists($imagePath['dir'])) {
       if ($imagePath['extension'] == 'svg') {
          header('Content-Type: image/svg+xml');
          readfile($imagePath['dir']);
       } else {
          header('Content-Type: ' . $imagePath['mime_type']);
          readfile($imagePath['dir']);
       }
    } else {
      header('HTTP/1.0 404 Not Found');
    }

