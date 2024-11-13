<?php
use app\Tds;
$TABELID=explode('img/',$_GET['url']);
$imagePath=Tds::imgPath($TABELID[1]);
if (file_exists($imagePath)) {
   $type = pathinfo($imagePath, PATHINFO_EXTENSION);
   if ($type == 'svg') {
      header('Content-Type: image/svg+xml');
      readfile($imagePath);
   } else {
      $mimeType = mime_content_type($imagePath);
      header('Content-Type: ' . $mimeType);
      readfile($imagePath);
   }
} else {
  header('HTTP/1.0 404 Not Found');
}

